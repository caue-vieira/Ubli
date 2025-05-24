package com.ubli.acessibilidade;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

/*
 * Adicionar:
 * - JWT para verificação de login
 * - Validação nos controllers de edição, exclusão e criação
 * (impedir que o usuário edite um ponto que ele não criou e permitir que apenas usuários com sessão possam criar um ponto)
 */
@SpringBootApplication
@OpenAPIDefinition(info = @Info(title = "Ubli - Acessibilidade urbana"))
public class AcessibilidadeApplication {

	public static void main(String[] args) {
		SpringApplication.run(AcessibilidadeApplication.class, args);
	}

}
