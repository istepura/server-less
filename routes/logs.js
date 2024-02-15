const express = require('express')
const router = express.Router()
const { logDir } = require('../env')
const { open } = require('node:fs/promises')

/**
 * @openapi
 * /logs/{fileName}:
 *   get:
 *     tags: [Logs]
 *     description: Retireves list of files in the log dir
 *     parameters:
 *        - name: fileName
 *          in: path
 *          schema:
 *            type: string
 *          required: true
 *        - name: limit
 *          in: query
 *          schema:
 *            type: integer
 *        - name: filter
 *          in: query
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: List of files.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 lines:
 *                    type: array
 *                    items:
 *                      description: Logs lines from the specified file
 *                      type: string
 *
 */

router.get('/:fileName', async (req, res, next) => {
  try {
    const fileName = req.params.fileName
    const { filter, limit } = req.query

    const lines = await filereader(`${logDir}/${fileName}`, limit, filter)

    res.send({ lines })
  } catch (err) {
    next(err)
  }
})

const filereader = async (filePath, limit, filter) => {
  const lines = []

  const file = await open(filePath)
  for await (const line of file.readLines()) {
    if (!filter || line.includes(filter)) {
      lines.push(line)
    }
    if (limit > 0 && lines.length > limit) {
      lines.shift()
    }
  }
  return lines.reverse()
}

module.exports = router
