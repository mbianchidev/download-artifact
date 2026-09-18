import {describe, expect, test} from '@jest/globals'
import {spawnSync} from 'node:child_process'

describe('runtime dependencies', () => {
  test('creates an artifact extractor without deprecated Buffer usage', () => {
    const result = spawnSync(
      process.execPath,
      [
        '--throw-deprecation',
        '--eval',
        "require('unzip-stream').Extract({path: require('node:os').tmpdir()})"
      ],
      {encoding: 'utf8'}
    )

    expect(result.stderr).toBe('')
    expect(result.status).toBe(0)
  })
})
