import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://cufglydvzflmzmlfphwm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1ZmdseWR2emZsbXptbGZwaHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTU5ODgsImV4cCI6MjA4MDg3MTk4OH0.F8gcELQQxO6LbqxO1gqhiZwUjLT1DotLqdAmo1YvEv8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('resetForm');
  const message = document.getElementById('message');

  let access_token = null;
let type = null;

// Leer query string
const queryParams = new URLSearchParams(window.location.search);
access_token = queryParams.get('access_token');
type = queryParams.get('type');

console.log('Query string access_token:', access_token);
console.log('Query string type:', type);

// Guardar en localStorage para mantenerlo
if (access_token) localStorage.setItem('access_token', access_token);
if (type) localStorage.setItem('type', type);

// Luego, al hacer submit:
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Recuperar token del localStorage
  const token = localStorage.getItem('access_token');
  const tokenType = localStorage.getItem('type');

  if (!token || tokenType !== 'recovery') {
    message.textContent = 'Token inválido o expirado.';
    message.style.color = 'red';
    return;
  }

  const supabaseTemp = createClient(SUPABASE_URL, token, {
    global: {
      headers: { Authorization: `Bearer ${token}` },
    },
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('confirmPassword').value;

    console.log('Password:', password);
    console.log('Password confirm:', passwordConfirm);

    if (password !== passwordConfirm) {
      message.textContent = 'Las contraseñas no coinciden.';
      message.style.color = 'red';
      return;
    }

    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';

    try {
      console.log('Intentando actualizar contraseña con token de recuperación...');
      const { data, error } = await supabaseTemp.auth.updateUser({ password });
      console.log('Respuesta updateUser:', { data, error });

      if (error) {
        message.textContent = error.message;
        message.style.color = 'red';
      } else {
        message.textContent = 'Contraseña actualizada correctamente.';
        message.style.color = 'green';
        form.reset();
      }
    } catch (err) {
      console.error('Error en try/catch:', err);
      message.textContent = 'Error al conectarse a Supabase.';
      message.style.color = 'red';
    } finally {
      btnText.style.display = 'inline';
      btnLoader.style.display = 'none';
    }
  });
})
});
