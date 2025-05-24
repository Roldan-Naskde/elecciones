let votanteActual = null;

document.addEventListener('DOMContentLoaded', () => {
  const modal = new bootstrap.Modal(document.getElementById('dniModal'));
  const validarBtn = document.getElementById('validarDniBtn');
  const dniInput = document.getElementById('dniInput');
  const dniError = document.getElementById('dniError');
  const bienvenida = document.getElementById('bienvenida');
  const contenedorCandidatos = document.getElementById('contenedorCandidatos');
  const finalizarBtn = document.getElementById('finalizarBtn');
  const ganadorMensaje = document.getElementById('ganadorMensaje');
  const cambiarDniBtn = document.getElementById('cambiarDniBtn');
  const inicioBtn = document.getElementById('inicioBtn');

  modal.show();

  cambiarDniBtn.addEventListener('click', reiniciarModal);
  inicioBtn.addEventListener('click', () => location.href = 'index.html');

  validarBtn.addEventListener('click', async () => {
    const dni = dniInput.value.trim();
    if (!dni) return;

    try {
      const res = await fetch('http://localhost:3000/votante');
      const votantes = await res.json();
      const encontrado = votantes.find(v => v.dni === dni);

      if (encontrado) {
        votanteActual = encontrado;
        bienvenida.textContent = `👋 Bienvenido, ${encontrado.nombre}`;
        contenedorCandidatos.innerHTML = '';
        ganadorMensaje.textContent = '';
        modal.hide();
        verificarSiYaVoto();
      } else {
        dniError.textContent = "❌ DNI no encontrado";
        dniError.classList.remove('d-none');
      }
    } catch (err) {
      dniError.textContent = "❌ Error de conexión con el servidor";
      dniError.classList.remove('d-none');
    }
  });

  async function verificarSiYaVoto() {
    try {
      const res = await fetch('http://localhost:3000/votos');
      const votos = await res.json();
      const yaVoto = votos.some(v => v.votanteId === votanteActual._id || v.votanteId?._id === votanteActual._id);

      if (yaVoto) {
        bienvenida.textContent = `👋 Hola, ${votanteActual.nombre}`;
        finalizarBtn.classList.add('d-none');
        contenedorCandidatos.innerHTML = `<p class="text-danger fs-5">⚠️ Ya has emitido tu voto.</p>`;
        mostrarBotonesAccion();
      } else {
        cargarCandidatos();
        finalizarBtn.classList.remove('d-none');
      }
    } catch (err) {
      contenedorCandidatos.innerHTML = '<p class="text-danger">❌ Error al verificar el estado del voto.</p>';
    }
  }

  async function cargarCandidatos() {
    try {
      const res = await fetch('http://localhost:3000/candidatos');
      const candidatos = await res.json();

      contenedorCandidatos.innerHTML = '';
      candidatos.forEach(c => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-3';
        card.innerHTML = `
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">${c.nombre}</h5>
              <p class="card-text">Partido: ${c.partido}</p>
              <button class="btn btn-success votar-btn" data-id="${c._id}">Votar</button>
            </div>
          </div>`;
        contenedorCandidatos.appendChild(card);
      });

      document.querySelectorAll('.votar-btn').forEach(btn => {
        btn.addEventListener('click', () => votarPorCandidato(btn.dataset.id));
      });
    } catch (error) {
      contenedorCandidatos.innerHTML = '<p class="text-danger">❌ Error al cargar candidatos.</p>';
    }
  }

  async function votarPorCandidato(candidatoId) {
    if (!votanteActual || !votanteActual._id) {
      alert("❌ Error: votante no válido. Por favor, vuelve a ingresar el DNI.");
      reiniciarModal();
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/votos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          votanteId: votanteActual._id,
          candidatoId: candidatoId
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Voto registrado con éxito");
        document.querySelectorAll('.votar-btn').forEach(btn => btn.disabled = true);
        finalizarBtn.classList.remove('d-none');
        mostrarBotonesAccion();
      } else {
        alert("⚠️ " + (data.error || "Error al votar"));
      }
    } catch (error) {
      alert("❌ Error al registrar el voto");
    }
  }

  finalizarBtn.addEventListener('click', async () => {
  try {
    const res = await fetch('http://localhost:3000/ganador');
    const data = await res.json();

    if (res.ok && data.ganador) {
      // Un solo ganador
      ganadorMensaje.innerHTML = `
        🎉 <strong>Ganador:</strong> ${data.ganador.nombre} <br>
        🏛️ <strong>Partido:</strong> ${data.ganador.partido} <br>
        🗳️ <strong>Votos:</strong> ${data.ganador.votos}
      `;
      contenedorCandidatos.innerHTML = '';
      finalizarBtn.disabled = true;

    } else if (res.ok && data.ganadores) {
      // Empate
      ganadorMensaje.innerHTML = `
        ⚠️ <strong>Empate entre los siguientes candidatos:</strong><br><br>
        ${data.ganadores.map(c => `
          👤 ${c.nombre} (${c.partido}) - 🗳️ ${c.votos} votos
        `).join('<br>')}<br><br>
        🔁 Por favor, reinicie la votación.
      `;
      contenedorCandidatos.innerHTML = '';
      finalizarBtn.disabled = true;

    } else {
      ganadorMensaje.textContent = '❌ No se pudo determinar un ganador aún.';
    }

  } catch (error) {
    ganadorMensaje.textContent = '❌ Error al obtener ganador.';
    console.error(error);
  }
});


  function mostrarBotonesAccion() {
    cambiarDniBtn.classList.remove('d-none');
    inicioBtn.classList.remove('d-none');
  }

  function reiniciarModal() {
    votanteActual = null;
    dniInput.value = '';
    dniError.classList.add('d-none');
    bienvenida.textContent = '';
    contenedorCandidatos.innerHTML = '';
    ganadorMensaje.textContent = '';
    finalizarBtn.classList.add('d-none');
    finalizarBtn.disabled = false;
    cambiarDniBtn.classList.add('d-none');
    inicioBtn.classList.add('d-none');
    modal.show();
  }
});
