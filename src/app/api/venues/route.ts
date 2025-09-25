import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
 
export async function GET() {
  const venues = await prisma.venues.findMany();
  return NextResponse.json(venues);
}
