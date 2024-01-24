export const revalidate = 604800 // 7 dias

import { getProductBySlug } from "@/actions";
import { ProductMobileSlideshow, ProductSlideshow, QuantitySelector, SizeSelector, StockLabe } from "@/components";
import { titleFont } from "@/config/fonts";
import { Metadata, ResolvingMetadata } from "next";
// import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";
import { AddToCart } from "./ui/AddToCart";
import { useCartStore } from "@/store";


interface Props {
  params: {
    slug: string
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const sulg = params.slug
 
  // fetch data
  const product = await getProductBySlug(sulg)
 
  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: product?.title ?? 'Producto no encontrado',
    description: product?.description ?? '',
    openGraph: {
      title: product?.title ?? 'Producto no encontrado',
      description: product?.description ?? '',
      // images: ['/some-specific-page-image.jpg', ...previousImages],
      images: [`/products/${ product?.images[1] }`],
    },
  }
}


export default async function ProductBySlugPage({ params }:Props) {
  //  Develop
  // const product = initialData.products.find( product => product.slug === slug )

  const { slug } = params
  const product = await getProductBySlug( slug )
  console.log(product);
  

  if (!product) {
    notFound()
  }

  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3 max-w-[1400px] md:mx-auto">
      {/* Slideshow */}
      <div className="col-span-1 md:col-span-2">
        {/* Mobile Slideshow */}
        <ProductMobileSlideshow 
          images={product.images} 
          title={product.title} 
          className="block md:hidden" 
        />
      
        {/* Desktop Slideshow */}
        <ProductSlideshow 
          images={product.images} 
          title={product.title} 
          className="hidden md:block" 
        />
      </div>

      {/* Detalles */}
      <div className="col-span-1 px-5">
       
        <StockLabe slug={ slug } />

        <h1 className={` ${ titleFont.className } antialiased font-bold text-xl`}>
          { product?.title }
        </h1>
        <p className="text-lg mb-5">${ product.price.toFixed(2)}</p>

        {/* Selector de talles */}

        <AddToCart product={ product } />

        {/* Descripcion del producto  */}
        <h3 className="font-bold text-sm">Descripción</h3>
        <p>{product.description}</p>
      </div>

    </div>
  );
}