// registrar_votante.js

const formulario = document.getElementById('formulario-votante');
const mensaje = document.getElementById('mensaje');

formulario.addEventListener('submit', async function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const dni = document.getElementById('dni').value.trim();

  if (nombre === '' || dni === '') {
    alert('Por favor, completa todos los campos.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/votantes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, dni})
    });

    if (!response.ok) throw new Error('Error al registrar votante');

    formulario.reset();
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
