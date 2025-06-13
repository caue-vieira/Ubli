import { useState, useEffect } from "react";

import ImageCarousel from "./ImageCarousel";
import type { AccessibilityData } from "./maps/GoMap";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";

import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// As interfaces permanecem as mesmas com adições do novo código
interface SidebarFormProps {
    onClose: () => void;
    selectedLocation: {
        lat: number;
        lng: number;
        placeId?: string;
    };
    placeDetails: {
        name: string;
        vicinity: string;
        formatted_address: string;
        types: string[];
        address_components?: {
            long_name: string;
            short_name: string;
            types: [];
        }[];
    } | null;
    existingData?: AccessibilityData | null;
    onSave: (data: AccessibilityData) => void;
}

const pontoFormSchema = z.object({
    descricao: z.string(),
    endereco: z.string(),
    acessibilidades: z.array(z.string()),
    tipo_estabelecimento: z.string().min(1),
    fotos_local: z.array(z.string()),
});

const tiposAcessibilidade = [
    "Rampa",
    "Elevador",
    "Banheiro acessível",
    "Sinalização tátil",
    "Estacionamento reservado",
    "Piso tátil",
    "Acesso para cadeirantes",
    "Audiodescrição",
    "Braile",
];

const tiposEstabelecimento = [
    "Loja/Comércio",
    "Restaurante/Café",
    "Hospital/Clínica",
    "Escola/Universidade",
    "Órgão Público",
    "Parque/Praça",
    "Outro",
];

function SidebarForm({
    onClose,
    selectedLocation,
    placeDetails,
    existingData,
    onSave,
}: SidebarFormProps) {
    const pontoForm = useForm<z.infer<typeof pontoFormSchema>>({
        resolver: zodResolver(pontoFormSchema),
        defaultValues: {
            descricao: "",
            endereco: "",
            acessibilidades: [],
            tipo_estabelecimento: "",
            fotos_local: [],
        },
    });
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

    // Dados do formulário. Utilizar para preencher os campos do formulário caso seja uma edição
    // const [formData, setFormData] = useState(getInitialFormData());
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    // Verificar useEffect e remodelá-lo para preencher os campos do formulário
    useEffect(() => {
        // Remover os logs após concluído
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
                formState = {
                    ...formState,
                    classificacao_local: existingData.classificacao_local,
                    descricao:
                        existingData.descricao == null
                            ? ""
                            : existingData.descricao,
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
        }
    }, [placeDetails, existingData]); // Dependências corretas

    function onPontoSave(values: z.infer<typeof pontoFormSchema>) {
        const novoPonto = {
            descricao: values.descricao === "" ? null : values.descricao,
            endereco:
                placeDetails === null
                    ? values.endereco
                    : placeDetails.formatted_address,
            acessibilidades: values.acessibilidades,
            tipo_estabelecimento: Number(values.tipo_estabelecimento),
            fotos_local: values.fotos_local,
            classificacao_local:
                values.acessibilidades.length < 9
                    ? values.acessibilidades.length < 5
                        ? 0
                        : 1
                    : 2,
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng,
            // id_usuario será adicionado no backend através do token JWT
        };
        onSave(novoPonto);
        console.log(novoPonto);
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
                    {existingData
                        ? "Editar Acessibilidade"
                        : "Cadastrar Acessibilidade"}
                </h2>
                <button
                    type="button"
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
            </div>
            {/**
             * Ao editar, inserir os valores nos campos do formulário
             */}
            <Form {...pontoForm}>
                <form
                    onSubmit={pontoForm.handleSubmit(onPontoSave)}
                    className="h-full flex flex-col justify-between"
                >
                    <div className="flex flex-col gap-5">
                        <FormField
                            control={pontoForm.control}
                            name="endereco"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Endereço</FormLabel>
                                    <FormControl>
                                        <Input
                                            readOnly
                                            value={
                                                placeDetails == null
                                                    ? "Sem endereço disponível"
                                                    : placeDetails.formatted_address
                                            }
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={pontoForm.control}
                            name="tipo_estabelecimento"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Tipo de Estabelecimento
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                {tiposEstabelecimento[
                                                    Number(field.value)
                                                ] ?? "Selecione"}
                                            </SelectTrigger>
                                            <SelectContent>
                                                {tiposEstabelecimento.map(
                                                    (
                                                        tipoEstabelecimento,
                                                        index
                                                    ) => (
                                                        <SelectItem
                                                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                                            key={index}
                                                            value={String(
                                                                index
                                                            )}
                                                        >
                                                            {
                                                                tipoEstabelecimento
                                                            }
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={pontoForm.control}
                            name="acessibilidades"
                            render={() => (
                                <FormItem>
                                    <FormLabel>
                                        Recursos de acessibilidade
                                    </FormLabel>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                                        {tiposAcessibilidade.map((tipo) => (
                                            <FormField
                                                key={tipo}
                                                control={pontoForm.control}
                                                name="acessibilidades"
                                                render={({ field }) => {
                                                    const isChecked =
                                                        field.value?.includes(
                                                            tipo
                                                        );

                                                    const handleChange = (
                                                        checked: boolean
                                                    ) => {
                                                        if (checked) {
                                                            field.onChange([
                                                                ...field.value,
                                                                tipo,
                                                            ]);
                                                        } else {
                                                            field.onChange(
                                                                field.value.filter(
                                                                    (
                                                                        item: string
                                                                    ) =>
                                                                        item !==
                                                                        tipo
                                                                )
                                                            );
                                                        }
                                                    };

                                                    return (
                                                        <FormItem
                                                            key={tipo}
                                                            className="flex flex-row items-start space-x-3 space-y-0"
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={
                                                                        isChecked
                                                                    }
                                                                    onCheckedChange={
                                                                        handleChange
                                                                    }
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="text-sm font-normal">
                                                                {tipo}
                                                            </FormLabel>
                                                        </FormItem>
                                                    );
                                                }}
                                            />
                                        ))}
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={pontoForm.control}
                            name="fotos_local"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fotos do local</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={async (e) => {
                                                const files = e.target.files;
                                                if (!files) return;

                                                const base64Promises =
                                                    Array.from(files).map(
                                                        (file) => {
                                                            return new Promise<string>(
                                                                (
                                                                    resolve,
                                                                    reject
                                                                ) => {
                                                                    const reader =
                                                                        new FileReader();
                                                                    reader.onload =
                                                                        () =>
                                                                            resolve(
                                                                                reader.result as string
                                                                            );
                                                                    reader.onerror =
                                                                        reject;
                                                                    reader.readAsDataURL(
                                                                        file
                                                                    );
                                                                }
                                                            );
                                                        }
                                                    );

                                                try {
                                                    const base64Images =
                                                        await Promise.all(
                                                            base64Promises
                                                        );
                                                    field.onChange(
                                                        base64Images
                                                    );
                                                } catch (err) {
                                                    console.error(
                                                        "Erro ao ler arquivos:",
                                                        err
                                                    );
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={pontoForm.control}
                            name="descricao"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Observações</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Observações adicionais"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
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
                            className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-wait"
                        >
                            {existingData ? "Atualizar" : "Salvar"}
                        </button>
                    </div>
                </form>
            </Form>
        </motion.div>
    );
}

export default SidebarForm;
