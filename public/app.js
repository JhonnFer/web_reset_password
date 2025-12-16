document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('resetForm');
  const message = document.getElementById('message');

  // Leer hash parameters
  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const access_token = hashParams.get('access_token');
  const type = hashParams.get('type');

  // Mostrar advertencia si token inválido, pero no ocultamos el formulario
  if (!access_token || type !== 'recovery') {
    message.textContent = 'Atención: enlace inválido o expirado. Intenta solicitar otro restablecimiento.';
    message.style.color = 'red';
  }

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

    // Opcional: mostrar loader
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
        message.textContent = data.message;
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
