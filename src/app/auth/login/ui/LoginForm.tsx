"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

import { authenticate } from "@/actions";
import { IoInformationCircleSharp } from "react-icons/io5";
import clsx from "clsx";

export const LoginForm = () => {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  // console.log(errorMessage);
  

  return (
    <form autoComplete="off" action={dispatch} className="flex flex-col">
      <label htmlFor="email">Correo electrónico</label>
      <input
        autoComplete="user"
        autoFocus
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="email"
        name="email"
      />

      <label htmlFor="password">Contraseña</label>
      <input
        autoComplete="new-password"
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="password"
        name="password"
      />
         <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <div className="mb-2 flex gap-1">
              <IoInformationCircleSharp className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </div>
          )}
        </div>

      <LoginButton />

      {/* divisor l ine */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="/auth/new-account" className="btn-secondary text-center">
        Crear una nueva cuenta
      </Link>
    </form>
  );
};


function LoginButton() {
  const { pending } = useFormStatus();
 
  return (

    <button 
      type="submit" 
      className={
        clsx({
          'btn-primary': !pending,
          'btn-disabled': pending,
        })
      }
      disabled={pending}
      >Ingresar</button>
  );
}
