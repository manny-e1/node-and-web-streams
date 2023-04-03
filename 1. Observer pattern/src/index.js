import {PaymentSubject} from './subjects/paymentSubject.js'
import {Marketing} from './observers/marketing.js'
import {Shipment} from './observers/shipment.js'
import {Payment} from './events/payment.js'

const paymentSubject = new PaymentSubject()
const marketing = new Marketing()
const shipment = new Shipment()

paymentSubject.subscribe(marketing)
paymentSubject.subscribe(shipment)

const payment = new Payment(paymentSubject)

payment.payWithCreditCard({id:1,username:"Manny",price:430})
