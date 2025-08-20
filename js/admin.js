document.addEventListener('DOMContentLoaded', () => {
    // --- State ---
    let menu = {};
    let orders = [];

    // --- DOM Elements ---
    const pendingOrdersTableBody = document.querySelector('#pending-orders-table tbody');
    const doneOrdersTableBody = document.querySelector('#done-orders-table tbody');
    const menuItemsContainer = document.getElementById('menu-items-container');
    const newOrderForm = document.getElementById('new-order-form');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-id');
    const addItemForm = document.getElementById('add-item-form');
    const editItemForm = document.getElementById('edit-item-form');
    const editItemSelect = document.getElementById('select-item-edit');

    // --- API URL ---
    const API_URL = 'http://localhost:3000/api';

    // --- RENDER FUNCTIONS ---
    function renderOrders(ordersToRender = orders) {
        const pendingOrders = ordersToRender.filter(o => o.status === 'pending');
        const doneOrders = ordersToRender.filter(o => o.status === 'done');
        pendingOrders.sort((a, b) => new Date(a.deliveryTime) - new Date(b.deliveryTime));

        pendingOrdersTableBody.innerHTML = '';
        pendingOrders.forEach(order => {
            const allItems = [].concat(...Object.values(menu));
            const orderItems = order.itemIds.map(id => allItems.find(item => item.id === id));
            const itemsFormatted = orderItems.map(item => item ? item.name : 'Unknown Item').join(', ');

            const row = document.createElement('tr');
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

        doneOrdersTableBody.innerHTML = '';
        doneOrders.forEach(order => {
            const allItems = [].concat(...Object.values(menu));
            const orderItems = order.itemIds.map(id => allItems.find(item => item.id === id));
            const itemsFormatted = orderItems.map(item => item ? item.name : 'Unknown Item').join(', ');

            const row = document.createElement('tr');
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

    function populatePlaceOrderForm() { /* ... same ... */ }
    function populateEditItemDropdown() { /* ... same ... */ }
    function refreshAdminMenuDisplays() {
        populatePlaceOrderForm();
        populateEditItemDropdown();
    }
    // Re-pasting helpers
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

    // --- EVENT HANDLERS ---

    // Handle order actions (Mark as Done, Cancel)
    pendingOrdersTableBody.addEventListener('click', async (e) => {
        const orderId = e.target.dataset.id;
        if (!orderId) return;

        let newStatus = '';
        if (e.target.classList.contains('mark-done-btn')) newStatus = 'done';
        if (e.target.classList.contains('cancel-order-btn')) newStatus = 'cancelled';
        if (!newStatus) return;

        try {
            await fetch(`${API_URL}/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            await init(); // Re-fetch all data and re-render
        } catch (error) {
            console.error('Failed to update order status:', error);
        }
    });

    // Handle "Add New Item"
    addItemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('new-item-name').value;
        const price = parseFloat(document.getElementById('new-item-price').value);
        const category = document.getElementById('new-item-category').value.toLowerCase().replace(' ', '_');
        const description = document.getElementById('new-item-desc').value;

        const newItem = {
            id: Date.now(), name, price, description, category,
            image: `images/${name.toLowerCase().replace(/ /g, '-')}.jpg`,
            status: 'available'
        };

        try {
            await fetch(`${API_URL}/menu`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem),
            });
            await init(); // Re-fetch all data and re-render
            addItemForm.reset();
        } catch (error) {
            console.error('Failed to add new item:', error);
        }
    });

    // Handle "Edit Existing Item"
    editItemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const itemId = parseInt(editItemSelect.value);
        const newPrice = document.getElementById('edit-item-price').value;
        const newStatus = document.getElementById('edit-item-status').value;
        if (!itemId) return;

        const updates = { status: newStatus };
        if (newPrice) updates.price = parseFloat(newPrice);

        try {
            await fetch(`${API_URL}/menu/${itemId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            await init(); // Re-fetch all data and re-render
            editItemForm.reset();
        } catch (error) {
            console.error('Failed to edit item:', error);
        }
    });

    // Handle "Place a New Order"
    newOrderForm.addEventListener('submit', async (e) => {
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
            customerName,
            itemIds: selectedItems.map(i => i.id),
            deliveryTime: new Date(deliveryTime),
            totalPrice,
            // status is added server-side
        };

        try {
            await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrder),
            });
            await init(); // Re-fetch all data and re-render
            newOrderForm.reset();
        } catch (error) {
            console.error('Failed to place new order:', error);
        }
    });

    // Handle Search
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            const filteredOrders = orders.filter(order => order.orderId.toLowerCase().includes(searchTerm));
            renderOrders(filteredOrders);
        } else {
            renderOrders();
        }
    });
    searchForm.addEventListener('reset', () => renderOrders());

    // --- ASYNC INITIALIZATION ---
    async function init() {
        try {
            const [menuRes, ordersRes] = await Promise.all([
                fetch(`${API_URL}/menu`),
                fetch(`${API_URL}/orders`)
            ]);
            menu = await menuRes.json();
            orders = await ordersRes.json();
            renderOrders();
            refreshAdminMenuDisplays();
        } catch (error) {
            console.error("Failed to initialize admin panel:", error);
            alert("Could not connect to the server. Please make sure the backend server is running.");
        }
    }

    init();
});
