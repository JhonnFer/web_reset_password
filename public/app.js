const SUPABASE_URL = 'https://cufglydvzflmzmlfphwm.supabase.co';
// Usamos el URL del cliente ya que no es necesario el service role en el frontend

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('resetForm');
  const errorDiv = document.getElementById('error');
  const successDiv = document.getElementById('success');

  if (!form) {
    console.error('FORM NO ENCONTRADO');
    return;
  }

  // Mostrar formulario siempre
  form.style.display = 'block';
  errorDiv.style.display = 'none';
  successDiv.style.display = 'none';

  // 1️⃣ Obtener el token y tipo desde el hash de la URL
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);

  const accessToken = params.get('access_token');
  const type = params.get('type');

  console.log('TOKEN:', accessToken);
  console.log('TYPE:', type);

  // 2️⃣ Verificar si el token es válido
  if (!accessToken || type !== 'recovery') {
    errorDiv.innerText =
      'El enlace es inválido o ha expirado. Solicita nuevamente el cambio de contraseña.';
    errorDiv.style.display = 'block';
    return;
  }

  // 3️⃣ Evento al enviar el formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // 🔥 ESTO YA NO SE PIERDE

    const password = document.getElementById('password').value;
    const confirmPassword =
      document.getElementById('confirmPassword').value;

    // 4️⃣ Verificar si las contraseñas coinciden
    if (password !== confirmPassword) {
      errorDiv.innerText = 'Las contraseñas no coinciden';
      errorDiv.style.display = 'block';
      return;
    }

    // 5️⃣ Enviar solicitud al servidor para cambiar la contraseña
    try {
      const res = await fetch('/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          access_token: accessToken, // Usamos el token recuperado de la URL
        }),
      });

      if (!res.ok) throw new Error('Error al cambiar la contraseña.');

      successDiv.innerText = 'Contraseña actualizada correctamente';
      successDiv.style.display = 'block';
      errorDiv.style.display = 'none';
      form.reset();
    } catch (error) {
      errorDiv.innerText = 'Error al actualizar la contraseña';
      errorDiv.style.display = 'block';
    }
  });
});
