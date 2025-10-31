// pages/index.tsx
'use client'; // opcional dependendo da sua versão; mantive para seguir seu padrão (se usar pages dir, remova)
import Image from 'next/image';
import { useEffect, useState } from 'react';

type Message = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

export default function Home() {
  // login states (seu código original mantém)
  const [role, setRole] = useState<'cliente' | 'empresa'>('cliente');
  const [emailLogin, setEmailLogin] = useState('');
  const [password, setPassword] = useState('');

  // contato por email
  const [contatoNome, setContatoNome] = useState('');
  const [contatoEmail, setContatoEmail] = useState('');
  const [contatoMensagem, setContatoMensagem] = useState('');
  const [contatoStatus, setContatoStatus] = useState<string | null>(null);

  // postar mensagem no site
  const [msgNome, setMsgNome] = useState('');
  const [msgTexto, setMsgTexto] = useState('');
  const [msgStatus, setMsgStatus] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // login handler original (simplificado)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = [
      { email: 'cliente@gmail.com', password: 'cliente123', role: 'cliente' },
      { email: 'empresa@empresa.com', password: 'empresa123', role: 'empresa' },
    ];
    const user = users.find(u => u.email === emailLogin && u.password === password);
    if (user) {
      localStorage.setItem('userRole', user.role);
      if (user.role === 'cliente') window.location.href = '/cliente';
      else window.location.href = '/empresa';
    } else {
      alert('Email ou senha incorretos!');
    }
  };

  // buscar mensagens ao carregar
  useEffect(() => {
    fetch('/api/messages')
      .then(res => res.json())
      .then((data) => setMessages(data || []))
      .catch(() => setMessages([]));
  }, []);

  // enviar contato por email
  const enviarContato = async (e: React.FormEvent) => {
    e.preventDefault();
    setContatoStatus('enviando');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contatoNome,
          email: contatoEmail,
          message: contatoMensagem,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setContatoStatus('enviado com sucesso!');
        setContatoNome(''); setContatoEmail(''); setContatoMensagem('');
      } else {
        // fallback: abrir mailto caso o servidor retorne erro específico
        if (json && json.fallbackMailto) {
          window.location.href = json.fallbackMailto;
        }
        setContatoStatus('erro ao enviar. Tente novamente.');
      }
    } catch (err) {
      setContatoStatus('erro de conexão. Tente novamente.');
    }
    setTimeout(() => setContatoStatus(null), 3500);
  };

  // postar mensagem no site
  const postarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsgStatus('enviando');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: msgNome,
          message: msgTexto,
        }),
      });
      if (!res.ok) throw new Error('Falha ao postar');
      const saved = await res.json();
      setMessages(prev => [saved, ...prev]);
      setMsgNome(''); setMsgTexto('');
      setMsgStatus('Mensagem postada!');
    } catch (err) {
      setMsgStatus('Erro ao postar. Tente novamente.');
    }
    setTimeout(() => setMsgStatus(null), 2500);
  };

  return (
    <main className="min-h-screen bg-[#FFF8F3] px-6 py-12">
      {/* Top area */}
      <section className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start gap-10">
        {/* Logo left */}
        <div className="flex-1 flex justify-center lg:justify-start items-center">
          <div className="w-64 h-64 lg:w-72 lg:h-72 relative">
            <Image src="/ecofood.png" alt="EcoFood Logo" fill style={{ objectFit: 'contain' }} />
          </div>
        </div>

        {/* Login right */}
        <div className="w-full max-w-md">
          <div className="bg-white border border-[#c84b4b] rounded-lg shadow-lg p-6 relative">
            <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={emailLogin}
                  onChange={(e) => setEmailLogin(e.target.value)}
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
              <button type="submit" className="w-full bg-[#b94b4b] hover:bg-[#a43f3f] text-white py-2 rounded mt-1">
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

      {/* About */}
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

        {/* ENTRE EM CONTATO area: duas colunas - Contato (email) e Mensagem (post site) */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* CONTATO (envia e-mail) */}
          <div className="bg-white border border-[#c84b4b] rounded-lg p-6 shadow">
            <h4 className="text-lg font-semibold mb-4">CONTATO</h4>
            <form onSubmit={enviarContato} className="space-y-3">
              <input
                placeholder="Nome"
                value={contatoNome}
                onChange={(e) => setContatoNome(e.target.value)}
                className="w-full border border-gray-200 p-2 rounded"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={contatoEmail}
                onChange={(e) => setContatoEmail(e.target.value)}
                className="w-full border border-gray-200 p-2 rounded"
                required
              />
              <textarea
                placeholder="Mensagem"
                value={contatoMensagem}
                onChange={(e) => setContatoMensagem(e.target.value)}
                className="w-full border border-gray-200 p-2 rounded h-32"
                required
              />
              <button className="bg-[#b94b4b] text-white py-2 px-4 rounded">Enviar Mensagem</button>
            </form>
            {contatoStatus && <p className="mt-3 text-sm text-gray-700">{contatoStatus}</p>}
          </div>

          {/* MENSAGEM (post no site) */}
          <div className="bg-white border border-[#c84b4b] rounded-lg p-6 shadow">
            <h4 className="text-lg font-semibold mb-4">MENSAGEM</h4>
            <form onSubmit={postarMensagem} className="space-y-3">
              <input
                placeholder="Nome"
                value={msgNome}
                onChange={(e) => setMsgNome(e.target.value)}
                className="w-full border border-gray-200 p-2 rounded"
                required
              />
              <textarea
                placeholder="Mensagem"
                value={msgTexto}
                onChange={(e) => setMsgTexto(e.target.value)}
                className="w-full border border-gray-200 p-2 rounded h-28"
                required
              />
              <button className="bg-[#b94b4b] text-white py-2 px-4 rounded">Postar Mensagem</button>
            </form>
            {msgStatus && <p className="mt-3 text-sm text-gray-700">{msgStatus}</p>}

            {/* Lista de mensagens */}
            <div className="mt-6">
              <h5 className="font-semibold mb-2">Mensagens publicadas</h5>
              {messages.length === 0 && <p className="text-sm text-gray-500">Nenhuma mensagem ainda.</p>}
              <ul className="space-y-3">
                {messages.map(m => (
                  <li key={m.id} className="border border-gray-200 rounded p-3 bg-[#fffaf9]">
                    <div className="text-sm font-semibold">{m.name} <span className="text-xs text-gray-500 ml-2">{new Date(m.createdAt).toLocaleString()}</span></div>
                    <div className="mt-1 text-sm text-gray-700">{m.message}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}
