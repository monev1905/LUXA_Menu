import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete existing data
  await prisma.drink.deleteMany();
  await prisma.shishaFlavor.deleteMany();

  // Seed drinks
  await prisma.drink.createMany({
    data: [
      { name: 'Buzz Lemonade', price: 5.0, category: 'drinks', type: 'lemonades', isActive: true },
      { name: 'Classic Lemonade', price: 4.5, category: 'drinks', type: 'lemonades', isActive: true },
      { name: 'Whiskey', price: 7.0, category: 'drinks', type: 'alcohol', isActive: true },
      { name: 'Beer', price: 4.0, category: 'drinks', type: 'alcohol', isActive: true },
      { name: 'Strawberry Milkshake', price: 5.5, category: 'drinks', type: 'smoothies', isActive: true },
      { name: 'Banana Smoothie', price: 5.0, category: 'drinks', type: 'smoothies', isActive: true },
      { name: 'Coca Cola', price: 3.0, category: 'drinks', type: 'softdrinks', isActive: true },
      { name: 'Fanta', price: 3.0, category: 'drinks', type: 'softdrinks', isActive: true },
      { name: 'Sprite', price: 3.0, category: 'drinks', type: 'softdrinks', isActive: true },
      { name: 'Water', price: 2.0, category: 'drinks', type: 'softdrinks', isActive: true },
      { name: 'Salted Peanuts', price: 2.5, category: 'drinks', type: 'nuts', isActive: true },
      { name: 'Coffee', price: 2.5, category: 'drinks', type: 'hotdrinks', isActive: true },
      { name: 'Cappuccino', price: 3.0, category: 'drinks', type: 'hotdrinks', isActive: true },
    ],
  });

  // Seed shisha flavors
  await prisma.shishaFlavor.createMany({
    data: [
      { name: 'Must Have - Raspberry', price: 15.0, category: 'shisha', brand: 'musthave', type: 'blond', isActive: true },
      { name: 'Darkside - Wildberry', price: 16.0, category: 'shisha', brand: 'darkside', type: 'black', isActive: true },
      { name: 'Blackburn - Lemon Pie', price: 15.0, category: 'shisha', brand: 'blackburn', type: 'black', isActive: true },
      { name: 'Deus - Mint', price: 15.0, category: 'shisha', brand: 'deus', type: 'blond', isActive: true },
    ],
  });

  console.log('Seed data created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
