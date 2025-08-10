import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Typography,
  Avatar,
  Chip
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import AddProductForm from './AddProductForm';
import EditProductDialog from './EditProductDialog';
import { Link } from 'react-router-dom';

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products: ", error);
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchProducts();
    }, []);

  if (loading) {
    return <Typography>Carregando produtos...</Typography>;
  }

  return (
    <>
      <AddProductForm onProductAdded={fetchProducts} />
      
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="tabela de produtos">
        <TableHead>
          <TableRow>
            <TableCell>Imagem</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell>Categoria</TableCell>
            <TableCell>Preço</TableCell>
            <TableCell>Quantidade</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Avatar 
                  alt={product.name} 
                  src={product.imageURL} 
                  sx={{ width: 56, height: 56 }}
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>
                <Chip label={product.category} color="primary" />
              </TableCell>
              <TableCell>R$ {product.price.toFixed(2)}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>
                {product.isActive ? (
                  <CheckCircle color="success" />
                ) : (
                  <Cancel color="error" />
                )}
              </TableCell>
              <TableCell>
    <EditProductDialog 
      product={product} 
      onProductUpdated={fetchProducts} 
    />
  </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
};

export default ProductsList;