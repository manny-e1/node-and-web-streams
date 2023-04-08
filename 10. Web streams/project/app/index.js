const API_URL = 'http://192.168.0.7:3500';

async function consumeAPI(signal){
    const response = await fetch(API_URL, {
        signal
    })

    const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(parseNDJSON())
        return reader

}

function parseNDJSON() {
    let buffer = ''
    return new TransformStream({
        transform(chunk,controller){
            buffer +=chunk
            const items = buffer.split('\n')
            if(!items[0]) return
            controller.enqueue(JSON.parse(items[0]))
            buffer = items[items.length-1]
        },
        flush(controller){
            if(!buffer) return;
            controller.enqueue(JSON.parse(buffer))
        }
    })
}



const stopButton = document.getElementById('stop')
const startButton = document.getElementById('start')
stopButton.addEventListener('click',()=>{
    abortController.abort()
    abortController = new AbortController()
})

startButton.addEventListener('click',async ()=>{
    try { 
        let count = 1;
   const readable = await consumeAPI(abortController.signal)
        await readable
 .pipeTo(new WritableStream({
        write(chunk){
            const parsed = chunk
            const main = document.getElementById('cards')
          
        const article = document.createElement('article')
const data = `
            
                <div class="text">
                <h3>${parsed.title} --- ${count}</h3>
                <p>${parsed.description.slice(0,80)}</p>
                <a href="${parsed.url}">Here's why</a>

                </div>
            
                `
            article.innerHTML = data
            main.appendChild(article)
            count++
        }
    }))

    }catch (error){
        if (!error.message.includes('aborted')) throw error
    }
})

let abortController = new AbortController()

