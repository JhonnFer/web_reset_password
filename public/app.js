// public\app.js
const SUPABASE_URL = 'https://cufglydvzflmzmlfphwm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1ZmdseWR2emZsbXptbGZwaHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTU5ODgsImV4cCI6MjA4MDg3MTk4OH0.F8gcELQQxO6LbqxO1gqhiZwUjLT1DotLqdAmo1YvEv8';

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

    // 1. DIAGNÓSTICO: Confirmar que el token se obtuvo correctamente
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
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            // CAMBIO: Intentamos enviar la clave pública como Bearer Token
            // Esto es necesario en algunos escenarios del API Gateway.
            // Si funciona, significa que el token de restablecimiento es el problema.
            'Authorization': `Bearer ${SUPABASE_KEY}` 
        },
        body: JSON.stringify({ password })
    });
        // 2. DIAGNÓSTICO: Mostrar el estado de la respuesta de Supabase
        console.log('--- Diagnóstico de Respuesta API ---');
        console.log('Respuesta OK:', response.ok);
        console.log('Código de Estado:', response.status); // 403, 401, etc.
        console.log('------------------------------------');

        if (response.ok) {
            successDiv.textContent = '¡Contraseña actualizada exitosamente!';
            successDiv.style.display = 'block';
            document.getElementById('resetForm').reset();

            setTimeout(() => {
                window.close();
            }, 3000);
        } else {
            // Clonamos la respuesta para poder leer el cuerpo JSON sin bloquear otros procesos
            const errorResponse = response.clone(); 
            
            try {
                const error = await errorResponse.json();
                
                // 3. DIAGNÓSTICO: Mostrar el mensaje de error EXACTO del servidor
                console.log('Mensaje de Error del Servidor:', error.message || 'Sin mensaje de error en la respuesta JSON.');
                
                errorDiv.textContent = error.message || 'Error al actualizar contraseña (Sin mensaje detallado).';
                errorDiv.style.display = 'block';

            } catch (jsonError) {
                // Esto se ejecuta si Supabase devuelve un 403 o 401 sin cuerpo JSON válido
                console.error('Error al parsear JSON de respuesta. El servidor devolvió:', response.statusText);
                errorDiv.textContent = `Error ${response.status}: El servidor rechazó la solicitud (revisa CORS/Key).`;
                errorDiv.style.display = 'block';
            }
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