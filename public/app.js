// app.js
const form = document.getElementById('resetForm');
const message = document.getElementById('message');

// Leer email desde query string
const queryParams = new URLSearchParams(window.location.search);
const email = queryParams.get('email');

if (!email) {
  message.textContent = 'Enlace inválido o correo no proporcionado.';
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
      body: JSON.stringify({ email, password }),
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
