'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  category: string;
}

interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  price: number;
}

export default function GarcomPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [tableNumber, setTableNumber] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'garcom') {
      router.push('/');
      return;
    }
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    const response = await fetch('/api/menu-items');
    const data = await response.json();
    setMenuItems(data);
  };

  const addToOrder = (menuItem: MenuItem) => {
    const existingItem = orderItems.find(item => item.menuItem._id === menuItem._id);
    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.menuItem._id === menuItem._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems([...orderItems, { menuItem, quantity: 1, price: menuItem.price }]);
    }
  };

  const removeFromOrder = (menuItemId: string) => {
    setOrderItems(orderItems.filter(item => item.menuItem._id !== menuItemId));
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromOrder(menuItemId);
    } else {
      setOrderItems(orderItems.map(item =>
        item.menuItem._id === menuItemId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const submitOrder = async () => {
    if (orderItems.length === 0) return;

    const orderData = {
      tableNumber,
      items: orderItems.map(item => ({
        menuItem: item.menuItem._id,
        quantity: item.quantity,
      })),
    };

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      setOrderItems([]);
      alert('Pedido enviado com sucesso!');
    } else {
      alert('Erro ao enviar pedido');
    }
  };

  const categories = [...new Set(menuItems.map(item => item.category))];
  const filteredMenuItems = selectedCategory
    ? menuItems.filter(item => item.category === selectedCategory)
    : menuItems;

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Painel do Garçom</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sair
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Menu */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Cardápio</h2>

          <div className="mb-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border p-2 rounded mr-2"
            >
              <option value="">Todas as categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {filteredMenuItems.map((item) => (
              <div key={item._id} className="border p-4 rounded">
                <h3 className="font-bold">{item.name}</h3>
                <p>R$ {item.price.toFixed(2)}</p>
                <p className="text-gray-600 text-sm">{item.category}</p>
                <button
                  onClick={() => addToOrder(item)}
                  className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  Adicionar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Order */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Pedido Atual</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Número da Mesa:</label>
            <input
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(parseInt(e.target.value))}
              className="border p-2 rounded w-full"
              min="1"
            />
          </div>

          <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
            {orderItems.map((item) => (
              <div key={item.menuItem._id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <span className="font-medium">{item.menuItem.name}</span>
                  <span className="text-gray-600 ml-2">R$ {item.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item.menuItem._id, item.quantity - 1)}
                    className="bg-red-500 text-white px-2 py-1 rounded mr-1"
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.menuItem._id, item.quantity + 1)}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-1"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromOrder(item.menuItem._id)}
                    className="bg-gray-500 text-white px-2 py-1 rounded"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="text-xl font-bold mb-4">
              Total: R$ {calculateTotal().toFixed(2)}
            </div>
            <button
              onClick={submitOrder}
              disabled={orderItems.length === 0}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              Enviar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
