import readline from 'node:readline';
import net from 'node:net';
import { PassThrough, Writable } from 'node:stream';

function customLog(message) {
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(message);
}

const output = Writable({
  write(chunk, enc, cb) {
    const { id, message } = JSON.parse(chunk);
    if (message) customLog(`Reply from ${id}: ${message}`);
    else customLog(`My username is: ${id} \n`);
    customLog('Type: ');
    cb();
  },
});

const resetChatAfterSend = PassThrough();
resetChatAfterSend.on('data', (_) => {
  customLog('Type: ');
});

process.stdin
  .pipe(resetChatAfterSend)
  .pipe(
    net.connect(8080).on('end', () => {
      readline = undefined;
    })
  )
  .pipe(output);
