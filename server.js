const express = require('express');
const cors =require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'db.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/'))); // Serve static files from root

// Helper functions
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// --- READ ENDPOINTS ---
app.get('/api/menu', (req, res) => res.json(readDB().menu));
app.get('/api/orders', (req, res) => res.json(readDB().orders));
app.get('/api/recommendations', (req, res) => res.json(readDB().recommendations));


// --- WRITE ENDPOINTS ---

// Add a new menu item
app.post('/api/menu', (req, res) => {
    try {
        const db = readDB();
        const newItem = req.body;
        const category = newItem.category;

        if (!db.menu[category]) {
            db.menu[category] = [];
        }
        db.menu[category].push(newItem);
        writeDB(db);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: "Error writing to database", error });
    }
});

// Update a menu item (price/status)
app.patch('/api/menu/:id', (req, res) => {
    try {
        const db = readDB();
        const itemId = parseInt(req.params.id);
        const updates = req.body; // e.g., { price: 15.00, status: 'sold-out' }

        let itemFound = false;
        for (const category in db.menu) {
            const itemIndex = db.menu[category].findIndex(item => item.id === itemId);
            if (itemIndex !== -1) {
                // Merge updates into the item
                db.menu[category][itemIndex] = { ...db.menu[category][itemIndex], ...updates };
                itemFound = true;
                break;
            }
        }

        if (itemFound) {
            writeDB(db);
            res.status(200).json(db.menu);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: "Error writing to database", error });
    }
});

// Create a new order
app.post('/api/orders', (req, res) => {
    try {
        const db = readDB();
        const newOrder = req.body;

        // Add server-side details
        newOrder.orderId = `ORD${Date.now()}`;
        newOrder.status = 'pending';

        db.orders.push(newOrder);
        writeDB(db);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: "Error writing to database", error });
    }
});

// Update an order's status
app.patch('/api/orders/:id', (req, res) => {
    try {
        const db = readDB();
        const orderId = req.params.id;
        const { status } = req.body; // e.g., { status: 'done' }

        const orderIndex = db.orders.findIndex(order => order.orderId === orderId);

        if (orderIndex !== -1) {
            db.orders[orderIndex].status = status;
            writeDB(db);
            res.status(200).json(db.orders[orderIndex]);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: "Error writing to database", error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
