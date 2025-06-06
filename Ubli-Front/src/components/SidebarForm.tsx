import React, { useState } from "react";

interface AccessibilityFeatures {
  rampa: boolean;
  elevador: boolean;
  banheiro_acessivel: boolean;
  sinalizacao_tatil: boolean;
  vaga_especial: boolean;
  piso_tatil: boolean;
  acesso_cadeirantes: boolean;
  audio_descricao: boolean;
  braille: boolean;
}

interface AccessibilityData {
  features: AccessibilityFeatures;
  observations: string;
  tipo: string;
  images?: string[];
}

interface SidebarFormProps {
  onClose: () => void;
  selectedLocation?: {
    lat: number;
    lng: number;
    placeId?: string;
  } | null;
  placeDetails?: {
    name?: string;
    vicinity?: string;
    formatted_address?: string;
  } | null;
  existingData?: AccessibilityData | null;
  onSave: (placeId: string, data: AccessibilityData) => void;
}

const SidebarForm: React.FC<SidebarFormProps> = ({
  onClose,
  selectedLocation,
  placeDetails,
  existingData,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    nome: placeDetails?.name || "",
    endereco: placeDetails?.vicinity || placeDetails?.formatted_address || "",
    tipo: existingData?.tipo || "",
    acessibilidades: existingData?.features || {
      rampa: false,
      elevador: false,
      banheiro_acessivel: false,
      sinalizacao_tatil: false,
      vaga_especial: false,
      piso_tatil: false,
      acesso_cadeirantes: false,
      audio_descricao: false,
      braille: false,
    },
    imagens: [] as File[],
    observacoes: existingData?.observations || "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        acessibilidades: {
          ...prev.acessibilidades,
          [name]: (e.target as HTMLInputElement).checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        imagens: Array.from(e.target.files as FileList),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLocation?.placeId) return;

    const dataToSave: AccessibilityData = {
      features: formData.acessibilidades,
      observations: formData.observacoes,
      tipo: formData.tipo,
      // Adicione aqui a lógica para upload de imagens se necessário
    };

    onSave(selectedLocation.placeId, dataToSave);
    onClose();
  };

  const tiposEstabelecimento = [
    "Loja/Comércio",
    "Restaurante/Café",
    "Hospital/Clínica",
    "Escola/Universidade",
    "Órgão Público",
    "Parque/Praça",
    "Outro",
  ];

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {existingData ? "Editar Acessibilidade" : "Cadastrar Acessibilidade"}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
      </div>

      {/* Dados do local */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-lg">
          {placeDetails?.name || "Local selecionado"}
        </h3>
        <p className="text-gray-600">
          {placeDetails?.vicinity ||
            placeDetails?.formatted_address ||
            "Endereço não disponível"}
        </p>
        {selectedLocation && (
          <p className="text-sm text-gray-500 mt-1">
            Lat: {selectedLocation.lat.toFixed(6)}, Lng:{" "}
            {selectedLocation.lng.toFixed(6)}
          </p>
        )}
      </div>

      {/* Exibir acessibilidades existentes */}
      {existingData && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">
            Acessibilidades já cadastradas:
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(existingData.features)
              .filter(([_, value]) => value)
              .map(([key]) => (
                <span
                  key={key}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize"
                >
                  {key.replace("_", " ")}
                </span>
              ))}
          </div>
          {existingData.observations && (
            <p className="mt-2 text-sm text-blue-700">
              <span className="font-medium">Observações:</span>{" "}
              {existingData.observations}
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1 overflow-y-auto">
          {/* Tipo de estabelecimento */}
          <div>
            <label className="block mb-1 font-medium">
              Tipo de Estabelecimento *
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Selecione...</option>
              {tiposEstabelecimento.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          {/* Nome do local */}
          <div>
            <label className="block mb-1 font-medium">Nome do Local *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Endereço */}
          <div>
            <label className="block mb-1 font-medium">Endereço *</label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Recursos de acessibilidade */}
          <div>
            <label className="block mb-2 font-medium">
              Recursos de Acessibilidade
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(formData.acessibilidades).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={key}
                    checked={value}
                    onChange={handleChange}
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                  <span className="capitalize">{key.replace("_", " ")}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Imagens */}
          <div>
            <label className="block mb-1 font-medium">Fotos (opcional)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <p className="text-xs text-gray-500 mt-1">
              Adicione fotos que comprovem as condições de acessibilidade
            </p>
          </div>

          {/* Observações */}
          <div>
            <label className="block mb-1 font-medium">Observações</label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Informações adicionais sobre a acessibilidade..."
            />
          </div>
        </div>

        {/* Botões de ação */}
        <div className="mt-6 pt-4 border-t flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {existingData ? "Atualizar" : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SidebarForm;
