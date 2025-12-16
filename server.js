const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Configura Supabase con Service Role Key (solo en backend) ---
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Servir HTML
app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'reset-password.html'));
});

// Endpoint para actualizar contraseña
app.post('/reset-password', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan parámetros' });
  }

  try {
    // --- Buscar usuario usando Service Role ---
    const { data: userData, error: getUserError } = await supabase.auth.admin.getUserByEmail(email);

    if (getUserError || !userData?.user) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    const userId = userData.user.id;

    // --- Actualizar contraseña ---
    const { data, error: updateError } = await supabase.auth.admin.updateUserById(userId, { password });

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    return res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error('Error interno del servidor:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
