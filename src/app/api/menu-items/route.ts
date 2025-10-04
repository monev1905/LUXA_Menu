import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/menu-items?category=drink|shisha
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const where = category ? { type: category } : {};
  const items = await prisma.drinks.findMany({ where });
  return NextResponse.json(items);
}

// POST /api/menu-items
export async function POST(req: NextRequest) {
  const data = await req.json();
  const item = await prisma.drinks.create({ data });
  return NextResponse.json(item, { status: 201 });
}

// PATCH /api/menu-items
export async function PATCH(req: NextRequest) {
  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  try {
    const updated = await prisma.drinks.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Item not found or update failed' }, { status: 400 });
  }
}
