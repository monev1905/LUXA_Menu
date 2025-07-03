import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const drinks = await prisma.drink.findMany();
  return NextResponse.json(drinks);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const drink = await prisma.drink.create({ data });
  return NextResponse.json(drink, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  try {
    const updated = await prisma.drink.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Drink not found or update failed' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  try {
    await prisma.drink.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Drink not found or delete failed' }, { status: 400 });
  }
} 