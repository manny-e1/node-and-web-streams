import sqlite3 from 'sqlite3'
import {promisify} from 'node:util'
import { log } from 'node:console'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { createWriteStream } from 'node:fs'

const Connection = sqlite3.verbose()
const db = new Connection.Database('./data/db')

const seriliazeAsync = promisify(db.serialize.bind(db))
const runAsync = promisify(db.run.bind(db))
const findAllAsync = promisify(db.all.bind(db))

await seriliazeAsync()

async function * selectAsStream(){
    const defaultLimit = 100
    let skip = 0

    while(true){
        const data = await findAllAsync(`SELECT * FROM users LIMIT ${defaultLimit} OFFSET ${skip}`)
        skip += defaultLimit

        if(!data.length) break
        //for(const item of data) yield `{id:${item.id.slice(0,4)}---name:${item.name}}---age:${item.age}---skip:${skip}\n`
        for(const item of data) yield item
    }
}

let processed  = 0
const stream = Readable.from(selectAsStream())
.filter(record => record.age > 25 && record.age < 50).map(async (item) => {
    const name = await Promise.resolve(item.name.toUpperCase())
    return {
        ...item,
        name,
        at: new Date().toISOString()

    }
}).map(record => {
    processed++
    //log('bout to write', processed)
    return JSON.stringify(record).concat('\n')
})

 await pipeline(
   stream,
   createWriteStream('./data/output.ndjson')
)
// const writeStream = createWriteStream('./data/output.ndjson')
// stream.on('data', (chunk) => {
//   if (!writeStream.write(chunk)) {
//     stream.pause();
//   }
// });
// stream.on('end', (chunk) => {
//   writeStream.end();
// });
// 
// writeStream.on('drain', () => {
//   stream.resume();
// });

console.log(`\nprocess has finished with  ${processed} items...`)
