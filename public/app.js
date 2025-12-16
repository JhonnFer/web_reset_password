const form = document.getElementById('resetForm');
const message = document.getElementById('message');

// Leer token de la URL
const queryParams = new URLSearchParams(window.location.search);
const access_token = queryParams.get('access_token');
const type = queryParams.get('type');

if (!access_token || type !== 'recovery') {
  message.textContent = 'Enlace inválido o expirado.';
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

  try {
    const res = await fetch('https://webresetpassword-production-947b.up.railway.app/reset-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }, // <- correcto
  body: JSON.stringify({ access_token, password }) // <- correcto
});
    const data = await res.json();

    if (res.ok) {
      message.textContent = data.message;
      message.style.color = 'green';
      form.reset();
    } else {
      message.textContent = data.error;
      message.style.color = 'red';
    }
  } catch (err) {
    console.error(err);
    message.textContent = 'Error al conectarse al servidor.';
    message.style.color = 'red';
  }
});
