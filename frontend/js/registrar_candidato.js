// registrar_candidato.js

const form = document.getElementById('formCandidato');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombreCandidato').value.trim();
    const partido = document.getElementById('partidoCandidato').value.trim();

    if (!nombre || !partido) {
        alert('Por favor, complete todos los campos');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/candidatos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, partido })
        });

        const data = await response.json();

        if (!response.ok) {
            // Muestra el mensaje personalizado desde el backend
            alert(data.message || 'Error al registrar candidato');
            return;
        }

        alert('Candidato registrado exitosamente');
        form.reset();
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al registrar el candidato');
    }
});
