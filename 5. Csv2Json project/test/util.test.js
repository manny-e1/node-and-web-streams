import { expect, describe, it, jest, afterAll } from '@jest/globals';
import readline from 'node:readline';
import { customLog } from '../src/util';

describe('Util test suite', () => {
  readline.cursorTo = jest.fn().mockImplementation();
  process.stdout.write = jest.fn().mockImplementation();
  afterAll(() => jest.clearAllMocks());

  it('write input', () => {
    const msg = 'test';
    customLog(msg);
    expect(readline.cursorTo).toBeCalledWith(process.stdout, 0);
    expect(process.stdout.write).toBeCalledWith(msg);
  });
});
