import {describe, expect, test} from '@jest/globals'
import {spawnSync} from 'node:child_process'

describe('runtime dependencies', () => {
  test.each([
    [
      'unzip-stream',
      "require('unzip-stream').Extract({path: require('node:os').tmpdir()})"
    ],
    [
      'binary',
      "require('binary').parse(Buffer.from('abc')).scan('before', 'b')"
    ],
    [
      'buffers',
      "const Buffers = require('buffers'); const buffers = Buffers([Buffer.from('abc')]); buffers.slice(0, 2); buffers.indexOf('b'); buffers.splice(1, 1)"
    ],
    [
      'tunnel',
      "const http = require('node:http'); const {EventEmitter} = require('node:events'); http.request = () => Object.assign(new EventEmitter(), {end() {}}); const agent = require('tunnel').httpOverHttp({proxy: {host: 'localhost', port: 8080, proxyAuth: 'user:pass'}}); agent.createSocket({host: 'example.com', port: 80}, () => {})"
    ]
  ])('%s avoids deprecated Buffer usage', (_dependency, script) => {
    const result = spawnSync(
      process.execPath,
      ['--throw-deprecation', '--eval', script],
      {encoding: 'utf8'}
    )

    expect(result.status).toBe(0)
    expect(result.stderr).not.toContain('[DEP0005]')
  })
})
