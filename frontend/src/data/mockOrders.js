export const mockOrders = [
  {
    id: "ANP-8472",
    userId: "mock-user",
    createdAt: "2024-10-24",
    status: "delivered",
    expectedDelivery: null,
    items: [
      {
        productId: "dal-makhani-premix",
        name: "Dal Makhani Premix",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=150&q=80",
        quantity: 1,
        price: 249
      },
      {
        productId: "methi-thepla-mix",
        name: "Methi Thepla Mix",
        image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=150&q=80",
        quantity: 2,
        price: 150
      },
      {
        productId: "kadhi-pakoda-mix",
        name: "Kadhi Pakoda Mix",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=150&q=80",
        quantity: 1,
        price: 199
      },
      {
        productId: "rajma-masala-mix",
        name: "Rajma Masala Mix",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=150&q=80",
        quantity: 1,
        price: 92
      }
    ],
    total: 840
  },
  {
    id: "ANP-8511",
    userId: "mock-user",
    createdAt: "2024-10-28",
    status: "in-transit",
    expectedDelivery: "Expected today by 8 PM",
    items: [
      {
        productId: "paneer-butter-masala-premix",
        name: "Paneer Butter Masala Premix",
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?auto=format&fit=crop&w=150&q=80",
        quantity: 1,
        price: 350
      }
    ],
    total: 350
  },
  {
    id: "ANP-8105",
    userId: "mock-user",
    createdAt: "2024-09-15",
    status: "delivered",
    expectedDelivery: null,
    items: [
      {
        productId: "complete-thali-meal-pack",
        name: "Complete Thali Meal Pack",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=150&q=80",
        quantity: 1,
        price: 550
      }
    ],
    total: 550
  }
];
