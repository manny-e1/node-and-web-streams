import { log } from 'node:console'
import { createReadStream } from 'node:fs'
import {createServer} from 'node:http'
import { Readable, Transform } from 'node:stream'
import csvtojson from 'csvtojson'
import {setTimeout} from 'node:timers/promises'

const PORT = 3500

createServer(async (req,res)=>{
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
    }
    if(req.method === 'OPTIONS'){
        res.writeHead(204,headers)
        res.end()
        return
    }
    
    const abortController = new AbortController()

    let items = 0;
    req.once('close',()=>{
        log('connection was closed.', items, 'processed.')
abortController.abort()
    })

    try{
        res.writeHead(200,headers)
    await Readable.toWeb(createReadStream('./animeflv.csv'))
    .pipeThrough(Transform.toWeb(csvtojson()))
    .pipeThrough(new TransformStream({
        transform(chunk,controller){
            const data = JSON.parse(Buffer.from(chunk))
            const mappedData = JSON.stringify({
                title: data.title,
                description: data.description,
                url: data.url_anime
            })
            controller.enqueue(mappedData.concat('\n'))
        }
    }))
    .pipeTo(new WritableStream({
        async write(chunk){
           await setTimeout(100)
           items++
           res.write(chunk)
        },

        close() {
            res.end()
        }
    }),{signal: abortController.signal})    
    }catch(e){
        if(!e.message.includes('aborted')) throw e
    }

}).listen(PORT,'192.168.0.7').on('listening',_=>log(`running on ${PORT}`))
