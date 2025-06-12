import type React from "react";
import { SidebarTrigger } from "./ui/sidebar";

const Introduction: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            {/* Botão abre/fecha menu lateral */}
            <div className="absolute top-5 left-4 z-[3]">
                <SidebarTrigger className="bg-white text-black p-2 rounded shadow" />
            </div>
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 md:p-12 space-y-6">
                <h1 className="text-3xl md:text-4xl font-bold text-blue-700 text-center">
                    Bem-vindo ao Sistema de Acessibilidade
                </h1>

                <p className="text-gray-700 text-lg leading-relaxed">
                    Nosso sistema foi desenvolvido com o objetivo de{" "}
                    <b>facilitar a inclusão e acessibilidade</b> em
                    estabelecimentos, ruas e espaços públicos. Por meio dele,
                    qualquer pessoa pode cadastrar, consultar e compartilhar
                    informações sobre a acessibilidade de um local.
                </p>

                <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-blue-600 mb-2">
                        🔍 Como funciona:
                    </h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>
                            Explore o mapa e clique sobre estabelecimentos ou
                            locais públicos.
                        </li>
                        <li>
                            Veja se já existem informações sobre acessibilidade
                            cadastradas.
                        </li>
                        <li>
                            Contribua adicionando novos dados, fotos e
                            observações.
                        </li>
                        <li>
                            Ajude outras pessoas a encontrarem locais
                            acessíveis.
                        </li>
                    </ul>
                </div>

                <div className="bg-green-50 p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-green-600 mb-2">
                        🎯 Objetivo do sistema:
                    </h2>
                    <p className="text-gray-700">
                        O principal objetivo é{" "}
                        <b>criar uma rede colaborativa de acessibilidade</b>,
                        promovendo a inclusão de pessoas com deficiência física
                        ou mobilidade reduzida. Com a ajuda da comunidade, nosso
                        sistema ajuda a tornar as cidades mais acessíveis para
                        todos.
                    </p>
                </div>

                <div className="text-center">
                    <p className="text-gray-500 italic">
                        Vamos construir juntos um mundo mais acessível! 🌍
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Introduction;
