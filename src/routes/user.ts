import express from 'express';
import controller from '../controllers/user';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Swagger API Documentation',
      version: '1.0.0',
    //   description: 'API for user operations',
    },
    servers: [
      {
        url: 'http://localhost:3000/'
      },
    ]
  },
  apis: [`${__dirname}/user.ts`]
};


const swaggerSpec = swaggerJSDoc(options);
// Serve Swagger documentation
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


/**
 * @swagger
 * /signin:
 *   post:
 *     summary: User sign-in
 *     description: Sign in a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Successful sign-in
 *       401:
 *         description: Unauthorized
 */
router.post('/signin', controller.signin);

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: User sign-up
 *     description: Sign up a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Successful sign-up
 *       400:
 *         description: Bad request
 */
router.post('/signup', controller.signup);

export = router;
