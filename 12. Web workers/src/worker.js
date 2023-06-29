import Service from "./service.js"

console.log("ready")

const service = new Service()

onmessage = ({data}) => {
    const {query,file} = data
    service.processFile({
        query,
        file,
        onOcurrenceUpdate: (args)=> {
            postMessage({eventType: 'ocurrenceUpdate',...args})
        },
        onProgress: (total)=>postMessage({eventType: 'progress',total})
    })
}
