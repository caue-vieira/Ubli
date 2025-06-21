package com.ubli.acessibilidade.dto;

import java.util.UUID;

import com.ubli.acessibilidade.model.PontoAcessibilidade;

public class PontoAcessibilidadeDTO {
    private String descricao;
    private Integer classificacaoLocal;
    private Double latitude;
    private Double longitude;
    private UUID idUsuario;
    private Integer tipoEstabelecimento;
    private String endereco;
    private String acessibilidades;
    private String nome;

    public PontoAcessibilidadeDTO() {
    }
    
    public PontoAcessibilidadeDTO(String descricao, Integer classificacaoLocal, Double latitude, Double longitude, UUID idUsuario, Integer tipoEstabelecimento, String endereco, String acessibilidades, String nome) {
        this.descricao = descricao;
        this.classificacaoLocal = classificacaoLocal;
        this.latitude = latitude;
        this.longitude = longitude;
        this.idUsuario = idUsuario;
        this.tipoEstabelecimento = tipoEstabelecimento;
        this.endereco = endereco;
        this.acessibilidades = acessibilidades;
        this.nome = nome;
    }

    public PontoAcessibilidadeDTO(PontoAcessibilidade pontoAcessibilidade) {
        this.descricao = pontoAcessibilidade.getDescricao();
        this.classificacaoLocal = pontoAcessibilidade.getClassificacaoLocal();
        this.latitude = pontoAcessibilidade.getLatitude();
        this.longitude = pontoAcessibilidade.getLongitude();
        this.idUsuario = pontoAcessibilidade.getIdUsuario();
        this.tipoEstabelecimento = pontoAcessibilidade.getTipoEstabelecimento();
        this.endereco = pontoAcessibilidade.getEndereco();
        this.acessibilidades = pontoAcessibilidade.getAcessibilidades();
        this.nome = pontoAcessibilidade.getNome();
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
    public Integer getTipoEstabelecimento(){
        return tipoEstabelecimento;
    }
    public void setTipoEstabelecimento(Integer tipoEstabelecimento){
        this.tipoEstabelecimento = tipoEstabelecimento;
    }
    public String getEndereco(){
        return this.endereco;
    }
    public void setEndereco(String endereco){
        this.endereco = endereco;
    }
    public String getAcessibilidades(){
        return this.acessibilidades;
    }
    public void setAcessibilidades(String acessibilidades){
        this.acessibilidades = acessibilidades;
    }
    public String getNome(){
        return this.nome;
    }
    public void setNome(String nome){
        this.nome = nome;
    }

}
