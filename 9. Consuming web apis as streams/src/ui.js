import ComponentBuilder from "./componentBuilder";


export function renderUI() {
    const components = new ComponentBuilder().setScreen({title: "Consuming Web APIs"}).setLayoutComponent().build()

    components.screen.render()

}
