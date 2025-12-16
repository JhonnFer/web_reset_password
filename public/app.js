import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://cufglydvzflmzmlfphwm.supabase.co';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('resetForm');
  const message = document.getElementById('message');

  // --- 1. Obtener access_token del hash ---
  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const access_token = hashParams.get('access_token');
  const type = hashParams.get('type');

  if (!access_token || type !== 'recovery') {
    message.textContent =
      'Atención: enlace inválido o expirado. Intenta solicitar otro restablecimiento.';
    message.style.color = 'red';
    return;
  }

  // --- 2. Crear cliente Supabase temporal con el recovery token ---
  const supabaseTemp = createClient(SUPABASE_URL, null, {
    global: {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  });

  // --- 3. Manejar envío del formulario ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('confirmPassword').value;

    if (password !== passwordConfirm) {
      message.textContent = 'Las contraseñas no coinciden.';
      message.style.color = 'red';
      return;
    }

    // Loader
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';

    try {
      const { data, error } = await supabaseTemp.auth.updateUser({
        password,
      });

      if (error) {
        message.textContent = error.message;
        message.style.color = 'red';
      } else {
        message.textContent = 'Contraseña actualizada correctamente.';
        message.style.color = 'green';
        form.reset();
      }
    } catch (err) {
      console.error(err);
      message.textContent = 'Error al conectarse a Supabase.';
      message.style.color = 'red';
    } finally {
      btnText.style.display = 'inline';
      btnLoader.style.display = 'none';
    }
  });
});
