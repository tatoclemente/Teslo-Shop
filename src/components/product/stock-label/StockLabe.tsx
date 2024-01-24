"use client";

import { titleFont } from "@/config/fonts";
import { useEffect, useState } from "react";
import { getStockBySlug } from "@/actions";

interface Props {
  slug: string;
}

export const StockLabe = ({ slug }: Props) => {
  const [stock, setStock] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStock = async () => {
      const inStock = await getStockBySlug(slug);
      setStock(inStock);
      setLoading(false);
    };

    getStock();
  }, [ slug ]);


  return (
    <>
      {
        loading 
        ? (<h1 className={` ${titleFont.className} antialiased font-bold text-lg bg-gray-200 animate-pulse`}>
            &nbsp;
          </h1>)
        : (<h1 className={` ${titleFont.className} antialiased font-bold text-lg`}>
            Stock: { stock }
          </h1>)
        
      }
    </>
  );
};
