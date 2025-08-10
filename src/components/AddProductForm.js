import React, { useState } from 'react';
import { 
  Button, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  MenuItem,
  Switch,
  FormControlLabel,
  Grid
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const AddProductForm = ({ onProductAdded }) => {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: 'salgado',
    price: 0,
    quantity: 0,
    imageURL: '',
    isActive: true
  });

  const categories = [
    { value: 'salgado', label: 'Salgado' },
    { value: 'doce', label: 'Doce' },
    { value: 'bebida', label: 'Bebida' },
    { value: 'outro', label: 'Outro' }
  ];

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setProduct({
      ...product,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...product,
        price: Number(product.price),
        quantity: Number(product.quantity),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log('Produto adicionado com ID: ', docRef.id);
      onProductAdded();
      handleClose();
    } catch (error) {
      console.error('Erro ao adicionar produto: ', error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setProduct({
      name: '',
      description: '',
      category: 'salgado',
      price: 0,
      quantity: 0,
      imageURL: '',
      isActive: true
    });
  };

  return (
    <div>
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AddIcon />}
        onClick={handleClickOpen}
        sx={{ mb: 2 }}
      >
        Adicionar Produto
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Adicionar Novo Produto</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  margin="dense"
                  name="name"
                  label="Nome do Produto"
                  type="text"
                  fullWidth
                  value={product.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  name="description"
                  label="Descrição"
                  type="text"
                  fullWidth
                  value={product.description}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  margin="dense"
                  name="category"
                  label="Categoria"
                  fullWidth
                  value={product.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  name="price"
                  label="Preço (R$)"
                  type="number"
                  fullWidth
                  value={product.price}
                  onChange={handleChange}
                  inputProps={{ step: "0.01", min: "0" }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  name="quantity"
                  label="Quantidade em Estoque"
                  type="number"
                  fullWidth
                  value={product.quantity}
                  onChange={handleChange}
                  inputProps={{ min: "0" }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  name="imageURL"
                  label="URL da Imagem"
                  type="url"
                  fullWidth
                  value={product.imageURL}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      name="isActive"
                      checked={product.isActive}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="Produto ativo"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" color="primary">Adicionar</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default AddProductForm;