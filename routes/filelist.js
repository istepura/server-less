const { readdir } = require('node:fs/promises')

const express = require('express')
const router = express.Router()
const { logDir } = require('../env')

/**
 * @openapi
 * /files:
 *   tags: [files]
 *   get:
 *     description: Retireves list of files in the log dir
 *     responses:
 *       200:
 *         description: List of files.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 files:
 *                    type: array
 *                    items:
 *                      description: filenames
 *                      type: string
 */
router.get('/', async (req, res, next) => {
  try {
    const files = await readdir(logDir)
    res.send({ files })
  } catch (err) {
    console.error(err)
    next(err)
  }
})

module.exports = router
