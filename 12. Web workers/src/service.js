export default class Service{
    processFile({query,file,onOcurrenceUpdate,onProgress}){
        file
            .stream()
            .pipeThrough(new TextDecoderStream())
            .pipeThrough(this.#updateProgressBar({onProgress,fileSize: file.size}))
            .pipeTo(new WritableStream({
                write(chunk){
                    console.log({chunk})
                }
            }))
    }

    #updateProgressBar({onProgress, fileSize}) {
        let totalUpdated = 0
        onProgress(0)
        const progressFn = (chunkLength)=>{
            totalUpdated += chunkLength
            const total  = 100/fileSize * totalUpdated
            onProgress(total)
        }

        return new TransformStream({
            transform(chunk,controller){
                progressFn(chunk.length)
                controller.enqueue(chunk)
            }
        })
    }
}
