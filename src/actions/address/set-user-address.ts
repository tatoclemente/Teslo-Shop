"use server";

import { Address } from "@/interfaces";
import prisma from '@/lib/prisma';

export const setUserAddress = (address: Address, userId: string) => {
  try {

    const saveAddress = createReplaceAddress(address, userId);

    return {
      ok: true,
      address
    }

  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "No se pudo grabar la dirección",
    };
  }
};

const createReplaceAddress = async (address: Address, userId: string) => {
  try {

    const storeAddress = await prisma.userAddress.findUnique({
      where: { userId }
    })

    const addressToSave = {
      userId: userId,
      address: address.address,
      address2: address.address2,
      city: address.city,
      countryId: address.country,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      postalCode: address.postalCode,
    }
    
    // Si No existe lo crea
    if ( !storeAddress ) {
      const newAddress = await prisma.userAddress.create({
        data: addressToSave
      })
      return newAddress;
    }

    // Si existe Lo actualiza
    const updatedAddress = await prisma.userAddress.update({
      where: {
        userId
      },
      data: addressToSave,
    })

    return updatedAddress

  } catch (error) {
    console.log(error);

    throw new Error("No se pudo grabar la dirección");
  }
};
