import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://cufglydvzflmzmlfphwm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1ZmdseWR2emZsbXptbGZwaHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTU5ODgsImV4cCI6MjA4MDg3MTk4OH0.F8gcELQQxO6LbqxO1gqhiZwUjLT1DotLqdAmo1YvEv8'; // <- Pon aquí tu anon key

// Cliente general (por si necesitas otras operaciones, opcional)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('resetForm');
  const message = document.getElementById('message');

  // --- 1. Obtener access_token y type ---
  let access_token = null;
  let type = null;

  // Intentar hash primero
  if (window.location.hash) {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    access_token = hashParams.get('access_token');
    type = hashParams.get('type');
  }

  // Fallback: query string
  if ((!access_token || !type) && window.location.search) {
    const queryParams = new URLSearchParams(window.location.search);
    access_token = queryParams.get('access_token');
    type = queryParams.get('type');
  }

  // Validar token
  if (!access_token || type !== 'recovery') {
    message.textContent =
      'Atención: enlace inválido o expirado. Abre el enlace desde el correo de recuperación.';
    message.style.color = 'red';
    return;
  }

  // --- 2. Crear cliente Supabase temporal con el recovery token ---
  const supabaseTemp = createClient(SUPABASE_URL, null, {
    global: {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  });

  // --- 3. Manejar envío del formulario ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('confirmPassword').value;

    if (password !== passwordConfirm) {
      message.textContent = 'Las contraseñas no coinciden.';
      message.style.color = 'red';
      return;
    }

    // Loader
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';

    try {
      // --- Actualizar contraseña usando recovery token ---
      const { data, error } = await supabaseTemp.auth.updateUser({ password });

      if (error) {
        message.textContent = error.message;
        message.style.color = 'red';
      } else {
        message.textContent = 'Contraseña actualizada correctamente.';
        message.style.color = 'green';
        form.reset();
      }
    } catch (err) {
      console.error(err);
      message.textContent = 'Error al conectarse a Supabase.';
      message.style.color = 'red';
    } finally {
      btnText.style.display = 'inline';
      btnLoader.style.display = 'none';
    }
  });
});
