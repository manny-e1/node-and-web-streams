/**
  echo "id,name,desc,age" > big.csv
  for i in `seq 1 5`; do node -e "process.stdout.write('$i,manny-$i,$i-text,$i\n'.repeat(1e5))" >> big.csv; done
 */
import { Transform } from 'node:stream';
import { Reporter } from './streamComponents/reporter.js';
import { createReadStream, createWriteStream, statSync } from 'node:fs';
import { CSVToNDJSON } from './streamComponents/csv2ndjson.js';
import { pipeline } from 'node:stream/promises';

const filename = './big.csv';
const reporter = new Reporter();
const { size: fileSize } = statSync(filename);

let counter = 0;
const processData = Transform({
  transform(chunk, enc, cb) {
    const data = JSON.parse(chunk);
    const result = JSON.stringify({
      ...data,
      id: counter++,
    }).concat('\n');
    return cb(null, result);
  },
});

const csvToJSON = new CSVToNDJSON({
  delimiter: ',',
  headers: ['id', 'name', 'desc', 'age'],
});

console.time(' took');
await pipeline(
  createReadStream(filename),
  csvToJSON,
  processData,
  reporter.progress(fileSize),
  createWriteStream('big.ndjson')
);
console.timeEnd(' took');
