const contenedorCandidatos = document.getElementById('contenedorCandidatos');

async function cargarCandidatos() {
    try {
        const res = await fetch('http://localhost:3000/candidatos');
        const candidatos = await res.json();

        contenedorCandidatos.innerHTML = '';

        candidatos.forEach((candidato) => {
            const div = document.createElement('div');
            div.classList.add('candidato-card');
            div.innerHTML = `
                <h3>${candidato.nombre}</h3>
                <p><strong>Partido:</strong> ${candidato.partido}</p>
                <button onclick="eliminarCandidato('${candidato._id}')">Eliminar</button>
                <button onclick="editarCandidato('${candidato._id}', '${candidato.nombre}', '${candidato.partido}')">Editar</button>
            `;
            contenedorCandidatos.appendChild(div);
        });
    } catch (error) {
        console.error('Error al cargar candidatos:', error);
    }
}

async function eliminarCandidato(id) {
    if (!confirm('¿Estás seguro de eliminar este candidato?')) return;

    try {
        const res = await fetch(`http://localhost:3000/candidatos/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error('No se pudo eliminar');

        alert('Candidato eliminado');
        cargarCandidatos();
    } catch (error) {
        console.error('Error al eliminar candidato:', error);
    }
}

function editarCandidato(id, nombreActual, partidoActual) {
    const nuevoNombre = prompt('Nuevo nombre:', nombreActual);
    const nuevoPartido = prompt('Nuevo partido:', partidoActual);

    if (nuevoNombre && nuevoPartido) {
        fetch(`http://localhost:3000/candidatos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre: nuevoNombre, partido: nuevoPartido })
        })
        .then(res => {
            if (!res.ok) throw new Error('Error al actualizar');
            return res.json();
        })
        .then(() => {
            alert('Candidato actualizado');
            cargarCandidatos();
        })
        .catch(err => {
            console.error(err);
            alert('Error al editar el candidato');
        });
    }
}

cargarCandidatos();
