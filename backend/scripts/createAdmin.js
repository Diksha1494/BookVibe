require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/users/user.model");

const ADMIN_USER = {
  username: "admin",
  email: "admin@gmail.com",
  password: "12345",
  role: "admin",
};

const run = async () => {
  if (!process.env.DB_URL) {
    throw new Error("DB_URL is not set in your backend .env file.");
  }

  await mongoose.connect(process.env.DB_URL);
  console.log("Connected to MongoDB Atlas");

  const existingAdmin = await User.findOne({
    $or: [{ email: ADMIN_USER.email.toLowerCase() }, { username: ADMIN_USER.username }],
  });

  if (existingAdmin) {
    console.log("Admin already exists.");
    console.log({
      id: existingAdmin._id.toString(),
      username: existingAdmin.username,
      email: existingAdmin.email,
      role: existingAdmin.role,
    });
    return;
  }

  const admin = await User.create({
    username: ADMIN_USER.username,
    email: ADMIN_USER.email.toLowerCase(),
    password: ADMIN_USER.password,
    role: ADMIN_USER.role,
  });

  console.log("Admin created successfully.");
  console.log({
    id: admin._id.toString(),
    username: admin.username,
    email: admin.email,
    role: admin.role,
    hashedPassword: admin.password,
  });
};

run()
  .catch((error) => {
    console.error("Failed to create admin:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  });
