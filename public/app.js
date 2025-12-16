import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://cufglydvzflmzmlfphwm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1ZmdseWR2emZsbXptbGZwaHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTU5ODgsImV4cCI6MjA4MDg3MTk4OH0.F8gcELQQxO6LbqxO1gqhiZwUjLT1DotLqdAmo1YvEv8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('resetForm');
  const message = document.getElementById('message');

  // --- 1. Obtener token y tipo del query string ---
  const queryParams = new URLSearchParams(window.location.search);
  const access_token = queryParams.get('access_token');
  const type = queryParams.get('type');

  console.log('Query string access_token:', access_token);
  console.log('Query string type:', type);

  if (!access_token || type !== 'recovery') {
    message.textContent = 'Atención: enlace inválido o expirado.';
    message.style.color = 'red';
    return;
  }

  // --- 2. Crear cliente temporal con token de recuperación ---
  const supabaseTemp = createClient(SUPABASE_URL, access_token);

  // --- 3. Manejar envío del formulario ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('confirmPassword').value;

    console.log('Password:', password);
    console.log('Password confirm:', passwordConfirm);
    console.log('Access token al enviar:', access_token);

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
});
