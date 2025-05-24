package com.ubli.acessibilidade.interfaces.service;

import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

public interface IFotoLocalService {
    public void adicionaFotoLocal(List<MultipartFile> fotosLocal, UUID idPontoAcessibilidade);
    public List<String> buscaFotosLocal(UUID idPontoAcessibilidade);
    public void excluiFotoLocal(UUID idFoto);
    public void excluiFotoLocalIdPonto(UUID idPontoAcessibilidade);
}
