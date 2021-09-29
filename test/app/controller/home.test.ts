import * as assert from 'assert'
import { app } from 'egg-mock/bootstrap'

describe('test/app/controller/home.test.ts', () => {
  it('should GET /', async () => {
    const result = await app.httpRequest().get('/').expect(200)
    const obj = {
      code: 0,
      message: '',
      data: {
        result: 'test',
      },
    }
    assert(result.text === JSON.stringify(obj))
  })
})
