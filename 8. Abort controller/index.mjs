import { log } from 'node:console'
import { Readable } from 'node:stream'
import {pipeline} from 'node:stream/promises'
import { setInterval } from 'node:timers/promises'


async function * customReadable(abortController) {
//     if we use this function directly, we have to manually check and break out of it.
//     if(abortController.signal.aborted) break;
    for await(const interval of setInterval(200)) yield Buffer.from(`tick: ${new Date().toISOString()}`)
}

async function * customWritable(stream) {
    for await(const chunk of stream) console.log(chunk.toString())
}

const abortController = new AbortController()
abortController.signal.addEventListener('abort',()=>log("They killed me"))
abortController.signal.onabort = ()=>log("I'm dead")

setTimeout(()=>abortController.abort(),1011)

try{
    await pipeline(
        //customReadable(abortController), //We have to pass the abort controller
        Readable.from(customReadable()), // We don't need to pass it here
        customWritable,
        {signal:abortController.signal}
    )
}catch(e){
    if(e.code !== 'ABORT_ERR') throw e
}
