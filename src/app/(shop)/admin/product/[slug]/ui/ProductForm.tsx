"use client";

import clsx from "clsx";
import Image from "next/image";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2'

import { createUpdateproduct, deleteProductImage } from "@/actions";
import { Category, Gender, Product, ProductImage as ProductWithImage } from "@/interfaces";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductImage } from "@/components";

interface Props {
  product: Partial<Product> & { ProductImage?: ProductWithImage[] };
  categories: Category[];
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface FormInputs {
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  sizes: string[];
  gender: Gender;
  tags: string; // cmisa, t-shirt
  categoryId: string;
  
  // Todo: Images
  images?: FileList;
}

export const ProductForm = ({ product, categories }: Props) => {

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const {
    handleSubmit,
    register,
    formState: { isValid },
    getValues,
    setValue,
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      ...product,
      tags: product.tags?.join(", "),
      sizes: product.sizes ?? [],
      images: undefined
    },
  });

  watch("sizes");

  const onSubmit = async (data: FormInputs) => {
    setLoading(true)

    const formData = new FormData();

    const { images, ...productToSave } = data;

    



    if (product.id) formData.append("id", product.id);
    formData.append("title", productToSave.title);
    formData.append("slug", productToSave.slug);
    formData.append("description", productToSave.description);
    formData.append("price", productToSave.price.toString());
    formData.append("inStock", productToSave.inStock.toString());
    formData.append("sizes", productToSave.sizes.toString());
    formData.append("tags", productToSave.tags);
    formData.append("categoryId", productToSave.categoryId);
    formData.append("gender", productToSave.gender);

    if (images) {
      for ( let i = 0; i < images.length; i++ ) {
        formData.append("images", images[i]);
      }
    }

    const { ok, product: updatedProduct } = await createUpdateproduct(formData);

    if ( !ok ) {
      Swal.fire("Producto no se pudo actualizar");
    } else {
        Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Producto actualizado con éxito",
        showConfirmButton: false,
        timer: 1500
      });
    }
    setLoading(false)
    router.replace(`/admin/product/${ updatedProduct?.slug }`)
  };

  const onSizeChanged = (size: string) => {
    const sizes = new Set(getValues("sizes"));

    sizes.has(size) ? sizes.delete(size) : sizes.add(size);

    setValue("sizes", Array.from(sizes));
  };


  const deleteProduct = async (imageId: number, imageUrl: string) => {
    const button = document.querySelector(`button[data-id="${imageId}"]`) as HTMLButtonElement; // Seleccionar el botón correspondiente
    button.disabled = true; // Desactivar el botón
    button.textContent = "Eliminando..."; // Cambiar el texto del botón
    button.className = 'btn-danger-disabled w-full rounded-b-xl'
  
    try {
      await deleteProductImage(imageId, imageUrl);
      // Actualizar la lista de imágenes (no mostrado en el código)
    } catch (error) {
      // Manejar el error
      button.disabled = false;
      button.textContent = "Eliminar";
      button.className = 'btn-danger w-full rounded-b-xl'
      console.error("Error al eliminar la imagen:", error);
    }
  };
  

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3"
    >
      {/* Textos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Título</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("title", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Slug</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("slug", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Descripción</span>
          <textarea
            rows={5}
            className="p-2 border rounded-md bg-gray-200"
            {...register("description", { required: true })}
          ></textarea>
        </div>

        <div className="flex flex-col mb-2">
          <span>Price</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register("price", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Tags</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("tags", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Gender</span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register("gender", { required: true })}
          >
            <option value="">[Seleccione]</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div className="flex flex-col mb-2">
          <span>Categoria</span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register("categoryId", { required: true })}
          >
            <option value="">[Seleccione]</option>
            {categories?.map((categorie) => (
              <option key={categorie.id} value={categorie.id}>
                {categorie.name}
              </option>
            ))}
          </select>
        </div>

        <button 
          disabled={!isValid} 
          type="submit" 
          className={
          clsx(
            "w-full",
            {
              "btn-primary": !loading,
              "btn-disabled": loading
            }
          )
        }>
          Guardar
        </button>
      </div>

      {/* Selector de tallas y fotos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Inventario</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register("inStock", { required: true, min: 0 })}
          />
        </div>

        {/* As checkboxes */}
        <div className="flex flex-col">
          <span>Tallas</span>
          <div className="flex flex-wrap">
            {sizes.map((size) => (
              // bg-blue-500 text-white <--- si está seleccionado
              <div
                key={size}
                onClick={() => onSizeChanged(size)}
                className={clsx(
                  "flex cursor-pointer items-center justify-center w-10 h-10 mr-2 border rounded-md transition-all",
                  {
                    "bg-blue-500 text-white": getValues("sizes").includes(size),
                  }
                )}
              >
                <span>{size}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col mb-2">
            <span>Fotos</span>
            <input
              type="file"
              { ...register("images") }
              multiple
              className="p-2 border rounded-md bg-gray-200"
              accept="image/png, image/jpeg, image/avif"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {product.ProductImage?.map((image) => (
              <div key={image.id}>
                <ProductImage
                  src={image.url}
                  alt={product.title ?? ""}
                  width={300}
                  height={300}
                  className="rounded-t-xl shadow-md"
                />

                <button
                  type="button"
                  data-id={image.id}
                  onClick={() => deleteProduct(image.id, image.url)}
                  className="btn-danger w-full rounded-b-xl"
                >
                 Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};
