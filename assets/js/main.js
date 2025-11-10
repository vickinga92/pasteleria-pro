//IMPLEMENTACIÓN DE COOKIES

document.addEventListener('DOMContentLoaded', function() {
    const banner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('accept-cookies');
    const rejectButton = document.getElementById('reject-cookies');
    const cookieName = 'cookie_consent_status';
    const cookieExpiryDays = 365;
    
    // ⚠️ IMPORTANTE: REEMPLAZA 'G-XXXXXXXXXX' con tu ID de Medición de Google Analytics 4 (GA4)
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; 

    // --- Funciones de Gestión de Cookies ---

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        // path=/ asegura que la cookie esté disponible en todo el sitio
        document.cookie = name + "=" + (value || "") + expires + "; path=/; Secure; SameSite=Lax";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // --- Lógica de Carga de Scripts de Terceros ---

    function loadTrackingScripts() {
        console.log('Consentimiento aceptado. Cargando Google Analytics...');
        
        // 1. Cargar la librería principal de Google Analytics (gtag.js)
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);

        // 2. Inicializar la capa de datos y el seguimiento (gtag)
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        // 3. Configurar el seguimiento
        gtag('config', GA_MEASUREMENT_ID);
        
        // Aquí podrías añadir otros scripts de seguimiento (Meta Pixel, etc.)
    }

    // --- Manejo del Consentimiento y Estado ---

    function handleConsent(status) {
        // 1. Guarda la elección del usuario
        setCookie(cookieName, status, cookieExpiryDays);
        
        // 2. Oculta el banner
        banner.classList.remove('visible');
        setTimeout(() => { banner.style.display = 'none'; }, 500); // Ocultar después de la animación
        
        // 3. Carga condicional de scripts
        if (status === 'accepted') {
            loadTrackingScripts();
        } else {
            console.log('Cookies rechazadas. Scripts de seguimiento bloqueados.');
        }
    }

    // --- Inicialización y Comprobación de Estado ---
    const consent = getCookie(cookieName);

    if (!consent) {
        // No hay cookie de consentimiento, mostrar el banner
        banner.style.display = 'block';
        // Mostrar con un pequeño retraso para asegurar la animación CSS
        setTimeout(() => {
            banner.classList.add('visible');
        }, 100);
    } else if (consent === 'accepted') {
        // Ya aceptó, cargar los scripts de seguimiento inmediatamente
        loadTrackingScripts();
    } else {
        // Ya rechazó, mantener scripts bloqueados y banner oculto
        banner.style.display = 'none';
        console.log('Consentimiento previo: Rechazado.');
    }

    // --- Manejadores de Eventos de Botones ---
    acceptButton.addEventListener('click', () => {
        handleConsent('accepted');
    });

    rejectButton.addEventListener('click', () => {
        handleConsent('rejected');
    });
});