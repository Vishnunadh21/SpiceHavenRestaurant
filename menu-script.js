// Category filtering
const categoryButtons = document.querySelectorAll('.category-btn');
const menuItems = document.querySelectorAll('.menu-item');

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const category = button.dataset.category;
        
        // Filter menu items
        menuItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Initialize with first category active
document.querySelector('.category-btn.active').click();

// Quantity controls
const decreaseButtons = document.querySelectorAll('.decrease');
const increaseButtons = document.querySelectorAll('.increase');
const quantityInputs = document.querySelectorAll('.item-quantity');

decreaseButtons.forEach(button => {
    button.addEventListener('click', () => {
        const input = button.nextElementSibling;
        if (parseInt(input.value) > 0) {
            input.value = parseInt(input.value) - 1;
            updateOrderSummary();
        }
    });
});

increaseButtons.forEach(button => {
    button.addEventListener('click', () => {
        const input = button.previousElementSibling;
        input.value = parseInt(input.value) + 1;
        updateOrderSummary();
    });
});

// Manual input change
quantityInputs.forEach(input => {
    input.addEventListener('change', () => {
        // Ensure value is not negative
        if (parseInt(input.value) < 0) {
            input.value = 0;
        }
        updateOrderSummary();
    });
});

// Update order summary function
function updateOrderSummary() {
    const selectedItems = document.getElementById('selectedItems');
    const totalPriceElement = document.getElementById('totalPrice');
    const emptySelectionMessage = document.getElementById('emptySelection');
    
    // Clear previous selections - properly remove all child elements except emptySelectionMessage
    while (selectedItems.firstChild) {
        selectedItems.removeChild(selectedItems.firstChild);
    }
    
    // Add back the empty selection message (it was removed above)
    selectedItems.appendChild(emptySelectionMessage);
    
    let totalPrice = 0;
    let hasItems = false;
    
    // Loop through all menu items
    menuItems.forEach(item => {
        const quantityInput = item.querySelector('.item-quantity');
        const quantity = parseInt(quantityInput.value);
        
        if (quantity > 0) {
            hasItems = true;
            
            // Hide empty message
            emptySelectionMessage.style.display = 'none';
            
            // Get item details
            const itemName = item.querySelector('h3').textContent;
            const itemPrice = parseFloat(item.querySelector('.price').textContent.replace('$', ''));
            const itemTotal = quantity * itemPrice;
            totalPrice += itemTotal;
            
            // Create selected item element
            const selectedItem = document.createElement('div');
            selectedItem.className = 'selected-item';
            selectedItem.innerHTML = `
                <div>${quantity} x ${itemName}</div>
                <div>$${itemTotal.toFixed(2)}</div>
            `;
            
            // Add special requests if any
            const specialRequest = item.querySelector('textarea').value.trim();
            if (specialRequest) {
                const requestNote = document.createElement('div');
                requestNote.className = 'request-note';
                requestNote.textContent = `Note: ${specialRequest}`;
                requestNote.style.fontSize = '0.85em';
                requestNote.style.color = '#666';
                requestNote.style.fontStyle = 'italic';
                selectedItem.appendChild(requestNote);
            }
            
            selectedItems.appendChild(selectedItem);
        }
    });
    
    // Update total price
    totalPriceElement.textContent = totalPrice.toFixed(2);
    
    // Show/hide empty message
    emptySelectionMessage.style.display = hasItems ? 'none' : 'block';
}

// Save selections button
document.getElementById('saveSelections').addEventListener('click', (e) => {
    e.preventDefault();
    
    // Get all selected items with quantities and special requests
    const orderData = [];
    menuItems.forEach(item => {
        const quantity = parseInt(item.querySelector('.item-quantity').value);
        if (quantity > 0) {
            orderData.push({
                name: item.querySelector('h3').textContent,
                price: parseFloat(item.querySelector('.price').textContent.replace('$', '')),
                quantity: quantity,
                specialRequest: item.querySelector('textarea').value.trim(),
                category: item.dataset.category
            });
        }
    });
    
    // Save to localStorage
    if (orderData.length > 0) {
        localStorage.setItem('spiceHavenOrder', JSON.stringify(orderData));
        alert('Your menu selections have been saved!');
    } else {
        alert('Please select at least one item to save.');
    }
});

// Add to reservation button
document.getElementById('addToReservation').addEventListener('click', () => {
    // Get total price
    const totalPrice = document.getElementById('totalPrice').textContent;
    
    // Check if any items are selected
    if (parseFloat(totalPrice) > 0) {
        // Save order data before redirecting
        const orderData = [];
        menuItems.forEach(item => {
            const quantity = parseInt(item.querySelector('.item-quantity').value);
            if (quantity > 0) {
                orderData.push({
                    name: item.querySelector('h3').textContent,
                    price: parseFloat(item.querySelector('.price').textContent.replace('$', '')),
                    quantity: quantity,
                    specialRequest: item.querySelector('textarea').value.trim(),
                    category: item.dataset.category
                });
            }
        });
        
        // Save to localStorage
        localStorage.setItem('spiceHavenOrder', JSON.stringify(orderData));
        
        // Redirect to reservation page
        window.location.href = 'index.html';
    } else {
        alert('Please select at least one item to add to your reservation.');
    }
});

// Load saved selections if they exist
window.addEventListener('DOMContentLoaded', () => {
    const savedOrder = localStorage.getItem('spiceHavenOrder');
    
    if (savedOrder) {
        const orderData = JSON.parse(savedOrder);
        
        // Populate form with saved data
        orderData.forEach(item => {
            menuItems.forEach(menuItem => {
                const itemName = menuItem.querySelector('h3').textContent;
                if (itemName === item.name) {
                    menuItem.querySelector('.item-quantity').value = item.quantity;
                    if (item.specialRequest) {
                        menuItem.querySelector('textarea').value = item.specialRequest;
                    }
                }
            });
        });
        
        // Update the order summary
        updateOrderSummary();
    }
});