const SUPABASE_URL = 'https://cufglydvzflmzmlfphwm.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1ZmdseWR2emZsbXptbGZwaHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTU5ODgsImV4cCI6MjA4MDg3MTk4OH0.F8gcELQQxO6LbqxO1gqhiZwUjLT1DotLqdAmo1YvEv8';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('resetForm');
  const errorDiv = document.getElementById('error');
  const successDiv = document.getElementById('success');

  // 🔥 FORZAR VISIBILIDAD INICIAL
  form.style.display = 'block';
  errorDiv.style.display = 'none';
  successDiv.style.display = 'none';

  // 1️⃣ Leer token desde el HASH (#)
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);

  const accessToken = params.get('access_token');
  const type = params.get('type');

  console.log('HASH:', hash);
  console.log('TOKEN:', accessToken);
  console.log('TYPE:', type);

  // 2️⃣ Validar token
  if (!accessToken || type !== 'recovery') {
    errorDiv.innerText =
      'El enlace es inválido o ha expirado. Solicita nuevamente el cambio de contraseña.';
    errorDiv.style.display = 'block';
    form.style.display = 'none';
    return; // ❗ NO throw
  }

  // 3️⃣ Envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword =
      document.getElementById('confirmPassword').value;

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
          access_token: accessToken,
        }),
      });

      if (!res.ok) throw new Error();

      successDiv.innerText = 'Contraseña actualizada correctamente';
      successDiv.style.display = 'block';
      errorDiv.style.display = 'none';
      form.reset();
    } catch (err) {
      errorDiv.innerText = 'No se pudo actualizar la contraseña';
      errorDiv.style.display = 'block';
    }
  });
});
