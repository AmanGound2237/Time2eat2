document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const bestSellerContainer = document.querySelector('#best-seller .item-card-container');
    const menuContainer = document.getElementById('menu');
    const modal = document.getElementById('recommendation-modal');
    const modalCloseButton = document.querySelector('.close-button');
    const selectedItemNameSpan = document.getElementById('selected-item-name');
    const recommendationItemsContainer = document.getElementById('recommendation-items');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');

    // --- State ---
    let cart = [];

    // --- Functions ---

    // Function to render the cart
    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach(cartItem => {
            const itemElement = document.createElement('div');
            itemElement.textContent = `${cartItem.name} x ${cartItem.quantity} - $${(cartItem.price * cartItem.quantity).toFixed(2)}`;
            cartItemsContainer.appendChild(itemElement);
            total += cartItem.price * cartItem.quantity;
        });
        cartTotalSpan.textContent = total.toFixed(2);
    }

    // Function to add an item to the cart
    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        renderCart();
    }

    // Function to create an item card
    function createItemCard(item) {
        const card = document.createElement('div');
        card.classList.add('item-card');
        card.dataset.itemId = item.id;

        card.innerHTML = `
            <div class="item-card-image-container">
                <img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'">
            </div>
            <h4>${item.name}</h4>
            <p>$${item.price.toFixed(2)}</p>
            <p>${item.description}</p>
            <button class="add-to-cart-btn">Add to Cart</button>
        `;

        // Add to cart button event listener
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent modal from opening when button is clicked
            addToCart(item);
        });

        // Card click event listener for recommendations
        const imageContainer = card.querySelector('.item-card-image-container');
        imageContainer.addEventListener('click', () => openModal(item));

        return card;
    }

    // Render Best Seller
    if (bestSeller) {
        const bestSellerCard = createItemCard(bestSeller);
        bestSellerContainer.appendChild(bestSellerCard);
    }

    // Render Menu
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

    // Open Modal with recommendations
    function openModal(item) {
        selectedItemNameSpan.textContent = item.name;
        recommendationItemsContainer.innerHTML = '';

        const recommendedIds = recommendations[item.id] || [];
        if (recommendedIds.length > 0) {
            const allItems = [].concat(...Object.values(menu));
            const recommendedItems = allItems.filter(i => recommendedIds.includes(i.id));

            recommendedItems.forEach(recItem => {
                const recCard = createItemCard(recItem);
                // Avoid infinite loop by not opening modal from modal
                recCard.querySelector('.item-card-image-container').removeEventListener('click', () => openModal(recItem));
                recommendationItemsContainer.appendChild(recCard);
            });
        } else {
            recommendationItemsContainer.innerHTML = '<p>No recommendations for this item.</p>';
        }

        modal.style.display = 'block';
    }

    // Close Modal
    modalCloseButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Initial Render
    renderCart();
});
