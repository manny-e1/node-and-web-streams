import { expect, describe, it, jest } from '@jest/globals';

import { CSVToNDJSON } from '../../src/streamComponents/csv2ndjson.js';

describe('CSV to NDJSON test suite', () => {
  it('given a csv string it should return a ndjson string', () => {
    const csvString = `id,name,address\n01,manny,bole\n`;
    const csvToJson = new CSVToNDJSON({
      delimiter: ',',
      headers: ['id', 'name', 'address'],
    });
    const expected = {
      id: '01',
      name: 'manny',
      address: 'bole',
    };
    const fn = jest.fn();
    csvToJson.on('data', fn);
    csvToJson.write(csvString);
    csvToJson.end();
    const [current] = fn.mock.lastCall;
    expect(JSON.parse(current)).toStrictEqual(expected);
  });
  it("it should work with strings that doesn't contain breaklines at the end", () => {
    const csvString = `id,name,address\n01,manny,bole`;
    const csvToJson = new CSVToNDJSON({
      delimiter: ',',
      headers: ['id', 'name', 'address'],
    });
    const expected = {
      id: '01',
      name: 'manny',
      address: 'bole',
    };
    const fn = jest.fn();
    csvToJson.on('data', fn);
    csvToJson.write(csvString);
    csvToJson.end();
    const [current] = fn.mock.lastCall;
    expect(JSON.parse(current)).toStrictEqual(expected);
  });
  it('it should work with files that has breaklines in the beginning of the string ', () => {
    const csvString = `\nid,name,address\n01,manny,bole\n02,dagim,gerji`;
    const csvToJson = new CSVToNDJSON({
      delimiter: ',',
      headers: ['id', 'name', 'address'],
    });
    const expected = [
      {
        id: '01',
        name: 'manny',
        address: 'bole',
      },
      { id: '02', name: 'dagim', address: 'gerji' },
    ];
    const fn = jest.fn();
    csvToJson.on('data', fn);
    csvToJson.write(csvString);
    csvToJson.end();
    const [firstCall] = fn.mock.calls[0];
    const [secondCall] = fn.mock.calls[1];
    expect([JSON.parse(firstCall), JSON.parse(secondCall)]).toStrictEqual(
      expected
    );
  });
});
