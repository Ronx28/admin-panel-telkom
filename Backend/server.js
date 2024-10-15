require('./sync');
const express = require('express');
const path = require('node:path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cors = require('cors');
const { updateDatabaseFromSheet } = require('./sync');
const port = process.env.PORT || 4000;
const app = express();
try {
  // Middleware untuk mengatur CORS
app.use(cors({
  origin: ['http://localhost:3000', 'https://admin-panel-telkom-frontend.vercel.app'], // domain frontend
  methods: 'GET,POST,DELETE,PUT', // Menentukan metode yang diperbolehkan
}));

// Middleware untuk parsing JSON dan URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mengatur direktori statis
app.use(express.static(path.join(__dirname, '../../Frontend')));

// Update data secara periodik
setInterval(() => {
  updateDatabaseFromSheet();
}, 3000);

// Rute untuk login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend-TelkomInterview/src/App.js'));
});

// Redirect dari root ke login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// API untuk mendapatkan data user
app.get('/api/UserTable', async (req, res) => {
  try {
    const users = await prisma.data_user.findMany();
    res.json(users);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API untuk mendapatkan data dev
app.get('/api/devisi', async (req, res) => {
  try {
    const devisiData = await prisma.data_devisi.findMany();
    res.json(devisiData);
  } catch (error) {
    console.error('Error fetching devisi data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API untuk delete devisi
app.delete('/api/devisi/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const devisi = await prisma.data_devisi.findUnique({
      where: { id: Number.parseInt(id) },
    });

    if (!devisi) {
      return res.status(404).json({ error: 'Devisi not found' });
    }

    await prisma.data_devisi.delete({
      where: { id: Number.parseInt(id) },
    });

    res.status(200).json({ message: 'Devisi deleted successfully' });
  } catch (error) {
    console.error('Error deleting devisi:', error);
    res.status(500).json({ error: 'Failed to delete devisi' });
  }
});

// API untuk menambah devisi
app.post('/api/devisi', async (req, res) => {
  const { namaDevisi } = req.body;

  if (!namaDevisi) {
    return res.status(400).json({ error: 'Nama devisi is required' });
  }

  try {
    const newDevisi = await prisma.data_devisi.create({
      data: { namaDevisi },
    });
    res.status(201).json(newDevisi);
  } catch (error) {
    console.error('Error adding devisi:', error);
    res.status(500).json({ error: 'Failed to add devisi' });
  }
});

// API untuk mendapatkan data pertanyaan
app.get('/api/pertanyaan', async (req, res) => {
  try {
    // Fetch all pertanyaan data from Prisma
    const allPertanyaan = await prisma.data_pertanyaan.findMany({
      include: {
        devisi: true, // Fetch related devisi data
        subDevisi: true, // Fetch related sub-devisi data
      },
    });

    // Return the fetched data
    res.status(200).json(allPertanyaan);
  } catch (error) {
    console.error('Error fetching pertanyaan data:', error);
    res.status(500).json({ error: 'Failed to fetch pertanyaan data' });
  }
});


// Mendapatkan API data_sub_devisi
app.get('/api/subDevisi', async (req, res) => {
  try {
    const subDevisiData = await prisma.data_sub_devisi.findMany();
    res.json(subDevisiData);
  } catch (error) {
    console.error('Error fetching devisi data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/question', async (req, res)=> {
  try{
    const question = await prisma.data_pertanyaan.findMany();
    res.json(question);
  }catch (error){
    console.error('Error find question:', error);
    req.status(500).json({error: 'Server Error'});
  }
})



// Middleware untuk menangani 404
app.use((req, res) => {
  res.status(404).send('404: Page Not Found');
});

// Menjalankan server di port 4000
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

} catch (error) {
  console.log(error)
}
