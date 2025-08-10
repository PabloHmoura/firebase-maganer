import React from 'react';
import { Container, CssBaseline, Typography } from '@mui/material';
import ProductsList from './components/ProductsList';

function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Lista de Produtos
        </Typography>
        <ProductsList />
      </Container>
    </>
  );
}

export default App;