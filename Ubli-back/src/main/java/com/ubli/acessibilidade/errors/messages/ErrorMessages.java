package com.ubli.acessibilidade.errors.messages;

public enum ErrorMessages {
    EMAIL_INVALIDO("O email inserido não é válido"),
    CAMPO_VAZIO("O campo %s não pode estar vazio"),
    ERRO_INTERNO_SERVIDOR("Ocorreu um erro interno do servidor"),
    USUARIO_NAO_ENCONTRADO("Usuário não encontrado"),
    PONTO_NAO_ENCONTRADO("Ponto de acessibilidade não encontrado"),
    NENHUM_REGISTRO_ENCONTRADO("Nenhum registro encontrado"),
    ARQUIVO_NAO_ENCONTRADO("Nenhum arquivo encontrado"),
    ACAO_PROIBIDA("Você não tem permissão para realizar esta ação"),
    USUARIO_OU_SENHA_INCORRETOS("Usuário ou senha incorretos");

    public static final String EMAIL_INVALIDO_STRING = "O email inserido não é válido";
    public static final String CAMPO_VAZIO_STRING = "O campo <campo> não pode estar vazio";
    public static final String ERRO_INTERNO_SERVIDOR_STRING = "Ocorreu um erro interno do servidor";
    public static final String USUARIO_NAO_ENCONTRADO_STRING = "Usuário não encontrado";
    public static final String PONTO_NAO_ENCONTRADO_STRING = "Ponto de acessibilidade não encontrado";
    public static final String NENHUM_REGISTRO_ENCONTRADO_STRING = "Nenhum registro encontrado";
    public static final String ARQUIVO_NAO_ENCONTRADO_STRING = "Nenhum arquivo encontrado";
    public static final String ACAO_PROIBIDA_STRING = "Você não tem permissão para realizar esta ação";
    public static final String USUARIO_OU_SENHA_INCORRETOS_STRING = "Usuário ou senha incorretos";

    private final String mensagem;

    ErrorMessages(String mensagem) {
        this.mensagem = mensagem;
    }

    public String getMensagem() {
        return mensagem;
    }

    public String format(Object... args) {
        return String.format(mensagem, args);
    }
}
