"use client";

import { useEffect, useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import clsx from "clsx";
import Link from "next/link";

import { placeOrder } from "@/actions";
import { useAddressStore, useCartStore } from "@/store";
import { Sleep, currencyFormat } from "@/utils";

export const PlaceOrder = () => {

  const [loaded, setLoaded] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const address = useAddressStore((state) => state.address);

  const { itemsInCart, subTotal, tax, total } = useCartStore((state) =>
  state.getSummaryInformation()
  );
  
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);


  useEffect(() => {
    setLoaded(true);
  }, []);


  const onPlacingOrder = async() => {
    setIsPlacingOrder(true)
    // await Sleep(2)

    const productsToOrder = cart.map(product => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size
    }))

    console.log({ address, productsToOrder  });
    


    //! Server Action
    const resp = await placeOrder( productsToOrder, address )

    if (!resp.ok) {
      setIsPlacingOrder(false)
      setErrorMessage(resp.message)

      return
    }

    //* Si todo salio bien!
    
    // setIsPlacingOrder(false)
    clearCart()
    const url = `/orders/${resp.order!.id}`
    
    window.location.replace(url)
  }


  if (!loaded) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      <h2 className="text-2xl mb-2">Dirección de entrega</h2>
      <div className="mb-10">
        <p>
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        {address.address2 && <p>{address.address2}</p>}
        <p>{address.postalCode}</p>
        <p>{address.city}</p>
        <p>{address.country}</p>
        <p>{address.phone}</p>
      </div>

      {/* Divider */}
      <div className="w-full h-0.5 rounded bg-gray-300"></div>

      <h2 className="text-2xl my-2">Resumen de la orden</h2>

      <div className="grid grid-cols-2">
        <span>N° Productos:</span>
        <span className="text-right">
          {itemsInCart === 1 ? " 1 artículo" : `${itemsInCart} artículos`}
        </span>

        <span>Subtotal:</span>
        <span className="text-right">{currencyFormat(subTotal)}</span>

        <span>Impuestos (15%)</span>
        <span className="text-right">{currencyFormat(tax)}</span>

        <span className="mt-5 text-2xl">Total:</span>
        <span className=" mt-5 text-2xl text-right">
          {currencyFormat(total)}
        </span>
      </div>

      <div className="mt-5 mb-2 w-full">
        <p className="mb-5">
          {/* Didclaimer */}
          <span className="text-xs">
            Al hacer click en &quot;Completar orden&quot;, aceptas nuestros{" "}
            <Link className="underline" href="#">
              Términos y condiciones
            </Link>{" "}
            y{" "}
            <Link className="underline" href="#">
              Políticas de privacidad
            </Link>
          </span>
        </p>

        {
          errorMessage &&
          (<div className="flex items-center gap-1">
            <IoInformationCircleOutline className="h-5 w-5 text-red-500" />
            <p className="text-red-500">{errorMessage}</p>
          </div>) 
        }

        <button
          // href="/orders/123"
          onClick={ onPlacingOrder }
          className={
            clsx({
              'btn-primary': !isPlacingOrder,
              'btn-disabled': isPlacingOrder,
            })
          }
        >
          Completar orden
        </button>
      </div>
    </div>
  );
};
