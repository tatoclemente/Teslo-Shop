'use server'

import {v2 as cloudinary} from 'cloudinary';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
cloudinary.config( process.env.CLOUDINARY_URL ?? '')


export const deleteProductImage = async (imageId: number, imageUrl: string) => {

  if ( !imageUrl.startsWith('http') ) {
    return {
      ok: false,
      message: 'No se pueden eliminar imagenes del File System'
    }
  }

  const imageName = imageUrl.split('/').at(-1)?.split('.')[0] ?? ''

  try {

    await cloudinary.uploader.destroy(`teslo-shop/${imageName}`)
    const deleteImage = await prisma.productImage.delete({
      where: {
        id: imageId,
      },
      select: {
        product: {
          select: {
            slug: true
          }
        }
      }
    })


    // Revalidar Paths
    revalidatePath('/admin/products')
    revalidatePath(`/admin/product/${ deleteImage.product.slug }`)
    revalidatePath(`/product/${ deleteImage.product.slug }`)

    return {
      ok: true,
      message: 'Imagen eliminada con éxito'
    }
    
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'Error al eliminar la imagen'
    }
    
  }
  

      
  

}