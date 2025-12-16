const SUPABASE_URL = 'https://cufglydvzflmzmlfphwm.supabase.co';
const SUPABASE_ANON_KEY = 'TU_ANON_PUBLIC_KEY';

const supabase = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

let recoverySessionReady = false;

// Escucha el evento global de Supabase
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'PASSWORD_RECOVERY') {
    recoverySessionReady = true;
    console.log('Sesión de recuperación lista');
  }
});

const form = document.getElementById('resetForm');
const errorDiv = document.getElementById('error');
const successDiv = document.getElementById('success');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirmPassword').value;

  if (password !== confirm) {
    showError('Las contraseñas no coinciden');
    return;
  }

  if (!recoverySessionReady) {
    showError('El enlace de recuperación no es válido o expiró');
    return;
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    showError(error.message);
  } else {
    successDiv.innerText = 'Contraseña actualizada correctamente';
    successDiv.style.display = 'block';
    form.reset();
  }
});

function showError(msg) {
  errorDiv.innerText = msg;
  errorDiv.style.display = 'block';
}
