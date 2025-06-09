package com.ubli.acessibilidade.model;

import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ubli.acessibilidade.dto.PontoAcessibilidadeDTO;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "PontoAcessibilidade")
public class PontoAcessibilidade {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String descricao;
    @Column(name = "classificacao_local")
    private Integer classificacaoLocal;
    private Double latitude;
    private Double longitude;
    @Column(name = "id_usuario")
    private UUID idUsuario;
    // Não é necessário criar este campo no banco
    @Transient
    private List<String> fotosLocal;    

    public PontoAcessibilidade() {
    }

    public PontoAcessibilidade(String descricao, Integer classificacaoLocal, Double latitude, Double longitude, UUID idUsuario) {
        this.descricao = descricao;
        this.classificacaoLocal = classificacaoLocal;
        this.latitude = latitude;
        this.longitude = longitude;
        this.idUsuario = idUsuario;
    }

    public PontoAcessibilidade(PontoAcessibilidadeDTO pontoAcessibilidadeDto) {
        this.descricao = pontoAcessibilidadeDto.getDescricao();
        this.classificacaoLocal = pontoAcessibilidadeDto.getClassificacaoLocal();
        this.latitude = pontoAcessibilidadeDto.getLatitude();
        this.longitude = pontoAcessibilidadeDto.getLongitude();
        this.idUsuario = pontoAcessibilidadeDto.getIdUsuario();
    }

    public UUID getId() {
        return id;
    }

    @JsonIgnore
    public void setId(UUID id) {
        this.id = id;
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

    public List<String> getFotosLocal() {
        return fotosLocal;
    }

    public void setFotosLocal(List<String> fotosLocal) {
        this.fotosLocal = fotosLocal;
    }
    
}
