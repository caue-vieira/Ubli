package com.ubli.acessibilidade.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ubli.acessibilidade.errors.DataNotFoundException;
import com.ubli.acessibilidade.errors.messages.ErrorMessages;
import com.ubli.acessibilidade.interfaces.repository.IUsuarioRepository;
import com.ubli.acessibilidade.interfaces.service.IUsuarioService;
import com.ubli.acessibilidade.model.Usuario;
import com.ubli.acessibilidade.validators.UsuarioValidator;

// Define a classe como um Service, peritindo ao JPA reconhecê-lo
@Service
public class UsuarioService implements IUsuarioService {

    @Autowired
    public IUsuarioRepository _usuarioRepository;

    @Override
    public Usuario cadastrarUsuario(Usuario usuario) {
        UsuarioValidator.ValidateUsuario(usuario);
        return _usuarioRepository.save(usuario);
    }

    @Override
    public Usuario buscaUsuarioId(UUID id) {
        return _usuarioRepository.findById(id).orElseThrow(() -> new DataNotFoundException(ErrorMessages.USUARIO_NAO_ENCONTRADO.getMensagem()));
    }

    @Override
    public Usuario editaUsuario(Usuario usuario, UUID id) {
        Usuario _usuario = _usuarioRepository.findById(id).orElseThrow(() -> new DataNotFoundException(ErrorMessages.USUARIO_NAO_ENCONTRADO.getMensagem()));
        UsuarioValidator.ValidateUsuario(usuario);

        _usuario.setNome(usuario.getNome());
        _usuario.setEmail(usuario.getEmail());
        _usuario.setSenha(usuario.getSenha());
        _usuario.setCpf(usuario.getCpf());
        _usuario.setFotoPerfil(usuario.getFotoPerfil());
        return _usuarioRepository.save(_usuario);
    }

    @Override
    public void excluiUsuario(UUID id) {
        _usuarioRepository.findById(id).orElseThrow(() -> new DataNotFoundException(ErrorMessages.USUARIO_NAO_ENCONTRADO.getMensagem()));
        _usuarioRepository.deleteById(id);
    }
    
}
