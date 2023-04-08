import { log } from 'node:console'
import { createReadStream } from 'node:fs'
import {pipeline} from 'node:stream/promises'
import split from 'split'

console.log('initializing', process.pid)

process.once('message',async msg => {
    log('msg',msg)
    process.send({ok:'hello'})
//      await pipeline(
//          createReadStream(msg),
//          split(),
//          async function * (source){
//              for await(const chunk of source){
//                   log("chunk *******", chunk.toString())
//              }
//          }
//      )
})
