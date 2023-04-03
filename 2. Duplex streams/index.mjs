import { log } from 'node:console';
import { randomUUID } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { Duplex, PassThrough, Transform, Writable } from 'node:stream';

//////////// Duplex transform api ////////////////
const server = Duplex({
  objectMode: true,
  write(chunk, enc, cb) {
    log(`[Writable] saving ${chunk}`);
    cb();
  },
  read() {
    const everySecond = (intervalContext) => {
      this.counter = this.counter ?? 0;
      if (this.counter++ <= 5) {
        this.push(`My name is manny[${this.counter}]`);
        return;
      }
      clearInterval(intervalContext);
      this.push(null);
    };

    setInterval(function () {
      everySecond(this);
    });
  },
});

server.write('[Duplex] key this is a writable\n');
server.push('[Duplex] this is a readable\n');

const transformToUpperCase = Transform({
  objectMode: true,
  transform: (chunk, enc, cb) => {
    cb(null, chunk.toUpperCase());
  },
});

transformToUpperCase.write('[transform] hello from writer');
// the push method will ignore what you have in the transform function
transformToUpperCase.push('[transform] hello from reader');

server
  .pipe(transformToUpperCase)
  // it'll redirect all data to the duplex's writable channel
  .pipe(server);

//////////// Duplex transform api ////////////////////////////////

//////////// Duplex Broadcast ////////////////////////////////////
const stream = Duplex.from({
  readable: createReadStream('./big.file'),
  writable: createWriteStream('./output.txt'),
});

const consumers = [randomUUID(), randomUUID()].map((id) =>
  Writable({
    write(chunk, enc, cb) {
      log(
        `[${id}] bytes: ${
          chunk.length
        }, received a message at: ${new Date().toISOString()}`
      );
    },
  })
);

const onData = (chunk) => {
  consumers.forEach((consumer, idx) => {
    if (consumer.writableEnded) {
      delete consumers[index];
    } else {
      consumer.write(chunk);
    }
  });
};

const broadcaster = PassThrough();
broadcaster.on('data', onData);

stream.pipe(broadcaster).pipe(stream);
//////////// Duplex Broadcast ////////////////////////////////////
