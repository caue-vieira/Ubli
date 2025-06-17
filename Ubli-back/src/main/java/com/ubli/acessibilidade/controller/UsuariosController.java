package com.ubli.acessibilidade.controller;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.ubli.acessibilidade.dto.LoginRequestDTO;
import com.ubli.acessibilidade.dto.LoginResponseDTO;
import com.ubli.acessibilidade.errors.ErrorResponseDTO;
import com.ubli.acessibilidade.errors.exceptions.DataNotFoundException;
import com.ubli.acessibilidade.errors.exceptions.EmptyFieldException;
import com.ubli.acessibilidade.errors.exceptions.InvalidFieldException;
import com.ubli.acessibilidade.errors.messages.ErrorMessages;
import com.ubli.acessibilidade.interfaces.repository.IUsuarioRepository;
import com.ubli.acessibilidade.interfaces.service.IUsuarioService;
import com.ubli.acessibilidade.model.Usuario;
import com.ubli.acessibilidade.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

// Apenas define o nome da tag no Swagger
@Tag(name = "Usuários")
// Define este controller como sendo um RestController, permitindo ao JPA reconhecê-lo como um controller
@RestController
// Define a rota principal do controller (todas as rotas das funções iniciarão com /usuario/...)
@RequestMapping("/usuario")
public class UsuariosController {

    // Faz a criação automática do contrutor
    @Autowired
    private IUsuarioService _usuarioService;
    @Autowired
    private IUsuarioRepository _iUsuarioRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthService _authService;

    @ResponseStatus(code = HttpStatus.OK)
    @Operation(summary = "Faz login do usuário")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", content = @Content),
        @ApiResponse(responseCode = "401", description = ErrorMessages.USUARIO_OU_SENHA_INCORRETOS_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        ))
    })
    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginRequestDTO loginRequest) {
    try {
        // Adicione logs para depuração
        System.out.println("Email recebido: " + loginRequest.email);
        System.out.println("Senha recebida: " + loginRequest.senha);

        Optional<Usuario> usuarioOpt = _iUsuarioRepository.findByEmail(loginRequest.email.trim());
        
        if (usuarioOpt.isEmpty()) {
            System.out.println("Usuário não encontrado");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                   .body(new ErrorResponseDTO("Credenciais inválidas"));
        }

        Usuario usuario = usuarioOpt.get();
        System.out.println("Hash no banco: " + usuario.getSenha());
        
        // Verifique se a senha foi codificada
        boolean senhaValida = passwordEncoder.matches(loginRequest.senha.trim(), usuario.getSenha());
        System.out.println("Senha válida? " + senhaValida);

        if (!senhaValida) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                   .body(new ErrorResponseDTO("Credenciais inválidas"));
        }

        String token = _authService.generateToken(usuario);
        return ResponseEntity.ok(new LoginResponseDTO(token));

    } catch (Exception e) {
        System.out.println("Erro no login: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
               .body(new ErrorResponseDTO("Erro interno no servidor"));
    }
}

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
        @ApiResponse(responseCode = "400", description = ErrorMessages.CAMPO_VAZIO_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        )),
        @ApiResponse(responseCode = "500", description = ErrorMessages.ERRO_INTERNO_SERVIDOR_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        )),
    })
    @PostMapping("/cadastrar")
    public ResponseEntity<Object> cadastraUsuario(@RequestBody Usuario usuario) {
    try {
        // Codifique a senha antes de salvar
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        Usuario _usuario = _usuarioService.cadastrarUsuario(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(_usuario);
    } catch(EmptyFieldException | InvalidFieldException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponseDTO(e.getMessage()));
    } catch(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
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
        @ApiResponse(responseCode = "404", description = ErrorMessages.USUARIO_NAO_ENCONTRADO_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        )),
        @ApiResponse(responseCode = "500", description = ErrorMessages.ERRO_INTERNO_SERVIDOR_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        )),
    })
    @GetMapping("/{id}")
    public ResponseEntity<Object> buscaUsuarioId(@PathVariable UUID id) {
        try {
            Usuario usuario = _usuarioService.buscaUsuarioId(id);
            return ResponseEntity.ok(usuario);
        } catch(DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponseDTO(e.getMessage()));
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
        @ApiResponse(responseCode = "400", description = ErrorMessages.CAMPO_VAZIO_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        )),
        @ApiResponse(responseCode = "404", description = ErrorMessages.USUARIO_NAO_ENCONTRADO_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        )),
        @ApiResponse(responseCode = "500", description = ErrorMessages.ERRO_INTERNO_SERVIDOR_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        )),
    })
    @PutMapping("/{id}/editar")
    public ResponseEntity<Object> editaUsuario(@PathVariable UUID id, @RequestBody Usuario usuario) {
        try {
            Usuario _usuario = _usuarioService.editaUsuario(usuario, id);
            return ResponseEntity.status(HttpStatus.OK).body(_usuario);
        } catch(DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponseDTO(e.getMessage()));
        } catch(EmptyFieldException | InvalidFieldException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponseDTO(e.getMessage()));
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ErrorMessages.ERRO_INTERNO_SERVIDOR.getMensagem());
        }
    }

    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    @Operation(summary = "Exclui um usuário no banco de dados", description = "Endpoint para exclusão de um usuário no banco de dados com base no ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", content = @Content),
        @ApiResponse(responseCode = "404", description = ErrorMessages.USUARIO_NAO_ENCONTRADO_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        )),
        @ApiResponse(responseCode = "500", description = ErrorMessages.ERRO_INTERNO_SERVIDOR_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        )),
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
