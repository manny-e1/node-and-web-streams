const $ = id => document.querySelector(`#${id}`)
export default class View{
    #csvFile = $('csv-file')
    #fileSize = $('file-size')
    #form = $('form')
    #progress = $('progress')
    #report = $('report')

    setFileSize(size) {
        this.#fileSize.innerText = `File size: ${size}\n`
    }

    configureOnFileChange(fn) {
        this.#csvFile.addEventListener('change',e=>{
            fn(e.target.files[0])
        })
    }

    configureOnSubmit(fn){
        this.#form.reset()
        this.#form.addEventListener('submit', e=> {
            e.preventDefault()
            const file = this.#csvFile.files[0]
            if (!file){
                alert('Please select a file')
            }
            const form = new FormData(e.currentTarget)
            const description = form.get('description')
            fn({description,file})
        })
    }
}
