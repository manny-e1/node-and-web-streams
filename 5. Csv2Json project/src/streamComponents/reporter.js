import { PassThrough } from 'node:stream';
import { customLog } from '../util.js';

const HUNDRED_PERCENT = 100;

export class Reporter {
  #loggerFn;
  lineLengthAfterTurnedIntoJSON = 37.6;
  constructor({ logger = customLog } = {}) {
    this.#loggerFn = logger;
  }

  #onData(amount) {
    let totalChunks = 0;
    return (chunk) => {
      totalChunks += chunk.length - this.lineLengthAfterTurnedIntoJSON;
      //(totalChunks / amount) * HUNDRED_PERCENT
      const processed = (HUNDRED_PERCENT / amount) * totalChunks;
      this.#loggerFn(`processed ${processed.toFixed(2)}%`);
    };
  }

  progress(amount) {
    const progress = PassThrough();
    progress.on('data', this.#onData(amount));
    progress.on('end', () => `processed ${HUNDRED_PERCENT}.00%`);
    return progress;
  }
}
