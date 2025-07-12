import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete existing data
  await prisma.drink.deleteMany();
  await prisma.shishaFlavor.deleteMany();
  await prisma.venue.deleteMany();

  // Seed venue only
  await prisma.venue.create({
    data: {
      name: 'Shisha Lounge',
      address: 'str "Musala" 2, Varna',
      phone: '+359 888 123 456',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2908.3121788379667!2d27.91146187701693!3d43.20294117112709!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40a453f43df5de81%3A0x2f821627d3671dac!2z0JLQsNGA0L3QsCDQptC10L3RgtGK0YDQntC00LXRgdC-0YEsINGD0LsuIOKAntCc0YPRgdCw0LvQsOKAnCAyLCA5MDAwINCS0LDRgNC90LA!5e0!3m2!1sbg!2sbg!4v1751661707375!5m2!1sbg!2sbg',
    }
  });

  console.log('Database reset - only venue data created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
 