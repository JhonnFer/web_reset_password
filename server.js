const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir archivos estáticos (app.js, styles.css, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Redirigir la raíz a /reset-password
app.get('/', (req, res) => {
  res.redirect('/reset-password');
});

// Servir reset-password.html
app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/reset-password.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
