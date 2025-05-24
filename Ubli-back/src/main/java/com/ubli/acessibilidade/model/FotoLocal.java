package com.ubli.acessibilidade.model;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class FotoLocal {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private UUID idPontoAcessibilidade;
    private String caminhoArquivo;

    public FotoLocal() {
    }

    public FotoLocal(UUID idPontoAcessibilidade, String caminhoArquivo) {
        this.idPontoAcessibilidade = idPontoAcessibilidade;
        this.caminhoArquivo = caminhoArquivo;
    }

    public UUID getId() {
        return id;
    }

    @JsonIgnore
    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getIdPontoAcessibilidade() {
        return idPontoAcessibilidade;
    }

    public void setIdPontoAcessibilidade(UUID idPontoAcessibilidade) {
        this.idPontoAcessibilidade = idPontoAcessibilidade;
    }

    public String getCaminhoArquivo() {
        return caminhoArquivo;
    }

    public void setCaminhoArquivo(String caminhoArquivo) {
        this.caminhoArquivo = caminhoArquivo;
    }
}
