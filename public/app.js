// public\app.js (Versión Final Completa)

const SUPABASE_URL = 'https://cufglydvzflmzmlfphwm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1ZmdseWR2emZsbXptbGZwaHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTU5ODgsImV4cCI6MjA4MDg3MTk4OH0.F8gcELQQxO6LbqxO1gqhiZwUjLT1DotLqdAmo1YvEv8';

// 1. Inicialización del cliente Supabase (solo para usar en updateUser)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    }
});


document.getElementById('resetForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value; // <--- Falta en tu versión
    const errorDiv = document.getElementById('error');
    const successDiv = document.getElementById('success');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');

    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    // //////////////////////////////////////////////////
    // [validaciones de contraseña]
    // //////////////////////////////////////////////////
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
    // //////////////////////////////////////////////////
    
    // //////////////////////////////////////////////////
    // [configuración de loading]
    // //////////////////////////////////////////////////
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    // //////////////////////////////////////////////////

    try {
        // ///////////////////////////////////////////////////////////////
        // LÓGICA FINAL: SOLO ACTUALIZAR (La sesión ya fue establecida por el script inline)
        // ///////////////////////////////////////////////////////////////
        
        const { error: updateError } = await supabase.auth.updateUser({ password: password });

        if (updateError) {
            console.error('Error al actualizar contraseña:', updateError);
            // Si falla aquí, significa que el token no se capturó o expiró inmediatamente después.
            errorDiv.textContent = updateError.message || 'Error: La sesión falló. Solicita un nuevo enlace.';
            errorDiv.style.display = 'block';
        } else {
            // Éxito
            successDiv.textContent = '¡Contraseña actualizada exitosamente! Esta ventana se cerrará.';
            successDiv.style.display = 'block';
            document.getElementById('resetForm').reset();

            setTimeout(() => {
                window.close();
            }, 3000);
        }

    } catch (error) {
        // //////////////////////////////////////////////////
        // [manejo de errores de red]
        // //////////////////////////////////////////////////
        console.error('Error de red o conexión:', error);
        errorDiv.textContent = 'Error de conexión. Intenta nuevamente.';
        errorDiv.style.display = 'block';
        // //////////////////////////////////////////////////
    } finally {
        // //////////////////////////////////////////////////
        // [fin del loading]
        // //////////////////////////////////////////////////
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        // //////////////////////////////////////////////////
    }
});