// node -e "process.stdout.write('hello world'.repeat(1e7))" > big.file -> outputs a file named big.file with 10 milli hello worlds
import { CallTracker, deepStrictEqual } from 'node:assert';
import { log } from 'node:console';
import { createReadStream } from 'node:fs';
import { createServer, get } from 'node:http';
import { PassThrough } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { setTimeout } from 'node:timers/promises';

const file = createReadStream('./big.file');
const file2 = createReadStream('./big.file');

createServer((req, res) => {
  file.pipe(res);
}).listen(5000, () => {
  log('running at 5000');
});
createServer(async (req, res) => {
  // throws ERR_STREAM_PREMATURE_CLOSE when interupted from the consumer(connection closes)
  await pipeline(file2, res);
}).listen(5001, () => {
  log('running at 5001');
});

await setTimeout(500);

const getHttpStream = (url) =>
  new Promise((resolve) => get(url, (res) => resolve(res)));

const pass = () => PassThrough();

const streamPipe = await getHttpStream('http://localhost:5000');
streamPipe.pipe(pass());

const streamPipeline = await getHttpStream('http://localhost:5001');
streamPipeline.pipe(pass());

streamPipe.destroy();
streamPipeline.destroy();

const tracker = new CallTracker();
const fn = tracker.calls((msg) => {
  log("stream.pipeline rejects if we don't fully consume it.");
  deepStrictEqual(msg.message, 'Premature close');
  process.exit();
});

process.on('uncaughtException', fn);

await setTimeout(10);
tracker.verify();
