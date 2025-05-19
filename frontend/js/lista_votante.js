// ../js/listar_votante.js

document.addEventListener('DOMContentLoaded', async () => {
  const lista = document.getElementById('listaVotantes');
  const buscarInput = document.getElementById('buscarInput');

  let votantes = [];

  // Cargar votantes desde la API
  const cargarVotantes = async () => {
    try {
      const res = await fetch('http://localhost:3000/votante');
      if (!res.ok) throw new Error('Error al obtener votantes');
      votantes = await res.json();
      mostrarVotantes(votantes);
    } catch (error) {
      console.error('Error al cargar votantes:', error);
      lista.innerHTML = '<li>Error al cargar votantes</li>';
    }
  };

  // Mostrar votantes en la lista
  const mostrarVotantes = (datos) => {
    lista.innerHTML = '';

    if (datos.length === 0) {
      lista.innerHTML = '<li>No se encontraron votantes 🤷‍♂️</li>';
      return;
    }

    datos.forEach((v) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>👤 ${v.nombre}</strong><br>
        🪪 DNI: ${v.dni}<br>
      `;
      lista.appendChild(li);
    });
  };

  // Búsqueda dinámica
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
