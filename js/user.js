document.addEventListener('DOMContentLoaded', () => {
    const bestSellerContainer = document.querySelector('#best-seller .item-card-container');
    const menuContainer = document.getElementById('menu');
    const modal = document.getElementById('recommendation-modal');
    const modalCloseButton = document.querySelector('.close-button');
    const selectedItemNameSpan = document.getElementById('selected-item-name');
    const recommendationItemsContainer = document.getElementById('recommendation-items');

    // Function to create an item card
    function createItemCard(item) {
        const card = document.createElement('div');
        card.classList.add('item-card');
        card.dataset.itemId = item.id;

        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'">
            <h4>${item.name}</h4>
            <p>$${item.price.toFixed(2)}</p>
            <p>${item.description}</p>
        `;

        card.addEventListener('click', () => openModal(item));
        return card;
    }

    // Render Best Seller
    if (bestSeller) {
        const bestSellerCard = createItemCard(bestSeller);
        // We remove the event listener for the best seller card in its own section
        bestSellerCard.removeEventListener('click', () => openModal(bestSeller));
        bestSellerCard.addEventListener('click', () => openModal(bestSeller));
        bestSellerContainer.appendChild(bestSellerCard);
    }

    // Render Menu
    for (const category in menu) {
        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
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
        recommendationItemsContainer.innerHTML = ''; // Clear previous recommendations

        const recommendedIds = recommendations[item.id] || [];
        if (recommendedIds.length > 0) {
            const allItems = [].concat(...Object.values(menu));
            const recommendedItems = allItems.filter(i => recommendedIds.includes(i.id));

            recommendedItems.forEach(recItem => {
                const recCard = createItemCard(recItem);
                // Avoid infinite loop by not opening modal from modal
                recCard.removeEventListener('click', () => openModal(recItem));
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
});
