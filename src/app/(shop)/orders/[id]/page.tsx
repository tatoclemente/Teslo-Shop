export const revalidate = true;

import clsx from "clsx";
import Image from "next/image";


import { redirect } from "next/navigation";
import { IoCardOutline } from "react-icons/io5";

import { OrderStatus, PayPalButton, Title } from "@/components";
import { getOrderById } from "@/actions";
import { currencyFormat } from "@/utils";

// const productsInCart = [
//   initialData.products[0],
//   initialData.products[1],
//   initialData.products[2],
// ]

interface Props {
  params: {
    id: string;
  };
}

export default async function OrderByIdPage({ params }: Props) {
  const { id } = params;

  const { ok, order, orderAddress, orderItem } = await getOrderById(id);
  

  if (!ok) {
    redirect("/");
  }

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Orden #${id.split("-").at(-1)}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">

            <OrderStatus isPaid={order?.isPaid ?? false} />

            {/* Items */}
            {orderItem?.map(({ product, ...rest }) => (
              <div key={`${product.slug}-${rest.size}`} className="flex mb-5">
                <Image
                  src={`/products/${product.ProductImage[0].url}`}
                  width={100}
                  height={100}
                  alt={product.title}
                  className="mr-5 rounded object-cover w-30 h-30"
                />

                <div>
                  <p>{`${rest.size} - ${product.title}`}</p>
                  <p>{currencyFormat(product.price)}</p>
                  <p className="font-bold">
                    Subtotal: {currencyFormat(product.price)} x {rest.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen de orden */}
          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2">Dirección de entrega</h2>
            <div className="mb-10">
              <p>
                {orderAddress?.firstName} {orderAddress?.lastName}
              </p>
              <p>{orderAddress?.address}</p>
              {orderAddress?.address2 && <p>{orderAddress.address2}</p>}
              <p>{orderAddress?.postalCode}</p>
              <p>{orderAddress?.city}</p>
              <p>{orderAddress?.country.name}</p>
              <p>{orderAddress?.phone}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-300"></div>

            <h2 className="text-2xl mb-2">Resumen de la orden</h2>

            <div className="grid grid-cols-2">
              <span>N° Productos:</span>
              <span className="text-right">
                {order?.itemsInOrder} artículos
              </span>

              <span>Subtotal:</span>
              <span className="text-right">
                {currencyFormat(order!.subTotal)}
              </span>

              <span>Impuestos (15%)</span>
              <span className="text-right">{currencyFormat(order!.tax)}</span>

              <span className="mt-5 text-2xl">Total:</span>
              <span className=" mt-5 text-2xl text-right">
                {currencyFormat(order!.total)}
              </span>
            </div>

            <div className="mt-5 mb-2 w-full">

              {!order?.isPaid ? (
                <PayPalButton amount={order!.total} orderId={order!.id} />
              ) : (
                <OrderStatus isPaid={order.isPaid} />
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
