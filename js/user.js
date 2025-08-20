document.addEventListener('DOMContentLoaded', () => {
    // --- State ---
    let menu = {};
    let recommendations = {};
    let cart = [];

    // --- DOM Elements ---
    const bestSellerContainer = document.querySelector('#best-seller .item-card-container');
    const menuContainer = document.getElementById('menu');
    const recModal = document.getElementById('recommendation-modal');
    const recModalCloseButton = recModal.querySelector('.close-button');
    const selectedItemNameSpan = document.getElementById('selected-item-name');
    const recommendationItemsContainer = document.getElementById('recommendation-items');
    const cartModal = document.getElementById('cart-modal');
    const cartModalCloseButton = cartModal.querySelector('.cart-close-button');
    const myCartBtn = document.getElementById('my-cart-btn');
    const cartCountSpan = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-modal');
    const cartTotalSpan = document.getElementById('cart-total-modal');
    const checkoutBtn = document.getElementById('checkout-btn');

    // --- RENDER FUNCTIONS ---
    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let totalItems = 0;
        cart.forEach(cartItem => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <span>${cartItem.name} x ${cartItem.quantity}</span>
                <span>$${(cartItem.price * cartItem.quantity).toFixed(2)}</span>
                <button class="remove-from-cart-btn" data-item-id="${cartItem.id}">Remove</button>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += cartItem.price * cartItem.quantity;
            totalItems += cartItem.quantity;
        });
        cartTotalSpan.textContent = total.toFixed(2);
        cartCountSpan.textContent = totalItems;
    }

    function createItemCard(item) {
        const card = document.createElement('div');
        card.classList.add('item-card');
        if (item.status === 'sold-out') {
            card.classList.add('sold-out');
        }
        card.dataset.itemId = item.id;
        card.dataset.testid = `item-card-${item.id}`;
        card.innerHTML = `
            <div class="item-card-image-container" style="cursor: pointer;">
                <img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'">
            </div>
            <h4>${item.name}</h4>
            <p>$${item.price.toFixed(2)}</p>
            <p>${item.description}</p>
            <button class="add-to-cart-btn" data-testid="add-to-cart-btn-${item.id}" ${item.status === 'sold-out' ? 'disabled' : ''}>
                ${item.status === 'sold-out' ? 'Sold Out' : 'Add to Cart'}
            </button>
        `;
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        if (item.status !== 'sold-out') {
            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                addToCart(item);
            });
        }
        card.querySelector('.item-card-image-container').addEventListener('click', () => openRecModal(item));
        return card;
    }

    function openRecModal(item) {
        selectedItemNameSpan.textContent = item.name;
        recommendationItemsContainer.innerHTML = '';
        const recommendedIds = recommendations[item.id] || [];
        if (recommendedIds.length > 0) {
            const allItems = [].concat(...Object.values(menu));
            const recommendedItems = allItems.filter(i => recommendedIds.includes(i.id));
            recommendedItems.forEach(recItem => {
                const recCard = createItemCard(recItem);
                recCard.querySelector('.item-card-image-container').removeEventListener('click', () => openRecModal(recItem));
                recommendationItemsContainer.appendChild(recCard);
            });
        } else {
            recommendationItemsContainer.innerHTML = '<p>No recommendations for this item.</p>';
        }
        recModal.style.display = 'block';
    }

    // --- CART LOGIC ---
    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        renderCart();
    }
    function removeFromCart(itemId) {
        const itemIndex = cart.findIndex(cartItem => cartItem.id === itemId);
        if (itemIndex > -1) {
            const item = cart[itemIndex];
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart.splice(itemIndex, 1);
            }
        }
        renderCart();
    }

    // --- EVENT LISTENERS ---
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-from-cart-btn')) {
            const itemId = parseInt(e.target.dataset.id);
            removeFromCart(itemId);
        }
    });
    myCartBtn.addEventListener('click', () => cartModal.style.display = 'block');
    cartModalCloseButton.addEventListener('click', () => cartModal.style.display = 'none');
    checkoutBtn.addEventListener('click', async () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        const customerName = prompt("Please enter your name for the order:");
        if (!customerName) {
            alert("Name is required to place an order.");
            return;
        }

        const newOrder = {
            customerName,
            itemIds: cart.map(item => item.id),
            totalPrice: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            deliveryTime: new Date(Date.now() + 30 * 60 * 1000), // Default 30 mins from now
        };

        try {
            const response = await fetch('http://localhost:3000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrder),
            });
            if (response.ok) {
                alert(`Thank you, ${customerName}! Your order has been placed.`);
                cart = [];
                renderCart();
                cartModal.style.display = 'none';
            } else {
                throw new Error('Failed to place order.');
            }
        } catch (error) {
            console.error("Checkout failed:", error);
            alert("Sorry, there was an error placing your order.");
        }
    });
    recModalCloseButton.addEventListener('click', () => recModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === recModal) recModal.style.display = 'none';
        if (e.target === cartModal) cartModal.style.display = 'none';
    });

    // --- ASYNC INITIALIZATION ---
    async function init() {
        try {
            // Fetch initial data from the backend
            const [menuRes, recRes] = await Promise.all([
                fetch('http://localhost:3000/api/menu'),
                fetch('http://localhost:3000/api/recommendations')
            ]);
            menu = await menuRes.json();
            recommendations = await recRes.json();

            // Render the menu
            for (const category in menu) {
                const categoryTitle = document.createElement('h3');
                categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
                menuContainer.appendChild(categoryTitle);
                const itemContainer = document.createElement('div');
                itemContainer.classList.add('item-card-container');
                menu[category].forEach(item => {
                    const itemCard = createItemCard(item);
                    itemContainer.appendChild(itemCard);
                });
                menuContainer.appendChild(itemContainer);
            }
            // Best seller can be a future feature driven by backend logic
            bestSellerContainer.style.display = 'none';

            renderCart();

        } catch (error) {
            console.error("Failed to initialize user panel:", error);
            alert("Could not connect to the server. Please make sure the backend server is running.");
        }
    }

    init();
});
