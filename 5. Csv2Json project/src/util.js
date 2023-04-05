import readline from 'node:readline';

export function customLog(message) {
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(message);
}
