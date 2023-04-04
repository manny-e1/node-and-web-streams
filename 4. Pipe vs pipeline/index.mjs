// node -e "process.stdout.write('hello world'.repeat(1e7))" > big.file -> outputs a file named big.file with 10 milli hello worlds
import { log } from 'node:console';
import { createReadStream } from 'node:fs';
import { createServer } from 'node:http';
import { pipeline } from 'node:stream/promises';

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
