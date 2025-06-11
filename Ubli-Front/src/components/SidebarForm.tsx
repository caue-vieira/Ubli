import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
// Importações adicionadas do novo código
import ImageCarousel from "./ImageCarousel";
import { AccessibilityData } from "./maps/GoMap";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem } from "./ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import { Textarea } from "./ui/textarea";

// As interfaces permanecem as mesmas com adições do novo código
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
  onSave: (placeId: string, data: AccessibilityData) => Promise<boolean | void>;
}

const pontoFormSchema = z.object({
    descricao: z.string().min(5),
    endereco: z.string().min(8),
    acessibilidades: z.array(z.string()),
    tipo_estabelecimento: z.number().min(1),
})

const SidebarForm: React.FC<SidebarFormProps> = ({
  onClose,
  selectedLocation,
  placeDetails,
  existingData,
  onSave,
}) => {
    const pontoForm = useForm<z.infer<typeof pontoFormSchema>>({
        resolver: zodResolver(pontoFormSchema),
        defaultValues: {
            descricao: "",
            endereco: "",
            acessibilidades: [],
            tipo_estabelecimento: 0
        }
    })
  // Estado inicial padrão e vazio para o formulário
  const getInitialFormData = () => ({
    descricao: "",
    latidude: "",
    longitude: "",
    classificacao_local: 0,
    id_usuario: "",
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
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Adicionei logs para depuração. Verifique o console do navegador (F12).
    console.log("[SidebarForm] useEffect executado.");
    console.log("[SidebarForm] Dados existentes recebidos:", existingData);

    if (placeDetails) {
      // Começa com um estado base a partir dos detalhes do local
      let formState = {
        ...getInitialFormData(),
      };

      // Se houver dados salvos, eles SOBRESCREVEM o estado base.
      if (existingData) {
        console.log("[SidebarForm] Mesclando dados existentes no formulário.");
        formState = {
          ...formState,
          classificacao_local: existingData.classificacao_local,
          descricao: existingData.descricao,
        };
        // Define as imagens existentes para preview
        setImagePreviews(existingData.fotos_local || []);
      } else {
        // Garante que, se não houver dados, as imagens de preview sejam limpas
        setImagePreviews([]);
      }

      console.log(
        "[SidebarForm] Estado final definido no formulário:",
        formState
      );
      setFormData(formState);
    }
  }, [placeDetails, existingData]); // Dependências corretas

  // Funções auxiliares (sem alterações)
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        return reject(new Error("Apenas arquivos de imagem são permitidos"));
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        return reject(new Error("Imagem muito grande (máximo 5MB)"));
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const getCompleteAddress = (details: any) =>
    details?.formatted_address ||
    details?.vicinity ||
    "Endereço não disponível";
  const determinePlaceType = (types?: string[]) => {
    if (!types) return "";
    const typeMap: Record<string, string> = {
      store: "Loja/Comércio",
      restaurant: "Restaurante/Café",
      hospital: "Hospital/Clínica",
      school: "Escola/Universidade",
      city_hall: "Órgão Público",
      park: "Parque/Praça",
    };
    return types.map((t) => typeMap[t]).find(Boolean) || "Outro";
  };

  // Funções de manipulação de eventos (sem alterações)
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        acessibilidades: { ...prev.acessibilidades, [name]: e.target.checked },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setIsSaving(true);
    try {
      const newPreviews = await Promise.all(
        Array.from(e.target.files).map(convertToBase64)
      );
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImagePreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  // handleSubmit modificado para incluir as melhorias do novo código
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) return alert("Nenhum local selecionado.");

    // Garante um placeId único para salvar
    const placeId =
      selectedLocation.placeId ||
      `custom-${selectedLocation.lat}-${selectedLocation.lng}`;

    setIsSaving(true);
    try {
      const dataToSave: AccessibilityData = {
        descricao: formData.descricao,
        classificacao_local: formData.classificacao_local,
        latitude: 0,
        longitude: 0,
        id_usuario: "0",
        fotos_local: imagePreviews,
      };

      console.log("[SidebarForm] Salvando dados:", dataToSave);
      await onSave(placeId, dataToSave);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Ocorreu um erro ao salvar.");
    } finally {
      setIsSaving(false);
    }
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

  function onPontoSave(values: z.infer<typeof pontoFormSchema>) {
    console.log(values);
  }

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="p-6 h-full flex flex-col bg-white shadow-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {existingData ? "Editar Acessibilidade" : "Cadastrar Acessibilidade"}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 text-3xl"
        >
          &times;
        </button>
      </div>

      {/* Adicionado ImageCarousel do novo código */}
      {imagePreviews.length > 0 && (
        <ImageCarousel
          images={imagePreviews}
          className="mb-4 max-h-52 rounded-lg"
        />
      )}

      <div className="mb-4 p-4 bg-gray-100 rounded-lg border">
        <h3 className="font-semibold text-lg text-gray-900">
          {placeDetails?.name || "Local selecionado"}
        </h3>
        <p className="text-sm text-gray-600">{formData.endereco}</p>
      </div>

      <Form {...pontoForm}>
        <form onSubmit={pontoForm.handleSubmit(onPontoSave)}>
            <FormField 
                control={pontoForm.control}
                name="endereco"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Tipo de Estabelecimento</FormLabel>
                        <FormControl>
                            <Select {...field}>
                                <SelectTrigger>Selecione</SelectTrigger>
                                <SelectContent>
                                    {tiposEstabelecimento.map((tipoEstabelecimento, index) => (
                                        <SelectItem value={String(index)}>
                                            {tipoEstabelecimento}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                    </FormItem>
                )}
            />
            {/* 
            Adicionar componente checkbox shadcn
            <FormField 
                control={pontoForm.control}
                name="acessibilidades"
                render={}
            /> */}
            <FormField 
                control={pontoForm.control}
                name="descricao"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Descrição" {...field}></Textarea>
                        </FormControl>
                    </FormItem>
                )}
            />
            {/**
             * Faltam: "endereco" e "acessibilidades"
             */}
        </form>
      </Form>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
        <div className="space-y-5 flex-1 overflow-y-auto pr-3">
          {/* Tipo de estabelecimento */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Tipo de Estabelecimento *
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Selecione...
              </option>
              {tiposEstabelecimento.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          {/* Recursos de acessibilidade */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Recursos de Acessibilidade
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              {Object.entries(formData.acessibilidades).map(([key, value]) => (
                <label
                  key={key}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name={key}
                    checked={value}
                    onChange={handleChange}
                    className="h-5 w-5 text-blue-600 rounded border-gray-400 focus:ring-blue-500"
                  />
                  <span className="capitalize text-gray-800">
                    {key.replace(/_/g, " ")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Imagens */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Fotos do local/Acessibilidade
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={isSaving}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Observações */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Observações
            </label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Informações adicionais..."
            />
          </div>

          {/* Adicionado seção de avaliações do novo código */}
        </div>

        {/* Botões de ação */}
        <div className="mt-6 pt-4 border-t flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-wait"
          >
            {isSaving ? "Salvando..." : existingData ? "Atualizar" : "Salvar"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default SidebarForm;
