import { log } from 'node:console'
import { randomUUID } from 'node:crypto'
import { createServer } from 'node:http'
import { Readable } from 'node:stream'
import { setInterval } from 'node:timers/promises'

async function * readable(){
    let counter = 0
    for await (const i of setInterval(200)){
        const item = JSON.stringify({
            id: randomUUID(), 
            name: `Manny-${Date.now()}`
        }).concat("\n")
        console.count('item sent')
        yield item
        if(++counter >= 600) break
    }
}   


createServer((req,res)=>{
    Readable.from(readable()).pipe(res)
}).listen(3000,()=>log('at 3000'))
