package com.ubli.acessibilidade.dto;

import java.util.UUID;

import com.ubli.acessibilidade.model.PontoAcessibilidade;

public class PontoAcessibilidadeDTO {
    private String descricao;
    private Integer classificacaoLocal;
    private Double latitude;
    private Double longitude;
    private UUID idUsuario;

    public PontoAcessibilidadeDTO() {
    }
    
    public PontoAcessibilidadeDTO(String descricao, Integer classificacaoLocal, Double latitude, Double longitude, UUID idUsuario) {
        this.descricao = descricao;
        this.classificacaoLocal = classificacaoLocal;
        this.latitude = latitude;
        this.longitude = longitude;
        this.idUsuario = idUsuario;
    }

    public PontoAcessibilidadeDTO(PontoAcessibilidade pontoAcessibilidade) {
        this.descricao = pontoAcessibilidade.getDescricao();
        this.classificacaoLocal = pontoAcessibilidade.getClassificacaoLocal();
        this.latitude = pontoAcessibilidade.getLatitude();
        this.longitude = pontoAcessibilidade.getLongitude();
        this.idUsuario = pontoAcessibilidade.getIdUsuario();
    }

    public String getDescricao() {
        return descricao;
    }
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
    public Integer getClassificacaoLocal() {
        return classificacaoLocal;
    }
    public void setClassificacaoLocal(Integer classificacaoLocal) {
        this.classificacaoLocal = classificacaoLocal;
    }
    public Double getLatitude() {
        return latitude;
    }
    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }
    public Double getLongitude() {
        return longitude;
    }
    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
    public UUID getIdUsuario() {
        return idUsuario;
    }
    public void setIdUsuario(UUID idUsuario) {
        this.idUsuario = idUsuario;
    }
}
