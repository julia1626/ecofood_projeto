import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import MenuItem from '@/models/MenuItem';

export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find({}).populate('items.menuItem').sort({ createdAt: 1 });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { endereco, items } = body;

    // Calculate total and validate items
    let total = 0;
    const validatedItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return NextResponse.json({ error: `Menu item not found: ${item.menuItem}` }, { status: 400 });
      }
      const itemTotal = menuItem.price * item.quantity;
      total += itemTotal;
      validatedItems.push({
        menuItem: item.menuItem,
        quantity: item.quantity,
        price: menuItem.price,
      });
    }

    const order = new Order({
      endereco,
      items: validatedItems,
      total,
    });

    await order.save();
    await order.populate('items.menuItem');
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, status } = body;

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true }).populate('items.menuItem');
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
