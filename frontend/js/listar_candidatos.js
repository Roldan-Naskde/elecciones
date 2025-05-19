document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('contenedorCandidatos');

    const imagenespartido = {
        // puedes agregar más partidos
        'DEFAULT': './images/default.png',
    };

    const imagenCandidatoDefault = './images/candidato_default.png';

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
                    <div class="contenido">
                        <img src="${logo}" alt="Logo del partido" class="logo">
                        <img src="${imagenCandidatoDefault}" alt="Foto del candidato" class="foto">
                    </div>
                    <div class="detalle">
                        <p><strong>Presidente:</strong> ${candidato.nombre}</p>
                    </div>
                `;
                contenedor.appendChild(div);
            });
        })
        .catch(err => {
            console.error('Error al cargar candidatos:', err);
            contenedor.innerHTML = '<p>Error al cargar los candidatos.</p>';
        });
});
