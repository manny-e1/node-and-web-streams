import { log } from 'node:console'
import { createReadStream } from 'node:fs'
import {pipeline} from 'node:stream/promises'
import split from 'split'

console.log('initializing', process.pid)

process.once('message',async msg => {
    try{
        await pipeline(
            createReadStream(msg),
            split(),
            async function * (source){
                for await(const chunk of source){
                    //ignore empty lines
                    if(!chunk.length) continue
                    const item = JSON.parse(chunk)
                    if (!item.email.includes('gmail'))
                        continue
                    process.send({
                        status: 'success',
                        message: item
                    })
                }
            }
        )

    }catch (error){
        process.send({
            status: 'error',
            message: error.message
        })
    }
})
