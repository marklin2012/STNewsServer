export default () => {
  const jsonBody = {
    code: { type: 'number', required: true, example: 0 },
    message: { type: 'string', required: true, example: 'success' },
    data: { type: 'Enum', required: true, example: [] },
  }
  return {
    indexJsonBody: {
      ...jsonBody,
      data: { type: 'string', example: 'test' },
    },
  }
}
