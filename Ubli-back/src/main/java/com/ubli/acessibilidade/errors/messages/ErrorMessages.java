package com.ubli.acessibilidade.errors.messages;

public enum ErrorMessages {
    EMAIL_INVALIDO("O email inserido não é válido"),
    CAMPO_VAZIO("O campo %s não pode estar vazio"),
    ERRO_INTERNO_SERVIDOR("Ocorreu um erro interno do servidor"),
    USUARIO_NAO_ENCONTRADO("Usuário não encontrado"),
    PONTO_NAO_ENCONTRADO("Ponto de acessibilidade não encontrado"),
    NENHUM_REGISTRO_ENCONTRADO("Nenhum registro encontrado"),
    ARQUIVO_NAO_ENCONTRADO("Nenhum arquivo encontrado");

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
