const form = document.getElementById('resetForm');
const message = document.getElementById('message');

// Leer access_token desde hash (#) de la URL
const params = new URLSearchParams(window.location.hash.replace('#', '?'));
const access_token = params.get('access_token');

if (!access_token) {
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
    const res = await fetch('/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, access_token }),
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
