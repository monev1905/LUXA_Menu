import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const flavors = await prisma.shishaFlavors.findMany({
    include: {
      ShishaBrands: {
        select: {
          Brand: true,
          Type: true
        }
      }
    }
  });
  
  // Transform the data to convert BigInt to string and include the type and brand fields
  const transformedFlavors = flavors.map(flavor => ({
    id: flavor.id.toString(),
    name: flavor.name,
    description: flavor.description,
    isActive: flavor.isActive,
    imageUrl: flavor.imageUrl,
    brand: flavor.ShishaBrands?.Brand || null,
    type: flavor.ShishaBrands?.Type || null
  }));
  
  return NextResponse.json(transformedFlavors);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Basic validation
    if (!data.name || typeof data.name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!data.brand_id || typeof data.brand_id !== 'number') {
      return NextResponse.json({ error: 'Valid brand_id is required' }, { status: 400 });
    }
    
    const flavor = await prisma.shishaFlavors.create({ 
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive ?? true,
        imageUrl: data.imageUrl || '',
        brand_id: BigInt(data.brand_id)
      }
    });
    return NextResponse.json(flavor, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  try {
    const updated = await prisma.shishaFlavors.update({ 
      where: { id: BigInt(id) }, 
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
        imageUrl: data.imageUrl,
        brand_id: data.brand_id ? BigInt(data.brand_id) : undefined
      }
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Flavor not found or update failed' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  try {
    await prisma.shishaFlavors.delete({ where: { id: BigInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Flavor not found or delete failed' }, { status: 400 });
  }
}
