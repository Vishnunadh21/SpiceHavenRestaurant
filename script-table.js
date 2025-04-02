// Table configuration
const tables = [
    { id: 'T1', type: 'round-table', capacity: 2, location: 'Window' },
    { id: 'T2', type: 'round-table', capacity: 2, location: 'Near Bar' },
    { id: 'T3', type: 'round-table', capacity: 2, location: 'Top Floor' },
    { id: 'T4', type: 'round-table', capacity: 2, location: 'Rooftop' },
    { id: 'T5', type: 'round-table', capacity: 4, location: 'Near Pool' },
    { id: 'T6', type: 'round-table', capacity: 4, location: 'Eastern End' },
    { id: 'T7', type: 'round-table', capacity: 6, location: 'Main Hall' },
    { id: 'T8', type: 'round-table', capacity: 6, location: 'Private Corner' },
    { id: 'T9', type: 'round-table', capacity: 6, location: 'Near Entrance' },
    { id: 'T10', type: 'round-table', capacity: 6, location: 'Top Floor' }, 
    { id: 'T11', type: 'round-table', capacity: 8, location: 'By Pool' },
    { id: 'T12', type: 'round-table', capacity: 8, location: 'Near Bar' },
    { id: 'T13', type: 'large-table', capacity: 10, location: 'Main Hall' },
    { id: 'T14', type: 'large-table', capacity: 10, location: 'Top Floor' },
    { id: 'T15', type: 'large-table', capacity: 10, location: 'Rooftop' },
    { id: 'T16', type: 'large-table', capacity: 10, location: 'Private Corner' },
    { id: 'T17', type: 'large-table', capacity: 14, location: 'Main Hall' },
    { id: 'T18', type: 'large-table', capacity: 14, location: 'Top Floor' },
    { id: 'T19', type: 'large-table', capacity: 20, location: 'Rooftop' },
    { id: 'T20', type: 'large-table', capacity: 20, location: 'Private Corner' }
];

// Some pre-reserved tables for demonstration
const reservedTables = ['T2','T11'];

// State management
let selectedTable = null;

// Generate restaurant map
const restaurantMap = document.getElementById('restaurantMap');

tables.forEach(table => {
    const tableElement = document.createElement('div');
    tableElement.className = `table ${table.type}`;
    tableElement.textContent = table.id;
    tableElement.dataset.id = table.id;
    tableElement.dataset.capacity = table.capacity;
    tableElement.dataset.location = table.location;
    
    // Add capacity indicator
    const capacityElement = document.createElement('div');
    capacityElement.className = 'table-capacity';
    capacityElement.textContent = `${table.capacity} seats`;
    tableElement.appendChild(capacityElement);
    
    // Mark pre-reserved tables
    if (reservedTables.includes(table.id)) {
        tableElement.classList.add('reserved');
    } else {
        tableElement.addEventListener('click', selectTable);
    }
    
    restaurantMap.appendChild(tableElement);
});

// Select table function
function selectTable() {
    // Clear previous selection
    if (selectedTable) {
        document.querySelector(`.table[data-id="${selectedTable}"]`).classList.remove('selected');
    }
    
    const tableId = this.dataset.id;
    this.classList.add('selected');
    selectedTable = tableId;
    
    updateSummary();
}

// Update reservation summary
function updateSummary() {
    const selectedTableElement = document.getElementById('selectedTable');
    const tableInfoContainer = document.getElementById('tableInfoContainer');
    const reserveButton = document.getElementById('reserveButton');
    
    if (selectedTable) {
        const tableElement = document.querySelector(`.table[data-id="${selectedTable}"]`);
        const capacity = tableElement.dataset.capacity;
        const location = tableElement.dataset.location;
        
        selectedTableElement.textContent = selectedTable;
        
        tableInfoContainer.innerHTML = `
            <p class="table-info">Capacity: ${capacity} people</p>
            <p class="table-info">Location: ${location}</p>
        `;
        
        reserveButton.disabled = false;
    } else {
        selectedTableElement.textContent = 'None';
        tableInfoContainer.innerHTML = '';
        reserveButton.disabled = true;
    }
}

// Form validation
const formInputs = ['name', 'email', 'phone', 'date', 'time', 'guests'];
formInputs.forEach(id => {
    document.getElementById(id).addEventListener('input', validateForm);
});

function validateForm() {
    const reserveButton = document.getElementById('reserveButton');
    const isFormValid = formInputs.every(id => document.getElementById(id).value.trim() !== '');
    
    reserveButton.disabled = !selectedTable || !isFormValid;
}

// Handle reservation submission
document.getElementById('reserveButton').addEventListener('click', function() {
    if (!selectedTable) return;
    
    // Get form values
    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const guests = document.getElementById('guests').value;
    
    // In a real app, this would send data to a server
    alert(`Reservation Confirmed!\n\nName: ${name}\nDate: ${date}\nTime: ${time}\nGuests: ${guests}\nTable: ${selectedTable}`);
    
    // Mark selected table as reserved
    const tableElement = document.querySelector(`.table[data-id="${selectedTable}"]`);
    tableElement.classList.remove('selected');
    tableElement.classList.add('reserved');
    tableElement.removeEventListener('click', selectTable);
    
    // Reset selection and form
    selectedTable = null;
    document.querySelectorAll('input, select').forEach(el => el.value = '');
    updateSummary();
});


