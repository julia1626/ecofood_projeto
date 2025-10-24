'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

export default function GerentePage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [newItem, setNewItem] = useState({ name: '', price: 0, category: '' });
  const [activeTab, setActiveTab] = useState('cardapio');
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'gerente') {
      router.push('/');
      return;
    }
    fetchMenuItems();
    fetchOrders();
  }, []);

  const fetchMenuItems = async () => {
    const response = await fetch('/api/menu-items');
    const data = await response.json();
    setMenuItems(data);
  };

  const fetchOrders = async () => {
    const response = await fetch('/api/orders');
    const data = await response.json();
    setOrders(data);
  };

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/menu-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
    if (response.ok) {
      setNewItem({ name: '', price: 0, category: '' });
      fetchMenuItems();
    }
  };

  const calculateRevenue = () => {
    return orders
      .filter(order => order.status === 'Entregue')
      .reduce((total, order) => total + order.total, 0);
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Painel do Gerente</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sair
        </button>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setActiveTab('cardapio')}
          className={`mr-4 px-4 py-2 rounded ${activeTab === 'cardapio' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Gerenciar Cardápio
        </button>
        <button
          onClick={() => setActiveTab('pedidos')}
          className={`mr-4 px-4 py-2 rounded ${activeTab === 'pedidos' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Ver Pedidos
        </button>
        <button
          onClick={() => setActiveTab('faturamento')}
          className={`px-4 py-2 rounded ${activeTab === 'faturamento' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Faturamento
        </button>
      </div>

      {activeTab === 'cardapio' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Gerenciar Cardápio</h2>

          <form onSubmit={handleAddMenuItem} className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Nome do item"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Preço"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                className="border p-2 rounded"
                step="0.01"
                required
              />
              <input
                type="text"
                placeholder="Categoria"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="border p-2 rounded"
                required
              />
            </div>
            <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Adicionar Item
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map((item) => (
              <div key={item._id} className="border p-4 rounded">
                <h3 className="font-bold">{item.name}</h3>
                <p>R$ {item.price.toFixed(2)}</p>
                <p className="text-gray-600">{item.category}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'pedidos' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Todos os Pedidos</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">Mesa {order.tableNumber}</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    order.status === 'Recebido' ? 'bg-yellow-200' :
                    order.status === 'Em Preparo' ? 'bg-orange-200' : 'bg-green-200'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="mb-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="text-sm">
                      {item.quantity}x {item.menuItem.name} - R$ {(item.price * item.quantity).toFixed(2)}
                    </div>
                  ))}
                </div>
                <div className="font-bold">Total: R$ {order.total.toFixed(2)}</div>
                <div className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'faturamento' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Faturamento</h2>
          <div className="text-2xl font-bold text-green-600">
            Total Faturado: R$ {calculateRevenue().toFixed(2)}
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Pedidos Entregues: {orders.filter(o => o.status === 'Entregue').length}</h3>
            <h3 className="text-lg font-semibold">Total de Pedidos: {orders.length}</h3>
          </div>
        </div>
      )}
    </div>
  );
}
