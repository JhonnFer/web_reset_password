const form = document.getElementById('resetForm');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Obtener valores del formulario
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('confirmPassword').value;

  // Validación
  if (!email) {
    message.textContent = 'Ingresa tu correo electrónico';
    message.style.color = 'red';
    return;
  }

  if (password !== passwordConfirm) {
    message.textContent = 'Las contraseñas no coinciden';
    message.style.color = 'red';
    return;
  }

  try {
    console.log('Enviando al backend:', { email, password });

    const res = await fetch('https://webresetpassword-production-947b.up.railway.app/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }) // <- enviamos email + password
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
    console.error('Error fetch:', err);
    message.textContent = 'Error al conectarse al servidor';
    message.style.color = 'red';
  }
});
