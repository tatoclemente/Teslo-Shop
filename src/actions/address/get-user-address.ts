'use server'

import prisma from '@/lib/prisma';



export const getUserAddres = async ( userId: string ) => {


  try {
    
    const userAddress = await prisma.userAddress.findFirst({
      where: { userId }
    })

    if (!userAddress) return 
    
    const { countryId, address2, ...rest} = userAddress

    return {
      ...rest,
      address2: address2 ? address2 : '',
      country: countryId,
    }

  } catch (error) {
    console.log(error);
    return null
    
  }

}