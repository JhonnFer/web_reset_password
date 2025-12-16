const SUPABASE_URL = 'https://cufglydvzflmzmlfphwm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1ZmdseWR2emZsbXptbGZwaHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTU5ODgsImV4cCI6MjA4MDg3MTk4OH0.F8gcELQQxO6LbqxO1gqhiZwUjLT1DotLqdAmo1YvEv8'; // misma que ya usas

const form = document.getElementById('resetForm');
const errorDiv = document.getElementById('error');
const successDiv = document.getElementById('success');

// 1️⃣ Leer el token DESDE EL HASH (#)
const hashParams = new URLSearchParams(window.location.hash.substring(1));
const accessToken = hashParams.get('access_token');
const type = hashParams.get('type');

console.log('TOKEN:', accessToken);
console.log('TYPE:', type);

// 2️⃣ Validar token
if (!accessToken || type !== 'recovery') {
  errorDiv.style.display = 'block';
  errorDiv.innerText = 'El enlace es inválido o ha expirado.';
  form.style.display = 'none';
  throw new Error('Token inválido');
}

// 3️⃣ Mostrar formulario (ESTA ES LA CLAVE)
form.style.display = 'block';
errorDiv.style.display = 'none';

// 4️⃣ Envío del formulario
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
    const res = await fetch('/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password,
        access_token: accessToken
      })
    });

    if (!res.ok) throw new Error('Error al actualizar contraseña');

    successDiv.innerText = 'Contraseña actualizada correctamente';
    successDiv.style.display = 'block';
    errorDiv.style.display = 'none';
    form.reset();

  } catch (err) {
    errorDiv.innerText = 'No se pudo actualizar la contraseña';
    errorDiv.style.display = 'block';
  }
});
