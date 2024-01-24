"use client";

import { useCartStore } from "@/store";
import { useEffect, useState } from "react";
import { currencyFormat } from '../../../../utils/currencyFormat';

export const OrderSummary = () => {

  const [loaded, setLoaded] = useState(true)

  useEffect(() => {
    setLoaded(false)
  }, [])

  const { itemsInCart, subTotal, tax, total } = useCartStore( state => state.getSummaryInformation())
  

  if (loaded) return <span>Cargando...</span>

  return (
    <>
      <div className="grid grid-cols-2">
        <span>N° Productos:</span>
        <span className="text-right">
          { itemsInCart === 1 
            ? ' 1 artículo' 
            : `${ itemsInCart } artículos` }
        </span>

        <span>Subtotal:</span>
        <span className="text-right">{ currencyFormat( subTotal ) }</span>

        <span>Impuestos (15%)</span>
        <span className="text-right">{ currencyFormat( tax ) }</span>

        <span className="mt-5 text-2xl">Total:</span>
        <span className=" mt-5 text-2xl text-right">{ currencyFormat( total ) }</span>
      </div>
    </>
  );
};
