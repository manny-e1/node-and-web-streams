import { fork } from 'node:child_process'
import { log } from 'node:console'
import {createWriteStream} from 'node:fs'
import { readdir } from 'node:fs/promises'
import { PassThrough, Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

const outputFileName = './database/output-gmail.ndjson'
const backgroundPath = './src/backgroundJob.js'

const output = createWriteStream(outputFileName)
console.time('child-processes')

    function merge(streams){
        let pass = new PassThrough()
        let waiting = streams.length;
        for(const stream of streams){
            pass = stream.pipe(pass, {end:false})
            stream.once('end',()=>--waiting == 0 && pass.emit('end'))
        }
        return pass
    }    

    function childProcessAsStream(cp,file){
        const stream = Readable({
            read(){}
        })

        cp.on('message',({status,message})=>{
            if (status === 'error'){
                log({
                    msg: 'got an error',
                    file,
                    pid: cp.pid,
                    message: message.split('\n')
                })
            stream.push(null)
            return
            }
            stream.push(JSON.stringify({
                ...message,
                file,
                pid: cp.pid,
            }).concat('\n'))
        })
        cp.send(file)
        return stream
    }

    const childProcesses = []
const counters = {}
    const files = (await readdir('./database')).filter(item => !item.includes('output'))
    for (const file of files){
         const cp = fork(backgroundPath,[],{
             silent: false,
         })
        counters[cp.pid] = {counter:1}
        const stream = childProcessAsStream(cp,`./database/${file}`)
        childProcesses.push(stream)
    }
   const allStreams = merge(childProcesses) 
await pipeline(
    allStreams,
    async function* (source){
        for await(const chunk of source){
            for(const line of chunk.toString().trim().split('\n')){
                const {file, ...data} = JSON.parse(line)
                const counter =  counters[data.pid].counter++
                log(`${file} found ${counter}`)
                yield JSON.stringify(data).concat('\n')
            }
        }
    },output
)

console.timeEnd('child-processes')
