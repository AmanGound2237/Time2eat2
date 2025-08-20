document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const bestSellerContainer = document.querySelector('#best-seller .item-card-container');
    const menuContainer = document.getElementById('menu');

    // Recommendation Modal Elements
    const recModal = document.getElementById('recommendation-modal');
    const recModalCloseButton = recModal.querySelector('.close-button');
    const selectedItemNameSpan = document.getElementById('selected-item-name');
    const recommendationItemsContainer = document.getElementById('recommendation-items');

    // Cart Modal Elements
    const cartModal = document.getElementById('cart-modal');
    const cartModalCloseButton = cartModal.querySelector('.cart-close-button');
    const myCartBtn = document.getElementById('my-cart-btn');
    const cartCountSpan = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-modal');
    const cartTotalSpan = document.getElementById('cart-total-modal');

    // --- State ---
    let cart = [];

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
        card.dataset.itemId = item.id;
        card.dataset.testid = `item-card-${item.id}`; // Add test ID

        card.innerHTML = `
            <div class="item-card-image-container" style="cursor: pointer;">
                <img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'">
            </div>
            <h4>${item.name}</h4>
            <p>$${item.price.toFixed(2)}</p>
            <p>${item.description}</p>
            <button class="add-to-cart-btn" data-testid="add-to-cart-btn-${item.id}">Add to Cart</button>
        `;

        card.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(item);
        });

        card.querySelector('.item-card-image-container').addEventListener('click', () => openRecModal(item));

        return card;
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

    // --- RECOMMENDATION MODAL LOGIC ---

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

    // --- EVENT LISTENERS ---

    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-from-cart-btn')) {
            const itemId = parseInt(e.target.dataset.itemId);
            removeFromCart(itemId);
        }
    });

    myCartBtn.addEventListener('click', () => cartModal.style.display = 'block');
    cartModalCloseButton.addEventListener('click', () => cartModal.style.display = 'none');
    recModalCloseButton.addEventListener('click', () => recModal.style.display = 'none');

    window.addEventListener('click', (e) => {
        if (e.target === recModal) recModal.style.display = 'none';
        if (e.target === cartModal) cartModal.style.display = 'none';
    });

    // --- INITIALIZATION ---

    if (bestSeller) {
        const bestSellerCard = createItemCard(bestSeller);
        bestSellerContainer.appendChild(bestSellerCard);
    }

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

    renderCart();
});
