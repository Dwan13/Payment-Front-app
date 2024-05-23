import { env } from "app/config/env"
import { shopifyUrls } from "./urls"
export const getPayments = async () => {
  try {
    const response = await fetch(shopifyUrls.payments.all)
    const { smart_payments } = await response.json()
    /* const transformedCollections = smart_payments.map((payment: any) => {
      return {
        id: payment.id,
        title: payment.title,
        handle: payment.handle
      }
    }) */
    console.log('smart_payments', smart_payments, shopifyUrls.payments.all);
    
    return smart_payments
  } catch (error) {
    console.log(error)
  }
}
