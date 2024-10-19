const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/User.js');

const app = express();
const PORT = '3000';

// Middleware

app.use(bodyparser.json());

mongoose.connect('mongodb://localhost:27017/crud_db',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error)=> {
    console.error('Error connecting to MongoDB', error);
});


// Routes

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/users', async (req, res) => {
    const { name, email, age } = req.body;
    try {
      const newUser = new User({ name, email, age });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ error: 'Error creating user' });
    }
  });
  

  app.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching users' });
    }
  });

  app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user' });
    }
  });

  app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body;
    try {
      const updatedUser = await User.findByIdAndUpdate(id, { name, email, age }, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: 'Error updating user' });
    }
  });

  app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting user' });
    }
  });
  
  

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


