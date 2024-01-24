'use server'

import { Gender, Product, Size } from '@prisma/client';
import { z } from 'zod'
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import {v2 as cloudinary} from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL ?? '')

const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce
  .number()
  .min(0)
  .transform( val => Number( val.toFixed(2) ) ),
  inStock: z.coerce
  .number()
  .min(0)
  .transform( val => Number( val.toFixed(0) ) ),
  categoryId: z.string().uuid(),
  sizes: z.coerce.string().transform( val => val.split(',') ),
  tags: z.string(),
  gender: z.nativeEnum( Gender )

})

export const createUpdateproduct =  async ( formData: FormData ) => {
  // console.log(formData);

  const data = Object.fromEntries( formData )
  const productParse = productSchema.safeParse( data )

  if ( !productParse.success ) {
    console.log( productParse.error);
    return {
      ok: false,
    }
  }

  const product = productParse.data
  product.slug = product.slug.toLowerCase().replace(/ /g, '-').trim()


  const { id, ...rest } = product
  const tagsArray = rest.tags.split(',').map( tag => tag.trim() )
  
  try {

    const prismaTx =  await prisma.$transaction( async (tx) => {

      let productDB: Product

      if ( id ) {
        // Actualizar producto

        productDB = await prisma.product.update({
          where: { id },
          data: {
            ...rest,
            sizes: {
              set: rest.sizes as Size[]
            },
            tags: {
              set: tagsArray
            }
          }
        })

        // console.log({ updatedProduct: productDB });

        return {
          productDB
        }
    
      } else {
        //crear
        productDB = await prisma.product.create({
          data: {
            ...rest,
            sizes: {
              set: rest.sizes as Size[]
            },
            tags: {
              set: tagsArray
            }
          }
        })


        return {
          productDB,
        }
        
      }

    })

                    
    if ( formData.getAll('images') ) {
          
      const urlImages = await uploadImage(formData.getAll('images') as File[])
      
      if ( !urlImages ) {
        throw new Error('No se pudieron subir las imagenes')
      }

      await prisma.productImage.createMany({
        data: urlImages.map( url => ({
          url: url!,
          productId: product.id!,
        }))
      })
      
      
    }


    
    // Todo: RevalidatePath

    revalidatePath('/admin/products')
    revalidatePath(`/admin/product/${ product.slug }`)
    revalidatePath(`/products/${ product.slug }`)
    
    return {
      ok: true,
      product: prismaTx.productDB
    }

  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo actualizar/crear, revisar los logs'
    }
    
  }
  
}


const uploadImage = async ( images: File[] ) => {

  try {
    
    const uploadPromises = images.map( async (image) => {

      try {

        const buffer = await image.arrayBuffer()
        const base64Image = Buffer.from(buffer).toString('base64')
  
        const { secure_url } = await cloudinary.uploader.upload(`data:image/png;base64,${ base64Image }`,
          { folder: 'teslo-shop' }
        )
  
        return secure_url
        
      } catch (error) {
        console.log(error);
        return null;
      }
    })

    const urlsImages = await Promise.all( uploadPromises )

    return urlsImages;

  } catch (error) {
    console.log(error);
    return null;
    
  }

}