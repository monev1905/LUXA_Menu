import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import ExcelJS from 'exceljs';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as any);

    // Drinks
    const drinksSheet = workbook.getWorksheet('Drinks');
    let drinksImported = 0;
    if (drinksSheet) {
      const rows = drinksSheet.getSheetValues().slice(2); // skip null and header
      for (const row of rows) {
        if (!Array.isArray(row)) continue;
        const [ , id, name, description, price, section, isActive ] = row;
        if (!name || !price) continue;
        await prisma.drink.upsert({
          where: { id: String(id || '') },
          update: { 
            name: String(name), 
            description: description ? String(description) : null, 
            price: Number(price), 
            category: 'drinks',
            type: section ? String(section) : '',
            isActive: isActive === true || isActive === 'TRUE' || isActive === 1 || isActive === '1' 
          },
          create: { 
            name: String(name), 
            description: description ? String(description) : null, 
            price: Number(price), 
            category: 'drinks',
            type: section ? String(section) : '',
            isActive: isActive === true || isActive === 'TRUE' || isActive === 1 || isActive === '1' 
          },
        });
        drinksImported++;
      }
    }

    // ShishaFlavors
    const shishaSheet = workbook.getWorksheet('ShishaFlavors');
    let shishaImported = 0;
    if (shishaSheet) {
      const rows = shishaSheet.getSheetValues().slice(2);
      for (const row of rows) {
        if (!Array.isArray(row)) continue;
        const [ , id, name, description, price, brand, type, isActive ] = row;
        if (!name || !price || !brand || !type) continue;
        await prisma.shishaFlavor.upsert({
          where: { id: String(id || '') },
          update: { 
            name: String(name), 
            description: description ? String(description) : null, 
            price: Number(price), 
            brand: String(brand), 
            type: String(type), 
            category: 'shisha', 
            isActive: isActive === true || isActive === 'TRUE' || isActive === 1 || isActive === '1' 
          },
          create: { 
            name: String(name), 
            description: description ? String(description) : null, 
            price: Number(price), 
            brand: String(brand), 
            type: String(type), 
            category: 'shisha', 
            isActive: isActive === true || isActive === 'TRUE' || isActive === 1 || isActive === '1' 
          },
        });
        shishaImported++;
      }
    }

    return NextResponse.json({ drinksImported, shishaImported });
  } catch (error: any) {
    console.error('Error importing file:', error);
    return NextResponse.json({ error: 'Import failed. Please check your file format and required columns.' }, { status: 500 });
  }
} 