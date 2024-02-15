const express = require('express')
const { port } = require('./env')
const files = require('./routes/filelist')

const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const app = express()

const logErrors = (err, req, res, next) => {
  console.error(err.stack)
  next(err)
}

const globalErrorHandler = (err, req, res, next) => {
  res.status(500)
  res.send({ error: err })
}
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

app.use(logErrors)
app.use(globalErrorHandler)


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
