CREATE TABLE usuario (
  id VARCHAR(36) PRIMARY KEY,
  nome VARCHAR(50),
  email VARCHAR(50) NOT NULL,
  senha VARCHAR(100) NOT NULL,
  cpf VARCHAR(11) NOT NULL,
  foto_perfil BLOB
);

CREATE TABLE ponto_acessibilidade (
    id VARCHAR(36) PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    classificacao_local TEXT,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    id_usuario VARCHAR(36) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE
);


CREATE TABLE fotos_local (
    id VARCHAR(36) PRIMARY KEY,
    id_ponto_acessibilidade VARCHAR(36) NOT NULL,
    caminho_arquivo VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_ponto_acessibilidade) REFERENCES ponto_acessibilidade(id) ON DELETE CASCADE
);

-- CREATE TABLE AddressVerification (
--     VerificationID INT AUTO_INCREMENT PRIMARY KEY,
--     LocationID INT,
--     VerificationDate DATE NOT NULL,
--     isAccessible BOOLEAN NOT NULL,
--     FOREIGN KEY (LocationID) REFERENCES Location(LocalID) ON DELETE CASCADE,
--     CHECK (isAccessible IN (0, 1)) -- 0 = Não acessível, 1 = Acessível
-- );