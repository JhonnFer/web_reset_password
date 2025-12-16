// server.js
const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Supabase con Service Role Key (solo backend) ---
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Servir HTML
app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/reset-password.html'));
});

// Endpoint para actualizar contraseña
app.post('/reset-password', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan parámetros: email o password' });
  }

  try {
    // Buscar usuario por email
    const { data: user, error: fetchError } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', email)
      .single();

    if (fetchError || !user) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar contraseña usando Service Role Key
    const { data, error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password,
    });

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    return res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
