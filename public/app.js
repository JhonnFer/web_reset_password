document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('resetForm');
  const message = document.getElementById('message');

  // Leer hash parameters
  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const access_token = hashParams.get('access_token');
  const type = hashParams.get('type');

  if (!access_token || type !== 'recovery') {
    message.textContent = 'Enlace inválido o expirado.';
    return;
  }

  form.style.display = 'block';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    if (password !== passwordConfirm) {
      message.textContent = 'Las contraseñas no coinciden';
      return;
    }

    try {
      const res = await fetch('/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token, password })
      });

      const data = await res.json();
      if (res.ok) {
        message.textContent = data.message;
        form.style.display = 'none';
      } else {
        message.textContent = data.error || 'Error al actualizar la contraseña';
      }
    } catch (err) {
      console.error(err);
      message.textContent = 'Error al conectarse al servidor';
    }
  });
});
