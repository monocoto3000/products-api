import { url } from 'inspector';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Products API DEV',
      version: '1.0.0',
      description: 'Inventory manager for Products - DEV',
    },
    servers: [
      {
        url: 'http://52.45.170.88:3000',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], 
};

const swaggerSpec = swaggerJsDoc(options);

export { swaggerUi, swaggerSpec };
