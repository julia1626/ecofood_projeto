'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [role, setRole] = useState<'gerente' | 'garcom'>('gerente');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple password check - in production, use proper authentication
    const gerentePassword = 'gerente123';
    const garcomPassword = 'garcom123';

    if (role === 'gerente' && password === gerentePassword) {
      localStorage.setItem('userRole', 'gerente');
      router.push('/gerente');
    } else if (role === 'garcom' && password === garcomPassword) {
      localStorage.setItem('userRole', 'garcom');
      router.push('/garcom');
    } else {
      alert('Senha incorreta!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Sistema de Gestão de Pedidos</h1>
        <h2 className="text-xl text-center mb-6">Pequeno Bistrô Sabor Local</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Função:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'gerente' | 'garcom')}
              className="w-full border p-2 rounded"
            >
              <option value="gerente">Gerente</option>
              <option value="garcom">Garçom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 pt-6 border-t">
          <a
            href="/cozinha"
            className="block w-full bg-red-500 text-white py-2 px-4 rounded text-center hover:bg-red-600"
          >
            Tela da Cozinha
          </a>
        </div>
      </div>
    </div>
  );
}
