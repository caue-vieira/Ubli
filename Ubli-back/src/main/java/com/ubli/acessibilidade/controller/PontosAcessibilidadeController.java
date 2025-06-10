package com.ubli.acessibilidade.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ubli.acessibilidade.dto.PontoAcessibilidadeDTO;
import com.ubli.acessibilidade.errors.ErrorResponseDTO;
import com.ubli.acessibilidade.errors.exceptions.DataNotFoundException;
import com.ubli.acessibilidade.errors.exceptions.EmptyFieldException;
import com.ubli.acessibilidade.errors.messages.ErrorMessages;
import com.ubli.acessibilidade.interfaces.service.IFotoLocalService;
import com.ubli.acessibilidade.interfaces.service.IPontoAcessibilidadeService;
import com.ubli.acessibilidade.model.PontoAcessibilidade;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Pontos de Acessibilidade")
@RestController
@RequestMapping("/acessibilidade")
public class PontosAcessibilidadeController {

    @Autowired
    private IPontoAcessibilidadeService _pontoAcessibilidadeService;
    @Autowired
    private IFotoLocalService _fotoLocalService;

    @ResponseStatus(code = HttpStatus.CREATED)
    @Operation(summary = "Cadastra um novo ponto de acessibilidade", description = "Endpoint para cadastro de um novo ponto de acessibilidade no banco de dados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = PontoAcessibilidade.class)
        )),
        @ApiResponse(responseCode = "400", description = ErrorMessages.CAMPO_VAZIO_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        )),
        @ApiResponse(responseCode = "500", description = ErrorMessages.ERRO_INTERNO_SERVIDOR_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        )),
    })
    @PostMapping(value = "/adicionar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> cadastraPontoAcessibilidade(
        @RequestPart("ponto_acessibilidade") PontoAcessibilidadeDTO pontoAcessibilidadeDto,
        @RequestPart("fotos_local") List<MultipartFile> fotos
    ) {
        try {
            // Está correto em retornar um PontoAcessibilidade ao invés do DTO pois ele irá retornar o ponto específico
            PontoAcessibilidade _pontoAcessibilidade = _pontoAcessibilidadeService.cadastraPontoAcessibilidade(pontoAcessibilidadeDto);
            // Retorna o id do objeto salvo;
            UUID idPonto = _pontoAcessibilidade.getId();

            // Utiliza o id e a lista recebida na requisição para adicionar as fotos
            _fotoLocalService.adicionaFotoLocal(fotos, idPonto);
            return ResponseEntity.status(HttpStatus.CREATED).body(_pontoAcessibilidade);
        } catch(EmptyFieldException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponseDTO(e.getMessage()));
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ErrorMessages.ERRO_INTERNO_SERVIDOR.getMensagem());
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Busca os pontos de acessibilidade", description = "Endpoint para busca de todos os pontos de acessibilidade no banco de dados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", content = @Content(
            mediaType = "application/json",
            array = @ArraySchema(schema = @Schema(implementation = PontoAcessibilidadeDTO.class))
        )),
        @ApiResponse(responseCode = "404", description = ErrorMessages.NENHUM_REGISTRO_ENCONTRADO_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        )),
        @ApiResponse(responseCode = "500", description = ErrorMessages.ERRO_INTERNO_SERVIDOR_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        )),
    })
    @GetMapping("/buscar")
    public ResponseEntity<Object> buscaPontosAcessibilidade() {
        // A função não irá retornar o campo "fotosLocal", apenas os dados presentes no DTO
        try {
            List<PontoAcessibilidadeDTO> pontosAcessibilidade = _pontoAcessibilidadeService.buscaPontosAcessibilidade();
            return ResponseEntity.status(HttpStatus.OK).body(pontosAcessibilidade);
        } catch(DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponseDTO(e.getMessage()));
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ErrorMessages.ERRO_INTERNO_SERVIDOR.getMensagem());
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Busca os pontos de acessibilidade por filtro", description = "Endpoint para busca de todos os pontos de acessibilidade por filtro no banco de dados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", content = @Content(
            mediaType = "application/json",
            array = @ArraySchema(schema = @Schema(implementation = PontoAcessibilidadeDTO.class))
        )),
        @ApiResponse(responseCode = "404", description = ErrorMessages.NENHUM_REGISTRO_ENCONTRADO_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        )),
        @ApiResponse(responseCode = "500", description = ErrorMessages.ERRO_INTERNO_SERVIDOR_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        )),
    })
    @GetMapping("/buscar/{filtro}")
    public ResponseEntity<Object> buscaPontosAcessibilidadeFiltro(@PathVariable int filtro) {
        try {
            List<PontoAcessibilidadeDTO> pontosAcessibilidade = _pontoAcessibilidadeService.buscaPontoAcessibilidadeFiltro(filtro);
            return ResponseEntity.status(HttpStatus.OK).body(pontosAcessibilidade);
        } catch(DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponseDTO(e.getMessage()));
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ErrorMessages.ERRO_INTERNO_SERVIDOR.getMensagem());
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Busca um ponto de acessibilidade pelo id", description = "Endpoint para busca de um ponto de acessibilidade pelo seu id")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = PontoAcessibilidade.class)
        )),
        @ApiResponse(responseCode = "404", description = ErrorMessages.PONTO_NAO_ENCONTRADO_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        )),
        @ApiResponse(responseCode = "500", description = ErrorMessages.ERRO_INTERNO_SERVIDOR_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        )),
    })
    @GetMapping("/buscar/{id}")
    public ResponseEntity<Object> buscaPontoAcessibilidadeId(@PathVariable UUID id) {
        /* 
         * A função está correta, já que retorna um registro do banco e adiciona um campo efêmero "fotosLocal" e adiciona as fotos encontradas à ele
         * Isto evita um campo desnecessário no banco (já que na própria definição do model, este campo é "Transient") e em retornos/requisições
        */
        try {
            // Busca os pontos pelo id informado
            PontoAcessibilidade pontoAcessibilidade = _pontoAcessibilidadeService.buscaPontoAcessibilidadeId(id);
            // Busca as fotos pelo id do ponto informado e seta o campo "fotosLocal"
            List<String> fotos = _fotoLocalService.buscaFotosLocal(id);
            pontoAcessibilidade.setFotosLocal(fotos);
            
            return ResponseEntity.status(HttpStatus.OK).body(pontoAcessibilidade);
        } catch(DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponseDTO(e.getMessage()));
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ErrorMessages.ERRO_INTERNO_SERVIDOR.getMensagem());
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Edita um ponto de acessibilidade", description = "Endpoint para edição de um ponto de acessibilidade no banco de dados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = PontoAcessibilidade.class)
        )),
        @ApiResponse(responseCode = "400", description = ErrorMessages.CAMPO_VAZIO_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        )),
        @ApiResponse(responseCode = "403", description = ErrorMessages.ACAO_PROIBIDA_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        )),
        @ApiResponse(responseCode = "404", description = ErrorMessages.PONTO_NAO_ENCONTRADO_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        )),
        @ApiResponse(responseCode = "500", description = ErrorMessages.ERRO_INTERNO_SERVIDOR_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        )),
    })
    @PutMapping("/{id}/editar")
    public ResponseEntity<Object> editaPontoAcessibilidade(@PathVariable UUID id, @RequestBody PontoAcessibilidadeDTO pontoAcessibilidadeDto) {
        try {
            // Função correta, edita os pontos necessários e retorna um model
            PontoAcessibilidade _pontoAcessibilidade = _pontoAcessibilidadeService.editPontoAcessibilidade(pontoAcessibilidadeDto, id);
            return ResponseEntity.status(HttpStatus.OK).body(_pontoAcessibilidade);
        } catch(DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponseDTO(e.getMessage()));
        } catch(EmptyFieldException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponseDTO(e.getMessage()));
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ErrorMessages.ERRO_INTERNO_SERVIDOR.getMensagem());
        }
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Exclui um ponto de acessibilidade", description = "Endpoint para a exclusão de um ponto de acessibilidade no banco de dados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", content = @Content),
        @ApiResponse(responseCode = "404", description = ErrorMessages.PONTO_NAO_ENCONTRADO_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        )),
        @ApiResponse(responseCode = "500", description = ErrorMessages.ERRO_INTERNO_SERVIDOR_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        )),
    })
    @DeleteMapping("/{id}/excluir")
    public ResponseEntity<Object> excluiPontoAcessibilidade(@PathVariable("id") UUID idPontoAcessibilidade) {
        try {
            // Função correta (checar apenas o service), exclui o ponto e o diretório do mesmo
            _pontoAcessibilidadeService.excluiPontoAcessibilidadeId(idPontoAcessibilidade);
            _fotoLocalService.excluiFotoLocalIdPonto(idPontoAcessibilidade);
            return ResponseEntity.noContent().build();
        } catch(DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponseDTO(e.getMessage()));
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ErrorMessages.ERRO_INTERNO_SERVIDOR.getMensagem());
        }
    }
}
