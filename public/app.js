// public\app.js

const SUPABASE_URL = 'https://cufglydvzflmzmlfphwm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1ZmdseWR2emZsbXptbGZwaHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTU5ODgsImV4cCI6MjA4MDg3MTk4OH0.F8gcELQQxO6LbqxO1gqhiZwUjLT1DotLqdAmo1YvEv8';

// 1. Inicialización del cliente Supabase (¡Debe ir fuera del listener!)
// Esto requiere que la etiqueta <script src="...supabase-js@2"></script> esté en tu HTML antes de app.js
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

    // Obtener access token de la URL
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');

    // MANTENEMOS el diagnóstico de token, pero eliminamos el diagnóstico de fetch fallido.
    console.log('--- Diagnóstico de Token ---');
    console.log('Access Token Obtenido:', accessToken ? 'Sí' : 'No');
    console.log('Token (solo inicio):', accessToken ? accessToken.substring(0, 10) + '...' : 'N/A');
    console.log('---------------------------');

    if (!accessToken) {
        errorDiv.textContent = 'Token inválido o expirado';
        errorDiv.style.display = 'block';
        return;
    }

    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';

    try {
        // ///////////////////////////////////////////////////////////////
        // LÓGICA DE SUPABASE (Dos pasos para eliminar el 403)
        // ///////////////////////////////////////////////////////////////
        
        // PASO 1: Intercambiar el Recovery Token por un Session Token válido.
        // Esto le dice al API Gateway: "Este token es legítimo, crea una sesión."
        const { error: sessionError } = await supabase.auth.setSession({ access_token: accessToken });

        if (sessionError) {
            console.error('Error al establecer la sesión (Paso 1):', sessionError);
            errorDiv.textContent = sessionError.message || 'Error al validar el token de recuperación.';
            errorDiv.style.display = 'block';
            return;
        }

        // PASO 2: Actualizar la contraseña (Ahora con una sesión válida establecida por el cliente)
        // Esto usa el Token de Sesión, satisfaciendo el endpoint /auth/v1/user
        const { error: updateError } = await supabase.auth.updateUser({ password: password });

        if (updateError) {
            console.error('Error al actualizar contraseña (Paso 2):', updateError);
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
        console.error('Error de red o conexión:', error);
        errorDiv.textContent = 'Error de conexión. Intenta nuevamente.';
        errorDiv.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
});