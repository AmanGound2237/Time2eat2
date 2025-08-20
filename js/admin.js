document.addEventListener('DOMContentLoaded', () => {
    const ordersTableBody = document.querySelector('#orders-table tbody');

    if (orders && ordersTableBody) {
        orders.forEach(order => {
            const row = document.createElement('tr');

            const itemsFormatted = order.items.map(item => item.name).join(', ');

            row.innerHTML = `
                <td>${order.orderId}</td>
                <td>${order.customerName}</td>
                <td>${itemsFormatted}</td>
                <td>${new Date(order.deliveryTime).toLocaleString()}</td>
                <td>$${order.totalPrice.toFixed(2)}</td>
            `;

            ordersTableBody.appendChild(row);
        });
    }
});
