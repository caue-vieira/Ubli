package com.ubli.acessibilidade.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ubli.acessibilidade.dto.PontoAcessibilidadeDTO;
import com.ubli.acessibilidade.errors.exceptions.DataNotFoundException;
import com.ubli.acessibilidade.errors.messages.ErrorMessages;
import com.ubli.acessibilidade.interfaces.repository.IPontoAcessibilidadeRepository;
import com.ubli.acessibilidade.interfaces.service.IPontoAcessibilidadeService;
import com.ubli.acessibilidade.model.PontoAcessibilidade;
import com.ubli.acessibilidade.validators.PontoAcessibilidadeValidator;

@Service
public class PontoAcessibilidadeService implements IPontoAcessibilidadeService {
    
    @Autowired
    private IPontoAcessibilidadeRepository _pontoAcessibilidadeRepository;

    @Override
    public PontoAcessibilidade cadastraPontoAcessibilidade(PontoAcessibilidadeDTO pontoAcessibilidadeDto) {
        // Recebe um DTO e converte para o model e salva no banco de dados;
        PontoAcessibilidade pontoAcessibilidade = new PontoAcessibilidade(pontoAcessibilidadeDto);
        PontoAcessibilidadeValidator.ValidatePontoAcessibilidade(pontoAcessibilidade);
        return _pontoAcessibilidadeRepository.save(pontoAcessibilidade);
    }

    @Override
    public PontoAcessibilidade editPontoAcessibilidade(PontoAcessibilidadeDTO pontoAcessibilidadeDto, UUID id) {
        // Função correta (checar validator). Valida se o registro existe e edita os campos com base no DTO recebido
        PontoAcessibilidade _pontoAcessibilidade = _pontoAcessibilidadeRepository.findById(id).orElseThrow(() -> new DataNotFoundException(ErrorMessages.PONTO_NAO_ENCONTRADO.getMensagem()));
        PontoAcessibilidadeValidator.ValidatePontoAcessibilidade(_pontoAcessibilidade);

        _pontoAcessibilidade.setClassificacaoLocal(pontoAcessibilidadeDto.getClassificacaoLocal());
        _pontoAcessibilidade.setDescricao(pontoAcessibilidadeDto.getDescricao());
        _pontoAcessibilidade.setLatitude(pontoAcessibilidadeDto.getLatitude());
        _pontoAcessibilidade.setLongitude(pontoAcessibilidadeDto.getLongitude());
        
        // O tipo de retorno está correto, já que irá retornar um ponto específico
        return _pontoAcessibilidadeRepository.save(_pontoAcessibilidade);
    }

    @Override
    public List<PontoAcessibilidadeDTO> buscaPontosAcessibilidade() {
        // Busca os dados no banco (O repository ainda está definido como o model e não como o DTO)
        List<PontoAcessibilidade> pontoAcessibilidades = _pontoAcessibilidadeRepository.findAll();
        if(pontoAcessibilidades.isEmpty()) {
            throw new DataNotFoundException(ErrorMessages.NENHUM_REGISTRO_ENCONTRADO.getMensagem());
        }
        // Converte a lista de model PontoAcessibilidade em seu DTO e retorna
        List<PontoAcessibilidadeDTO> pontoAcessibilidadeDtos = new ArrayList<>();
        for(PontoAcessibilidade pontoAcessibilidade : pontoAcessibilidades) {
            pontoAcessibilidadeDtos.add(new PontoAcessibilidadeDTO(pontoAcessibilidade));
        }
        return pontoAcessibilidadeDtos;
    }

    @Override
    public List<PontoAcessibilidadeDTO> buscaPontoAcessibilidadeFiltro(int classificacaoLocal) {
        List<PontoAcessibilidade> pontoAcessibilidades = _pontoAcessibilidadeRepository.findByClassificacaoLocal(classificacaoLocal);
        if(pontoAcessibilidades.isEmpty()) {
            throw new DataNotFoundException(ErrorMessages.NENHUM_REGISTRO_ENCONTRADO.getMensagem());
        }

        List<PontoAcessibilidadeDTO> pontoAcessibilidadeDtos = new ArrayList<>();
        for(PontoAcessibilidade pontoAcessibilidade : pontoAcessibilidades) {
            pontoAcessibilidadeDtos.add(new PontoAcessibilidadeDTO(pontoAcessibilidade));
        }
        return pontoAcessibilidadeDtos;
    }

    @Override
    public PontoAcessibilidade buscaPontoAcessibilidadeId(UUID id) {
        return _pontoAcessibilidadeRepository.findById(id).orElseThrow(() -> new DataNotFoundException(ErrorMessages.PONTO_NAO_ENCONTRADO.getMensagem()));
    }

    @Override
    public void excluiPontoAcessibilidadeId(UUID id) {
        _pontoAcessibilidadeRepository.findById(id).orElseThrow(() -> new DataNotFoundException(ErrorMessages.PONTO_NAO_ENCONTRADO.getMensagem()));
        _pontoAcessibilidadeRepository.deleteById(id);
    }
}
