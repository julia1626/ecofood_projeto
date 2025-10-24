'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  validade: Date;
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

export default function EmpresaPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [newItem, setNewItem] = useState({ name: '', price: 0, validade: '' });
  const [activeTab, setActiveTab] = useState('cardapio');
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'empresa') {
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
      setNewItem({ name: '', price: 0, validade: '' });
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
    <div className="min-h-screen bg-[#FFF8F3] p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-[#b94b4b]/30 pb-4">
        <h1 className="text-3xl font-bold text-[#b94b4b] mb-4 md:mb-0">Painel da Empresa</h1>
        <button
          onClick={handleLogout}
          className="bg-[#b94b4b] text-white px-4 py-2 rounded hover:bg-[#a43f3f] transition-colors"
        >
          Sair
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex flex-wrap gap-4">
        <button
          onClick={() => setActiveTab('cardapio')}
          className={`px-5 py-2 rounded-full font-medium transition-colors ${
            activeTab === 'cardapio'
              ? 'bg-[#b94b4b] text-white shadow-md'
              : 'bg-white text-[#b94b4b] border border-[#b94b4b]/50 hover:bg-[#fff2ef]'
          }`}
        >
          Gerenciar Produtos
        </button>
        <button
          onClick={() => setActiveTab('pedidos')}
          className={`px-5 py-2 rounded-full font-medium transition-colors ${
            activeTab === 'pedidos'
              ? 'bg-[#b94b4b] text-white shadow-md'
              : 'bg-white text-[#b94b4b] border border-[#b94b4b]/50 hover:bg-[#fff2ef]'
          }`}
        >
          Ver Pedidos
        </button>
        <button
          onClick={() => setActiveTab('faturamento')}
          className={`px-5 py-2 rounded-full font-medium transition-colors ${
            activeTab === 'faturamento'
              ? 'bg-[#b94b4b] text-white shadow-md'
              : 'bg-white text-[#b94b4b] border border-[#b94b4b]/50 hover:bg-[#fff2ef]'
          }`}
        >
          Faturamento
        </button>
      </div>

      {/* Aba: Cardápio */}
      {activeTab === 'cardapio' && (
        <div className="bg-white p-8 rounded-lg shadow-lg border border-[#b94b4b]/20">
          <h2 className="text-2xl font-bold text-[#b94b4b] mb-6">Gerenciar Produtos</h2>

          <form onSubmit={handleAddMenuItem} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Nome do item"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="border border-[#b94b4b]/30 p-2 rounded shadow-inner focus:outline-none focus:border-[#b94b4b]"
                required
              />
              <input
                type="number"
                placeholder="Preço"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                className="border border-[#b94b4b]/30 p-2 rounded shadow-inner focus:outline-none focus:border-[#b94b4b]"
                step="0.01"
                required
              />
              <input
                type="date"
                placeholder="Data de Validade"
                value={newItem.validade}
                onChange={(e) => setNewItem({ ...newItem, validade: e.target.value })}
                className="border border-[#b94b4b]/30 p-2 rounded shadow-inner focus:outline-none focus:border-[#b94b4b]"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-[#b94b4b] text-white px-6 py-2 rounded hover:bg-[#a43f3f] transition-colors"
            >
              Adicionar Item
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item._id}
                className="border border-[#b94b4b]/20 p-4 rounded-lg bg-[#fffdfc] hover:shadow-md transition"
              >
                <h3 className="font-bold text-lg text-[#b94b4b]">{item.name}</h3>
                <p className="text-gray-700">R$ {item.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{new Date(item.validade).toLocaleDateString('pt-BR')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aba: Pedidos */}
      {activeTab === 'pedidos' && (
        <div className="bg-white p-8 rounded-lg shadow-lg border border-[#b94b4b]/20">
          <h2 className="text-2xl font-bold text-[#b94b4b] mb-6">Pedidos Recebidos</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border border-[#b94b4b]/20 p-4 rounded bg-[#fffdfc] hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-[#b94b4b]">Mesa {order.tableNumber}</span>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      order.status === 'Recebido'
                        ? 'bg-yellow-200 text-yellow-900'
                        : order.status === 'Em Preparo'
                        ? 'bg-orange-200 text-orange-900'
                        : 'bg-green-200 text-green-900'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="mb-2 text-gray-700">
                  {order.items.map((item, index) => (
                    <div key={index} className="text-sm">
                      {item.quantity}x {item.menuItem.name} - R$ {(item.price * item.quantity).toFixed(2)}
                    </div>
                  ))}
                </div>
                <div className="font-bold text-[#b94b4b]">
                  Total: R$ {order.total.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(order.createdAt).toLocaleString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aba: Faturamento */}
      {activeTab === 'faturamento' && (
        <div className="bg-white p-8 rounded-lg shadow-lg border border-[#b94b4b]/20">
          <h2 className="text-2xl font-bold text-[#b94b4b] mb-4">Faturamento</h2>
          <div className="text-3xl font-bold text-green-600 mb-4">
            Total Faturado: R$ {calculateRevenue().toFixed(2)}
          </div>
          <p className="text-gray-700">
            <strong>Pedidos Entregues:</strong> {orders.filter(o => o.status === 'Entregue').length}
          </p>
          <p className="text-gray-700">
            <strong>Total de Pedidos:</strong> {orders.length}
          </p>
        </div>
      )}
    </div>
  );
}
