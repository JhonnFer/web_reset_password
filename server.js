const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'reset-password.html'));
});

// Endpoint para /reset-password
app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'reset-password.html'));
});

// Endpoint POST para actualizar contraseña
app.post('/reset-password', async (req, res) => {
  const { password, access_token } = req.body;
  if (!password || !access_token) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  // Aquí usarías supabase.auth.admin.updateUser con Service Role Key
  // o el método seguro que tengas implementado
  res.json({ message: 'Contraseña actualizada correctamente' });
});

app.listen(PORT, () => {
  console.log('=== SERVER RUNNING ON PORT', PORT, '===');
});
