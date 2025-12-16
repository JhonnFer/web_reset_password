const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Configura Supabase con Service Role Key (backend solo) ---
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Servir HTML
app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/reset-password.html'));
});

// Endpoint para actualizar contraseña
app.post('/reset-password', async (req, res) => {
  console.log('POST /reset-password body:', req.body);
  const { access_token, password } = req.body;

  if (!access_token || !password) {
    return res.status(400).json({ error: 'Faltan parámetros' });
  }

  try {
    // Obtener usuario con token de recuperación
    const { data: userData, error: getUserError } = await supabase.auth.getUser(access_token);

    if (getUserError || !userData?.user) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    // Actualizar contraseña usando Service Role
    const { data, error } = await supabase.auth.admin.updateUserById(userData.user.id, {
      password
    });

    if (error) {
      return res.status(400).json({ error: error.message });
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
