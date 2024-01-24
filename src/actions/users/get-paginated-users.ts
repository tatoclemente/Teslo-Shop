'use server'

import { auth } from "@/auth.config"
import prisma from '@/lib/prisma';


export const getPaginatedUsers = async () => {

  const session = await auth()

  if ( session?.user.role !== 'admin') {
    return {
      ok: false,
      message: 'Debe ser un usuario administrador'
    }
  }

  try {

    const users = await prisma.user.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return {
      ok: true,
      users
    }
    
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'Error al obtener los usuarios'
    }
    
  }
}