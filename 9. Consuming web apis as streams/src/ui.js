import ComponentBuilder from "./componentBuilder.js";

let components
let active = false
let abortController
const MAX_ITEMS_VISIBLE = 30
function getController(){
    return new AbortController()
}

function addMessageOnTop(msg){
    const table = components.table
    const {content} = table.items.shift()
    const items = table.items.slice(0,MAX_ITEMS_VISIBLE).map(item=>item.content)
    table.clearItems()
    table.addItem(content)
    table.addItem(msg)
    items.forEach(item=>table.addItem(item))
    components.screen.render()
}

function renderUI(initializeFn) {
    components = new ComponentBuilder()
        .setScreen({title: "Consuming Web APIs"})
        .setLayoutComponent()
        .setFormComponent({
            onStart:()=>{
                if (active) return
                abortController = getController()
                abortController.signal.onabort = () => {
                    addMessageOnTop(`{bold}Cancelled`)
                }
                initializeFn(abortController.signal)
                active = true
            },
            onCancel:()=>{
                active = false
                abortController.abort()
            }
        })
        .setDataTableComponent()
        .build()
    components.form.focus()
    components.screen.render()
}

function log(msg){addMessageOnTop(msg)}

export {renderUI,log}
