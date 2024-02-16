const { readdir } = require('node:fs/promises')

const express = require('express')
const router = express.Router()
const { LOG_DIR } = require('../env')

/**
 * @openapi
 * tags:
 *   - name: Files
 *     description: API to retrieve the list of files
 */

/**
 * @openapi
 * /files:
 *   get:
 *     tags: [Files]
 *     description: Retireves list of files in the log dir
 *     responses:
 *       200:
 *         description: List of files.
 *         content:
 *           application/json:
 *             example:
 *               files: ["file.log", "someother.log"]
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
    const files = await readdir(LOG_DIR)
    res.send({ files })
  } catch (err) {
    next(err)
  }
})

module.exports = router
