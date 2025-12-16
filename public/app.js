import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'https://cufglydvzflmzmlfphwm.supabase.co', // tu URL de Supabase
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1ZmdseWR2emZsbXptbGZwaHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTU5ODgsImV4cCI6MjA4MDg3MTk4OH0.F8gcELQQxO6LbqxO1gqhiZwUjLT1DotLqdAmo1YvEv8' // tu anon key
);

const form = document.getElementById('resetForm');
const message = document.getElementById('message');

// Leer token y tipo desde query params
const queryParams = new URLSearchParams(window.location.search);
const accessToken = queryParams.get('access_token');
const type = queryParams.get('type'); // puede ser 'magiclink' o 'recovery'

if (!accessToken) {
  message.textContent = 'Enlace inválido o token ausente.';
  message.style.color = 'red';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('confirmPassword').value;

  if (password !== passwordConfirm) {
    message.textContent = 'Las contraseñas no coinciden.';
    message.style.color = 'red';
    return;
  }

  let result;
  if (type === 'magiclink') {
    // Magic Link: el usuario ya está autenticado, solo actualizar contraseña
    result = await supabase.auth.updateUser({ password });
  } else if (type === 'recovery' || type === 'pck') {
    // Recovery token: usar signInWithOtp / resetPasswordForEmail
    // Supabase JS recomienda usar updateUser con session creada desde el token
    result = await supabase.auth.updateUser({ password }, accessToken);
  } else {
    message.textContent = 'Tipo de enlace no soportado.';
    message.style.color = 'red';
    return;
  }

  if (result.error) {
    message.textContent = result.error.message;
    message.style.color = 'red';
  } else {
    message.textContent = 'Contraseña actualizada correctamente.';
    message.style.color = 'green';
    form.reset();
  }
});
