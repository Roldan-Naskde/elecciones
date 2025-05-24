    particlesJS("particles-js", {
      particles: {
        number: { value: 60 },
        size: { value: 4 },
        color: { value: "#ffffff" },
        opacity: { value: 0.3 },
        move: { enable: true, speed: 2 },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          opacity: 0.1,
          width: 1
        }
      }
    });

    document.getElementById('nuevaVotacionBtn').addEventListener('click', async () => {
      if (confirm('¿Estás seguro de que deseas iniciar una nueva votación? Esto eliminará todos los votos anteriores.')) {
        try {
          const response = await fetch('/reiniciar-votacion', { method: 'POST' });
          const data = await response.json();

          if (data.success) {
            alert('✅ Nueva votación iniciada correctamente.');
            window.location.href = './index.html';
          } else {
            alert('❌ No se pudo reiniciar la votación.');
          }
        } catch (error) {
          console.error('Error al reiniciar:', error);
          alert('❌ Error del servidor al intentar reiniciar la votación.');
        }
      }
    });