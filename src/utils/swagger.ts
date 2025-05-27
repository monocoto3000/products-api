import { url } from 'inspector';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Products API QA',
      version: '1.0.0',
      description: 'Inventory manager for Products - QA TEST #1',
    },
    servers: [
      {
        url: 'http://44.205.201.108:3000',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], 
};

const swaggerSpec = swaggerJsDoc(options);

export { swaggerUi, swaggerSpec };
