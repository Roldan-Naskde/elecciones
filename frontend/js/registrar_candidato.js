const form = document.getElementById('formCandidato');
const nombreInput = document.getElementById('nombreCandidato');
const partidoInput = document.getElementById('partidoCandidato');

const soloLetrasRegex = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/;

// Bloquear caracteres inválidos en tiempo real
[nombreInput, partidoInput].forEach(input => {
  input.addEventListener('input', function () {
    this.value = this.value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g, '');
  });
});

// Capitalizar cada palabra
function capitalizarTexto(texto) {
  return texto.replace(/\b\w/g, letra => letra.toUpperCase());
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  let nombre = nombreInput.value.trim();
  let partido = partidoInput.value.trim();

  if (!nombre || !partido) {
    alert('Por favor, complete todos los campos');
    return;
  }

  if (!soloLetrasRegex.test(nombre)) {
    alert('El nombre del candidato solo debe contener letras y espacios.');
    return;
  }

  if (!soloLetrasRegex.test(partido)) {
    alert('El nombre del partido solo debe contener letras y espacios.');
    return;
  }

  // Capitalizar automáticamente
  nombre = capitalizarTexto(nombre);
  partido = capitalizarTexto(partido);

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
