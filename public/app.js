document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('resetForm');
  const message = document.getElementById('message');

  // --- 1. Obtener access_token ---
  let access_token = null;
  let type = null;

  // Primero intentar hash
  if (window.location.hash) {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    access_token = hashParams.get('access_token');
    type = hashParams.get('type');
  }

  // Fallback: query string (opcional)
  if ((!access_token || !type) && window.location.search) {
    const queryParams = new URLSearchParams(window.location.search);
    access_token = queryParams.get('access_token');
    type = queryParams.get('type');
  }

  // --- 2. Validar token ---
  if (!access_token || type !== 'recovery') {
    message.textContent =
      'Atención: enlace inválido o expirado. Intenta solicitar otro restablecimiento.';
    message.style.color = 'red';
  }

  // --- 3. Manejar envío del formulario ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!access_token || type !== 'recovery') {
      message.textContent = 'No se puede restablecer la contraseña: token inválido.';
      message.style.color = 'red';
      return;
    }

    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('confirmPassword').value;

    if (password !== passwordConfirm) {
      message.textContent = 'Las contraseñas no coinciden.';
      message.style.color = 'red';
      return;
    }

    // Loader opcional
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';

    try {
      const res = await fetch('/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token, password })
      });

      const data = await res.json();

      if (res.ok) {
        message.textContent = data.message || 'Contraseña actualizada correctamente.';
        message.style.color = 'green';
        form.reset();
      } else {
        message.textContent = data.error || 'Error al actualizar la contraseña.';
        message.style.color = 'red';
      }
    } catch (err) {
      console.error(err);
      message.textContent = 'Error al conectarse al servidor.';
      message.style.color = 'red';
    } finally {
      btnText.style.display = 'inline';
      btnLoader.style.display = 'none';
    }
  });
});
