document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('contenedorCandidatos');

    const imagenespartido = {
        'DEFAULT': '/images/default.png',
        // Puedes agregar más como: 'PARTIDOX': '/images/partidox.png'
    };

    const imagenCandidatoDefault = '/images/candidato_default.png';

    fetch('/candidatos')
        .then(res => res.json())
        .then(candidatos => {
            contenedor.innerHTML = '';
            candidatos.forEach(candidato => {
                const logo = imagenespartido[candidato.partido.toUpperCase()] || imagenespartido['DEFAULT'];

                const div = document.createElement('div');
                div.classList.add('tarjeta-candidato');
                div.innerHTML = `
                    <h3 class="partido">${candidato.partido}</h3>
                    <img src="${logo}" alt="Logo del partido" class="logo">
                    <div class="detalle">
                        <strong>${candidato.nombre}</strong>
                        <img src="${imagenCandidatoDefault}" alt="Foto del candidato" class="foto">
                        <div class="btn-group mt-2">
                            <button class="btn btn-sm btn-warning editar-btn" data-id="${candidato._id}">✏️ Editar</button>
                            <button class="btn btn-sm btn-danger eliminar-btn" data-id="${candidato._id}">🗑️ Eliminar</button>
                     </div>
                </div>
            `;
                contenedor.appendChild(div);
            });


            // Asignar eventos después de renderizar
            document.querySelectorAll('.editar-btn').forEach(btn => {
                btn.addEventListener('click', editarCandidato);
            });

            document.querySelectorAll('.eliminar-btn').forEach(btn => {
                btn.addEventListener('click', eliminarCandidato);
            });
        })
        .catch(err => {
            console.error('Error al cargar candidatos:', err);
            contenedor.innerHTML = '<p>Error al cargar los candidatos.</p>';
        });

    async function eliminarCandidato(e) {
        const id = e.target.dataset.id;
        if (!confirm('¿Estás seguro de eliminar este candidato?')) return;

        try {
            const res = await fetch(`/candidatos/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('No se pudo eliminar');

            alert('Candidato eliminado correctamente');
            location.reload();
        } catch (error) {
            console.error('Error al eliminar:', error);
            alert('Error al eliminar candidato');
        }
    }

    async function editarCandidato(e) {
        const id = e.target.dataset.id;

        const nuevoNombre = prompt('Nuevo nombre del candidato:');
        const nuevoPartido = prompt('Nuevo partido político:');

        if (!nuevoNombre || !nuevoPartido) {
            alert('Todos los campos son obligatorios');
            return;
        }

        try {
            const res = await fetch(`/candidatos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: nuevoNombre,
                    partido: nuevoPartido
                })
            });

            if (!res.ok) throw new Error('No se pudo actualizar');

            alert('Candidato actualizado correctamente');
            location.reload();
        } catch (error) {
            console.error('Error al editar:', error);
            alert('Error al editar candidato');
        }
    }
});
