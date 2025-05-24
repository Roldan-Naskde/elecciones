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
      if (!res.ok) throw new Error("No se pudo obtener los votantes");
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
      console.error("Error al buscar votante:", err);
      dniError.textContent = "❌ Error de conexión con el servidor";
      dniError.classList.remove('d-none');
    }
  });

  async function verificarSiYaVoto() {
    try {
      const res = await fetch('http://localhost:3000/votos');
      if (!res.ok) throw new Error("No se pudo obtener votos");
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
      console.error("Error al verificar si ya votó:", err);
      contenedorCandidatos.innerHTML = '<p class="text-danger">❌ Error al verificar el estado del voto.</p>';
    }
  }

  async function cargarCandidatos() {
    try {
      const res = await fetch('http://localhost:3000/candidatos');
      if (!res.ok) throw new Error("No se pudo cargar los candidatos");
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
          </div>
        `;
        contenedorCandidatos.appendChild(card);
      });

      document.querySelectorAll('.votar-btn').forEach(btn => {
        btn.addEventListener('click', () => votarPorCandidato(btn.dataset.id));
      });

    } catch (error) {
      console.error("Error al cargar candidatos:", error);
      contenedorCandidatos.innerHTML = '<p class="text-danger">❌ Error al cargar candidatos.</p>';
    }
  }

  async function votarPorCandidato(candidatoId) {
    if (!votanteActual || !votanteActual._id) {
      alert("❌ Error: votante no válido. Por favor, vuelve a ingresar el DNI.");
      reiniciarModal();
      return;
    }

    if (!candidatoId) {
      alert("❌ Error: candidato no válido.");
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
      console.error("Error al registrar voto:", error);
      alert("❌ Error al registrar el voto");
    }
  }

  finalizarBtn.addEventListener('click', async () => {
    try {
      const res = await fetch('http://localhost:3000/ganador');
      const data = await res.json();

      if (res.ok && data.ganador) {
        ganadorMensaje.textContent = `🎉 El ganador es ${data.ganador.nombre} del partido ${data.ganador.partido} con ${data.ganador.votos} votos.`;
        contenedorCandidatos.innerHTML = '';
        finalizarBtn.disabled = true;
      } else {
        ganadorMensaje.textContent = '❌ No se pudo determinar un ganador aún.';
      }
    } catch (error) {
      console.error("Error al obtener ganador:", error);
      ganadorMensaje.textContent = '❌ Error al obtener ganador.';
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
