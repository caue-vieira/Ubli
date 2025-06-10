package com.ubli.acessibilidade.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ubli.acessibilidade.errors.ErrorResponseDTO;
import com.ubli.acessibilidade.errors.exceptions.DataNotFoundException;
import com.ubli.acessibilidade.errors.messages.ErrorMessages;
import com.ubli.acessibilidade.interfaces.service.IFotoLocalService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Fotos do Local")
@RestController
@RequestMapping("/imagens")
public class FotosLocalController {
    
    @Autowired
    private IFotoLocalService _fotoLocalService;

    @ResponseStatus(code = HttpStatus.OK)
    @Operation(summary = "Adiciona uma foto à um ponto já existente", description = "Endpoint para adição de fotos à um ponto de acessibilidade já cadastrado no banco de dados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", content = @Content),
        @ApiResponse(responseCode = "500", description = ErrorMessages.ERRO_INTERNO_SERVIDOR_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        )),
    })
    @PostMapping(value = "/{id}/adicionar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> adicionaFotoPonto(@PathVariable("id") UUID idPontoAcessibilidade, @RequestPart List<MultipartFile> fotos) {
        try {
            _fotoLocalService.adicionaFotoLocal(fotos, idPontoAcessibilidade);
            return ResponseEntity.ok().build();
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponseDTO(e.getMessage()));
        }
    }

    @ResponseStatus(code = HttpStatus.OK)
    @Operation(summary = "Exclui uma foto com base no id do ponto e da foto", description = "Endpoint para exclusão de uma foto única de um ponto de acessibilidade com base no id")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", content = @Content),
        @ApiResponse(responseCode = "404", description = ErrorMessages.PONTO_NAO_ENCONTRADO_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        )),
        @ApiResponse(responseCode = "500", description = ErrorMessages.ERRO_INTERNO_SERVIDOR_STRING, content = @Content(
            schema = @Schema(implementation = ErrorResponseDTO.class)
        )),
    })
    @DeleteMapping("/{id}/excluir")
    public ResponseEntity<Object> excluiFoto(@PathVariable("id") UUID idFotoLocal) {
        try {
            _fotoLocalService.excluiFotoLocal(idFotoLocal);
            return ResponseEntity.ok().build();
        } catch(DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponseDTO(e.getMessage()));
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponseDTO(e.getMessage()));
        }
    }
}
