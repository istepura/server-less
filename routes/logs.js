const express = require('express')
const router = express.Router()
const { LOG_DIR, MAX_PAGE_SIZE } = require('../env')
const { filereader } = require('../core/filreader')

/**
 * @openapi
 * /logs/{fileName}:
 *   get:
 *     tags: [Logs]
 *     description: Reads log lines from the file
 *     parameters:
 *        - name: fileName
 *          description: Name of the file to read from
 *          in: path
 *          schema:
 *            type: string
 *          required: true
 *        - name: limit
 *          description: Maximum number of lines to read
 *          in: query
 *          schema:
 *            type: integer
 *        - name: filter
 *          description: Filter string (simple text matching). Only lines containing filter string willl be returned
 *          in: query
 *          schema:
 *            type: string
 *        - name: startPosition
 *          description: The position in file to read from.
 *            If not specified, the most recent entries will be returned.
 *            Use `nextPage` from the previous response to implement pagination
 *            (The values of other parameters must be identical to those in the previous call.)
 *          in: query
 *          schema:
 *            type: integer
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *                lines: ["a", "b", "c"]
 *                count: 3
 *                nextPage: 330
 *             schema:
 *               type: object
 *               properties:
 *                 lines:
 *                    type: array
 *                    items:
 *                      description: Logs lines from the specified file
 *                      type: string
 *                 count:
 *                    type: integer
 *                    description: Number of lines that were read from the file
 *                 nextPage:
 *                    type: integer
 *                    description: Indicates that more data can be read. -1 if no more data is available
 */
router.get('/:fileName', async (req, res, next) => {
  try {
    const fileName = req.params.fileName
    let { filter, limit, startPosition } = req.query

    limit = Math.min(parseInt(limit) || MAX_PAGE_SIZE, MAX_PAGE_SIZE)

    // FIXME: We may need to do some sanity checking here.
    startPosition = parseInt(startPosition) || -1

    const result = await filereader(
      `${LOG_DIR}/${fileName}`,
      limit,
      filter,
      startPosition
    )

    res.send(result)
  } catch (err) {
    next(err)
  }
})

module.exports = router
