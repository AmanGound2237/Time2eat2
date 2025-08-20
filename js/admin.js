document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const ordersTableBody = document.querySelector('#orders-table tbody');
    const menuItemsContainer = document.getElementById('menu-items-container');
    const newOrderForm = document.getElementById('new-order-form');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-id');

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
    function renderOrdersTable(ordersToRender = orders) {
        // Sort the array by delivery time before rendering
        const sortedOrders = [...ordersToRender].sort((a, b) => new Date(a.deliveryTime) - new Date(b.deliveryTime));

        ordersTableBody.innerHTML = ''; // Clear existing table rows
        if (sortedOrders && ordersTableBody) {
            sortedOrders.forEach(order => {
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
            const deliveryTimeInput = document.getElementById('delivery-time');
            const selectedCheckboxes = document.querySelectorAll('input[name="menu-items"]:checked');

            if (!customerNameInput.value || !deliveryTimeInput.value || selectedCheckboxes.length === 0) {
                alert('Please fill out all fields and select at least one item.');
                return;
            }

            const allItems = [].concat(...Object.values(menu));
            const selectedItems = Array.from(selectedCheckboxes).map(cb => {
                return allItems.find(item => item.id === parseInt(cb.value));
            });

            const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

            const newOrder = {
                orderId: `ORD${Date.now()}`,
                customerName: customerNameInput.value,
                items: selectedItems,
                deliveryTime: new Date(deliveryTimeInput.value),
                totalPrice: totalPrice,
            };

            orders.push(newOrder);
            renderOrdersTable(); // Re-render the full, sorted table

            // Clear the form
            newOrderForm.reset();
        });
    }

    // --- 4. Handle Search ---
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchTerm = searchInput.value.trim().toLowerCase();
            if (searchTerm) {
                const filteredOrders = orders.filter(order =>
                    order.orderId.toLowerCase().includes(searchTerm)
                );
                renderOrdersTable(filteredOrders);
            } else {
                renderOrdersTable(); // If search is empty, show all
            }
        });

        searchForm.addEventListener('reset', () => {
            renderOrdersTable(); // On reset, render the full table
        });
    }

    // --- 5. Initial render of the orders table on page load ---
    renderOrdersTable();
});
