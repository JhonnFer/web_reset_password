import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Redirigir raíz al reset-password
app.get('/', (req, res) => {
  res.redirect('/reset-password');
});

// Servir HTML de reset-password
app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/reset-password.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
