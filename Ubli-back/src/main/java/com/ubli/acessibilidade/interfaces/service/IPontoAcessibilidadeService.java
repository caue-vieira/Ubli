package com.ubli.acessibilidade.interfaces.service;

import java.util.List;
import java.util.UUID;

import com.ubli.acessibilidade.dto.PontoAcessibilidadeDTO;
import com.ubli.acessibilidade.model.PontoAcessibilidade;

public interface IPontoAcessibilidadeService {
    public PontoAcessibilidade cadastraPontoAcessibilidade(PontoAcessibilidadeDTO pontoAcessibilidade);
    public PontoAcessibilidade editPontoAcessibilidade(PontoAcessibilidadeDTO pontoAcessibilidadeDto, UUID id);
    public List<PontoAcessibilidadeDTO> buscaPontosAcessibilidade();
    public PontoAcessibilidade buscaPontoAcessibilidadeId(UUID id);
    public void excluiPontoAcessibilidadeId(UUID id);
}
