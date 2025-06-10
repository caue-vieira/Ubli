package com.ubli.acessibilidade.interfaces.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ubli.acessibilidade.model.Usuario;

public interface IUsuarioRepository extends JpaRepository<Usuario, UUID> {
    Optional<Usuario> findByEmail(String email);
}
