// Global variables
let characters = [];
const editModal = new bootstrap.Modal(document.getElementById('editModal'));

// Load characters when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadCharacters();
    setupEventListeners();
});

// Function to load and display characters
async function loadCharacters() {
    try {
        const response = await fetch('characters.json');
        if (!response.ok) {
            throw new Error('Failed to load characters');
        }
        characters = await response.json();
        displayCharacters(characters);
    } catch (error) {
        console.error('Error loading characters:', error);
        alert('Error loading characters. Please try again.');
    }
}

// Display characters in the table
function displayCharacters(characters) {
    const characterList = document.getElementById('characterList');
    characterList.innerHTML = '';

    characters.forEach(character => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${character.name}</td>
            <td>${character.role}</td>
            <td>${character.nationality}</td>
            <td>${character.ability}</td>
            <td>
                <button class="btn btn-sm btn-primary edit-btn" data-id="${character.id}">Edit</button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${character.id}">Delete</button>
            </td>
        `;
        characterList.appendChild(row);
    });
}

// Add new character
document.getElementById('addCharacterForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newCharacter = {
        id: characters.length > 0 ? Math.max(...characters.map(c => c.id)) + 1 : 1,
        name: document.getElementById('name').value,
        role: document.getElementById('role').value,
        nationality: document.getElementById('nationality').value,
        ability: document.getElementById('ability').value
    };

    characters.push(newCharacter);
    await saveCharacters();
    displayCharacters(characters);
    e.target.reset();
});

// Edit character
function editCharacter(id) {
    const character = characters.find(c => c.id === id);
    if (character) {
        document.getElementById('editId').value = character.id;
        document.getElementById('editName').value = character.name;
        document.getElementById('editRole').value = character.role;
        document.getElementById('editNationality').value = character.nationality;
        document.getElementById('editAbility').value = character.ability;
        editModal.show();
    }
}

// Save edited character
document.getElementById('editCharacterForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editId').value);
    const characterIndex = characters.findIndex(c => c.id === id);
    
    if (characterIndex !== -1) {
        characters[characterIndex] = {
            id: id,
            name: document.getElementById('editName').value,
            role: document.getElementById('editRole').value,
            nationality: document.getElementById('editNationality').value,
            ability: document.getElementById('editAbility').value
        };

        await saveCharacters();
        displayCharacters(characters);
        editModal.hide();
    }
});

// Delete character
async function deleteCharacter(id) {
    if (confirm('Are you sure you want to delete this character?')) {
        characters = characters.filter(c => c.id !== id);
        await saveCharacters();
        displayCharacters(characters);
    }
}

// Save characters to JSON file
async function saveCharacters() {
    try {
        const response = await fetch('characters.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(characters, null, 2)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save characters');
        }
    } catch (error) {
        console.error('Error saving characters:', error);
        alert('Error saving characters. Please try again.');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Close modal when clicking outside
    document.getElementById('editModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('editModal')) {
            editModal.hide();
        }
    });

    // Add event listeners for edit and delete buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const id = parseInt(e.target.dataset.id);
            editCharacter(id);
        } else if (e.target.classList.contains('delete-btn')) {
            const id = parseInt(e.target.dataset.id);
            deleteCharacter(id);
        }
    });
} 