import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();
    
    const brand = await prisma.shishaBrands.update({
      where: { id: BigInt(id) },
      data: {
        logoUrl: data.logoUrl
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating brand:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
