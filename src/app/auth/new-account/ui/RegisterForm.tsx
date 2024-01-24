"use client";

import clsx from "clsx";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { login, registerUser } from "@/actions";
import { regexTypes } from "@/utils";
import { useState } from "react";



type FormInputs = {
  name: string;
  email: string;
  password: string;
};

export const RegisterForm = () => {


  const [errorMessage, setErrorMessage] = useState('')
  const [showMessage, setShowMessage] = useState(false)
  const [loader, setLoader] = useState(false)

  const { register, handleSubmit, formState: { errors }  } = useForm<FormInputs>();

  const onSubmit = async (data: FormInputs) => {
    const { name, email, password } = data;

    // Server Action
    setLoader(true)
    const resp = await registerUser(name, email, password);

    if ( !resp.ok ) {
      setErrorMessage(resp.message)
      setShowMessage(true)
      timeMessage()
      setLoader(false)
      return
    }

    await login( email.toLowerCase(), password );
    window.location.replace('/')
    setLoader(false)

  };

  const timeMessage = () => {
    setTimeout(() => {
      setShowMessage(false)
      setErrorMessage('')
    }, 2000)
  }

  return (
    <form onSubmit={ handleSubmit( onSubmit )} className="flex flex-col">

      {/* {
        errors.name && <span>*El nombre es obligatorio</span>
      } */}
      <label htmlFor="name">Nombre completo</label>
      <input
        className={
          clsx(
            "px-5 py-2 border bg-gray-200 rounded mb-5",
            {
              'focus:outline-red-500 border-red-500': errors.name
            }
          )
        }
        type="text"
        autoFocus
        {...register("name", { required: true })}
      />

      <label htmlFor="email">Correo electrónico</label>
      <input
         autoComplete="email"
         className={
          clsx(
            "px-5 py-2 border bg-gray-200 rounded mb-5",
            {
              'focus:outline-red-500 border-red-500': errors.email
            }
          )
        }
        type="email"
        {...register("email", { required: true, pattern: regexTypes.email})}
      />

      <label htmlFor="passwword">Contraseña</label>
      <input
         autoComplete="new-password"
         className={
          clsx(
            "px-5 py-2 border bg-gray-200 rounded mb-5",
            {
              'focus:outline-red-500 border-red-500': errors.password
            }
          )
        }
        type="password"
        {...register("password", { required: true }) }
      />

      {/* <button
    
          className="btn-primary">
          Crear cuenta
        </button> */}

      <span className="text-red-500">{errorMessage}</span>
      
      

      <button 
      type="submit" 
      className={
        clsx({
          'btn-primary': !loader,
          'btn-disabled': loader,
        })
      }
      disabled={loader}
      >Crear cuenta</button>

      {/* divisor l ine */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="/auth/login" className="btn-secondary text-center">
        Ingresar
      </Link>
    </form>
  );
};




