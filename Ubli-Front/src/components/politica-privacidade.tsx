import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const PoliticaPrivacidade: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-3 py-8 text-gray-800 space-y-6">
      {/* Botão abre/fecha menu lateral */}
      <div className="absolute top-5 left-4 z-[3]">
        <SidebarTrigger className="bg-white text-black p-2 rounded shadow" />
      </div>
      <h2 className="text-2xl font-bold border-b pb-2">
        Política de Privacidade
      </h2>

      <p>
        A sua privacidade é importante para nós. É política do{" "}
        <strong>Ubli</strong> respeitar a sua privacidade em relação a qualquer
        informação sua que possamos coletar no site{" "}
        <a
          href="https://ubli.com.br"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Ubli
        </a>{" "}
        e outros sites que possuímos e operamos.
      </p>

      <p>
        Solicitamos informações pessoais apenas quando realmente precisamos
        delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais,
        com o seu conhecimento e consentimento. Também informamos por que
        estamos coletando e como será usado.
      </p>

      <p>
        Apenas retemos as informações coletadas pelo tempo necessário para
        fornecer o serviço solicitado. Quando armazenamos dados, protegemos
        dentro de meios comercialmente aceitáveis para evitar perdas, roubos,
        acesso, divulgação, cópia, uso ou modificação não autorizados.
      </p>

      <p>
        Não compartilhamos informações de identificação pessoal publicamente ou
        com terceiros, exceto quando exigido por lei.
      </p>

      <p>
        Nosso site pode conter links para sites externos que não são operados
        por nós. Esteja ciente de que não temos controle sobre o conteúdo e
        práticas desses sites e não podemos aceitar responsabilidade por suas
        respectivas{" "}
        <a
          href="https://politicaprivacidade.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          políticas de privacidade
        </a>
        .
      </p>

      <p>
        Você é livre para recusar a nossa solicitação de informações pessoais,
        entendendo que talvez não possamos fornecer alguns dos serviços
        desejados.
      </p>

      <p>
        O uso continuado de nosso site será considerado como aceitação de nossas
        práticas em torno de privacidade e informações pessoais. Se você tiver
        alguma dúvida sobre como lidamos com dados do usuário e informações
        pessoais, entre em contato conosco.
      </p>

      <ul className="list-disc list-inside space-y-2">
        <li>
          O serviço Google AdSense que usamos para veicular publicidade usa um
          cookie DoubleClick para exibir anúncios mais relevantes e limitar o
          número de vezes que um anúncio é exibido.
        </li>
        <li>
          Para mais informações sobre o Google AdSense, consulte as FAQs
          oficiais sobre privacidade do Google.
        </li>
        <li>
          Utilizamos anúncios para compensar os custos de funcionamento deste
          site e financiar desenvolvimentos futuros. Os cookies de publicidade
          comportamental rastreiam anonimamente seus interesses para exibir
          anúncios relevantes.
        </li>
        <li>
          Parceiros afiliados podem usar cookies para identificar acessos ao
          site e garantir atribuição correta de comissões ou promoções.
        </li>
      </ul>

      <h3 className="text-xl font-semibold mt-8">Compromisso do Usuário</h3>

      <p>
        O usuário se compromete a fazer uso adequado dos conteúdos e informações
        que o Ubli oferece, incluindo mas não se limitando a:
      </p>

      <ul className="list-disc list-inside space-y-2">
        <li>
          A) Não se envolver em atividades ilegais ou contrárias à boa fé e à
          ordem pública;
        </li>
        <li>
          B) Não difundir propaganda ou conteúdo racista, xenofóbico, de azar,
          pornografia ilegal, apologia ao terrorismo ou que viole direitos
          humanos;
        </li>
        <li>
          C) Não causar danos aos sistemas do Ubli, seus fornecedores ou
          terceiros, nem disseminar vírus ou softwares maliciosos.
        </li>
      </ul>

      <h3 className="text-xl font-semibold mt-8">Mais Informações</h3>

      <p>
        Esperamos que esteja esclarecido e, como mencionado, se houver algo que
        você não tenha certeza se precisa ou não, é mais seguro manter os
        cookies ativados caso utilize algum recurso que os necessite.
      </p>

      <p className="text-sm text-gray-500">
        Esta política é efetiva a partir de{" "}
        <strong>17 de maio de 2025 às 20:49</strong>.
      </p>
    </div>
  );
};

export default PoliticaPrivacidade;
