import { PassThrough } from 'node:stream';
import { customLog } from '../util';
import { log } from 'node:console';

const HUNDRED_PERCENT = 100;

export class Reporter {
  #loggerFn;
  constructor({ logger = customLog } = {}) {
    this.#loggerFn = logger;
  }

  #onData(amount) {
    let totalChunks = 0;
    return (chunk) => {
      totalChunks += chunk.length;
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
