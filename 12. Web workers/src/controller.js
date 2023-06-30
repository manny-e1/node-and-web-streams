export default class Controller {
    #view
    #service
    #worker
    constructor({view,service,worker}){
        this.#view = view
        this.#service = service
        this.#worker = worker
    }

    static init(deps){
        const controller = new Controller(deps)
        controller.init()
        return controller
    }

    init(){
        this.#view.configureOnFileChange(this.#configureOnFileChange.bind(this))

        this.#view.configureOnSubmit(this.#configureOnSubmit.bind(this))
    }

    #formatBytes(bytes){
        const units = ['B','KB','MB','GB','TB']
        let i = 0
        for (i; bytes >= 1024 && i<4;i++){
            bytes /=1024
        }
        return `${bytes.toFixed(2)} ${units[i]}`
    }

    #configureOnFileChange(file){
        this.#view.setFileSize(this.#formatBytes(file.size))
    }

    #configureOnSubmit({description,file}){
        console.log({description,file})
    }
}
