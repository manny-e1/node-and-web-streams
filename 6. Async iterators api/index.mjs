import { log } from 'node:console'
import {pipeline} from 'node:stream/promises'
import { setTimeout } from 'node:timers/promises'

async function * customReadable(){
    yield Buffer.from('New phone,')
    await setTimeout(1000)
    yield Buffer.from('Who dis?')
}

async function * customTransform(stream){
    for await(const chunk of stream){
        yield Buffer.from(chunk.toString().replace(/\s/g,'_'))
    }
}

async function * customDuplex(stream) {
    let bytesRead = 0
    const wholeString = []
    for await(const chunk of stream){
        log('[Duplex] ', chunk.toString())
        bytesRead += chunk.length
        wholeString.push(chunk.toString())
    }

    yield `wholeString: ${wholeString.join(' ').replace(/_/g,' ')}`
    await setTimeout(250)
    yield `bytesRead: ${bytesRead}`
}

async function * customWritable(stream) {
    for await(const chunk of stream){
        log(chunk)
    }
}

await pipeline(customReadable,customTransform,customDuplex,customWritable)
