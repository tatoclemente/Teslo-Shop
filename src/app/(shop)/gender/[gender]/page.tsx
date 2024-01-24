export const revalidate = 60

import { redirect } from "next/navigation";

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";

import type { Gender } from "@prisma/client";
import { Metadata, ResolvingMetadata } from "next";



interface Props {
  searchParams: {
    page?: string;
  },
  params: {
    gender: string;
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const gender = params.gender

 
  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || []
 
  const genders: Record<string, string> = {
    "men" : "Men",
    "women" : "Women",
    "kid" : "Kids",
    "unisex" : "Unisex"
  }
  return {
    title: genders[gender],
    description: `Clothes for ${genders[gender]}`,
  }
}


export default async function GenderByPage ({ params, searchParams }:Props) {
  
  const { gender } = params

  const page = searchParams.page ? parseInt( searchParams.page ) : 1
  
  // console.log(gender);
  
  
  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({ 
    page, 
    gender: gender as Gender 
  })

  if (products.length === 0) {
    redirect(`/gender/${ gender }`)
  }
  // console.log({ product: products.length, totalPages});
  
  
    

  // if ( id === 'kids') {
  //   notFound()
  // }

  // let gender;
  
  // if(id === 'men') {
  //   gender = 'Hombres'
  // } else if(id === 'women') {
  //   gender = 'Mujeres'
  // } else if(id === 'kid') {
  //   gender = 'Niños'
  // } else {
  //   gender = 'Todos'
  // }

  const labels: Record<string, string> = {
    'men': 'Artículos para Hombres',
    'women': 'Artículos para Mujeres',
    'kid': 'Artículos para Niños',
    'unisex': 'Artículos para Todos'
  }

  const subLabels: Record<string, string> = {
    'men': 'Ropa para ellos',
    'women': 'Ropa para ellas',
    'kid': 'Ropa para los mas peques',
    'unisex': 'Ropa para todos los generos'
  }


  return (
    <div>
        <Title 
        title={labels[gender]}
        subtitle={subLabels[gender]}
        className='mb-2'
      />
      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </div>
  );
}