'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [role, setRole] = useState<'cliente' | 'empresa'>('cliente');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Usuários fixos
    const users = [
      { email: 'cliente@gmail.com', password: 'cliente123', role: 'cliente' },
      { email: 'empresa@empresa.com', password: 'empresa123', role: 'empresa' },
    ];

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('userRole', user.role);
      if (user.role === 'cliente') {
        router.push('/cliente');
      } else {
        router.push('/empresa');
      }
    } else {
      alert('Email ou senha incorretos!');
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF8F3] px-6 py-12">
      {/* Top area: logo left, login right */}
      <section className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start gap-10">
        {/* Left: Big Logo */}
        <div className="flex-1 flex justify-center lg:justify-start items-center">
          <div className="w-64 h-64 lg:w-72 lg:h-72 relative">
            <Image
              src="/ecofood.png"
              alt="EcoFood Logo"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Right: Login card */}
        <div className="w-full max-w-md">
          <div className="bg-white border border-[#c84b4b] rounded-lg shadow-lg p-6 relative">
            <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 p-2 rounded shadow-inner"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 p-2 rounded shadow-inner"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entrar como:</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'cliente' | 'empresa')}
                  className="w-full border border-gray-200 p-2 rounded"
                >
                  <option value="cliente">Cliente</option>
                  <option value="empresa">Empresa</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#b94b4b] hover:bg-[#a43f3f] text-white py-2 rounded mt-1"
              >
                Entrar
              </button>
            </form>

            <div className="text-center mt-3">
              <a href="#" className="text-sm text-[#b94b4b] hover:underline">Cadastrar cliente</a>
            </div>
            <div className="text-center mt-3">
              <a href="#" className="text-sm text-[#b94b4b] hover:underline">Cadastrar empresa</a>
            </div>
          </div>
        </div>
      </section>

      {/* About section */}
      <section className="max-w-6xl mx-auto mt-16 bg-transparent">
        <h3 className="text-center text-xl font-bold mb-8">SOBRE A EMPRESA</h3>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1">
            <h4 className="text-lg font-semibold mb-2">EcoFood &co.</h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              A EcoFood &co. é uma empresa que une sabor, sustentabilidade e responsabilidade social para transformar a forma como nos alimentamos. Trabalhamos com ingredientes orgânicos e de origem local, priorizando práticas que reduzem o desperdício, valorizam produtores e respeitam o meio ambiente.
<br />
<br />
Mais do que oferecer produtos saudáveis, promovemos um ecossistema de consumo consciente — conectando pessoas, comunidades e ideias em torno de uma alimentação com propósito.
<br />
<br />
EcoFood &co. — Entregando Felicidade em cada pedido.
            </p>
          </div>

          {/* Right smaller logo */}
          <div className="w-48 flex-shrink-0 flex justify-center lg:justify-end">
            <div className="w-40 h-40 relative">
              <Image src="/ecofood.png" alt="EcoFood small" fill style={{ objectFit: 'contain' }} />
            </div>
          </div>
        </div>

        {/* Cards row */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#b94b4b] text-white rounded-lg p-6 shadow">
            <h5 className="font-semibold mb-2">Prêmios</h5>
            <p className="text-2xl font-bold">1º lugar SESI Tank</p>
          </div>

          <div className="bg-[#b94b4b] text-white rounded-lg p-6 shadow">
            <h5 className="font-semibold mb-2">Apoiadores</h5>
            <ul className="list-none space-y-1 text-sm">
              <li>Savengnago</li>
              <li>Pão de Açúcar</li>
              <li>Sempre Vale</li>
              <li>Zomper</li>
            </ul>
            <div className="mt-2 text-xs underline">MAIS</div>
          </div>

          <div className="bg-[#b94b4b] text-white rounded-lg p-6 shadow">
            <h5 className="font-semibold mb-2">Tempo de experiência</h5>
            <p className="text-2xl font-bold">10 meses</p>
          </div>
        </div>
      </section>
    </main>
  );
}
