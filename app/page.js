"use client";

import { Box, Typography, Button, TextField, Modal, IconButton, List, ListItem, Stack } from '@mui/material';
import { collection, getDocs, query, setDoc, updateDoc, deleteDoc, increment, where, doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import CloseIcon from '@mui/icons-material/Close';
import '@fontsource/lora'; // Importing Lora font

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  padding: 3,
  backgroundColor: '#FDF7F3', // Pastel orange
  borderRadius: 2,
  boxShadow: 3,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
};

const sectionStyle = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  fontFamily: '"Lora", serif', // Applying Lora font
};

const pastelGreenStyle = {
  ...sectionStyle,
  backgroundColor: '#FFFFD8', // Pastel green
};

const pastelOrangeStyle = {
  ...sectionStyle,
  backgroundImage: 'url(./3-background.png)',
};

export default function Home() {
  const [pantryList, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updatePantry = async () => {
    try {
      const q = query(collection(firestore, 'pantry'));
      const snapshot = await getDocs(q);
      const pantryItems = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.quantity > 0) { // Exclude items with quantity 0
          pantryItems.push({ name: data.name, quantity: data.quantity });
        }
      });
      setPantry(pantryItems);
    } catch (error) {
      console.error('Error fetching data from Firestore:', error);
    }
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const handleAddItem = async () => {
    if (itemName.trim()) {
      try {
        const docRef = doc(firestore, 'pantry', itemName);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          await updateDoc(docRef, { quantity: increment(itemQuantity) });
        } else {
          await setDoc(docRef, { name: itemName, quantity: itemQuantity });
        }

        setItemName('');
        setItemQuantity(1);
        handleClose();
        updatePantry();
      } catch (error) {
        console.error('Error adding item to Firestore:', error);
      }
    } else {
      alert('Item name cannot be empty!');
    }
  };

  const handleAdjustQuantity = async (itemName, adjustment) => {
    try {
      const docRef = doc(firestore, 'pantry', itemName);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentQuantity = docSnap.data().quantity || 0;

        if (currentQuantity + adjustment > 0) {
          await updateDoc(docRef, { quantity: increment(adjustment) });
        } else {
          await deleteDoc(docRef);
        }

        updatePantry();
      } else {
        console.log(`Item not found: ${itemName}`);
      }
    } catch (error) {
      console.error('Error adjusting item quantity in Firestore:', error);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        const q = query(collection(firestore, 'pantry'), where('name', '==', searchQuery));
        const snapshot = await getDocs(q);
        const searchResults = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.quantity > 0) { // Exclude items with quantity 0
            searchResults.push({ name: data.name, quantity: data.quantity });
          }
        });
        setPantry(searchResults);
      } catch (error) {
        console.error('Error searching items in Firestore:', error);
      }
    } else {
      updatePantry();
    }
  };

  const handleRemoveItem = async (itemName) => {
    try {
      const docRef = doc(firestore, 'pantry', itemName);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentQuantity = docSnap.data().quantity || 0;

        if (currentQuantity > 1) {
          await updateDoc(docRef, { quantity: increment(-1) });
        } else {
          await deleteDoc(docRef);
        }

        updatePantry();
      } else {
        console.log(`Item not found: ${itemName}`);
      }
    } catch (error) {
      console.error('Error removing item from Firestore:', error);
    }
  };

  return (
    <Box sx={pastelGreenStyle}>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          marginTop: 5,
          marginBottom: 2,
          backgroundColor: '#A4D1A1', // Pastel green
          '&:hover': {
            backgroundColor: '#8ABF8A',
          },
          '&:focus': {
            outline: 'none',
          },
        }}
      >
        ADD ITEM
      </Button>
      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <TextField
            id="item-name"
            label="Item Name"
            variant="outlined"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            fullWidth
          />
          <TextField
            id="item-quantity"
            label="Quantity"
            type="number"
            variant="outlined"
            value={itemQuantity}
            onChange={(e) => setItemQuantity(parseInt(e.target.value))}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleAddItem}
            sx={{
              marginTop: 5,
              marginBottom: 2,
              backgroundColor: '#A4D1A1', // Pastel green
              '&:hover': {
                backgroundColor: '#8ABF8A',
              },
              '&:focus': {
                outline: 'none',
              },
            }}
          >
            ADD
          </Button>
        </Box>
      </Modal>

      <Box width="500px" bgcolor="#FDF7F3" sx={{ padding: 2, borderRadius: 2, boxShadow: 2, border: '2px solid #A4D1A1', marginBottom: 2 }}>
        <Typography variant="h2" color="#333" textAlign="center">
          Pantry Items
        </Typography>
        <Stack direction="row" spacing={1} marginTop={2}>
          <TextField
            id="search-item"
            label="Search Item"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              backgroundColor: '#F4A7A0', // Pastel orange
              '&:hover': {
                backgroundColor: '#F28D7C',
              },
              '&:focus': {
                outline: 'none',
              },
            }}
          >
            SEARCH
          </Button>
        </Stack>
      </Box>

      <Box
        width="550px"
        height="300px"
        overflow="auto"
        sx={{
          marginTop: 2,
          borderRadius: 2,
          backgroundColor: '#FDF7F3',
          padding: 2,
          boxShadow: 2,
          border: '2px solid #A4D1A1', // Pastel green border
        }}
      >
        <List>
          {pantryList.map((item) => (
            <ListItem
              key={item.name}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 1,
                borderBottom: '1px solid #ccc',
              }}
            >
              <Typography variant="body1">{item.name} ({item.quantity})</Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() => handleAdjustQuantity(item.name, 1)}
                >
                  +
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveItem(item.name)}
                >
                  -
                </Button>
              </Stack>
            </ListItem>
          ))}
        </List>
      </Box>
      
    </Box>

  );
}
