import Link from "next/link";
import React from "react";
import {
  IoPeopleOutline,
  IoShirtOutline,
  IoTicketOutline,
} from "react-icons/io5";

interface Props {
  closeSideMenu: () => void
}

export const AdminOptions = ({closeSideMenu}:Props) => {
  return (
    <>
      {/* Line Separator */}
      <div className="w-full h-px bg-gray-200 my-10"></div>

      <Link
        onClick={closeSideMenu}
        href="/admin/products"
        className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
      >
        <IoShirtOutline size={30} />
        <span className="ml-3 text-xl">Productos</span>
      </Link>

      <Link
        onClick={closeSideMenu}
        href="/admin/orders"
        className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
      >
        <IoTicketOutline size={30} />
        <span className="ml-3 text-xl">Ordenes</span>
      </Link>

      <Link
        onClick={closeSideMenu}
        href="/admin/users"
        className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
      >
        <IoPeopleOutline size={30} />
        <span className="ml-3 text-xl">Usuarios</span>
      </Link>
    </>
  );
};
