import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import ExcelJS from 'exceljs';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Fetch data
  const drinks = await prisma.drink.findMany();
  const shishaFlavors = await prisma.shishaFlavor.findMany();

  // Create workbook
  const workbook = new ExcelJS.Workbook();

  // Drinks sheet
  const drinksSheet = workbook.addWorksheet('Drinks');
  drinksSheet.columns = [
    { header: 'ID', key: 'id', width: 36 },
    { header: 'Name', key: 'name', width: 24 },
    { header: 'Description', key: 'description', width: 32 },
    { header: 'Price', key: 'price', width: 10 },
    { header: 'Type', key: 'type', width: 16 },
    { header: 'isActive', key: 'isActive', width: 10 },
  ];
  drinks.forEach((drink: any) => drinksSheet.addRow(drink));

  // ShishaFlavors sheet
  const shishaSheet = workbook.addWorksheet('ShishaFlavors');
  shishaSheet.columns = [
    { header: 'ID', key: 'id', width: 36 },
    { header: 'Name', key: 'name', width: 24 },
    { header: 'Description', key: 'description', width: 32 },
    { header: 'Price', key: 'price', width: 10 },
    { header: 'Brand', key: 'brand', width: 20 },
    { header: 'Type', key: 'type', width: 10 },
    { header: 'isActive', key: 'isActive', width: 10 },
  ];
  shishaFlavors.forEach((flavor: any) => shishaSheet.addRow(flavor));

  // Write to buffer
  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="menu_export.xlsx"',
    },
  });
} 