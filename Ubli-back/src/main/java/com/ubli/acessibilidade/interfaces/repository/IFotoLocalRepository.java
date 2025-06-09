package com.ubli.acessibilidade.interfaces.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ubli.acessibilidade.model.FotosLocal;

public interface IFotoLocalRepository extends JpaRepository<FotosLocal, UUID> {
    public List<FotosLocal> findAllByIdPontoAcessibilidade(UUID idPontoAcessibilidade);
}
