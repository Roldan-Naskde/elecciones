const formulario = document.getElementById('formulario-votante');
const mensaje = document.getElementById('mensaje');
const nombreInput = document.getElementById('nombre');
const dniInput = document.getElementById('dni');
const boton = formulario.querySelector('button');

const soloLetrasRegex = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/;

// Permitir solo números en el campo DNI
dniInput.addEventListener('input', () => {
  dniInput.value = dniInput.value.replace(/\D/g, '');
  validarFormulario();
});

// Permitir solo letras en el nombre en tiempo real
nombreInput.addEventListener('input', () => {
  nombreInput.value = nombreInput.value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g, '');
  validarFormulario();
});

// Validar si el formulario es válido
function validarFormulario() {
  const nombreValido = soloLetrasRegex.test(nombreInput.value.trim());
  const dniValido = /^\d{8}$/.test(dniInput.value.trim());
  boton.disabled = !(nombreValido && dniValido);
}

// Capitalizar cada palabra
function capitalizarTexto(texto) {
  return texto.replace(/\b\w/g, letra => letra.toUpperCase());
}

// Validación y envío del formulario
formulario.addEventListener('submit', async function (e) {
  e.preventDefault();

  let nombre = nombreInput.value.trim();
  const dni = dniInput.value.trim();

  if (!soloLetrasRegex.test(nombre)) {
    alert('El nombre solo debe contener letras y espacios.');
    return;
  }

  if (!/^\d{8}$/.test(dni)) {
    alert('El DNI debe tener exactamente 8 dígitos numéricos.');
    return;
  }

  nombre = capitalizarTexto(nombre);

  try {
    const response = await fetch('http://localhost:3000/votantes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, dni })
    });

    if (!response.ok) throw new Error('Error al registrar votante');

    formulario.reset();
    boton.disabled = true;
    mensaje.classList.remove('oculto');
    lanzarConfetti();

    setTimeout(() => {
      mensaje.classList.add('oculto');
    }, 3000);
  } catch (error) {
    console.error('Error:', error);
    alert('Hubo un problema al registrar el votante.');
  }
});

// Confetti animación
function lanzarConfetti() {
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let piezas = [];
  for (let i = 0; i < 100; i++) {
    piezas.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 50 + 20,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      tilt: Math.floor(Math.random() * 10) - 10,
    });
  }

  function dibujarConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    piezas.forEach((p, i) => {
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, false);
      ctx.fill();
      p.y += Math.cos(p.d) + 2;
      p.x += Math.sin(p.d);
      if (p.y > canvas.height) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
    });
  }

  function animar() {
    dibujarConfetti();
    requestAnimationFrame(animar);
  }

  animar();

  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 3000);
}
