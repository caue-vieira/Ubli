import { useState } from "react";
import { SidebarTrigger } from "./ui/sidebar";

const ProblemReportPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        problemType: "",
        description: "",
        attachments: null,
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Dados do formulário:", formData);
        // Aicionar a lógica para enviar os dados
        setSubmitted(true);
        setFormData({
            name: "",
            email: "",
            problemType: "",
            description: "",
            attachments: null,
        });
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10 text-center">
                        <h2 className="text-2xl font-bold text-blue-600 mb-4">
                            Obrigado pelo seu relatório!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Seu problema foi registrado com sucesso. Nossa
                            equipe entrará em contato em breve.
                        </p>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Enviar outro relatório
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            {/* Botão do sidebar */}
            <div className="absolute top-10 left-4 z-[3]">
                <SidebarTrigger className="bg-white text-black p-2 rounded shadow" />
            </div>

            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Reportar Problema
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Preencha o formulário abaixo para nos informar sobre o
                        problema encontrado.
                    </p>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <form onSubmit={handleSubmit} className="px-6 py-8 sm:p-10">
                        <div className="space-y-6">
                            {/* Campo Nome */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Seu Nome{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            {/* Campo Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Seu Email{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            {/* Tipo de Problema */}
                            <div>
                                <label
                                    htmlFor="problemType"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Tipo de Problema{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="problemType"
                                        name="problemType"
                                        required
                                        value={formData.problemType}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                        <option value="">
                                            Selecione o tipo de problema
                                        </option>
                                        <option value="technical">
                                            Problema Técnico
                                        </option>
                                        <option value="content">
                                            Conteúdo Incorreto
                                        </option>
                                        <option value="usability">
                                            Dificuldade de Uso
                                        </option>
                                        <option value="other">Outro</option>
                                    </select>
                                </div>
                            </div>

                            {/* Descrição */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Descrição do Problema{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        required
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            {/* Anexos */}
                            <div>
                                <label
                                    htmlFor="attachments"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Anexar Imagem do Problema (Opcional)
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="attachments"
                                        name="attachments"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    Formatos aceitos: JPG, PNG (Máx. 5MB)
                                </p>
                            </div>

                            {/* Botão de Envio */}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Enviar Relatório
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>
                        Nossa equipe entrará em contato em até 48 horas úteis.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProblemReportPage;
