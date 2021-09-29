const responseBody = {
  code: { type: 'number', required: true, example: 0 },
  message: { type: 'string', required: true, example: 'success' },
  data: { type: 'any', required: true, example: {} },
}

module.exports = {
  responseBody,
}
