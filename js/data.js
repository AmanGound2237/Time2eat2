const menu = {
    beverages: [
        { id: 1, name: 'Tea', price: 10, image: 'images/tea.jpg', description: 'A warm cup of tea.' },
        { id: 2, name: 'Coffee', price: 20, image: 'images/coffee.jpg', description: 'A fresh cup of coffee.' },
        { id: 28, name: 'Soft Drink', price: 10, image: 'images/soft-drink.jpg', description: 'A refreshing soft drink.' },
        { id: 29, name: 'Tropicana', price: 20, image: 'images/tropicana.jpg', description: 'A carton of Tropicana juice.' },
        { id: 30, name: 'Cold Coffee', price: 50, image: 'images/cold-coffee.jpg', description: 'A chilled cold coffee.', status: 'sold-out' },
        { id: 40, name: 'Mineral Water', price: 10, image: 'images/water.jpg', description: 'A bottle of mineral water.' },
    ],
    "breakfast_and_snacks": [
        { id: 3, name: 'Medu Vada', price: 40, image: 'images/medu-vada.jpg', description: 'Crispy and savory medu vada.' },
        { id: 4, name: 'Idli Sambar', price: 40, image: 'images/idli-sambar.jpg', description: 'Soft idlis with hot sambar.' },
        { id: 5, name: 'Vada Pav', price: 15, image: 'images/vada-pav.jpg', description: 'The classic Mumbai street food.' },
        { id: 6, name: 'Poha', price: 40, image: 'images/poha.jpg', description: 'A light and healthy breakfast.' },
        { id: 7, name: 'Misal Pav', price: 60, image: 'images/misal-pav.jpg', description: 'Spicy and delicious misal with pav.' },
        { id: 8, name: 'Samosa Pav', price: 20, image: 'images/samosa-pav.jpg', description: 'A samosa stuffed in a pav.' },
        { id: 9, name: 'Sada Dosa', price: 50, image: 'images/sada-dosa.jpg', description: 'A plain, crispy dosa.' },
        { id: 10, name: 'Masala Dosa', price: 60, image: 'images/masala-dosa.jpg', description: 'Dosa with a spicy potato filling.' },
        { id: 11, name: 'Upma', price: 35, image: 'images/upma.jpg', description: 'A savory semolina dish.' },
        { id: 12, name: 'Shreera', price: 40, image: 'images/shreera.jpg', description: 'A sweet semolina dish.' },
        { id: 34, name: 'Bread Pakoda', price: 25, image: 'images/bread-pakoda.jpg', description: 'Fried bread fritters.' },
        { id: 42, name: 'Puri Bhaji', price: 50, image: 'images/puri-bhaji.jpg', description: 'Puffed bread with potato curry.' },
        { id: 43, name: 'Single Batata Vada', price: 12, image: 'images/batata-vada.jpg', description: 'A single potato fritter.' },
    ],
    "meals_and_thalis": [
        { id: 13, name: 'Dal Rice', price: 60, image: 'images/dal-rice.jpg', description: 'A simple and hearty meal.' },
        { id: 14, name: 'Veg Thali', price: 85, image: 'images/veg-thali.jpg', description: 'A complete vegetarian thali.' },
        { id: 15, name: 'Tomato Rice', price: 60, image: 'images/tomato-rice.jpg', description: 'Flavorful rice with tomatoes.' },
        { id: 16, name: 'Mushroom Rice', price: 70, image: 'images/mushroom-rice.jpg', description: 'Rice cooked with mushrooms.' },
        { id: 17, name: 'Bhaji Chapati', price: 50, image: 'images/bhaji-chapati.jpg', description: 'Vegetable curry with flatbread.' },
        { id: 27, name: 'Special Thali', price: 140, image: 'images/special-thali.jpg', description: 'A special, elaborate thali.' },
    ],
    "rice_and_noodles": [
        { id: 18, name: 'Veg Fried Rice', price: 75, image: 'images/veg-fried-rice.jpg', description: 'Classic fried rice with vegetables.' },
        { id: 19, name: 'Veg Noodles', price: 75, image: 'images/veg-noodles.jpg', description: 'Stir-fried noodles with vegetables.' },
        { id: 32, name: 'Egg Fried Rice', price: 75, image: 'images/egg-fried-rice.jpg', description: 'Fried rice with egg.' },
        { id: 41, name: 'Chicken Fried Rice', price: 100, image: 'images/chicken-fried-rice.jpg', description: 'Fried rice with chicken.' },
    ],
    "indo_chinese_and_rolls": [
        { id: 20, name: 'Veg Manchurian', price: 75, image: 'images/veg-manchurian.jpg', description: 'Vegetable balls in a tangy sauce.' },
        { id: 21, name: 'Veg Momos', price: 60, image: 'images/veg-momos.jpg', description: 'Steamed vegetable dumplings.' },
        { id: 22, name: 'Paneer Momos', price: 60, image: 'images/paneer-momos.jpg', description: 'Steamed paneer dumplings.' },
        { id: 23, name: 'Chicken Momos', price: 70, image: 'images/chicken-momos.jpg', description: 'Steamed chicken dumplings.' },
        { id: 35, name: 'Veg Manchurian Roll', price: 30, image: 'images/veg-manchurian-roll.jpg', description: 'A delicious manchurian roll.' },
    ],
    "parathas_and_biryani": [
        { id: 24, name: 'Egg Roast Paratha', price: 75, image: 'images/egg-roast-paratha.jpg', description: 'Paratha with an egg roast filling.' },
        { id: 25, name: 'Chicken Masala Paratha', price: 100, image: 'images/chicken-masala-paratha.jpg', description: 'Paratha with chicken masala filling.' },
        { id: 26, name: 'Chicken Biryani', price: 100, image: 'images/chicken-biryani.jpg', description: 'Aromatic chicken biryani.' },
    ],
    "eggs_and_omelets": [
        { id: 36, name: 'Single Omelet', price: 30, image: 'images/single-omelet.jpg', description: 'A simple single egg omelet.' },
        { id: 37, name: 'Double Omelet', price: 50, image: 'images/double-omelet.jpg', description: 'A hearty double egg omelet.' },
        { id: 38, name: 'Single Bhurji', price: 40, image: 'images/single-bhurji.jpg', description: 'Scrambled eggs with spices.' },
        { id: 39, name: 'Double Bhurji', price: 60, image: 'images/double-bhurji.jpg', description: 'A larger portion of scrambled eggs.' },
    ],
    "non_veg_snacks": [
        { id: 33, name: 'Chicken Lollipop', price: 30, image: 'images/chicken-lollipop.jpg', description: 'Spicy and succulent chicken lollipops.' },
    ],
    "extras": [
        { id: 31, name: 'Extra Pav', price: 5, image: 'images/pav.jpg', description: 'A single piece of pav bread.' },
    ],
};

