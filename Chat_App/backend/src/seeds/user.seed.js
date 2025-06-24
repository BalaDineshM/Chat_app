import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

config();

const seedUsers = [
     
  {
    email: "diya@gmail.com",
    fullName: "Diya",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    email: "heidi@gmail.com",
    fullName: "Heidi",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    email: "hemewari@gmail.com",
    fullName: "Hemewari",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    email: "nobita@gmail.com",
    fullName: "Nobita",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    email: "dora@gmail.com",
    fullName: "Dora",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    email: "bheem@gmail.com",
    fullName: "Bheem",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    email: "jerry@gmail.com",
    fullName: "Jerry",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    email: "doremon@gmail.com.com",
    fullName: "Doremon",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/8.jpg",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Call the function
seedDatabase();