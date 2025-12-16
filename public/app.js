import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://cufglydvzflmzmlfphwm.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1ZmdseWR2emZsbXptbGZwaHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTU5ODgsImV4cCI6MjA4MDg3MTk4OH0.F8gcELQQxO6LbqxO1gqhiZwUjLT1DotLqdAmo1YvEv8'; // anon key


const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('resetForm');
  const errorDiv = document.getElementById('error');
  const successDiv = document.getElementById('success');

  errorDiv.style.display = 'none';
  successDiv.style.display = 'none';
  form.style.display = 'none';

  // 🔹 Leer hash de URL
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  const type = params.get('type');

  console.log('TOKEN:', accessToken);
  console.log('TYPE:', type);

  if (!accessToken || type !== 'recovery') {
    errorDiv.innerText =
      'El enlace es inválido o ha expirado. Solicita nuevamente el cambio de contraseña.';
    errorDiv.style.display = 'block';
    return;
  }

  // ✅ Mostrar formulario
  form.style.display = 'block';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      errorDiv.innerText = 'Las contraseñas no coinciden';
      errorDiv.style.display = 'block';
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      }, { accessToken: accessToken });

      if (error) {
        errorDiv.innerText = error.message;
        errorDiv.style.display = 'block';
        return;
      }

      successDiv.innerText = 'Contraseña actualizada correctamente';
      successDiv.style.display = 'block';
      errorDiv.style.display = 'none';
      form.reset();
    } catch (err) {
      console.error(err);
      errorDiv.innerText = 'Error al actualizar la contraseña';
      errorDiv.style.display = 'block';
    }
  });
});