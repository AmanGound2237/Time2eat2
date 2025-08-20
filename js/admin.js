document.addEventListener('DOMContentLoaded', () => {
    const ordersTableBody = document.querySelector('#orders-table tbody');
    const menuItemsContainer = document.getElementById('menu-items-container');
    const newOrderForm = document.getElementById('new-order-form');

    // --- 1. Populate the "Order Now" form with menu items ---
    if (menu && menuItemsContainer) {
        for (const category in menu) {
            menu[category].forEach(item => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `item-${item.id}`;
                checkbox.name = 'menu-items';
                checkbox.value = item.id;

                const label = document.createElement('label');
                label.htmlFor = `item-${item.id}`;
                label.textContent = `${item.name} - $${item.price.toFixed(2)}`;

                const container = document.createElement('div');
                container.appendChild(checkbox);
                container.appendChild(label);
                menuItemsContainer.appendChild(container);
            });
        }
    }

    // --- 2. Function to render the orders table ---
    function renderOrdersTable() {
        ordersTableBody.innerHTML = ''; // Clear existing table rows
        if (orders && ordersTableBody) {
            orders.forEach(order => {
                const row = document.createElement('tr');
                const itemsFormatted = order.items.map(item => item.name).join(', ');
                row.innerHTML = `
                    <td data-label="Order ID">${order.orderId}</td>
                    <td data-label="Customer Name">${order.customerName}</td>
                    <td data-label="Items Ordered">${itemsFormatted}</td>
                    <td data-label="Delivery Time">${new Date(order.deliveryTime).toLocaleString()}</td>
                    <td data-label="Total Price">$${order.totalPrice.toFixed(2)}</td>
                `;
                ordersTableBody.appendChild(row);
            });
        }
    }

    // --- 3. Handle new order form submission ---
    if (newOrderForm) {
        newOrderForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const customerNameInput = document.getElementById('customer-name');
            const customerName = customerNameInput.value;
            const selectedCheckboxes = document.querySelectorAll('input[name="menu-items"]:checked');

            if (!customerName || selectedCheckboxes.length === 0) {
                alert('Please enter a customer name and select at least one item.');
                return;
            }

            const allItems = [].concat(...Object.values(menu));
            const selectedItems = Array.from(selectedCheckboxes).map(cb => {
                return allItems.find(item => item.id === parseInt(cb.value));
            });

            const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

            const newOrder = {
                orderId: `ORD${Date.now()}`, // Simple unique ID
                customerName: customerName,
                items: selectedItems,
                deliveryTime: new Date(),
                totalPrice: totalPrice,
            };

            orders.push(newOrder); // Add to the main orders array
            renderOrdersTable(); // Re-render the table with the new order

            // Clear the form
            customerNameInput.value = '';
            selectedCheckboxes.forEach(cb => cb.checked = false);
        });
    }

    // --- 4. Initial render of the orders table on page load ---
    renderOrdersTable();
});
