package com.ubli.acessibilidade.validators;

import com.ubli.acessibilidade.errors.InvalidFieldException;
import com.ubli.acessibilidade.model.Usuario;

public class UsuarioValidator {
    public static void ValidateUsuario(Usuario usuario) {
        GenericValidator.ValidateStringNotEmptyOrNull(usuario.getNome(), "Nome");
        GenericValidator.ValidateEmail(usuario.getEmail());
        GenericValidator.ValidateStringNotEmptyOrNull(usuario.getSenha(), "Senha");
        ValidateCPF(usuario.getCpf());
    }

    public static void ValidateCPF(String cpf) {
        GenericValidator.ValidateStringNotEmptyOrNull(cpf, "CPF");

        int[] digitosCpf = new int[9];
        int somaResMultiplicacao = 0;

        int digitoVerificadorUm = 0;
        int digitoVerificadorDois = 0;

        // Primeiro dígito verificador
        for (int i = 0; i < 9; i++) {
            int digito = Character.getNumericValue(cpf.charAt(i));
            digitosCpf[i] = digito;
            somaResMultiplicacao += digito * (10 - i);
        }

        if (somaResMultiplicacao % 11 >= 2) {
            digitoVerificadorUm = 11 - (somaResMultiplicacao % 11);
        }

        somaResMultiplicacao = 0;

        // Segundo dígito verificador
        for (int i = 0; i < 9; i++) {
            somaResMultiplicacao += digitosCpf[i] * (11 - i);
        }
        somaResMultiplicacao += digitoVerificadorUm * 2;

        if (somaResMultiplicacao % 11 >= 2) {
            digitoVerificadorDois = 11 - (somaResMultiplicacao % 11);
        }

        // Verificação final
        int verificador1Informado = Character.getNumericValue(cpf.charAt(9));
        int verificador2Informado = Character.getNumericValue(cpf.charAt(10));

        if (verificador1Informado != digitoVerificadorUm || verificador2Informado != digitoVerificadorDois) {
            throw new InvalidFieldException("O CPF informado não é válido");
        }
    }
}
