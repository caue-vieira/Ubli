package com.ubli.acessibilidade.interfaces.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ubli.acessibilidade.model.PontoAcessibilidade;

public interface IPontoAcessibilidadeRepository extends JpaRepository<PontoAcessibilidade, UUID> {}
