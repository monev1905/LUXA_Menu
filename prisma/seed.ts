import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete existing data in correct order (respecting foreign keys)
  await prisma.shishaFlavors.deleteMany();
  await prisma.shishaBrands.deleteMany();
  await prisma.shishaSelections.deleteMany();
  await prisma.drinks.deleteMany();
  await prisma.venues.deleteMany();

  // Seed venue
  await prisma.venues.create({
    data: {
      id: 'venue-1',
      name: 'Shisha Lounge',
      address: 'str "Musala" 2, Varna',
      phone: '+359 888 123 456',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2908.3121788379667!2d27.91146187701693!3d43.20294117112709!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40a453f43df5de81%3A0x2f821627d3671dac!2z0JLQsNGA0L3QsCDQptC10L3RgtGK0YDQntC00LXRgdC-0YEsINGD0LsuIOKAnNCc0YPRgdCw0LvQsOKAnCAyLCA5MDAwINCS0LDRgNC90LA!5e0!3m2!1sbg!2sbg!4v1751661707375!5m2!1sbg!2sbg',
      subtitle: 'Premium Shisha Experience'
    }
  });

  // Seed shisha selections
  const classicSelection = await prisma.shishaSelections.create({
    data: {
      Selection: 'Classic',
      Price: 24.99
    }
  });

  const finestSelection = await prisma.shishaSelections.create({
    data: {
      Selection: 'Finest',
      Price: 27.99
    }
  });

  const exclusiveSelection = await prisma.shishaSelections.create({
    data: {
      Selection: 'Exclusive',
      Price: 34.99
    }
  });

  // Seed shisha brands
  const darksideBrand = await prisma.shishaBrands.create({
    data: {
      Brand: 'Darkside',
      Selection_id: classicSelection.id,
      Type: 'dark',
      logoUrl: 'https://example.com/darkside-logo.png'
    }
  });

  const musthaveBrand = await prisma.shishaBrands.create({
    data: {
      Brand: 'Musthave',
      Selection_id: finestSelection.id,
      Type: 'dark',
      logoUrl: 'https://example.com/musthave-logo.png'
    }
  });

  const boncheBrand = await prisma.shishaBrands.create({
    data: {
      Brand: 'Bonche',
      Selection_id: exclusiveSelection.id,
      Type: 'cigar',
      logoUrl: 'https://example.com/bonche-logo.png'
    }
  });

  // Seed shisha flavors
  await prisma.shishaFlavors.create({
    data: {
      name: 'Pistachio',
      description: 'Rich and nutty flavor',
      imageUrl: 'https://example.com/pistachio.jpg',
      brand_id: darksideBrand.id
    }
  });

  await prisma.shishaFlavors.create({
    data: {
      name: 'Coconut',
      description: 'Tropical coconut taste',
      imageUrl: 'https://example.com/coconut.jpg',
      brand_id: darksideBrand.id
    }
  });

  await prisma.shishaFlavors.create({
    data: {
      name: 'Wild Strawberry',
      description: 'Sweet and fruity',
      imageUrl: 'https://example.com/strawberry.jpg',
      brand_id: musthaveBrand.id
    }
  });

  await prisma.shishaFlavors.create({
    data: {
      name: 'Rocketman',
      description: 'Premium cigar blend',
      imageUrl: 'https://example.com/rocketman.jpg',
      brand_id: boncheBrand.id
    }
  });

  // Seed some drinks
  await prisma.drinks.create({
    data: {
      id: 'drink-1',
      name: 'Mojito',
      description: 'Fresh mint and lime cocktail',
      price: 12.99,
      category: 'Cocktails',
      type: 'Alcoholic',
      imageUrl: 'https://example.com/mojito.jpg'
    }
  });

  await prisma.drinks.create({
    data: {
      id: 'drink-2',
      name: 'Fresh Orange Juice',
      description: 'Freshly squeezed orange juice',
      price: 4.99,
      category: 'Non-Alcoholic',
      type: 'Juice',
      imageUrl: 'https://example.com/orange-juice.jpg'
    }
  });

  console.log('Database seeded successfully with sample data');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
