// Configuración de Airtable
const AIRTABLE_API_KEY = 'patmlLMS0q68QCIcA.fc15dce0bcf6525bd874156b4e3572c9bc29d29a132c8ef9a27ff245c353abfc';
const BASE_ID = 'appGiSqEHv6y6Pe4G';
const TABLE_NAME = 'Table 1';

// Función para enviar datos a Airtable
async function sendToAirtable(data) {
    try {
        // Creamos el objeto de datos asegurándonos que los valores coincidan exactamente
        const airTableData = {
            records: [{
                fields: {
                    Nombre: data.nombre,
                    Email: data.email,
                    Telefono: data.telefono,
                    // Aseguramos que los valores coincidan exactamente con las opciones en Airtable
                    Profesion: mapSituacion(data.situacion),
                    Redes: mapRedes(data.contenido),
                    Ingresos: mapIngresos(data.tamanio),
                    Obstaculo: mapObstaculo(data.obstaculo)
                }
            }]
        };

        console.log('Enviando datos a Airtable:', airTableData); // Para debugging

        const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(airTableData)
        });

        const responseData = await response.json();
        
        if (!response.ok) {
            console.error('Error response from Airtable:', responseData);
            throw new Error(`Error de Airtable: ${responseData.error?.message || 'Error desconocido'}`);
        }

        return responseData;
    } catch (error) {
        console.error('Error completo:', error);
        throw error;
    }
}

// Funciones de mapeo para asegurar valores exactos
function mapSituacion(valor) {
    const mapping = {
        "Quiero emprender": "Quiero emprender",
        "Ya tengo un negocio físico": "Ya tengo un negocio físico",
        "Ya tengo un negocio digital": "Ya tengo un negocio digital",
        "Soy freelancer": " Soy freelancer"
    };
    return mapping[valor] || valor;
}

function mapRedes(valor) {
    const mapping = {
        "Publico contenido en instagram": "Publico contenido en instagram",
        "No publico contenido en instagram": " No publico contenido en instagram",
        "Quiero empezar a publicar contenido en instagram": "Quiero empezar a publicar contenido en instagram"
    };
    return mapping[valor] || valor;
}

function mapIngresos(valor) {
    const mapping = {
        "0$ - $10.000 USD": "0$ - $10.000 USD",
        "$10.000 - $50.000": "$10.000 - $50.000",
        "$50.000 - $100.000": "$50.000 - $100.000",
        "$100.000 - $250.000": " $100.000 - $250.000",
        "$250.000+": "$250.000+"
    };
    return mapping[valor] || valor;
}

function mapObstaculo(valor) {
    const mapping = {
        "Mas leads calificadas": "Más leads calificadas",
        "Mejorar en ventas": "Mejorar en ventas",
        "Mejorar mi contenido": "Mejorar mi contenido",
        "No saber como empezar mi marca personal": "No saber como empezar mi marca personal"
    };
    return mapping[valor] || valor;
}

// Función para guardar las respuestas
async function saveSurveyResponses() {
    try {
        const responses = {
            situacion: document.querySelector('input[name="situacion"]:checked')?.value || "",
            contenido: document.querySelector('input[name="contenido"]:checked')?.value || "",
            tamanio: document.querySelector('input[name="tamanio"]:checked')?.value || "",
            obstaculo: document.querySelector('input[name="obstaculo"]:checked')?.value || "",
            nombre: document.getElementById('nombre')?.value.trim() || "",
            email: document.getElementById('email')?.value.trim() || "",
            telefono: document.getElementById('telefono')?.value.trim() || ""
        };

        // Log para debugging
        console.log('Respuestas recolectadas:', responses);

        // Validar si se completaron todos los campos obligatorios
        if (!responses.situacion || !responses.contenido || !responses.tamanio || 
            !responses.obstaculo || !responses.nombre || !responses.email || !responses.telefono) {
            alert("Por favor, completa todas las preguntas y campos obligatorios.");
            return;
        }

        await sendToAirtable(responses);
        showThanksAndRedirect();
    } catch (error) {
        alert(`Error al guardar las respuestas: ${error.message}`);
        console.error('Error al guardar respuestas:', error);
    }
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

// Función para mostrar la pantalla de agradecimiento y redirigir
function showThanksAndRedirect() {
    document.querySelectorAll('.question').forEach((q) => q.classList.add('hidden'));
    const thanksScreen = document.getElementById('agradecimiento');
    if (thanksScreen) {
        thanksScreen.classList.remove('hidden');
    }
    setTimeout(() => {
        window.location.href = 'thank-you.html';
    }, 3000);
}

// Asignar el evento de envío del formulario
const form = document.getElementById('cuestionario');
form.addEventListener('submit', function (event) {
    event.preventDefault();
    saveSurveyResponses();
});