const recommendations = {
    5: [1], // Vada Pav -> Tea
    8: [2], // Samosa Pav -> Coffee
    10: [2], // Masala Dosa -> Coffee
    14: [28], // Veg Thali -> Soft Drink
    26: [28], // Chicken Biryani -> Soft Drink
    33: [18], // Chicken Lollipop -> Veg Fried Rice
    42: [1], // Puri Bhaji -> Tea
    11: [2], // Upma -> Coffee
    3: [4],  // Medu Vada -> Idli Sambar
    13: [31], // Dal Rice -> Extra Pav
    18: [20], // Veg Fried Rice -> Veg Manchurian
    19: [21], // Veg Noodles -> Veg Momos
    41: [33], // Chicken Fried Rice -> Chicken Lollipop
    36: [31], // Single Omelet -> Extra Pav
    6: [1],   // Poha -> Tea
    27: [29], // Special Thali -> Tropicana
};

const bestSeller = { id: 14, name: 'Veg Thali', price: 85, image: 'images/veg-thali.jpg', description: 'Our most popular complete meal.' };

const orders = [
    {
        orderId: 'ORD126',
        customerName: 'Rohan Sharma',
        items: [menu.breakfast_and_snacks[7], menu.beverages[1]], // Masala Dosa, Coffee
        deliveryTime: '2024-08-20 09:30',
        totalPrice: 80,
        status: 'pending',
    },
    {
        orderId: 'ORD127',
        customerName: 'Priya Verma',
        items: [menu.meals_and_thalis[1], menu.beverages[3]], // Veg Thali, Tropicana
        deliveryTime: '2024-08-20 13:00',
        totalPrice: 105,
        status: 'pending',
    },
    {
        orderId: 'ORD128',
        customerName: 'Amit Patel',
        items: [menu.rice_and_noodles[3], menu.non_veg_snacks[0]], // Chicken Fried Rice, Chicken Lollipop
        deliveryTime: '2024-08-20 20:15',
        totalPrice: 130,
        status: 'pending',
    }
];
