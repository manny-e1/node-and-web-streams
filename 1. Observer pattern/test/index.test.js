import { expect, describe, test, jest } from '@jest/globals';
import { PaymentSubject } from '../src/subjects/paymentSubject.js';
import { Payment } from '../src/events/payment.js';
import { Shipment } from '../src/observers/shipment.js';
import { Marketing } from '../src/observers/marketing.js';

describe('Test Suite for Observer Pattern', () => {
  test('#PaymentSubject notify observers', () => {
    const subject = new PaymentSubject();
    const observer = {
      update: jest.fn(),
    };
    const data = { id: 1, username: 'Manny', price: 598 };

    const expected = data;
    subject.subscribe(observer);
    subject.notify(data);

    expect(observer.update).toBeCalledWith(expected);
  });
  test('#PaymentSubject should not notify unsubscribed observers', () => {
    const subject = new PaymentSubject();
    const observer = {
      update: jest.fn(),
    };
    const data = { id: 1, username: 'Manny', price: 598 };

    const expected = data;
    subject.subscribe(observer);
    subject.unsubscribe(observer);
    subject.notify(data);

    expect(observer.update).not.toBeCalledWith(expected);
  });
  test('#Payment should notify subject after a credit card transaction', () => {
    const subject = new PaymentSubject();
    const payment = new Payment(subject);
    console.log(subject.notify.name);
    const paymenSubjectNotifierSpy = jest.spyOn(subject, subject.notify.name);
    const data = { id: 1, username: 'Manny', price: 598 };
    const { price, ...expected } = data;
    payment.payWithCreditCard(data);
    expect(paymenSubjectNotifierSpy).toBeCalledWith(expected);
  });
  test('#All should notify after a credit card payment', () => {
    const subject = new PaymentSubject();
    const payment = new Payment(subject);
    const shipment = new Shipment();
    const marketing = new Marketing();
    const data = { id: 1, username: 'Manny', price: 598 };
    const { price, ...expected } = data;
    const shipmentUpdateFnSpy = jest.spyOn(shipment, shipment.update.name);
    const marketingUpdateFnSpy = jest.spyOn(marketing, marketing.update.name);
    subject.subscribe(shipment);
    subject.subscribe(marketing);
    payment.payWithCreditCard(data);
    expect(shipmentUpdateFnSpy).toBeCalledWith(expected);
    expect(marketingUpdateFnSpy).toBeCalledWith(expected);
  });
});
