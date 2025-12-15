// public\app.js

const SUPABASE_URL = 'https://cufglydvzflmzmlfphwm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1ZmdseWR2emZsbXptbGZwaHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTU5ODgsImV4cCI6MjA4MDg3MTk4OH0.F8gcELQQxO6LbqxO1gqhiZwUjLT1DotLqdAmo1YvEv8';

// 1. Inicialización del cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
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

    // Validación local
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

    // Omitimos la obtención manual del accessToken porque getSession lo hace automáticamente.
    
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';

    try {
        // ///////////////////////////////////////////////////////////////
        // PLAN B: Usar getSession() (El flujo robusto)
        // ///////////////////////////////////////////////////////////////

        // PASO 1: Leer el hash de la URL, validar el token de recuperación y establecer la sesión.
        // Esto resuelve el error 'AuthSessionMissingError'.
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
            console.error('Error al obtener la sesión del URL:', sessionError);
            errorDiv.textContent = sessionError.message || 'Error al validar el token de recuperación. Por favor, solicita un nuevo enlace.';
            errorDiv.style.display = 'block';
            return;
        }

        // 2. Si la sesión fue establecida correctamente (session existe), procedemos a actualizar
        if (session && session.access_token) {
            
            const { error: updateError } = await supabase.auth.updateUser({ password: password });

            if (updateError) {
                console.error('Error al actualizar contraseña:', updateError);
                errorDiv.textContent = updateError.message || 'Error al actualizar contraseña. Intenta de nuevo.';
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
        } else {
            // Esto ocurre si el token es inválido/expirado y getSession() no pudo crear la sesión
            errorDiv.textContent = 'Token de restablecimiento inválido o expirado. Solicita un nuevo correo.';
            errorDiv.style.display = 'block';
        }

    } catch (error) {
        console.error('Error de red o conexión:', error);
        errorDiv.textContent = 'Error de conexión. Intenta nuevamente.';
        errorDiv.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
});