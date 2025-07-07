import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  _req: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  try {
    await prisma.menuItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  try {
    const data = await req.json();
    const updated = await prisma.menuItem.update({
      where: { id },
      data,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ error: 'Item not found or update failed' }, { status: 400 });
  }
}
 