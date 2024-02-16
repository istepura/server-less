const { open } = require('node:fs/promises')

/**
 * @typedef {object} FileReaderResult
 * @property {string[]} lines - Lines read from file
 * @property {int} count - Number of lines read and returned
 * @property {int} nextPage - The position of next page with the file. -1 if no more data available
 */
/**
 * @async
 * @function filereader
 * Reads `limit` lines from the newline separated text file at `filepath`,
 * applying optional `filter` to each line
 * @param {string} filePath - Path to the file
 * @param {int} limit - Maximum number of lines to read from file
 * @param {string} [filter]
 * @param {int} [startPosition] Position in the file from which the function will start reading
 * @returns {FileReaderResult}
 */

module.exports.filereader = async (filePath, limit, filter, startPosition) => {
  const lines = []
  // Keeps track of positions(lines) of log lines we've picked up
  const positions = []
  let pos = 0

  const file = await open(filePath)

  // FIXME: This is terribly ineffective, since we have to read lines from the file
  // multiple times.  Ideal approach would de to use Stream-like reverse line reader
  // which I'm sure exists in NPM
  for await (const line of file.readLines()) {
    if (!filter || line.includes(filter)) {
      lines.push(line)
      positions.push(pos)
    }
    if (limit > 0 && lines.length > limit) {
      lines.shift()
      positions.shift()
    }
    pos += 1

    // FIXME: Start position is the position in the file where we should
    // *start* our reading and move towards the beginning of the file.
    // Since we've chose simple-brute-forceish approach for this sprint,
    // and read the file *from the beginning*, startPosition is where we
    // should stop
    if (startPosition > 0 && pos >= startPosition) {
      break
    }
  }

  return {
    lines: lines.reverse(),
    count: lines.length,
    nextPage: positions[0] - 1 || -1
  }
}
