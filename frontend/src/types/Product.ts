export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  color: string;
  material: string;
  medidas: string;
}

/**
 * Respuesta esperada del backend para /products
 * Esto te permite tipar correctamente el hook useFetchProducts
 */
export type ProductResponse = {
  data: Product[];        // lista de productos
  totalProducts: number;  // total de productos en la DB
  totalPages: number;     // total de páginas (si usas paginación)
  page: number;           // página actual
};
