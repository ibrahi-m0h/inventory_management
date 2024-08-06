'use client'
import { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, getDocs, query, getDoc, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { Box, Stack, Typography, Modal, TextField, Button, Card, CardContent, CardActions, Grid, useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    // Only update inventory if window is defined
    if (typeof window !== 'undefined') {
      updateInventory();
    }
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    if (typeof window !== 'undefined') {
      await updateInventory();
    }
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    if (typeof window !== 'undefined') {
      await updateInventory();
    }
  };

  const updateItemQuantity = async (item, newQuantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    if (newQuantity === 0) {
      await deleteDoc(docRef);
    } else {
      await setDoc(docRef, { quantity: newQuantity });
    }
    if (typeof window !== 'undefined') {
      await updateInventory();
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={2}
      flexDirection="column"
      p={2}
      sx={{ backgroundColor: '#121212' }}
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        zIndex="-1"
        sx={{
          background: 'linear-gradient(135deg, #2e3b4e 0%, #1b2838 100%)',
        }}
      />
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={isMobile ? '90%' : 400}
          bgcolor="#333"
          border="none"
          borderRadius="10px"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <Typography variant="h6" color="#fff">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
              sx={{ input: { color: '#fff' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#555' }, '&:hover fieldset': { borderColor: '#fff' }, '&.Mui-focused fieldset': { borderColor: '#fff' } } }}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
              sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
          bgcolor: '#4caf50',
          '&:hover': { bgcolor: '#388e3c' },
        }}
      >
        Add New Item
      </Button>

      <Box
        border="none"
        width={isMobile ? '100%' : '80%'}
        p={2}
        borderRadius="10px"
        boxShadow={3}
        display="flex"
        flexDirection="column"
        height="80vh"
        bgcolor="#333"
      >
        <Box
          width="100%"
          bgcolor="#444"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="10px"
          mb={2}
          p={2}
          sx={{ borderBottom: '2px solid #555' }}
        >
          <Typography variant={isMobile ? "h4" : "h2"} color="#fff">
            Inventory Items
          </Typography>
        </Box>

        <Box width="100%" display="flex" justifyContent="center" marginBottom={2}>
          <TextField
            variant="outlined"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            sx={{ bgcolor: '#444', input: { color: '#fff' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#555' }, '&:hover fieldset': { borderColor: '#fff' }, '&.Mui-focused fieldset': { borderColor: '#fff' } }, borderRadius: '5px' }}
          />
        </Box>

        <Box flexGrow={1} overflow="auto">
          <Grid container spacing={2}>
            {filteredInventory.map(({ name, quantity }) => (
              <Grid item xs={12} sm={6} md={4} key={name}>
                <Card
                  variant="outlined"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: '10px',
                    border: '1px solid #555',
                    bgcolor: '#444'
                  }}
                >
                  <CardContent>
                    <Typography variant='h5' color='#fff'>
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Button
                        variant="contained"
                        onClick={() => { removeItem(name) }}
                        sx={{ backgroundColor: 'red', '&:hover': { backgroundColor: 'darkred' } }}
                      >
                        -
                      </Button>
                      <TextField
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value, 10);
                          if (newQuantity >= 0) {
                            updateItemQuantity(name, newQuantity);
                          }
                        }}
                        inputProps={{ min: 0 }}
                        sx={{
                          width: '60px', // Increased width
                          textAlign: 'center',
                          input: { color: '#fff' },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#555' },
                            '&:hover fieldset': { borderColor: '#fff' },
                            '&.Mui-focused fieldset': { borderColor: '#fff' }
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={() => { addItem(name) }}
                        sx={{ backgroundColor: '#7CFC00', '&:hover': { backgroundColor: 'green' } }}
                      >
                        +
                      </Button>
                    </Stack>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
