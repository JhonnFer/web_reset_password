import { createClient } from '@supabase/supabase-js'
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// --- Supabase con Service Role Key (solo backend) ---
const supabase = createClient(
  "https://cufglydvzflmzmlfphwm.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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

// Endpoint para actualizar contraseña usando access_token
app.post('/reset-password', async (req, res) => {
  const { password, access_token } = req.body;

  if (!password || !access_token) {
    return res.status(400).json({ error: 'Faltan parámetros' });
  }

  try {
    const { error } = await supabase.auth.updateUser(access_token, { password });

    if (error) return res.status(400).json({ error: error.message });

    return res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
