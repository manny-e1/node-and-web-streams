export class Payment{
    constructor(subject) {
        this.subject = subject
    }

    payWithCreditCard({id, username, price}) {
        console.log(`${username} payed $${price}`)
        this.subject.notify({id,username})
    }
}
