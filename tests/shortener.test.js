const request = require('supertest')
const app = require('../src/index')
const nanoid = require('nanoid');

const mongoose = require('mongoose');
const { response } = require('express');
const databaseName = 'shortener'

beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`
  await mongoose.connect(url, { useNewUrlParser: true })
})

describe('Post Endpoints', () => {
  it('should create a new post', async () => {
    const res = await request(app)
      .post('/longUrl')
      .send({
        url: "https://www.npmjs.com/package/supertest"
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('uniqueStringID')
  })
})
describe('Post Invalid Endpoints', () => {
  it('should throw error with message; {\"error\":\"invalid URL\"}, with status code; \'400\'  when invalid URL is written', async () => {
    const res = await request(app)
      .post('/longUrl')
      .send({
        url: "this_is_an_invalid_url"
      })
    expect(res.statusCode).toEqual(400)
    expect(res.error.text).toBe('{\"error\":\"invalid URL\"}')
  })
})
describe('Post Nonexistent Address', () => {
  it('should throw error with message; {\"error\":\"Address not found!\"}, with status code; \'404\'  when nonexistent address is stated', async () => {
    const res = await request(app)
      .post('/longUrl')
      .send({
        url: "https://www.notfoundaddress.com/package/supertest"
      })
    expect(res.statusCode).toEqual(404)
    expect(res.error.text).toBe('{\"error\":\"Address not found!\"}')
  })
})

describe('GET - URL Direction', () => {
  it('should perform GET and the status code should be 302', async () => {
    const requestGet = '/RdXgUTT';
    const respond = await request(app).get(requestGet);
    expect(respond.statusCode).toBe(302);
  })
})