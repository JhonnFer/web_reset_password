console.log('=== STARTING APP ===');

try {
  const express = require('express');
  const path = require('path');
  const { createClient } = require('@supabase/supabase-js');

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));

  // Crear cliente de Supabase con URL y clave de cliente
  const supabase = createClient(
    process.env.SUPABASE_URL,    // Usa tu URL de Supabase
    process.env.SUPABASE_KEY     // Usa la clave pública de cliente
  );

  // Endpoint para servir la página de restablecimiento de contraseña
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'reset-password.html'));
  });

  app.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'reset-password.html'));
  });

  // 🔐 Endpoint para cambiar la contraseña
  app.post('/reset-password', async (req, res) => {
    console.log('BODY RECIBIDO:', req.body);
    const { password, access_token } = req.body;

    if (!password || !access_token) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    try {
      // Actualizar la contraseña del usuario con el access_token
      const { user, error } = await supabase.auth.api.updateUser(access_token, {
        password: password,
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (err) {
      return res.status(400).json({ error: 'Error al actualizar la contraseña' });
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log('=== SERVER RUNNING ON PORT', PORT, '===');
  });
} catch (error) {
  console.log('=== ERROR ===');
  console.log(error);
}
