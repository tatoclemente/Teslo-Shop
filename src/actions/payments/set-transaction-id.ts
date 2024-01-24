'use server'

import { auth } from "@/auth.config"
import prisma from '@/lib/prisma';


export const setTransactionId = async (transactionId: string, orderId: string) => {

  const session = await auth()
  if ( !session ) return {
    ok: false,
    message: 'No estas autorizado par aesta transacción'
  }

  try {

    const resp = await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        transactionId
      }
    })

    if ( !resp ) throw new Error('Error al guardar el id de la transacción')

    return {
      ok: true,
      message: 'Id de la transacción guardada'
    }
    
  } catch (error:any) {
    console.log(error);
    return {
      ok: false,
      message: error.message
    }
    
  }

}