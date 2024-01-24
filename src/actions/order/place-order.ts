"use server";

import { auth } from "@/auth.config";
import { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productsIds: ProductToOrder[],
  address: Address
) => {
  const session = await auth();

  const userId = session?.user.id;

  // Verificar sesion de usuario
  if (!userId) {
    return {
      ok: false,
      message: "No estás autenticado",
    };
  }

  // console.log({ productsIds, address, userId });

  // Obtener la informacion de los productos
  // Nota: Recordar que puede llevar 2+ prodcutos con el mismo ID

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productsIds.map((product) => product.productId),
      },
    },
  });
  // console.log({ product });

  // Calcular los montos // Encabezados
  const itemsInOrder = productsIds.reduce(
    (acc, product) => acc + product.quantity,
    0
  );
  // console.log({ itemsInOrder });

  // Calcular los totales de tax, subTotal y total
  const { subTotal, tax, total } = productsIds.reduce(
    (totals, item) => {
      const productQuantity = item.quantity;

      const product = products.find((product) => product.id === item.productId);
      if (!product) throw new Error(`${item.productId} no existe - 500`);

      const subTotal = product.price * productQuantity;

      totals.subTotal += subTotal;
      totals.tax += subTotal * 0.15;
      totals.total += subTotal * 1.15;

      return totals;
    },
    { subTotal: 0, tax: 0, total: 0 }
  );

  // console.log({ subTotal, tax, total });

  // Crear la transaccion

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      // 1. Actualizar el stock de los productos
      const updatedProductsPromises = products.map((product) => {
        // Acumular los valores
        const productQuantity = productsIds
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => item.quantity + acc, 0);

        if (productQuantity === 0) {
          throw new Error(`${product.id} no tiene la cantidad definida`);
        }

        return tx.product.update({
          where: { id: product.id },
          data: {
            // inStock: product.inStock - productQuantity, // No hacerlo asi
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      // Actualizar el stock
      const updatedProducts = await Promise.all(updatedProductsPromises);

      // Veridicar valores negativos en existencia

      updatedProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error(`${product.title} no tiene stock suficiente`);
        }
      });

      // 2. Crear la orden - Encabezado - Detalle

      const order = await tx.order.create({
        data: {
          userId,
          itemsInOrder,
          subTotal,
          tax,
          total,

          OrderItem: {
            createMany: {
              data: productsIds.map((productId) => ({
                quantity: productId.quantity,
                size: productId.size,
                productId: productId.productId,
                price:
                  products.find((product) => product.id === productId.productId)
                    ?.price ?? 0,
              })),
            },
          },
        },
      });

      // Validar si el price es cero, entonces, lanzar error

      // 3. Crear la direccion de la orden

      const { country, ...restAddres } = address;
      const orderAddress = await tx.orderAddress.create({
        data: {
          ...restAddres,
          countryId: country,
          orderId: order.id,
        },
      });

      return {
        updatedProducts: updatedProducts,
        order: order,
        orderAddress: orderAddress,
      };
    });
    return {
      ok: true,
      order: prismaTx.order,
      prismaTx
    }
  } catch (error: any) {
    console.log(error);
    return {
      ok: false,
      message: error?.message,
    };
  }
};
