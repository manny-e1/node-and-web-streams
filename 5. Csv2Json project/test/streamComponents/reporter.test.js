import { expect, describe, it, jest, afterAll } from '@jest/globals';
import { Reporter } from '../../src/streamComponents/reporter';

describe('Reporter test suite', () => {
  it('it should print progress status correctly', () => {
    const loggerFnMock = jest.fn();
    const reporter = new Reporter({ logger: loggerFnMock });
    reporter.lineLengthAfterTurnedIntoJSON = 0;
    const multiple = 10;
    const progress = reporter.progress(multiple);

    for (let i = 0; i < multiple; i++) {
      progress.write('1');
    }
    progress.emit('end');
    expect(loggerFnMock.mock.calls.length).toEqual(multiple);
    for (const index in loggerFnMock.mock.calls) {
      const [call] = loggerFnMock.mock.calls[index];
      const expected = (Number(index) + 1) * multiple;
      expect(call).toStrictEqual(`processed ${expected}.00%`);
    }
  });
});
