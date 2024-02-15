const express = require('express')
const { port } = require('./env')
const files = require('./routes/filelist')
const logs = require('./routes/logs')

const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const app = express()

app.use('/files', files)
app.use('/logs', logs)

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

const logErrors = (err, req, res, next) => {
  console.error(err.stack)
  next(err)
}

const globalErrorHandler = (err, req, res, next) => {
  res.status(500)
  res.send({ error: err })
}
app.use(logErrors)
app.use(globalErrorHandler)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
