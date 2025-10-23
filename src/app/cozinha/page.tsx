'use client';

import { useState, useEffect } from 'react';

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  category: string;
}

interface Order {
  _id: string;
  tableNumber: number;
  items: Array<{
    menuItem: MenuItem;
    quantity: number;
    price: number;
  }>;
  status: string;
  total: number;
  createdAt: string;
}

export default function CozinhaPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    const response = await fetch('/api/kitchen');
    const data = await response.json();
    setOrders(data);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const response = await fetch('/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status }),
    });

    if (response.ok) {
      fetchOrders();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Tela da Cozinha</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-400">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Mesa {order.tableNumber}</h2>
              <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-sm">
                {order.status}
              </span>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Itens do Pedido:</h3>
              <ul className="space-y-1">
                {order.items.map((item, index) => (
                  <li key={index} className="text-sm">
                    {item.quantity}x {item.menuItem.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              Recebido em: {new Date(order.createdAt).toLocaleString()}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => updateOrderStatus(order._id, 'Em Preparo')}
                className="flex-1 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
              >
                Em Preparo
              </button>
              <button
                onClick={() => updateOrderStatus(order._id, 'Entregue')}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Entregue
              </button>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center text-gray-500 mt-12">
          <p className="text-xl">Nenhum pedido pendente no momento.</p>
        </div>
      )}
    </div>
  );
}
