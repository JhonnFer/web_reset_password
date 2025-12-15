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

// Variables globales para elementos de la interfaz
const resetForm = document.getElementById('resetForm');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const errorDiv = document.getElementById('error');
const successDiv = document.getElementById('success');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');

// Función para mostrar el estado del botón
function setProcessing(isProcessing) {
    submitBtn.disabled = isProcessing;
    btnText.style.display = isProcessing ? 'none' : 'inline';
    btnLoader.style.display = isProcessing ? 'inline-block' : 'none';
}

// Función principal de actualización de contraseña
async function updatePassword(newPassword) {
    setProcessing(true);
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    try {
        // Usamos el flujo robusto para asegurar que la sesión esté activa (Plan B)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session || !session.access_token) {
            // Este es el caso que te está fallando: el token ya no sirve.
            errorDiv.textContent = 'Error: Token de restablecimiento inválido o expirado. Solicita un nuevo correo.';
            errorDiv.style.display = 'block';
            return;
        }

        // Si la sesión está activa, actualizamos la contraseña
        const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

        if (updateError) {
            console.error('Error al actualizar contraseña:', updateError);
            errorDiv.textContent = updateError.message || 'Error al actualizar contraseña. Intenta de nuevo.';
            errorDiv.style.display = 'block';
        } else {
            // Éxito
            successDiv.textContent = '¡Contraseña actualizada exitosamente! Esta ventana se cerrará.';
            successDiv.style.display = 'block';
            resetForm.reset();

            setTimeout(() => {
                window.close();
            }, 3000);
        }

    } catch (error) {
        console.error('Error de red o conexión:', error);
        errorDiv.textContent = 'Error de conexión. Intenta nuevamente.';
        errorDiv.style.display = 'block';
    } finally {
        setProcessing(false);
    }
}

// 2. Lógica de Manejo del Formulario
resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

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
    
    // Si la validación local es exitosa, llamamos a la función de actualización
    await updatePassword(password);
});

// 3. Lógica de Detección de Eventos (CRÍTICA para la solución)
// Escuchamos los eventos de Auth de Supabase en tiempo real.
// Cuando la página carga el hash del token de restablecimiento, Supabase dispara el evento 'PASSWORD_RECOVERY'.
supabase.auth.onAuthStateChange(async (event, session) => {
    // Si el usuario llega desde el enlace de recuperación y la sesión ya está establecida por Supabase,
    // el formulario de restablecimiento se muestra y podemos asumir que el token es válido
    // para el momento en que se presione el botón.
    
    // Mostramos un mensaje claro para el usuario.
    if (event === 'PASSWORD_RECOVERY') {
        successDiv.textContent = '¡Token validado! Ingresa tu nueva contraseña para finalizar.';
        successDiv.style.display = 'block';
    }
    
    // NOTA: Con la lógica de getSession() al presionar el botón (Paso 2), 
    // y esta lógica de onAuthStateChange al cargar (Paso 3), el token debe ser capturado
    // antes de que Supabase lo expire.
});