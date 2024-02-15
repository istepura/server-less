const express = require('express')
const { port } = require('./env')
const files = require('./routes/filelist')

const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const app = express()

/**
 * @openapi
 * tags:
 *   - name: Files
 *     description: API to retrieve the list of files
 */
app.use('/files', files)

const options = {
  failOnErrors: true,
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Server Less',
      version: '1.0.0'
    }
  },
  apis: ['./routes/*.js']
}

const openapiSpecification = swaggerJsdoc(options)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
