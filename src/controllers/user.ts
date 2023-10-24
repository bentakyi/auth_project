import {Request, Response, NextFunction} from 'express';
import bcryptjs from 'bcryptjs';
import signJWT from '../functions/signJWT';
import {Connect, Query} from '../config/mysql'
import IUser from '../interfaces/user';
import IMySQLResult from '../interfaces/result';

import logging from '../config/logging'; 

const NAMESPACE = "User";

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, "Token validated, user authorized");

    return res.status(200).json({
        message: "Authorized"
    })
}

const signup = (req: Request, res: Response, next: NextFunction) => {
    let {email, password} = req.body;
    bcryptjs.hash(password, 10, (hashError, hash) => {
        if (hashError) {
            return res.status(401).json({
                message: hashError.message,
                error: hashError
            });
        }

        let query = `INSERT INTO users (email, password) VALUES ("${email}", "${hash}")`;

        Connect()
            .then((connection) => {
                Query<IMySQLResult>(connection, query)
                    .then((result) => {
                        logging.info(NAMESPACE, `User with id ${result.insertId} inserted.`);

                        return res.status(201).json(result);
                    })
                    .catch((error) => {
                        logging.error(NAMESPACE, error.message, error);

                        return res.status(500).json({
                            message: error.message,
                            error
                        });
                    });
            })
            .catch((error) => {
                logging.error(NAMESPACE, error.message, error);

                return res.status(500).json({
                    message: error.message,
                    error
                });
            });
    });
}

const signin = (req: Request, res: Response, next: NextFunction) => {
    let { email, password } = req.body;

    let query = `SELECT * FROM users WHERE email = '${email}'`;

    Connect()
        .then((connection) => {
            Query<IUser[]>(connection, query)
                .then((users) => {
                    bcryptjs.compare(password, users[0].password, (error, result) => {
                        if (error) {
                            return res.status(401).json({
                                message: 'Password Mismatch'
                            });
                        } else if (result) {
                            signJWT(users[0], (_error, token) => {
                                if (_error) {
                                    return res.status(401).json({
                                        message: 'Unable to Sign JWT',
                                        error: _error
                                    });
                                } else if (token) {
                                    return res.status(200).json({
                                        message: 'Auth Successful',
                                        token,
                                        user: users[0]
                                    });
                                }
                            });
                        }
                    });
                })
                .catch((error) => {
                    logging.error(NAMESPACE, error.message, error);

                    return res.status(500).json({
                        message: error.message,
                        error
                    });
                });
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);

            return res.status(500).json({
                message: error.message,
                error
            });
        });
};







export default {validateToken, signup, signin}
