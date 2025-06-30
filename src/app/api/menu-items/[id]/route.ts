import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.menuItem.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { isActive } = await req.json();
    const updated = await prisma.menuItem.update({
      where: { id: params.id },
      data: { isActive },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ error: 'Item not found or update failed' }, { status: 400 });
  }
} 