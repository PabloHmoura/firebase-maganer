import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export async function getProducts() {
  try {
    const productsCollection = collection(db, "products");
    const snapshot = await getDocs(productsCollection);
    
    const products = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      products.push({
        id: doc.id,
        name: data.name,
        category: data.category,
        description: data.description,
        price: data.price,
        quantity: data.quantity,
        imageURL: data.imageURL,
        isActive: data.isActive,
        createdAt: data.createdAt?.toDate() || null,
        updatedAt: data.updatedAt?.toDate() || null
      });
    });
    
    return products;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
}