// public/app.js - BYPASS DE LIBRERÍA

// 1. Configuración Manual
const SUPABASE_PROJECT_URL = 'https://cufglydvzflmzmlfphwm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1ZmdseWR2emZsbXptbGZwaHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTU5ODgsImV4cCI6MjA4MDg3MTk4OH0.F8gcELQQxO6LbqxO1gqhiZwUjLT1DotLqdAmo1YvEv8';

// Variables UI
const resetForm = document.getElementById('resetForm');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const errorDiv = document.getElementById('error');
const successDiv = document.getElementById('success');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');

// Obtener el token directamente del hash de la URL
const hash = window.location.hash.substring(1);
const params = new URLSearchParams(hash);
const accessToken = params.get('access_token');
const type = params.get('type');

// Diagnóstico inicial en consola
console.log("Token para Fetch:", accessToken ? "Presente" : "Faltante");
console.log("Tipo:", type);

function setProcessing(isProcessing) {
    if (submitBtn) submitBtn.disabled = isProcessing;
    if (btnText) btnText.style.display = isProcessing ? 'none' : 'inline';
    if (btnLoader) btnLoader.style.display = isProcessing ? 'inline-block' : 'none';
}

async function updatePasswordDirectly(newPassword) {
    setProcessing(true);
    if (errorDiv) errorDiv.style.display = 'none';

    if (!accessToken) {
        errorDiv.textContent = 'Error: No se encontró el token de seguridad. Usa el enlace de tu correo.';
        errorDiv.style.display = 'block';
        setProcessing(false);
        return;
    }

    try {
        // --- AQUÍ ESTÁ LA MAGIA: FETCH DIRECTO A LA API DE GO-TRUE ---
        // Ignoramos la librería JS y hablamos directo con el servidor.
        const response = await fetch(`${SUPABASE_PROJECT_URL}/auth/v1/user`, {
            method: 'PUT', // Supabase usa PUT para actualizar usuario
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${accessToken}` // Usamos el token del correo como autorización
            },
            body: JSON.stringify({
                password: newPassword
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // Si el servidor rechaza (400, 401, etc.)
            throw new Error(data.msg || data.message || data.error_description || 'Error al actualizar');
        }

        // Éxito
        console.log("Actualización exitosa:", data);
        if (successDiv) {
            successDiv.textContent = '¡Contraseña actualizada exitosamente!';
            successDiv.style.display = 'block';
        }
        if (resetForm) resetForm.reset();
        
        // Opcional: Cerrar ventana
        setTimeout(() => window.close(), 3000);

    } catch (error) {
        console.error('Error Fetch:', error);
        if (errorDiv) {
            errorDiv.textContent = error.message === 'Token has expired or is invalid' 
                ? 'El enlace ha expirado. Pide uno nuevo.' 
                : ('Error: ' + error.message);
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
        
        await updatePasswordDirectly(password);
    });
}