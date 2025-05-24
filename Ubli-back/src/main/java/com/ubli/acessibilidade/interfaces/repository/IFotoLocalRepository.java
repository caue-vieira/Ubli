package com.ubli.acessibilidade.interfaces.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ubli.acessibilidade.model.FotoLocal;

public interface IFotoLocalRepository extends JpaRepository<FotoLocal, UUID> {
    public List<FotoLocal> findAllByIdPontoAcessibilidade(UUID idPontoAcessibilidade);
}
