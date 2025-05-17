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

        if (!response.ok) throw new Error('Error al registrar candidato');

        alert('Candidato registrado exitosamente');
        form.reset();
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al registrar el candidato');
    }
});