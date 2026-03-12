const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ CORS Middleware - must come before any route
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));

// ✅ JSON body parser
app.use(express.json());

// ✅ Routes
const aiRoutes = require('./routes/ai');
const bookRoutes = require('./src/books/book.route');
const orderRoutes = require('./src/orders/order.route');
const userRoutes = require('./src/users/user.route');
const adminRoutes = require('./src/stats/admin.stats');

// ✅ Use routes
app.use('/api/ai', aiRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes); 
app.use('/api/auth', userRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Root route
app.get('/', (req, res) => {
  res.send('Book Store Server is running!');
});

// ✅ MongoDB Connection
async function main() {
  await mongoose.connect(process.env.DB_URL);
}
main()
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.log("MongoDB connection error:", err));

// ✅ Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
