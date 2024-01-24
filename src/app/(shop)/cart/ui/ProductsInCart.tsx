"use client";

import { ProductImage, QuantitySelector } from "@/components";
import { ProductCart } from "@/interfaces";

import { useCartStore } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export const ProductsInCart = () => {
  const productsInCart = useCartStore((state) => state.cart);
  const onUpdateProductsInCart = useCartStore( state => state.updateProductCart)
  const onRemoveItemFromCart = useCartStore( state => state.removeProductCart)

  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    setLoaded(false);
  }, []);


  if (loaded) return <div>Cargando...</div>;
  else if (productsInCart.length === 0) {
    redirect('/empty')
  };

  return (
    <>
      {productsInCart.map((product) => (
        <div key={`${product.slug}-${product.size}`} className="flex mb-5">
          <ProductImage
            src={product.image}
            width={100}
            height={100}
            style={{
              width: "100px",
              height: "100px",
            }}
            alt={product.title}
            className="mr-5 rounded object-cover w-40 h-40"
          />

          <div>
            <Link href={`/product/${product.slug}`} className="transition-all hover:underline">
              <p>
                {product.size} - {product.title}
              </p>
            </Link>`
            <p>${product.price.toFixed(2)}</p>
            <QuantitySelector
              quantity={product.quantity}
              onQuantityChanged={ (quantity) => onUpdateProductsInCart(product, quantity) }
            />

            <button
              onClick={() => onRemoveItemFromCart(product)} 
              className="underline mt-3">Remover</button>
          </div>
        </div>
      ))}
    </>
  );
};
