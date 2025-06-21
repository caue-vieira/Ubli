package com.ubli.acessibilidade.model;

import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ubli.acessibilidade.dto.PontoAcessibilidadeDTO;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import org.hibernate.annotations.JdbcType;
import org.hibernate.type.descriptor.jdbc.CharJdbcType;

@Entity
@Table(name = "PontoAcessibilidade")
public class PontoAcessibilidade {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private UUID id;
    private String descricao;
    @Column(name = "classificacao_local")
    private Integer classificacaoLocal;
    private Double latitude;
    private Double longitude;
    private String endereco;
    private String acessibilidades;
    private String nome;
    @Column(name = "tipo_estabelecimento")
    private Integer tipoEstabelecimento;
    @Column(name = "id_usuario", columnDefinition = "CHAR(36)")
    @JdbcType(CharJdbcType.class)  // Substitui o @Type antigo
    private UUID idUsuario;
    // Não é necessário criar este campo no banco
    @Transient
    private List<String> fotosLocal;    

    public PontoAcessibilidade() {
    }

    public PontoAcessibilidade(String descricao, Integer classificacaoLocal, Double latitude, Double longitude, UUID idUsuario, String endereco, Integer tipoEstabelecimento, String acessibilidade, String nome) {
        this.descricao = descricao;
        this.classificacaoLocal = classificacaoLocal;
        this.latitude = latitude;
        this.longitude = longitude;
        this.idUsuario = idUsuario;
        this.tipoEstabelecimento = tipoEstabelecimento;
        this.endereco = endereco;
        this.acessibilidades = acessibilidade;
        this.nome = nome;
    }

    public PontoAcessibilidade(PontoAcessibilidadeDTO pontoAcessibilidadeDto) {
        this.descricao = pontoAcessibilidadeDto.getDescricao();
        this.classificacaoLocal = pontoAcessibilidadeDto.getClassificacaoLocal();
        this.latitude = pontoAcessibilidadeDto.getLatitude();
        this.longitude = pontoAcessibilidadeDto.getLongitude();
        this.idUsuario = pontoAcessibilidadeDto.getIdUsuario();
        this.tipoEstabelecimento = pontoAcessibilidadeDto.getTipoEstabelecimento();
        this.endereco = pontoAcessibilidadeDto.getEndereco();
        this.acessibilidades = pontoAcessibilidadeDto.getAcessibilidades();
        this.nome = pontoAcessibilidadeDto.getNome();
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
