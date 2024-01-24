import type { Size } from "@/interfaces"
import clsx from "clsx"


interface Props {
  selectedSizes?: Size
  availableSizes: Size[]

  onSizeChanged: (size: Size) => void;
}

export const SizeSelector = ({ selectedSizes, availableSizes, onSizeChanged }:Props) => {
  return (
    <div className="my-5">
      <h3 className="font-bold mb-4">Talles disponibles</h3>

      <div className="flex">
        {
          availableSizes.map( size => (
            <button
              key={ size }
              onClick={ () => onSizeChanged( size )}
              className={
                clsx(
                  "mx-2 hover:underline text-lg",
                  {
                    'underline': size === selectedSizes
                  }
                  )
              }
            >
              { size }
            </button>
          ))
        }
      </div>

    </div>
  )
}
