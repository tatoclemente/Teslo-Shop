import { Title } from "@/components";
import { initialData } from "@/seed/seed";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductsInCart } from "./ui/ProductsInCart";
import { OrderSummary } from "./ui/OrderSummary";


// const productsInCart = [
//   initialData.products[0],
//   initialData.products[1],
//   initialData.products[2],
// ] 


export const metadata = {
 title: 'Cart',
 description: 'Shoping Cart',
};

export default function CartPage() {

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
          <Title
            title="Carrito de compras"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

            {/* Carrito */}
            <div className="flex flex-col mt-5">
              <span className="text-xl">Agregar más items</span>
              <Link href="/" className="underline mb-5">
                Continuar comprando
              </Link>

              {/* Items */}

              <ProductsInCart />

            </div>
            {/* Resumen de orden */}
            <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
              <h2 className="text-2xl mb-2">Resumen de la orden</h2>

             <OrderSummary />
              <div className="mt-5 mb-2 w-full">
                <Link href="/checkout/address" className="flex justify-center btn-primary">
                  Finalizar compra
                </Link>
              </div>

            </div>

          </div>
      </div>
    </div>
  );
}