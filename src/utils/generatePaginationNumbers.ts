

// [1,2,3,4,'...',7]
// [1,2,3,4,'...',48,49,50]

export const generatePaginationNumbers = ( currentPage: number, totalPages: number ) => {
  // console.log(totalPages);
  
  // Si el numero total de paginas es 7 o menos
  // vamos a mostrar todos los numeros sin puntos suspensivos
  if ( totalPages <= 7 ) {
    return Array.from( { length: totalPages }, ( _, i ) => i + 1 ); // [1,2,3,4,5,6,7]
  }
  // Si el numero de paginas es mayor a 7
  // vamos a mostrar los primeros 3, puntos suspensivos y ultimos 2
  if (currentPage < 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages]; // [1,2,3,'...',49,50]
  }
  // Si la pagina actual esta en las ultimas tres paginas
  // vamos a mostrar los primeros 2, puntos suspensivos y ultimos 3

  if (currentPage >= totalPages - 3) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages]; // [1,2,'...',48,49,50]  
  }

  // Si la pagina actual esta en el medio
  // vamos a mostrar la primera pagina, puntos suspensivos, la pagina actual y vecinos

  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ]

}