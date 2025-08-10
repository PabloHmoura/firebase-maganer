import React, { useState } from 'react';
import { 
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  IconButton
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const EditProductDialog = ({ product, onProductUpdated }) => {
  const [open, setOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState({ ...product });
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'salgado', label: 'Salgado' },
    { value: 'doce', label: 'Doce' },
    { value: 'bebida', label: 'Bebida' },
    { value: 'outro', label: 'Outro' }
  ];

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateDoc(doc(db, 'products', product.id), {
        ...editedProduct,
        price: Number(editedProduct.price),
        quantity: Number(editedProduct.quantity),
        updatedAt: serverTimestamp()
      });
      
      onProductUpdated();
      handleClose();
    } catch (error) {
      console.error('Erro ao atualizar produto: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setEditedProduct({ ...product });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton color="primary" onClick={handleOpen}>
        <EditIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Produto</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  name="name"
                  label="Nome do Produto"
                  type="text"
                  fullWidth
                  value={editedProduct.name}
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
                  value={editedProduct.description}
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
                  value={editedProduct.category}
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
                  value={editedProduct.price}
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
                  value={editedProduct.quantity}
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
                  value={editedProduct.imageURL}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      name="isActive"
                      checked={editedProduct.isActive}
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
            <Button onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" color="primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default EditProductDialog;