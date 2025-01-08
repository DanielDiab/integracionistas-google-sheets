function saveSurveyResponses() {
    const responses = {
        situacion: document.querySelector('input[name="situacion"]:checked')?.value || "",
        contenido: document.querySelector('input[name="contenido"]:checked')?.value || "",
        tamanio: document.querySelector('input[name="tamanio"]:checked')?.value || "",
        obstaculo: document.querySelector('input[name="obstaculo"]:checked')?.value || "",
        nombre: document.getElementById('nombre')?.value.trim() || "",
        email: document.getElementById('email')?.value.trim() || "",
        telefono: document.getElementById('telefono')?.value.trim() || "",
        timestamp: new Date().toISOString() // Añadimos timestamp para identificar cada respuesta
    };

    // Validar si se completaron todos los campos obligatorios
    if (!responses.situacion || !responses.contenido || !responses.tamanio || !responses.obstaculo || !responses.nombre || !responses.email || !responses.telefono) {
        alert("Por favor, completa todas las preguntas y campos obligatorios.");
        return;
    }

    // Obtener respuestas existentes o crear un nuevo array
    let allResponses = JSON.parse(localStorage.getItem('surveyResponses') || '[]');
    
    // Si no es un array (compatibilidad con versión anterior), convertirlo en array
    if (!Array.isArray(allResponses)) {
        allResponses = [];
    }

    // Añadir nueva respuesta
    allResponses.push(responses);

    // Guardar todas las respuestas
    localStorage.setItem('surveyResponses', JSON.stringify(allResponses));
}


// Función para obtener las respuestas en formato JSON, verificando si han expirado
function getSurveyResponses() {
    const storedData = localStorage.getItem('surveyResponses');
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        const currentTime = new Date().getTime();

        if (currentTime > parsedData.expiration) {
            localStorage.removeItem('surveyResponses'); // Elimina los datos si han expirado
            return null; // No retorna datos si han expirado
        }

        return parsedData.data; // Retorna las respuestas si no han expirado
    }
    return null; // Retorna null si no hay respuestas guardadas
}

// Función para mostrar la siguiente pregunta
function showNext(preguntaId) {
    const currentQuestion = document.querySelector(`#pregunta-${preguntaId - 1}`);
    if (currentQuestion) {
        currentQuestion.classList.add('hidden');
    }

    const nextQuestion = document.querySelector(`#pregunta-${preguntaId}`);
    if (nextQuestion) {
        nextQuestion.classList.remove('hidden');
    }
}

// Asigna el evento de envío del formulario para guardar las respuestas y mostrar la pantalla de agradecimiento
const form = document.getElementById('cuestionario');
form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevenir el envío del formulario

    saveSurveyResponses(); // Guarda las respuestas en formato JSON
    showThanksAndRedirect(); // Muestra agradecimiento y redirige
});

// Función para mostrar la pantalla de agradecimiento y redirigir después de unos segundos
function showThanksAndRedirect() {
    document.querySelectorAll('.question').forEach((q) => q.classList.add('hidden')); // Oculta todas las preguntas
    const thanksScreen = document.getElementById('agradecimiento');
    if (thanksScreen) {
        thanksScreen.classList.remove('hidden'); // Muestra la pantalla de agradecimiento
    }
    setTimeout(() => {
        window.location.href = 'thank-you.html'; // Cambia a la URL que desees
    }, 3000); // Redirige después de 3 segundos
}


function downloadJSON() {
    const storedData = localStorage.getItem('surveyResponses');
    if (!storedData) {
        document.getElementById('error-message').classList.remove('hidden');
        return;
    }

    const blob = new Blob([storedData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'respuestas.json';
    
    // Añadir la fecha actual al nombre del archivo
    const fecha = new Date().toISOString().split('T')[0];
    a.download = `respuestas_${fecha}.json`;
    
    a.click();

    URL.revokeObjectURL(url);
    
    // Limpiar todo el localStorage después de la descarga
    localStorage.clear();
    
    // Opcional: Mostrar mensaje de confirmación
    alert('Las respuestas han sido descargadas y el almacenamiento ha sido limpiado.');
}