import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const flavors = await prisma.shishaFlavor.findMany();
  return NextResponse.json(flavors);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Basic validation
    if (!data.name || typeof data.name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (typeof data.price !== 'number' || isNaN(data.price)) {
      return NextResponse.json({ error: 'Valid price is required' }, { status: 400 });
    }
    if (!data.brand || typeof data.brand !== 'string') {
      return NextResponse.json({ error: 'Brand is required' }, { status: 400 });
    }
    if (!data.type || (data.type !== 'blond' && data.type !== 'black')) {
      return NextResponse.json({ error: 'Type must be "blond" or "black"' }, { status: 400 });
    }
    const flavor = await prisma.shishaFlavor.create({ data });
    return NextResponse.json(flavor, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  try {
    const updated = await prisma.shishaFlavor.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Flavor not found or update failed' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  try {
    await prisma.shishaFlavor.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Flavor not found or delete failed' }, { status: 400 });
  }
} 