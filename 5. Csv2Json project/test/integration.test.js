import { expect, describe, it, jest } from '@jest/globals';
import { CSVToNDJSON } from '../src/streamComponents/csv2ndjson.js';
import { pipeline } from 'node:stream/promises';
import { Readable, Writable } from 'node:stream';
import { Reporter } from '../src/streamComponents/reporter.js';
import { customLog } from '../src/util.js';

describe('CSV to NDJSON test suite', () => {
  const reporter = new Reporter({ logger: console.log });
  it('given a csv stream, it should parse each line to a valid NDJSON string', async () => {
    const csvString =
      'id,name,desc\n01,manny,awesome manny\n02,dagim,the great dagim\n03,sicko,the amazing sicko';
    const csvToJSON = new CSVToNDJSON({
      delimiter: ',',
      headers: ['id', 'name', 'desc'],
    });
    const spy = jest.fn();
    await pipeline(
      Readable.from(csvString),
      csvToJSON,
      reporter.progress(csvString.length),
      Writable({
        write(chunk, enc, cb) {
          spy(chunk);
          cb(null, chunk);
        },
      })
    );
    const times = csvString.split('\n').length - 1;
    expect(spy).toHaveBeenCalledTimes(times);

    const [firstCall, secondCall, thirdCall] = spy.mock.calls;
    expect(JSON.parse(firstCall)).toStrictEqual({
      id: '01',
      name: 'manny',
      desc: 'awesome manny',
    });
    expect(JSON.parse(secondCall)).toStrictEqual({
      id: '02',
      name: 'dagim',
      desc: 'the great dagim',
    });
    expect(JSON.parse(thirdCall)).toStrictEqual({
      id: '03',
      name: 'sicko',
      desc: 'the amazing sicko',
    });
  });
});
