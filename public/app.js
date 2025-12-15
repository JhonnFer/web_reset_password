// public\app.js (VERSION FINAL DE EVENTOS)

// !!! ELIMINAR LAS DECLARACIONES DE SUPABASE_URL Y SUPABASE_KEY AQUI !!!
// Se asume que ya fueron declaradas en el script inline del HTML

// Inicialización del cliente Supabase (usamos las variables ya declaradas)
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
        // En esta versión, la sesión debe estar activa si el evento se disparó.
        const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

        if (updateError) {
            console.error('Error al actualizar contraseña:', updateError);
            errorDiv.textContent = updateError.message || 'Error al actualizar contraseña. Por favor, solicita un nuevo enlace.';
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

// 2. Lógica de Manejo del Formulario (Llama a la función de actualización)
resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

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
    
    await updatePassword(password);
});

// 3. Lógica de Detección de Eventos (Solución definitiva al problema de timing)
// Esto debe ejecutarse al cargar la página.
supabase.auth.onAuthStateChange(async (event, session) => {
    // Si la librería de Supabase logra establecer la sesión
    if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        // Muestra el mensaje de éxito para que el usuario pueda ingresar la contraseña
        successDiv.textContent = '¡Token validado! Ingresa y confirma tu nueva contraseña.';
        successDiv.style.display = 'block';
    }
    
    // Si se activa el evento USER_UPDATED (ej. si el usuario presiona Enter en el formulario), 
    // se maneja a través del listener del formulario (Paso 2).
});