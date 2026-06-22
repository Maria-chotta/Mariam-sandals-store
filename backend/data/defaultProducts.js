const defaultProducts = [
  {
    name: "Luxury beach sandal",
    price: 15000,
    image: "images/sandal.jpg",
    description: "Luxury and comfortable",
    category: "women",
    sizes: ["36", "37", "38", "39", "40", "41", "42"]
  },
  {
    name: "Classic Leather Sandal",
    price: 15000,
    image: "images/sandal2.jpg",
    description: "Leather and comfortable",
    category: "women",
    sizes: ["36", "37", "38", "39", "40", "41", "42"]
  },
  {
    name: "Open Leather Sandal",
    price: 15000,
    image: "images/sandal3.jpg",
    description: "Leather and comfortable",
    category: "women",
    sizes: ["36", "37", "38", "39", "40", "41", "42"]
  },
  {
    name: "Royal classic Sandal",
    price: 15000,
    image: "images/sandal4.jpg",
    description: "Royal and comfortable",
    category: "women",
    sizes: ["36", "37", "38", "39", "40", "41", "42"]
  },
  {
    name: "Clean white Sandal",
    price: 15000,
    image: "images/sandal5.jpg",
    description: "Clean and comfortable",
    category: "women",
    sizes: ["36", "37", "38", "39", "40", "41", "42"]
  },
  {
    name: "comfort urban Sandal",
    price: 15000,
    image: "images/sandal6.jpg",
    description: "Comfortable and urban",
    category: "women",
    sizes: ["36", "37", "38", "39", "40", "41", "42"]
  },
  {
    name: "Leather Sandal",
    price: 15000,
    image: "images/sandal7.jpg",
    description: "Leather and comfortable",
    category: "women",
    sizes: ["36", "37", "38", "39", "40", "41", "42"]
  },
  {
    name: "comfort Leather Sandal",
    price: 15000,
    image: "images/sandal8.jpg",
    description: "Leather and comfortable",
    category: "women",
    sizes: ["36", "37", "38", "39", "40", "41", "42"]
  },
  {
    name: "Elegant leather Sandal",
    price: 15000,
    image: "images/sandal9.jpg",
    description: "Elegant and comfortable",
    category: "women",
    sizes: ["36", "37", "38", "39", "40", "41", "42"]
  },
  {
    name: "beach Leather Sandal",
    price: 15000,
    image: "images/sandal10.jpg",
    description: "Leather and comfortable",
    category: "women",
    sizes: ["36", "37", "38", "39", "40", "41", "42"]
  },
  {
    name: "Leather Sandal",
    price: 15000,
    image: "images/sandal11.jpg",
    description: "Leather and comfortable",
    category: "women",
    sizes: ["36", "37", "38", "39", "40", "41", "42"]
  },
  {
    name: "Urban comfortable Sandal",
    price: 15000,
    image: "images/sandal12.jpg",
    description: "Urban and comfortable",
    category: "women",
    sizes: ["36", "37", "38", "39", "40", "41", "42"]
  },
  {
    name: "Black Leather Sandal",
    price: 15000,
    image: "images/sandal13.jpg",
    description: "Black Leather and comfortable",
    category: "women",
    sizes: ["36", "37", "38", "39", "40", "41", "42"]
  },
  {
    name: "luxury comfort Sandal",
    price: 15000,
    image: "images/sandal14.jpg",
    description: "Leather and comfortable",
    category: "women",
    sizes: ["36", "37", "38", "39", "40", "41", "42"]
  },
  {
    name: "Classic Leather Sandal",
    price: 15000,
    image: "images/sandal15.jpg",
    description: "Classic Leather and comfortable",
    category: "women",
    sizes: ["36", "37", "38", "39", "40", "41", "42"]
  },
  {
    name: "Elegant Leather Sandal",
    price: 15000,
    image: "images/sandal16.jpg",
    description: "Elegant Leather and comfortable",
    category: "women",
    sizes: ["36", "37", "38", "39", "40", "41", "42"]
  },
  {
    name: "Brown Leather Sandal",
    price: 15000,
    image: "images/sandalM1.jpg",
    description: "Leather and comfortable",
    category: "men",
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50"]
  },
  {
    name: "Royal classic sandal",
    price: 15000,
    image: "images/sandalM2.jpg",
    description: "Leather and comfortable",
    category: "men",
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50"]
  },
  {
    name: "Luxury beach sandal",
    price: 15000,
    image: "images/sandalM3.jpg",
    description: "Leather and comfortable",
    category: "men",
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50"]
  },
  {
    name: "Premium men sandal",
    price: 15000,
    image: "images/sandalM4.jpg",
    description: "Leather and comfortable",
    category: "men",
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50"]
  },
  {
    name: "Royal classic sandal",
    price: 15000,
    image: "images/sandalM5.jpg",
    description: "Leather and comfortable",
    category: "men",
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50"]
  },
  {
    name: "Urban comfort sandal",
    price: 15000,
    image: "images/sandalM6.jpg",
    description: "Leather and comfortable",
    category: "men",
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50"]
  },
  {
    name: "Open Leather Sandal",
    price: 15000,
    image: "images/sandalM7.jpg",
    description: "Leather and comfortable",
    category: "men",
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50"]
  },
  {
    name: "Elegant black sandal",
    price: 15000,
    image: "images/sandalM8.jpg",
    description: "Leather and comfortable",
    category: "men",
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50"]
  }
];

module.exports = defaultProducts;
