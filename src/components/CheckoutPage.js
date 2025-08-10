// import React, { useState, useEffect } from 'react';
// import { 
//   Container,
//   Grid,
//   Typography,
//   Card,
//   CardContent,
//   CardMedia,
//   Button,
//   TextField,
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
//   IconButton,
//   Paper,
//   Box,
//   Stepper,
//   Step,
//   StepLabel
// } from '@mui/material';
// import { Add, Remove, ShoppingCart, Payment, Done } from '@mui/icons-material';
// import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
// import { db } from '../firebaseConfig';
// import { useAuth } from '../contexts/AuthContext'; // Assumindo que você tem contexto de autenticação

// const steps = ['Carrinho', 'Pagamento', 'Confirmação'];

// const CheckoutPage = ({ products }) => {
//   const { currentUser } = useAuth();
//   const [cart, setCart] = useState([]);
//   const [activeStep, setActiveStep] = useState(0);
//   const [paymentMethod, setPaymentMethod] = useState('credit');
//   const [shippingAddress, setShippingAddress] = useState('');
//   const [orderId, setOrderId] = useState(null);

//   // Adicionar item ao carrinho
//   const addToCart = (product) => {
//     setCart(prevCart => {
//       const existingItem = prevCart.find(item => item.id === product.id);
//       if (existingItem) {
//         return prevCart.map(item =>
//           item.id === product.id 
//             ? { ...item, quantity: item.quantity + 1 } 
//             : item
//         );
//       }
//       return [...prevCart, { ...product, quantity: 1 }];
//     });
//   };

//   // Remover item do carrinho
//   const removeFromCart = (productId) => {
//     setCart(prevCart => 
//       prevCart.reduce((acc, item) => {
//         if (item.id === productId) {
//           if (item.quantity > 1) {
//             acc.push({ ...item, quantity: item.quantity - 1 });
//           }
//         } else {
//           acc.push(item);
//         }
//         return acc;
//       }, [])
//     );
//   };

//   // Calcular total
//   const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

//   // Finalizar pedido
//   const handlePlaceOrder = async () => {
//     if (!currentUser) {
//       alert('Por favor, faça login para finalizar a compra');
//       return;
//     }

//     try {
//       // Criar pedido no Firebase
//       const orderRef = await addDoc(collection(db, 'orders'), {
//         userId: currentUser.uid,
//         items: cart,
//         total,
//         paymentMethod,
//         shippingAddress,
//         status: 'pending',
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp()
//       });

//       // Atualizar estoque
//       const batch = [];
//       cart.forEach(item => {
//         const productRef = doc(db, 'products', item.id);
//         batch.push(
//           updateDoc(productRef, {
//             quantity: item.productQuantity - item.quantity
//           })
//         );
//       });

//       await Promise.all(batch);
      
//       setOrderId(orderRef.id);
//       setActiveStep(2);
//       setCart([]);
//     } catch (error) {
//       console.error('Erro ao finalizar pedido:', error);
//     }
//   };

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//       <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
//         {steps.map((label) => (
//           <Step key={label}>
//             <StepLabel>{label}</StepLabel>
//           </Step>
//         ))}
//       </Stepper>

//       {activeStep === 0 && (
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={8}>
//             <Typography variant="h5" gutterBottom>Produtos Disponíveis</Typography>
//             <Grid container spacing={2}>
//               {products.filter(p => p.isActive && p.quantity > 0).map(product => (
//                 <Grid item xs={12} sm={6} md={4} key={product.id}>
//                   <Card>
//                     <CardMedia
//                       component="img"
//                       height="140"
//                       image={product.imageURL || '/placeholder-product.png'}
//                       alt={product.name}
//                     />
//                     <CardContent>
//                       <Typography gutterBottom variant="h6">{product.name}</Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {product.description}
//                       </Typography>
//                       <Typography variant="h6" sx={{ mt: 1 }}>
//                         R$ {product.price.toFixed(2)}
//                       </Typography>
//                       <Typography variant="body2" sx={{ mt: 1 }}>
//                         Estoque: {product.quantity}
//                       </Typography>
//                       <Button 
//                         variant="contained" 
//                         size="small" 
//                         sx={{ mt: 2 }}
//                         onClick={() => addToCart(product)}
//                       >
//                         Adicionar
//                       </Button>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <Paper elevation={3} sx={{ p: 2 }}>
//               <Typography variant="h6" gutterBottom>
//                 <ShoppingCart /> Carrinho ({cart.reduce((sum, item) => sum + item.quantity, 0)} itens)
//               </Typography>
              
