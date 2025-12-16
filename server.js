// server.js
const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Configura Supabase con Service Role Key (solo backend) ---
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// --- Middleware ---
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Redirigir la raíz al formulario
app.get('/', (req, res) => {
  res.redirect('/reset-password');
});

// Servir HTML de reset password
app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'reset-password.html'));
});

// Endpoint POST para actualizar contraseña
app.post('/reset-password', async (req, res) => {
  const { access_token, password } = req.body;

  if (!access_token || !password) {
    return res.status(400).json({ error: 'Faltan parámetros: access_token o password' });
  }

  try {
    // Obtener usuario asociado al recovery token
    const { data: userData, error: getUserError } = await supabase.auth.getUser(access_token);

    if (getUserError || !userData?.user) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    // Actualizar contraseña usando Service Role
    const { data, error: updateError } = await supabase.auth.admin.updateUserById(userData.user.id, {
      password,
    });

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    return res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error('Error interno del servidor:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
