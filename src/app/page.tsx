import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8">Sistema de Gestão de Pedidos</h1>
        <h2 className="text-xl text-center mb-6">Pequeno Bistrô Sabor Local</h2>
        <div className="space-y-4">
          <Link href="/gerente" className="block w-full bg-blue-500 text-white py-2 px-4 rounded text-center hover:bg-blue-600">
            Acesso Gerente
          </Link>
          <Link href="/garcom" className="block w-full bg-green-500 text-white py-2 px-4 rounded text-center hover:bg-green-600">
            Acesso Garçom
          </Link>
          <Link href="/cozinha" className="block w-full bg-red-500 text-white py-2 px-4 rounded text-center hover:bg-red-600">
            Tela da Cozinha
          </Link>
        </div>
      </div>
    </div>
  );
}
