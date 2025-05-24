package com.ubli.acessibilidade.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.errors.DataNotFoundException;
import com.errors.EmptyFieldException;
import com.errors.InvalidFieldException;
import com.errors.messages.ErrorMessages;
import com.ubli.acessibilidade.interfaces.service.IUsuarioService;
import com.ubli.acessibilidade.model.Usuario;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

// Apenas define o nome da tag no Swagger
@Tag(name = "Usuários")
// Defne este controller como sendo um RestController, permitindo ao JPA reconhecê-lo como um controller
@RestController
// Define a rota principal do controller (todas as rotas das funções iniciarão com /usuario/...)
@RequestMapping("/usuario")
public class UsuariosController {

    // Faz a criação automática do contrutor
    @Autowired
    private IUsuarioService _usuarioService;

    /*
     * A anotação Operation edita a descrição da rota no Swagger
     */
    @ResponseStatus(code = HttpStatus.CREATED)
    @Operation(summary = "Cadastra um novo usuário no banco de dados", description = "Endpoint para criação de um novo usuário no banco de dados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = Usuario.class)
        )),
        @ApiResponse(responseCode = "400", content = @Content),
        @ApiResponse(responseCode = "500", content = @Content),
    })
    @PostMapping("/cadastrar")
    public ResponseEntity<Object> cadastraUsuario(@RequestBody Usuario usuario) {
        try {
            Usuario _usuario = _usuarioService.cadastrarUsuario(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(_usuario);
        } catch(EmptyFieldException | InvalidFieldException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ErrorMessages.ERRO_INTERNO_SERVIDOR.getMensagem());
        }
    }

    /*
     * A anotação ApiResponses cria um array de valores de respostas para o endpoint
     * 
     * A anotação ApiResponse define a resposta da api, contendo o código e uma descrição, além de um exemplo de valor que pode ser retornado
     *
     * O ResponseEntity é responsável por criar o objeto de resposta que será enviado para o front-end
     * Neste caso, o tipo dele (entre <>) é apenas um Object, significando que ele pode retornar qualquer tipo de objeto, porém é possível definir tipos específicos como Usuario
     * 
     * A anotação PathVariable "diz" para a função que o parâmetro virá do caminho da URL (http://localhost:8080/usuario/2, onde o 2 é o que será passado para o PathVariable)
     * 
     * O GetMapping define que esta função será acessada através do método Get na rota com o parâmetro mutável "/{id}"
    */
    @ResponseStatus(code = HttpStatus.OK)
    @Operation(summary = "Busca um usuário no banco de dados", description = "Endpoint para buscar de um usuário no banco de dados com base no ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = Usuario.class)
        )),
        @ApiResponse(responseCode = "404", content = @Content),
        @ApiResponse(responseCode = "500", content = @Content),
    })
    @GetMapping("/{id}")
    public ResponseEntity<Object> buscaUsuarioId(@PathVariable UUID id) {
        try {
            Usuario usuario = _usuarioService.buscaUsuarioId(id);
            return ResponseEntity.ok(usuario);
        } catch(DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ErrorMessages.ERRO_INTERNO_SERVIDOR.getMensagem());
        }
    }

    // O RequestBody "diz" para a função que um dos parâmetros dela virá do corpo da requisição
    @ResponseStatus(code = HttpStatus.OK)
    @Operation(summary = "Edita um usuário no banco de dados", description = "Endpoint para edição de um usuário no banco de dados com base no ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = Usuario.class)
        )),
        @ApiResponse(responseCode = "400", content = @Content),
        @ApiResponse(responseCode = "404", content = @Content),
        @ApiResponse(responseCode = "500", content = @Content),
    })
    @PutMapping("/{id}/editar")
    public ResponseEntity<Object> editaUsuario(@PathVariable UUID id, @RequestBody Usuario usuario) {
        try {
            Usuario _usuario = _usuarioService.editaUsuario(usuario, id);
            return ResponseEntity.status(HttpStatus.OK).body(_usuario);
        } catch(DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch(EmptyFieldException | InvalidFieldException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ErrorMessages.ERRO_INTERNO_SERVIDOR.getMensagem());
        }
    }

    @Operation(summary = "Exclui um usuário no banco de dados", description = "Endpoint para exclusão de um usuário no banco de dados com base no ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", content = @Content),
        @ApiResponse(responseCode = "404", content = @Content),
        @ApiResponse(responseCode = "500", content = @Content),
    })
    @DeleteMapping("/{id}/excluir")
    public ResponseEntity<String> excluiUsuario(@PathVariable UUID id) {
        try {
            _usuarioService.excluiUsuario(id);
            return ResponseEntity.noContent().build();
        } catch(DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorMessages.USUARIO_NAO_ENCONTRADO.getMensagem());
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ErrorMessages.ERRO_INTERNO_SERVIDOR.getMensagem());
        }
    }
}
