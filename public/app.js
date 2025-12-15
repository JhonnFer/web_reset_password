// public\app.js (VERSION FINAL DE PRODUCCIÓN)

// NO INCLUIR const SUPABASE_URL ni const SUPABASE_KEY AQUÍ.
// El cliente 'supabase' ya fue inicializado en el script inline y es accesible globalmente.

// Variables globales para elementos de la interfaz (Aseguramos que existen antes de usar)
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
    if (submitBtn) submitBtn.disabled = isProcessing;
    if (btnText) btnText.style.display = isProcessing ? 'none' : 'inline';
    if (btnLoader) btnLoader.style.display = isProcessing ? 'inline-block' : 'none';
}

// Función principal de actualización de contraseña
async function updatePassword(newPassword) {
    setProcessing(true);
    if (errorDiv) errorDiv.style.display = 'none';
    if (successDiv) successDiv.style.display = 'none';

    try {
        // La sesión DEBE estar activa en este punto gracias al script inline.
        const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

        if (updateError) {
            console.error('Error al actualizar contraseña:', updateError);
            if (errorDiv) errorDiv.textContent = updateError.message || 'Error: La sesión no es válida. Solicita un nuevo enlace.';
            if (errorDiv) errorDiv.style.display = 'block';
        } else {
            // Éxito
            if (successDiv) successDiv.textContent = '¡Contraseña actualizada exitosamente! Esta ventana se cerrará.';
            if (successDiv) successDiv.style.display = 'block';
            if (resetForm) resetForm.reset();

            setTimeout(() => {
                window.close();
            }, 3000);
        }

    } catch (error) {
        console.error('Error de red o conexión:', error);
        if (errorDiv) errorDiv.textContent = 'Error de conexión. Intenta nuevamente.';
        if (errorDiv) errorDiv.style.display = 'block';
    } finally {
        setProcessing(false);
    }
}

// 2. Lógica de Manejo del Formulario
if (resetForm) {
    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Validación local
        if (password !== confirmPassword) {
            if (errorDiv) errorDiv.textContent = 'Las contraseñas no coinciden';
            if (errorDiv) errorDiv.style.display = 'block';
            return;
        }
        if (password.length < 6) {
            if (errorDiv) errorDiv.textContent = 'La contraseña debe tener al menos 6 caracteres';
            if (errorDiv) errorDiv.style.display = 'block';
            return;
        }
        
        await updatePassword(password);
    });
}