import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
    types?: string[];
    address_components?: any[];
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
    nome: "",
    endereco: "",
    tipo: "",
    acessibilidades: {
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
    observacoes: "",
  });

  // Preenche os campos automaticamente quando placeDetails muda
  useEffect(() => {
    if (placeDetails) {
      const tipo = determinePlaceType(placeDetails.types);
      const endereco = getCompleteAddress(placeDetails);

      setFormData((prev) => ({
        ...prev,
        nome: placeDetails.name || "",
        endereco: endereco,
        tipo: existingData?.tipo || tipo || "",
      }));
    }
  }, [placeDetails, existingData]);

  // Função melhorada para obter o endereço completo
  const getCompleteAddress = (details: any) => {
    if (!details) return "Endereço não disponível";

    // Prioridade 1: formatted_address (geralmente o mais completo)
    if (details.formatted_address) return details.formatted_address;

    // Prioridade 2: vicinity (mais comum em resultados de busca)
    if (details.vicinity) return details.vicinity;

    // Prioridade 3: Construir a partir dos componentes
    if (details.address_components) {
      const components = {
        street_number: details.address_components.find((c: any) =>
          c.types.includes("street_number")
        )?.long_name,
        route: details.address_components.find((c: any) =>
          c.types.includes("route")
        )?.long_name,
        sublocality: details.address_components.find((c: any) =>
          c.types.includes("sublocality")
        )?.long_name,
        locality: details.address_components.find((c: any) =>
          c.types.includes("locality")
        )?.long_name,
        administrative_area_level_1: details.address_components.find((c: any) =>
          c.types.includes("administrative_area_level_1")
        )?.short_name,
        country: details.address_components.find((c: any) =>
          c.types.includes("country")
        )?.long_name,
        postal_code: details.address_components.find((c: any) =>
          c.types.includes("postal_code")
        )?.long_name,
      };

      const addressParts = [];

      // Endereço linha 1 (rua e número)
      if (components.route) {
        addressParts.push(
          `${components.route}${
            components.street_number ? `, ${components.street_number}` : ""
          }`
        );
      }

      // Bairro
      if (components.sublocality) {
        addressParts.push(components.sublocality);
      }

      // Cidade/Estado
      if (components.locality && components.administrative_area_level_1) {
        addressParts.push(
          `${components.locality} - ${components.administrative_area_level_1}`
        );
      } else if (components.locality) {
        addressParts.push(components.locality);
      } else if (components.administrative_area_level_1) {
        addressParts.push(components.administrative_area_level_1);
      }

      // CEP e País (opcionais)
      if (components.postal_code) {
        addressParts.push(`CEP: ${components.postal_code}`);
      }
      if (components.country && components.country !== "Brazil") {
        addressParts.push(components.country);
      }

      if (addressParts.length > 0) {
        return addressParts.join(", ");
      }
    }

    return "Endereço não disponível";
  };

  // Determina o tipo de estabelecimento baseado nos types do Google
  const determinePlaceType = (types?: string[]) => {
    if (!types) return "";

    const typeMap: Record<string, string> = {
      store: "Loja/Comércio",
      clothing_store: "Loja/Comércio",
      shoe_store: "Loja/Comércio",
      restaurant: "Restaurante/Café",
      cafe: "Restaurante/Café",
      hospital: "Hospital/Clínica",
      doctor: "Hospital/Clínica",
      school: "Escola/Universidade",
      university: "Escola/Universidade",
      city_hall: "Órgão Público",
      park: "Parque/Praça",
    };

    for (const type of types) {
      if (typeMap[type]) {
        return typeMap[type];
      }
    }

    return "";
  };

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
    } else if (name !== "endereco") {
      // Impede a edição do endereço
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
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.2 }}
      className="p-6 h-full flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xl font-bold text-gray-800"
        >
          {existingData ? "Editar Acessibilidade" : "Cadastrar Acessibilidade"}
        </motion.h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl transition-transform hover:scale-110"
        >
          &times;
        </button>
      </div>

      {/* Dados do local */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-4 p-4 bg-gray-50 rounded-lg"
      >
        <h3 className="font-semibold text-lg">
          {placeDetails?.name || "Local selecionado"}
        </h3>
        <p className="text-gray-600">{getCompleteAddress(placeDetails)}</p>
        {selectedLocation && (
          <p className="text-sm text-gray-500 mt-1">
            Lat: {selectedLocation.lat.toFixed(6)}, Lng:{" "}
            {selectedLocation.lng.toFixed(6)}
          </p>
        )}
      </motion.div>

      {/* Exibir acessibilidades existentes */}
      {existingData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 p-3 bg-blue-50 rounded-lg"
        >
          <h4 className="font-medium text-blue-800 mb-2">
            Acessibilidades já cadastradas:
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(existingData.features)
              .filter(([_, value]) => value)
              .map(([key]) => (
                <motion.span
                  key={key}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize"
                >
                  {key.replace("_", " ")}
                </motion.span>
              ))}
          </div>
          {existingData.observations && (
            <p className="mt-2 text-sm text-blue-700">
              <span className="font-medium">Observações:</span>{" "}
              {existingData.observations}
            </p>
          )}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1 overflow-y-auto">
          {/* Tipo de estabelecimento */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <label className="block mb-1 font-medium">
              Tipo de Estabelecimento *
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">Selecione...</option>
              {tiposEstabelecimento.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Nome do local */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block mb-1 font-medium">Nome do Local *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </motion.div>

          {/* Endereço */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <label className="block mb-1 font-medium">Endereço *</label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              required
              readOnly
              className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </motion.div>

          {/* Recursos de acessibilidade */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block mb-2 font-medium">
              Recursos de Acessibilidade
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(formData.acessibilidades).map(([key, value]) => (
                <motion.label
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    name={key}
                    checked={value}
                    onChange={handleChange}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="capitalize">{key.replace("_", " ")}</span>
                </motion.label>
              ))}
            </div>
          </motion.div>

          {/* Imagens */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <label className="block mb-1 font-medium">Fotos (opcional)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <p className="text-xs text-gray-500 mt-1">
              Adicione fotos que comprovem as condições de acessibilidade
            </p>
          </motion.div>

          {/* Observações */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block mb-1 font-medium">Observações</label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Informações adicionais sobre a acessibilidade..."
            />
          </motion.div>
        </div>

        {/* Botões de ação */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-6 pt-4 border-t flex justify-between pb-10"
        >
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {existingData ? "Atualizar" : "Salvar"}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default SidebarForm;
