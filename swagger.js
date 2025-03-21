const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Materiais",
      version: "1.0.0",
      description: "Documentação da API de Materiais",
    },
    servers: [
      {
        url: "http://localhost:3000",  // URL para ambiente local
        description: "Servidor Local",
      },
      {
        url: "https://apivai-1.onrender.com",  // URL para ambiente de produção
        description: "Servidor de Produção",
      },
    ],
  },
  apis: ["./server.js"], // Caminho correto para o arquivo com as rotas
};

const swaggerDocs = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerDocs };
