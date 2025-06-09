package com.ubli.acessibilidade.model;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class FotosLocal {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "id_ponto_acessibilidade")
    private UUID idPontoAcessibilidade;
    @Column(name = "caminho_arquivo")
    private String caminhoArquivo;

    public FotosLocal() {
    }

    public FotosLocal(UUID idPontoAcessibilidade, String caminhoArquivo) {
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
