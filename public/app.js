import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'https://cufglydvzflmzmlfphwm.supabase.co', // tu URL de Supabase
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1ZmdseWR2emZsbXptbGZwaHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTU5ODgsImV4cCI6MjA4MDg3MTk4OH0.F8gcELQQxO6LbqxO1gqhiZwUjLT1DotLqdAmo1YvEv8'                      // tu anon key (frontend)
);

const form = document.getElementById('resetForm');
const message = document.getElementById('message');

// Leer access_token desde hash (#) de la URL
const params = new URLSearchParams(window.location.hash.replace('#', '?'));
const access_token = params.get('access_token');

if (!access_token) {
  message.textContent = 'Enlace inválido o expirado.';
  message.style.color = 'red';
  form.querySelector('button').disabled = true;
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

  // Actualizar contraseña usando el token de recuperación
  const { error } = await supabase.auth.updateUser(access_token, { password });

  if (error) {
    message.textContent = error.message;
    message.style.color = 'red';
  } else {
    message.textContent = 'Contraseña actualizada correctamente.';
    message.style.color = 'green';
    form.reset();
  }
});
