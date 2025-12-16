console.log('Reset password app loaded');

// 1️⃣ Leer token desde el HASH (#)
const hash = window.location.hash.substring(1);
const params = new URLSearchParams(hash);

const access_token = params.get('access_token');
const type = params.get('type');

// Referencias UI
const form = document.getElementById('resetForm');
const errorDiv = document.getElementById('error');
const successDiv = document.getElementById('success');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');

// 2️⃣ Validar token
if (!access_token || type !== 'recovery') {
  errorDiv.style.display = 'block';
  errorDiv.textContent =
    'El enlace es inválido o ha expirado. Solicita nuevamente el cambio de contraseña.';
  form.style.display = 'none';
}

// 3️⃣ Submit del formulario
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  errorDiv.style.display = 'none';
  successDiv.style.display = 'none';

  if (password.length < 6) {
    showError('La contraseña debe tener al menos 6 caracteres');
    return;
  }

  if (password !== confirmPassword) {
    showError('Las contraseñas no coinciden');
    return;
  }

  setLoading(true);

  try {
    const res = await fetch('/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password,
        access_token
      })
    });

    const data = await res.json();

    if (!res.ok) {
      showError(data.error || 'Error al actualizar la contraseña');
      setLoading(false);
      return;
    }

    successDiv.style.display = 'block';
    successDiv.textContent =
      'Contraseña actualizada correctamente. Ya puedes iniciar sesión.';

    form.reset();
    window.location.hash = '';
  } catch (err) {
    console.error(err);
    showError('Error de conexión con el servidor');
  } finally {
    setLoading(false);
  }
});

// Helpers
function showError(message) {
  errorDiv.style.display = 'block';
  errorDiv.textContent = message;
}

function setLoading(loading) {
  submitBtn.disabled = loading;
  btnText.style.display = loading ? 'none' : 'inline';
  btnLoader.style.display = loading ? 'inline-block' : 'none';
}
