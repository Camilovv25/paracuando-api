const express = require('express');
const swaggerUi = require('swagger-ui-express')
const YAML = require('yaml')
const fs = require('fs')


function documentation(app){
  const file = fs.readFileSync('./openapi.yaml', 'utf8')
  const swaggerDoc = YAML.parse(file)
  app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc) )
}

module.exports = documentation