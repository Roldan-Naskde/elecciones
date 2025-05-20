document.addEventListener('DOMContentLoaded', async () => {
  const lista = document.getElementById('listaVotantes');
  const buscarInput = document.getElementById('buscarInput');

  let votantes = [];

  const cargarVotantes = async () => {
    try {
      const res = await fetch('http://localhost:3000/votante');
      if (!res.ok) throw new Error('Error al obtener votantes');
      votantes = await res.json();
      mostrarVotantes(votantes);
    } catch (error) {
      console.error('Error al cargar votantes:', error);
      lista.innerHTML = '<li class="list-group-item text-danger">Error al cargar votantes</li>';
    }
  };

  const mostrarVotantes = (datos) => {
    lista.innerHTML = '';

    if (datos.length === 0) {
      lista.innerHTML = '<li class="list-group-item text-center">No se encontraron votantes 🤷‍♂️</li>';
      return;
    }

    datos.forEach((v) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center flex-wrap';
      li.innerHTML = `
        <div>
          <strong>👤 ${v.nombre}</strong><br>
          🪪 DNI: ${v.dni}
        </div>
        <div class="btn-group">
          <button class="btn btn-warning btn-sm editar-btn" data-id="${v._id}">✏️ Editar</button>
          <button class="btn btn-danger btn-sm eliminar-btn" data-id="${v._id}">🗑️ Eliminar</button>
        </div>
      `;
      lista.appendChild(li);
    });

    document.querySelectorAll('.eliminar-btn').forEach((btn) => {
      btn.addEventListener('click', eliminarVotante);
    });

    document.querySelectorAll('.editar-btn').forEach((btn) => {
      btn.addEventListener('click', editarVotante);
    });
  };

  const eliminarVotante = async (e) => {
    const id = e.target.dataset.id;
    if (!confirm('¿Estás seguro de eliminar este votante?')) return;

    try {
      const res = await fetch(`http://localhost:3000/votantes/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Error al eliminar votante');

      alert('Votante eliminado exitosamente');
      cargarVotantes();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('No se pudo eliminar el votante');
    }
  };

  const editarVotante = async (e) => {
    const id = e.target.dataset.id;
    const votante = votantes.find((v) => v._id === id);

    const nuevoNombre = prompt('Nuevo nombre:', votante.nombre);
    const nuevoDNI = prompt('Nuevo DNI:', votante.dni);

    if (!nuevoNombre || !nuevoDNI) {
      alert('Nombre y DNI son obligatorios');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/votantes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nuevoNombre,
          dni: nuevoDNI,
        }),
      });

      if (!res.ok) throw new Error('Error al actualizar votante');

      alert('Votante actualizado');
      cargarVotantes();
    } catch (error) {
      console.error('Error al editar:', error);
      alert('No se pudo actualizar el votante');
    }
  };

  buscarInput.addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();
    const filtrados = votantes.filter(
      (v) =>
        v.nombre.toLowerCase().includes(texto) ||
        v.dni.includes(texto)
    );
    mostrarVotantes(filtrados);
  });

  cargarVotantes();
});
