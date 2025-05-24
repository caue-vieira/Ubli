package com.ubli.acessibilidade.interfaces.service;

import java.util.UUID;

import com.ubli.acessibilidade.model.Usuario;

public interface IUsuarioService {
    public Usuario cadastrarUsuario(Usuario usuario);
    public Usuario buscaUsuarioId(UUID id);
    public Usuario editaUsuario(Usuario usuario, UUID id);
    public void excluiUsuario(UUID id);
}
