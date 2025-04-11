"use client"
import { useEffect } from "react";
import { getProduct } from "@/api/product/product";

export default function Home() {
  const {
    productControllerGetProductById
  } = getProduct();

  const createProduct = async () => {
    try {
      const response = await productControllerGetProductById(8);
      console.log("Product detail:", response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    createProduct();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Check console for product info</h1>
    </div>
  );
}
