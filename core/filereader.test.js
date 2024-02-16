const { filereader } = require('./filereader')

test('can read a file', async () => {
  const res = await filereader('./test/small.log')
  expect(res.count).toBe(9)
  expect(res.nextPage).toBe(-1)
})

test('can read a file page by page', async () => {
  let res = await filereader('./test/small.log', 4)
  expect(res.count).toBe(4)
  expect(res.nextPage).toBe(4)

  res = await filereader('./test/small.log', 4, undefined, 4)
  expect(res.count).toBe(4)
  expect(res.nextPage).toBe(0)

  res = await filereader('./test/small.log', 4, undefined, 0)
  expect(res.count).toBe(1)
  expect(res.nextPage).toBe(-1)
})

test('does not read beyond file boudndary', async () => {
  const res = await filereader('./test/small.log', 4, undefined, -1)
  expect(res.count).toBe(1)
  expect(res.nextPage).toBe(-1)
})

test('can filter lines', async () => {
  const res = await filereader('./test/small.log', 5, 'systemd')
  expect(res.count).toBe(3)
  expect(res.nextPage).toBe(1)
})

test('can page with filter', async () => {
  let res = await filereader('./test/small.log', 2, 'systemd')
  expect(res.count).toBe(2)
  expect(res.nextPage).toBe(3)

  res = await filereader('./test/small.log', 2, 'systemd', 3)
  expect(res.count).toBe(1)
  expect(res.nextPage).toBe(1)

  res = await filereader('./test/small.log', 2, 'systemd', 1)
  expect(res.count).toBe(0)
  expect(res.nextPage).toBe(-1)
})
