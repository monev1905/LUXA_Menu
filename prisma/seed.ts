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

  await prisma.venue.create({
    data: {
      name: 'Shisha Lounge',
      address: 'str "Musala" 2, Varna',
      phone: '+359 888 123 456',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2908.3121788379667!2d27.91146187701693!3d43.20294117112709!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40a453f43df5de81%3A0x2f821627d3671dac!2z0JLQsNGA0L3QsCDQptC10L3RgtGK0YDQntC00LXRgdC-0YEsINGD0LsuIOKAntCc0YPRgdCw0LvQsOKAnCAyLCA5MDAwINCS0LDRgNC90LA!5e0!3m2!1sbg!2sbg!4v1751661707375!5m2!1sbg!2sbg',
    }
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
