'use strict'

const test = require('ava')
const reachableUrl = require('..')

test('resolve HEAD request', async t => {
  const url = 'https://google.com'
  const res = await reachableUrl(url)

  t.is(200, res.statusCode)
  t.is('HEAD', res.req.method)
})

test('resolve GET request', async t => {
  const url = 'https://httpbin-org.herokuapp.com/get'
  const res = await reachableUrl(url)

  t.is(200, res.statusCode)
  t.is('GET', res.req.method)
})

test('resolve redirect', async t => {
  const url = 'https://github.com/kikobeats/splashy'
  const res = await reachableUrl(url)

  t.deepEqual(res.redirectUrls, [[301, 'https://github.com/kikobeats/splashy']])
  t.is('https://github.com/microlinkhq/splashy', res.url)
  t.is(200, res.statusCode)
})

test('resolve multiple redirects', async t => {
  const url = 'https://httpbin-org.herokuapp.com/redirect/3'
  const res = await reachableUrl(url)

  t.deepEqual(res.redirectUrls, [
    [302, 'https://httpbin-org.herokuapp.com/redirect/3'],
    [302, 'https://httpbin-org.herokuapp.com/relative-redirect/2'],
    [302, 'https://httpbin-org.herokuapp.com/relative-redirect/1']
  ])
  t.is('https://httpbin-org.herokuapp.com/get', res.url)
  t.is(200, res.statusCode)
})

test('passing options', async t => {
  const url =
    'https://httpbin-org.herokuapp.com/redirect-to?url=http%3A%2F%2Fexample.com%2F'
  const res = await reachableUrl(url, { followRedirect: false })
  t.is(302, res.statusCode)
})
