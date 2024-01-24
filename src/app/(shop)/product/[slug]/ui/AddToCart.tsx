'use client'

import { QuantitySelector, SizeSelector } from "@/components";
import { Product, ProductCart, Size } from "@/interfaces";
import { useCartStore } from "@/store";
import { useState } from "react";

interface Props {
  product: Product;
}

export const AddToCart = ({ product }: Props) => {

  const addProductToCart = useCartStore( state => state.addProductCart )

  const [size, setSize] = useState<Size|undefined>()
  const [quantity, setQuantity] = useState<number>(1)
  const [posted, setPosted] = useState(false)

  const addToCart = () => {
    setPosted(true)

    if ( !size ) return

    const cartProduct:ProductCart = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      image: product.images[0],
      size,
      quantity

    }
    
    // console.log({ product, size, quantity })
    addProductToCart(cartProduct)
    setPosted(false)
    setQuantity(1)
    setSize(undefined)
  }

  return (
    <>
      {
        posted && !size && (
          <span className="mt-2 text-red-500 fade-in">
            Debes seleccionar un talle*
          </span>
        )
      }

      <SizeSelector
        selectedSizes={size}
        availableSizes={product.sizes}
        onSizeChanged={ setSize }
      />

      {/* Selector de cantidad  */}
      <QuantitySelector 
        quantity={ quantity } 
        onQuantityChanged={ setQuantity }
      />

      {/* Boton de agregar al carrito */}
      <button onClick={addToCart} className="btn-primary my-5">Agregar al carrito</button>
    </>
  );
};
