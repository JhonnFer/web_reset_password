console.log('=== STARTING APP ===');

try {
  const express = require('express');
  const path = require('path');
  const { createClient } = require('@supabase/supabase-js');

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'reset-password.html'));
  });

  app.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'reset-password.html'));
  });

  // 🔐 ENDPOINT REAL PARA CAMBIAR CONTRASEÑA
  app.post('/reset-password', async (req, res) => {
    console.log('BODY RECIBIDO:', req.body);
    const { password, access_token } = req.body;
    

    if (!password || !access_token) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    const { error } = await supabase.auth.updateUser(
      { password },
      { accessToken: access_token }
    );

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Contraseña actualizada correctamente' });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log('=== SERVER RUNNING ON PORT', PORT, '===');
  });
} catch (error) {
  console.log('=== ERROR ===');
  console.log(error);
}
