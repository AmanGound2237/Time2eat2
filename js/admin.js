document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const pendingOrdersTableBody = document.querySelector('#pending-orders-table tbody');
    const doneOrdersTableBody = document.querySelector('#done-orders-table tbody');
    const menuItemsContainer = document.getElementById('menu-items-container');
    const newOrderForm = document.getElementById('new-order-form');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-id');

    // Menu Management Elements
    const addItemForm = document.getElementById('add-item-form');
    const editItemForm = document.getElementById('edit-item-form');
    const editItemSelect = document.getElementById('select-item-edit');

    // --- RENDER FUNCTIONS ---

    function renderOrders(ordersToRender = orders) {
        const pendingOrders = ordersToRender.filter(o => o.status === 'pending');
        const doneOrders = ordersToRender.filter(o => o.status === 'done');

        // Sort pending orders by time
        pendingOrders.sort((a, b) => new Date(a.deliveryTime) - new Date(b.deliveryTime));

        // Render Pending Orders
        pendingOrdersTableBody.innerHTML = '';
        pendingOrders.forEach(order => {
            const row = document.createElement('tr');
            const itemsFormatted = order.items.map(item => item.name).join(', ');
            row.innerHTML = `
                <td data-label="Order ID">${order.orderId}</td>
                <td data-label="Customer Name">${order.customerName}</td>
                <td data-label="Items Ordered">${itemsFormatted}</td>
                <td data-label="Delivery Time">${new Date(order.deliveryTime).toLocaleString()}</td>
                <td data-label="Total Price">$${order.totalPrice.toFixed(2)}</td>
                <td data-label="Actions">
                    <button class="mark-done-btn" data-id="${order.orderId}">Done</button>
                    <button class="cancel-order-btn" data-id="${order.orderId}">Cancel</button>
                </td>
            `;
            pendingOrdersTableBody.appendChild(row);
        });

        // Render Done Orders
        doneOrdersTableBody.innerHTML = '';
        doneOrders.forEach(order => {
            const row = document.createElement('tr');
            const itemsFormatted = order.items.map(item => item.name).join(', ');
            row.innerHTML = `
                <td data-label="Order ID">${order.orderId}</td>
                <td data-label="Customer Name">${order.customerName}</td>
                <td data-label="Items Ordered">${itemsFormatted}</td>
                <td data-label="Delivery Time">${new Date(order.deliveryTime).toLocaleString()}</td>
                <td data-label="Total Price">$${order.totalPrice.toFixed(2)}</td>
            `;
            doneOrdersTableBody.appendChild(row);
        });
    }

    function populatePlaceOrderForm() {
        menuItemsContainer.innerHTML = '';
        for (const category in menu) {
            menu[category].forEach(item => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `order-item-${item.id}`;
                checkbox.name = 'menu-items';
                checkbox.value = item.id;

                const label = document.createElement('label');
                label.htmlFor = `order-item-${item.id}`;
                label.textContent = `${item.name} - $${item.price.toFixed(2)}`;

                const container = document.createElement('div');
                container.appendChild(checkbox);
                container.appendChild(label);
                menuItemsContainer.appendChild(container);
            });
        }
    }

    function populateEditItemDropdown() {
        editItemSelect.innerHTML = '<option value="">-- Choose an item --</option>';
        for (const category in menu) {
            menu[category].forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = `${item.name} (${category})`;
                editItemSelect.appendChild(option);
            });
        }
    }

    function refreshAdminMenuDisplays() {
        populatePlaceOrderForm();
        populateEditItemDropdown();
    }

    // --- EVENT HANDLERS ---

    // Handle order actions (Mark as Done, Cancel)
    pendingOrdersTableBody.addEventListener('click', (e) => {
        const orderId = e.target.dataset.id;
        if (!orderId) return;

        const order = orders.find(o => o.orderId === orderId);
        if (!order) return;

        if (e.target.classList.contains('mark-done-btn')) {
            order.status = 'done';
        } else if (e.target.classList.contains('cancel-order-btn')) {
            order.status = 'cancelled'; // This will make it disappear from both lists
        }

        renderOrders(); // Re-render all tables
    });

    // Handle "Add New Item"
    addItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('new-item-name').value;
        const price = parseFloat(document.getElementById('new-item-price').value);
        const category = document.getElementById('new-item-category').value.toLowerCase().replace(' ', '_');
        const description = document.getElementById('new-item-desc').value;

        const newItem = {
            id: Date.now(),
            name,
            price,
            description,
            image: `images/${name.toLowerCase().replace(/ /g, '-')}.jpg`,
            status: 'available'
        };

        if (!menu[category]) {
            menu[category] = [];
        }
        menu[category].push(newItem);

        console.log(`'${name}' added successfully!`);
        refreshAdminMenuDisplays();
        addItemForm.reset();
    });

    // Handle "Edit Existing Item"
    editItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const itemId = parseInt(editItemSelect.value);
        const newPrice = document.getElementById('edit-item-price').value;
        const newStatus = document.getElementById('edit-item-status').value;

        if (!itemId) {
            console.error('Please select an item to edit.');
            return;
        }

        let itemFound = false;
        for (const category in menu) {
            const item = menu[category].find(i => i.id === itemId);
            if (item) {
                if (newPrice) {
                    item.price = parseFloat(newPrice);
                }
                item.status = newStatus;
                itemFound = true;
                break;
            }
        }

        if (itemFound) {
            console.log('Item updated successfully!');
            refreshAdminMenuDisplays();
            editItemForm.reset();
        } else {
            console.error('Error: Item not found.');
        }
    });

    // Handle "Place a New Order"
    newOrderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const customerName = document.getElementById('customer-name').value;
        const deliveryTime = document.getElementById('delivery-time').value;
        const selectedCheckboxes = document.querySelectorAll('input[name="menu-items"]:checked');

        if (!customerName || !deliveryTime || selectedCheckboxes.length === 0) {
            console.error('Please fill out all fields and select at least one item.');
            return;
        }

        const allItems = [].concat(...Object.values(menu));
        const selectedItems = Array.from(selectedCheckboxes).map(cb => allItems.find(item => item.id === parseInt(cb.value)));
        const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

        const newOrder = {
            orderId: `ORD${Date.now()}`,
            customerName,
            items: selectedItems,
            deliveryTime: new Date(deliveryTime),
            totalPrice,
            status: 'pending', // New orders are pending by default
        };

        orders.push(newOrder);
        renderOrders();
        newOrderForm.reset();
    });

    // Handle Search
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            const filteredOrders = orders.filter(order =>
                order.orderId.toLowerCase().includes(searchTerm)
            );
            renderOrders(filteredOrders);
        } else {
            renderOrders();
        }
    });

    searchForm.addEventListener('reset', () => {
        renderOrders();
    });

    // --- INITIALIZATION ---
    renderOrders();
    refreshAdminMenuDisplays();
});
