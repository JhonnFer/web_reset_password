//public\app.js
const SUPABASE_URL = 'https://cufglydvzflmzmlfphwm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1ZmdseWR2emZsbXptbGZwaHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTU5ODgsImV4cCI6MjA4MDg3MTk4OH0.F8gcELQQxO6LbqxO1gqhiZwUjLT1DotLqdAmo1YvEv8';
// 1. Inicializa el cliente de Supabase (¡Debe ir antes del listener!)
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    }
});
document.getElementById('resetForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const errorDiv = document.getElementById('error');
  const successDiv = document.getElementById('success');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const btnLoader = document.getElementById('btnLoader');

  errorDiv.style.display = 'none';
  successDiv.style.display = 'none';

  if (password !== confirmPassword) {
    errorDiv.textContent = 'Las contraseñas no coinciden';
    errorDiv.style.display = 'block';
    return;
  }

  if (password.length < 6) {
    errorDiv.textContent = 'La contraseña debe tener al menos 6 caracteres';
    errorDiv.style.display = 'block';
    return;
  }

  // Obtener access token de la URL
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');

  if (!accessToken) {
    errorDiv.textContent = 'Token inválido o expirado';
    errorDiv.style.display = 'block';
    return;
  }

  submitBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoader.style.display = 'inline-block';

  try {
        // ///////////////////////////////////////////////////////////
        // 4. Lógica de Supabase: REEMPLAZA tu función fetch
        // ///////////////////////////////////////////////////////////

        // A. Primero, le decimos al cliente de Supabase que use el token de recuperación
        const { error: sessionError } = await supabase.auth.setSession({ access_token: accessToken });

        if (sessionError) {
            errorDiv.textContent = sessionError.message || 'Error al validar el token de recuperación.';
            errorDiv.style.display = 'block';
            return;
        }

        // B. Luego, actualizamos la contraseña.
        // La biblioteca envía el token y los encabezados correctamente.
        const { error: updateError } = await supabase.auth.updateUser({ password: password });

        if (updateError) {
            // Manejo de error de la API (ej: contraseña demasiado débil, token usado)
            errorDiv.textContent = updateError.message || 'Error al actualizar contraseña.';
            errorDiv.style.display = 'block';
        } else {
            // Éxito
            successDiv.textContent = '¡Contraseña actualizada exitosamente!';
            successDiv.style.display = 'block';
            document.getElementById('resetForm').reset();

            setTimeout(() => {
                window.close();
            }, 3000);
        }

    } catch (error) {
        errorDiv.textContent = 'Error de conexión. Intenta nuevamente.';
        errorDiv.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
});