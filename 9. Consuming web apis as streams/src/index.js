import { pipeline } from "node:stream/promises";
import { log, renderUI } from "./ui.js";
import {Readable} from 'node:stream'

async function * consumeAPI(signal){
    const response = await fetch('http://localhost:3000',{signal})
    const reader = response.body.getReader()
    let done = false
    do {
        const res = await reader.read()
        done = res.done
        if(done) break
        const data = Buffer.from(res.value).toString().split('\n')
        for (const item of data){
            if (!item) continue
            yield item
        }
    }while(!done)
}

function print(logFn){
    return async function * (stream) {
        for await(const chunk of stream){
            logFn(chunk)
        }
    }
}

async function initialize(signal){
    try{
        const readable = Readable.from(consumeAPI(signal))
        await pipeline(readable,print(log),{signal})
    }catch(err){
        if (err.code !== 'ABORT_ERR') throw err
    }
}

renderUI(initialize)
