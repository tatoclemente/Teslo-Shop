"use client";

import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import Image from "next/image";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export const ProductsInCart = () => {
  const productsInCart = useCartStore((state) => state.cart);

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
          <Image
            src={`/products/${product.image}`}
            width={100}
            height={100}
            alt={product.title}
            className="mr-5 rounded object-cover w-30 h-30"
          />

          <div>
            <span>
              <p>
                {product.size} - {product.title} ({ product.quantity})
              </p>
            </span>
            <p className="font-bold">{currencyFormat(product.price * product.quantity)}</p>

          </div>
        </div>
      ))}
    </>
  );
};
