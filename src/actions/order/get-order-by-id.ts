"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getOrderById = async (id: string) => {
  const session = await auth();

  if (!session) {
    return {
      ok: false,
      message: "Debe estar autenticado",
    };
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        id,
      },
      include: {
        OrderAddress: {
          include: {
            country: {
              select: {
                name: true,
              },
            },
          },
        },
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            size: true,

            product: {
              select: {
                title: true,
                slug: true,
                price: true,
                sizes: true,

                ProductImage: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) throw `${ id } no existe`

    if ( session.user.role === 'user') {
      if ( session.user.id !== order.userId) throw `Este ${ id } no puede ver este pedido`
    }

    // console.log(order);
    const { OrderAddress, OrderItem, ...rest } = order!;

    return {
      ok: true,
      order: rest,
      orderAddress: OrderAddress,
      orderItem: OrderItem,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Hable con el administrador",
    };
  }
};
