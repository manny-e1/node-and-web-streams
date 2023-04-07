import { log } from 'node:console'
import {TextDecoderStream,ReadableStream,WritableStream,TransformStream} from 'node:stream/web'
import { Readable } from 'node:stream'
import {setInterval} from 'node:timers/promises'

//  const readable = new ReadableStream({
//      async start(controller){
//          for await (const i of setInterval(100)){
//              controller.enqueue(`Yo ${new Date().toISOString()}`)
//          }
//      }
//  })

 async function* nodeReadable(){
     for await(const _ of setInterval(200)){
         yield `from node streams hi ${new Date().toISOString()}`
     }    
 }
 
 const readable = Readable.toWeb(Readable.from(nodeReadable()))

const transfrom = new TransformStream({
    transform(chunk,controller){
        controller.enqueue(chunk.split(' ').join('-').toUpperCase())
    }
})


readable
    .pipeThrough(transfrom)
    //.pipeThrough(new TextDecoderStream())
    .pipeTo(new WritableStream({
    write(chunk){
        log(chunk)
    }
}))
