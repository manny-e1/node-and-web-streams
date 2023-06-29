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

    #csvToJSON() {
        let _delimiter = ','
        let _columns = ''
        let _buffer = ''
        const BREAKLINE_SYMBOL = "\n"
        const INDEX_NOT_FOUND = -1

        return new TransformStream({
            transform(chunk,controller) {
                _buffer = _buffer.concat(chunk)
                let breaklineIndex = 0
                while (breaklineIndex !== INDEX_NOT_FOUND){
                    breaklineIndex = _buffer.indexOf(BREAKLINE_SYMBOL)
                    if(breaklineIndex === INDEX_NOT_FOUND) break;

                }
            }
        })

        function consumeLineData(breaklineIndex) {
            const lineToProcessIndex = breaklineIndex + BREAKLINE_SYMBOL.length
            const line = _buffer.slice(0,lineToProcessIndex)
        }
    }
}
