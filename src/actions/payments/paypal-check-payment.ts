'use server'

import { PayPalOrderStatusResponse } from "@/interfaces"
import prisma from '@/lib/prisma';
import { revalidatePath } from "next/cache";


export const paypalCheckPayment = async ( paypalTransactionId: string ) => {

  const authToken = await getPayPalBearerToken()
  
  if ( !authToken ) return {
    ok: false,
    message: 'Error al obtener el token de verificación'
  }

  const verifyPayPalPayment = async ( 
    paypalTransactionId: string, 
    bearerToken: string  
  ): Promise<PayPalOrderStatusResponse|null> => {
    
    const PAYPAL_ORDER_URL = process.env.PAYPAL_ORDERS_URL
    
    const myHeaders = new Headers()
    myHeaders.append(
      'Authorization', 
      `Bearer ${ bearerToken }`
    )

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    }

    const paypalOrderUrl = `${ PAYPAL_ORDER_URL }/${ paypalTransactionId }`

    try {
      const result = await fetch(paypalOrderUrl, requestOptions)
      .then(response => response.json())
      
      return result
    } catch (error) {
      console.log(error);
      return null
    }
  
  }


  const resp = await verifyPayPalPayment( paypalTransactionId, authToken )
  
  if ( !resp ) return {
    ok: false,
    message: 'Error al verificar el pago'
  }

  const { status, purchase_units } = resp
  // console.log({ status, purchase_units });
  const { invoice_id: orderId } = purchase_units[0]  //Todo: invoiceID

  if ( status !== 'COMPLETED' ) return {
    ok: false,
    message: 'El pago no fue completado'
  }

  // realizar la actualizacion del pago en la DB

  try {

    await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        isPaid: true,
        paidAt: new Date()
      }
    })

    // Revalidar el path
    revalidatePath(`/orders/${ orderId }`)

    return {
      ok: true,
    }
    
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'Error al actualizar el pago'
    }      
  }
}


const getPayPalBearerToken = async ():Promise<string|null> => {

  const PAYPAL_ClIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET
  const PAYPAL_OAUTH_URL = process.env.PAYPAL_OAUTH_URL ?? ''

  const base64token = Buffer.from(
    `${PAYPAL_ClIENT_ID}:${PAYPAL_SECRET}`,
    'utf-8'
  ).toString('base64')

  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')
  myHeaders.append(
    'Authorization', 
    `Basic ${ base64token }`
  )

  const urlencoded = new URLSearchParams()
  urlencoded.append('grant_type', 'client_credentials')

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  }

  try {

    const result = await fetch(PAYPAL_OAUTH_URL, {
      ...requestOptions,
      cache: 'no-store'
    })
    .then(response => response.json())
    
    
    return result.access_token

  } catch (error) {
    console.log(error);
    return null
    
  }

}