//               {cart.length === 0 ? (
//                 <Typography variant="body1">Seu carrinho está vazio</Typography>
//               ) : (
//                 <>
//                   <List>
//                     {cart.map(item => (
//                       <ListItem key={item.id} secondaryAction={
//                         <IconButton onClick={() => removeFromCart(item.id)}>
//                           <Remove />
//                         </IconButton>
//                       }>
//                         <ListItemText 
//                           primary={`${item.name} (${item.quantity}x)`} 
//                           secondary={`R$ ${(item.price * item.quantity).toFixed(2)}`} 
//                         />
//                       </ListItem>
//                     ))}
//                   </List>
//                   <Divider sx={{ my: 2 }} />
//                   <Typography variant="h6" align="right">
//                     Total: R$ {total.toFixed(2)}
//                   </Typography>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     fullWidth
//                     sx={{ mt: 2 }}
//                     onClick={() => setActiveStep(1)}
//                     disabled={cart.length === 0}
//                   >
//                     Prosseguir para Pagamento
//                   </Button>
//                 </>
//               )}
//             </Paper>
//           </Grid>
//         </Grid>
//       )}

//       {activeStep === 1 && (
//         <Grid container spacing={3} justifyContent="center">
//           <Grid item xs={12} md={6}>
//             <Paper elevation={3} sx={{ p: 3 }}>
//               <Typography variant="h5" gutterBottom>Método de Pagamento</Typography>
              
//               <TextField
//                 select
//                 fullWidth
//                 label="Forma de Pagamento"
//                 value={paymentMethod}
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//                 sx={{ mb: 3 }}
//               >
//                 <MenuItem value="credit">Cartão de Crédito</MenuItem>
//                 <MenuItem value="debit">Cartão de Débito</MenuItem>
//                 <MenuItem value="pix">PIX</MenuItem>
//                 <MenuItem value="cash">Dinheiro</MenuItem>
//               </TextField>

//               {paymentMethod === 'credit' || paymentMethod === 'debit' ? (
//                 <>
//                   <TextField fullWidth label="Número do Cartão" sx={{ mb: 2 }} />
//                   <Grid container spacing={2}>
//                     <Grid item xs={6}>
//                       <TextField fullWidth label="Validade" />
//                     </Grid>
//                     <Grid item xs={6}>
//                       <TextField fullWidth label="CVV" />
//                     </Grid>
//                   </Grid>
//                 </>
//               ) : paymentMethod === 'pix' ? (
//                 <Typography variant="body1" sx={{ mb: 2 }}>
//                   O QR Code para pagamento será exibido após a confirmação do pedido.
//                 </Typography>
//               ) : null}

//               <TextField
//                 fullWidth
//                 multiline
//                 rows={3}
//                 label="Endereço de Entrega"
//                 value={shippingAddress}
//                 onChange={(e) => setShippingAddress(e.target.value)}
//                 sx={{ mt: 3, mb: 2 }}
//               />

//               <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
//                 <Button onClick={() => setActiveStep(0)}>Voltar</Button>
//                 <Button 
//                   variant="contained" 
//                   color="primary"
//                   onClick={handlePlaceOrder}
//                   startIcon={<Payment />}
//                 >
//                   Finalizar Compra
//                 </Button>
//               </Box>
//             </Paper>
//           </Grid>
//         </Grid>
//       )}

//       {activeStep === 2 && (
//         <Grid container justifyContent="center">
//           <Grid item xs={12} md={6}>
//             <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
//               <Done color="success" sx={{ fontSize: 60, mb: 2 }} />
//               <Typography variant="h4" gutterBottom>
//                 Pedido Confirmado!
//               </Typography>
//               <Typography variant="body1" gutterBottom>
//                 Seu pedido foi registrado com o código #{orderId}
//               </Typography>
//               <Typography variant="body1" sx={{ mb: 3 }}>
//                 Enviamos os detalhes para o seu e-mail.
//               </Typography>
//               <Button 
//                 variant="contained" 
//                 onClick={() => {
//                   setActiveStep(0);
//                   setOrderId(null);
//                 }}
//               >
//                 Fazer Nova Compra
//               </Button>
//             </Paper>
//           </Grid>
//         </Grid>
//       )}
//     </Container>
//   );
// };

// export default CheckoutPage;