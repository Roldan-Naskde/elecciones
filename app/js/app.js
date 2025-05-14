let selectedCandidateId = null; // Variable para almacenar el ID del candidato seleccionado
let voterDNI = null; // Variable para almacenar el DNI del votante

// Function to show the modal for DNI input
function showModal() {
    const modal = document.getElementById('dniModal');
    modal.style.display = 'block';
}

// Function to hide the modal
function hideModal() {
    const modal = document.getElementById('dniModal');
    modal.style.display = 'none';
}

// Function to handle DNI submission
function submitDNI() {
    voterDNI = document.getElementById('dniInput').value;
    if (voterDNI) {
        hideModal();
        displayCandidates();
    } else {
        alert('Por favor, ingrese un número de documento válido.');
    }
}

// Function to display candidate cards
async function displayCandidates() {
    try {
        const response = await fetch("http://localhost:3000/candidatos"); // Llamar al endpoint del servidor
        const candidates = await response.json(); // Obtener los datos de los candidatos

        const candidateContainer = document.getElementById('candidatesContainer');
        candidateContainer.innerHTML = `
            <h2 class="text-center mb-4">Candidatos</h2>
            <div class="row"></div>
        `;

        const row = candidateContainer.querySelector('.row');

        candidates.forEach(candidate => {
            const card = document.createElement('div');
            card.className = 'col-md-4';
            card.innerHTML = `
                <div class="card candidate-card">
                    <img src="${candidate.photo}" class="card-img-top" alt="${candidate.name}">
                    <div class="card-body text-center">
                        <img src="${candidate.partyLogo}" alt="${candidate.partyName}" class="img-fluid mb-2" style="max-width: 50px;">
                        <h5 class="card-title">${candidate.name}</h5>
                        <button class="btn btn-success">Seleccionar</button>
                    </div>
                </div>
            `;
            card.querySelector('.btn-success').onclick = () => showConfirmationModal(candidate._id, candidate.name);
            row.appendChild(card);
        });
    } catch (error) {
        console.error("Error al cargar los candidatos:", error);
        alert("No se pudieron cargar los candidatos. Intente nuevamente más tarde.");
    }
}

// Function to show confirmation modal
function showConfirmationModal(candidateId, candidateName) {
    selectedCandidateId = candidateId;
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmationMessage = document.getElementById('confirmationMessage');
    confirmationMessage.textContent = `¿Estás seguro de votar por ${candidateName}?`;
    confirmationModal.style.display = 'block';
}

// Function to confirm vote
async function confirmVote() {
    if (!selectedCandidateId || !voterDNI) {
        alert("Error: No se pudo registrar el voto. Falta información.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/votar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                candidatoId: selectedCandidateId,
                dni: voterDNI,
            }),
        });

        if (response.ok) {
            alert("¡Voto registrado exitosamente!");
        } else {
            const errorData = await response.json();
            alert(`Error al registrar el voto: ${errorData.error}`);
        }
    } catch (error) {
        alert("Error al conectar con el servidor.");
    }

    hideConfirmationModal();
}

// Function to hide confirmation modal
function hideConfirmationModal() {
    const confirmationModal = document.getElementById('confirmationModal');
    confirmationModal.style.display = 'none';
}

// Event listeners
document.getElementById('continueButton').onclick = submitDNI;
document.getElementById('confirmVote').onclick = confirmVote;
document.getElementById('cancelVote').onclick = hideConfirmationModal;

// Show the modal on page load
window.onload = showModal;