// public/app.js

// Variables UI
const resetForm = document.getElementById('resetForm');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const errorDiv = document.getElementById('error');
const successDiv = document.getElementById('success');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');

function setProcessing(isProcessing) {
    if (submitBtn) submitBtn.disabled = isProcessing;
    if (btnText) btnText.style.display = isProcessing ? 'none' : 'inline';
    if (btnLoader) btnLoader.style.display = isProcessing ? 'inline-block' : 'none';
}

async function updatePassword(newPassword) {
    setProcessing(true);
    if (errorDiv) errorDiv.style.display = 'none';

    try {
        // Como eliminamos 'persistSession: false', ahora podemos verificar si la sesión existe
        // antes de intentar actualizar.
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            throw new Error("No hay sesión activa. El enlace expiró o no se pudo validar.");
        }

        const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

        if (updateError) {
            throw updateError;
        }

        if (successDiv) {
            successDiv.textContent = '¡Contraseña actualizada exitosamente!';
            successDiv.style.display = 'block';
        }
        if (resetForm) resetForm.reset();
        
        setTimeout(() => window.close(), 3000);

    } catch (error) {
        console.error('Error:', error);
        if (errorDiv) {
            errorDiv.textContent = error.message || 'Error al actualizar.';
            errorDiv.style.display = 'block';
        }
    } finally {
        setProcessing(false);
    }
}

if (resetForm) {
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
            errorDiv.textContent = 'Mínimo 6 caracteres';
            errorDiv.style.display = 'block';
            return;
        }
        
        await updatePassword(password);
    });
}