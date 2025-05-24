package com.ubli.acessibilidade.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.errors.DataNotFoundException;
import com.errors.InternalServerErrorException;
import com.errors.messages.ErrorMessages;
import com.ubli.acessibilidade.interfaces.repository.IFotoLocalRepository;
import com.ubli.acessibilidade.interfaces.service.IFotoLocalService;
import com.ubli.acessibilidade.model.FotoLocal;

@Service
public class FotoLocalService implements IFotoLocalService {

    @Autowired
    private IFotoLocalRepository _fotoLocalRepository;

    private final String storagePath = "storage";

    @Override
    public void adicionaFotoLocal(List<MultipartFile> fotosLocal, UUID idPontoAcessibilidade) {
        // Função correta
        Path pasta = Paths.get(storagePath, idPontoAcessibilidade.toString());
        try {
            Files.createDirectories(pasta);

            for(MultipartFile foto : fotosLocal) {
                String nomeArquivo = UUID.randomUUID() + "_" + foto.getOriginalFilename();
                String caminho = pasta.resolve(nomeArquivo).toString();

                foto.transferTo(new File(caminho));

                FotoLocal novaFoto = new FotoLocal();
                novaFoto.setIdPontoAcessibilidade(idPontoAcessibilidade);
                novaFoto.setCaminhoArquivo("storage/" + idPontoAcessibilidade + "/" + nomeArquivo);

                _fotoLocalRepository.save(novaFoto);
            }
        } catch(IOException e) {
            throw new InternalServerErrorException(ErrorMessages.ERRO_INTERNO_SERVIDOR.getMensagem());
        }
    }

    @Override
    public List<String> buscaFotosLocal(UUID idPontoAcessibilidade) {
        List<FotoLocal> fotos = _fotoLocalRepository.findAllByIdPontoAcessibilidade(idPontoAcessibilidade);
        if(fotos.isEmpty()) {
            throw new DataNotFoundException(ErrorMessages.NENHUM_REGISTRO_ENCONTRADO.getMensagem());
        }
    
        return fotos.stream()
            .map(FotoLocal::getCaminhoArquivo)
            .collect(Collectors.toList());
    }

    @Override
    public void excluiFotoLocal(UUID idFoto) {
        FotoLocal foto = _fotoLocalRepository.findById(idFoto).orElseThrow(() -> new DataNotFoundException(ErrorMessages.ARQUIVO_NAO_ENCONTRADO.getMensagem()));

        Path caminhoFoto = Paths.get(foto.getCaminhoArquivo());
        try {
            Files.deleteIfExists(caminhoFoto);
            _fotoLocalRepository.deleteById(idFoto);
        } catch(IOException e) {
            throw new InternalServerErrorException(ErrorMessages.ERRO_INTERNO_SERVIDOR.getMensagem());
        }
    }

    /*
     * ⚠ VERIFICAR ⚠
     */
    @Override
    public void excluiFotoLocalIdPonto(UUID idPontoAcessibilidade) {
        // TALVEZ não seja necessário excluir cada foto uma por uma, apenas o diretório com o id do ponto informado(já que terá um cascade no banco)
        // Encontra todos os registros de fotos com base no id do ponto de acessibilidade;
        List<FotoLocal> fotos = _fotoLocalRepository.findAllByIdPontoAcessibilidade(idPontoAcessibilidade);
        if(fotos.isEmpty()) {
            throw new DataNotFoundException(ErrorMessages.NENHUM_REGISTRO_ENCONTRADO.getMensagem());
        }

        // Exclui os arquivos salvos localmente e no banco de dados
        for(FotoLocal foto : fotos) {
            Path caminhoFoto = Paths.get(foto.getCaminhoArquivo());
            try {
                Files.deleteIfExists(caminhoFoto);
                _fotoLocalRepository.deleteById(foto.getId());
            } catch(IOException e) {
                throw new InternalServerErrorException(ErrorMessages.ERRO_INTERNO_SERVIDOR.getMensagem());
            }
        }
    }
}
