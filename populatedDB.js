#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Product = require("./models/product");
const Category = require("./models/category");

const products = [];
const categories = [];

const mongoose = require("mongoose");
const { proppatch } = require("./app");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createProducts();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, description) {
  const categorydetail = { name: name, description: description };

  const category = new Category(categorydetail);

  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function productCreate(index, name, description, price, category, stock) {
  const productdetail = {
    name: name,
    description: description,
    price: price,
    category: category,
    stock: stock,
  };

  const product = new Product(productdetail);
  await product.save();
  products[index] = product;
  console.log(`Added product: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(
      0,
      "Electronics",
      "Dive into the world of cutting-edge technology with our Electronics category. From powerful laptops and smartphones to wireless earbuds and gaming consoles, discover a range of devices designed to enhance your digital experience. Stay connected, entertained, and productive with the latest innovations in electronics."
    ),
    categoryCreate(
      1,
      "Fashion",
      "Unleash your style and express yourself through our Fashion category. Whether you're looking for trendy sneakers, luxury handbags, chic sunglasses, elegant wristwatches, or fashionable dresses, we have curated a collection that blends comfort and sophistication. Elevate your wardrobe and make a statement with our carefully selected fashion items."
    ),
    categoryCreate(
      2,
      "Home and Kitchen",
      "Transform your living space into a haven of comfort and efficiency with our Home and Kitchen category. Explore smart appliances like coffee makers and robot vacuums for hassle-free living. Upgrade your cookware, enhance home comfort with smart thermostats, and create a cozy bedroom with our luxurious bedding sets. Elevate your home life with functional and stylish essentials."
    ),
    categoryCreate(
      3,
      "Sports and Outdoors",
      "Embrace an active lifestyle with our Sports and Outdoors category. Whether you're a runner, camper, fitness enthusiast, biker, or outdoor cook, we have the gear you need. Discover quality running shoes, spacious camping tents, advanced fitness trackers, aerodynamic biking helmets, and portable grills for your next adventure. Gear up and conquer the great outdoors with confidence."
    ),
    categoryCreate(
      4,
      "Books and Stationery",
      "Immerse yourself in the world of knowledge and creativity with our Books and Stationery category. From gripping novels to inspirational self-help books, explore the diverse literary offerings. Enhance your writing experience with beautifully designed notebooks and high-quality pens. For the artists, indulge in our comprehensive art supplies kit. Feed your mind and nurture your creativity with our curated selection."
    ),
  ]);
}

async function createProducts() {
  console.log("Adding products");
  await Promise.all([
    productCreate(
      0,
      "TechBook Pro",
      "A powerful laptop with high-end specifications for seamless multitasking.",
      1200,
      categories[0],
      10
    ),
    productCreate(
      1,
      "SmartConnect X",
      "Cutting-edge smartphone with a stunning display and advanced camera features.",
      800,
      categories[0],
      15
    ),
    productCreate(
      2,
      "SonicBlast Pods",
      "True wireless earbuds with noise-canceling technology for an immersive audio experience.",
      150,
      categories[0],
      20
    ),
    productCreate(
      3,
      "HealthGuard Elite",
      "Stylish smartwatch with health monitoring features and customizable watch faces.",
      250,
      categories[0],
      12
    ),
    productCreate(
      4,
      "GameMaster Pro",
      "High-performance gaming console with 4K graphics and an extensive game library.",
      500,
      categories[0],
      8
    ),
    productCreate(
      5,
      "CapturePro 9000",
      "Professional-grade camera with advanced photography and video capabilities.",
      1500,
      categories[0],
      5
    ),
    productCreate(
      6,
      "UrbanFlex 2.0",
      "Trendy and comfortable sneakers designed for urban lifestyles.",
      80,
      categories[1],
      20
    ),
    productCreate(
      7,
      "Elegance Signature Tote",
      "Luxury handbag crafted with premium materials and timeless design.",
      500,
      categories[1],
      8
    ),
    productCreate(
      8,
      "SunShield Aviator",
      "Stylish aviator sunglasses with UV protection for a chic look.",
      120,
      categories[1],
      15
    ),
    productCreate(
      9,
      "Timeless Elegance",
      "Elegant wristwatch with a classic design and reliable timekeeping.",
      200,
      categories[1],
      10
    ),
    productCreate(
      10,
      "Weekend Chic Maxi",
      "Comfortable and fashionable maxi dress perfect for casual occasions.",
      60,
      categories[1],
      18
    ),
    productCreate(
      11,
      "BrewMaster Deluxe",
      "State-of-the-art coffee maker with programmable settings for the perfect brew.",
      100,
      categories[2],
      12
    ),
    productCreate(
      12,
      "CleanSweep 5000",
      "Smart robot vacuum for hands-free cleaning with advanced navigation.",
      300,
      categories[2],
      5
    ),
    productCreate(
      13,
      "Chef's Choice Pro",
      "Premium cookware set with non-stick surfaces and durable construction.",
      150,
      categories[2],
      15
    ),
    productCreate(
      14,
      "EcoComfort Smart Thermostat",
      "Energy-efficient smart thermostat with intuitive controls for home comfort.",
      120,
      categories[2],
      10
    ),
    productCreate(
      15,
      "DreamCloud Bliss Collection",
      "Luxurious bedding set for a comfortable and stylish bedroom.",
      200,
      categories[2],
      8
    ),
    productCreate(
      16,
      "SpeedRunner 3000",
      "Lightweight running shoes with superior cushioning for optimal performance.",
      120,
      categories[3],
      18
    ),
    productCreate(
      17,
      "Adventure Dome XL",
      "Spacious and durable camping tent for outdoor enthusiasts.",
      150,
      categories[3],
      10
    ),
    productCreate(
      18,
      "FitSync Pro",
      "Advanced fitness tracker with heart rate monitoring and GPS tracking.",
      80,
      categories[3],
      25
    ),
    productCreate(
      19,
      "AeroGuard 360",
      "Aerodynamic biking helmet with enhanced safety features.",
      50,
      categories[3],
      15
    ),
    productCreate(
      20,
      "GrillMaster Portable Pro",
      "Compact and efficient portable grill for on-the-go outdoor cooking.",
      70,
      categories[3],
      20
    ),
    productCreate(
      21,
      "Echoes of Eternity",
      "Gripping novel exploring the themes of love and time travel.",
      20,
      categories[4],
      25
    ),
    productCreate(
      22,
      "Creative Minds Collection",
      "Set of beautifully designed notebooks for creative thinkers.",
      15,
      categories[4],
      30
    ),
    productCreate(
      23,
      "Precision Ink Pens",
      "High-quality pens for smooth and precise writing.",
      10,
      categories[4],
      40
    ),
    productCreate(
      24,
      "Culinary Delights",
      "Cookbook featuring a variety of delicious and easy-to-make recipes.",
      25,
      categories[4],
      15
    ),
    productCreate(
      25,
      "Mindful Living Guide",
      "Inspirational self-help book promoting a mindful and fulfilling life.",
      18,
      categories[4],
      20
    ),
    productCreate(
      26,
      "Artistry Essentials Kit",
      "Comprehensive art supplies kit for aspiring artists.",
      30,
      categories[4],
      12
    ),
  ]);
}
