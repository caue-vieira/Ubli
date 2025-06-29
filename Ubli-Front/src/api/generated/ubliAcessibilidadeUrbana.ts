/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * Ubli - Acessibilidade urbana
 */
import * as axios from 'axios';
import type {
  AxiosRequestConfig,
  AxiosResponse
} from 'axios';

import type {
  AdicionaFotoPontoBody,
  CadastraPontoAcessibilidadeBody,
  Login200,
  LoginRequestDTO,
  PontoAcessibilidade,
  PontoAcessibilidadeDTO,
  Usuario
} from '../schemas';




  export const getUbliAcessibilidadeUrbana = () => {
/**
 * Endpoint para edição de um usuário no banco de dados com base no ID
 * @summary Edita um usuário no banco de dados
 */
const editaUsuario = <TData = AxiosResponse<Usuario>>(
    id: string,
    usuario: Usuario, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.default.put(
      `http://localhost:8080/usuario/${id}/editar`,
      usuario,options
    );
  }

/**
 * Endpoint para edição de um ponto de acessibilidade no banco de dados
 * @summary Edita um ponto de acessibilidade
 */
const editaPontoAcessibilidade = <TData = AxiosResponse<PontoAcessibilidade>>(
    id: string,
    pontoAcessibilidadeDTO: PontoAcessibilidadeDTO, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.default.put(
      `http://localhost:8080/acessibilidade/${id}/editar`,
      pontoAcessibilidadeDTO,options
    );
  }

/**
 * @summary Faz login do usuário
 */
const login = <TData = AxiosResponse<Login200 | void>>(
    loginRequestDTO: LoginRequestDTO, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.default.post(
      `http://localhost:8080/usuario/login`,
      loginRequestDTO,options
    );
  }

/**
 * Endpoint para criação de um novo usuário no banco de dados
 * @summary Cadastra um novo usuário no banco de dados
 */
const cadastraUsuario = <TData = AxiosResponse<Usuario>>(
    usuario: Usuario, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.default.post(
      `http://localhost:8080/usuario/cadastrar`,
      usuario,options
    );
  }

/**
 * Endpoint para adição de fotos à um ponto de acessibilidade já cadastrado no banco de dados
 * @summary Adiciona uma foto à um ponto já existente
 */
const adicionaFotoPonto = <TData = AxiosResponse<void>>(
    id: string,
    adicionaFotoPontoBody: AdicionaFotoPontoBody, options?: AxiosRequestConfig
 ): Promise<TData> => {const formData = new FormData();
adicionaFotoPontoBody.fotos.forEach(value => formData.append(`fotos`, value));

    return axios.default.post(
      `http://localhost:8080/imagens/${id}/adicionar`,
      formData,options
    );
  }

/**
 * Endpoint para cadastro de um novo ponto de acessibilidade no banco de dados
 * @summary Cadastra um novo ponto de acessibilidade
 */
const cadastraPontoAcessibilidade = <TData = AxiosResponse<PontoAcessibilidade>>(
    cadastraPontoAcessibilidadeBody: CadastraPontoAcessibilidadeBody, options?: AxiosRequestConfig
 ): Promise<TData> => {const formData = new FormData();
formData.append(`ponto_acessibilidade`, JSON.stringify(cadastraPontoAcessibilidadeBody.ponto_acessibilidade));
cadastraPontoAcessibilidadeBody.fotos_local.forEach(value => formData.append(`fotos_local`, value));

    return axios.default.post(
      `http://localhost:8080/acessibilidade/adicionar`,
      formData,options
    );
  }

/**
 * Endpoint para buscar de um usuário no banco de dados com base no ID
 * @summary Busca um usuário no banco de dados
 */
const buscaUsuarioId = <TData = AxiosResponse<Usuario>>(
    id: string, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.default.get(
      `http://localhost:8080/usuario/${id}`,options
    );
  }

/**
 * Endpoint para busca de todos os pontos de acessibilidade no banco de dados
 * @summary Busca os pontos de acessibilidade
 */
const buscaPontosAcessibilidade = <TData = AxiosResponse<PontoAcessibilidadeDTO[]>>(
     options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.default.get(
      `http://localhost:8080/acessibilidade/buscar`,options
    );
  }

/**
 * Endpoint para busca de um ponto de acessibilidade pelo seu id
 * @summary Busca um ponto de acessibilidade pelo id
 */
const buscaPontoAcessibilidadeId = <TData = AxiosResponse<PontoAcessibilidade>>(
    id: string, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.default.get(
      `http://localhost:8080/acessibilidade/buscar/${id}`,options
    );
  }

/**
 * Endpoint para busca de todos os pontos de acessibilidade por filtro no banco de dados
 * @summary Busca os pontos de acessibilidade por filtro
 */
const buscaPontosAcessibilidadeFiltro = <TData = AxiosResponse<PontoAcessibilidadeDTO[]>>(
    filtro: number, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.default.get(
      `http://localhost:8080/acessibilidade/buscar/${filtro}`,options
    );
  }

/**
 * Endpoint para exclusão de um usuário no banco de dados com base no ID
 * @summary Exclui um usuário no banco de dados
 */
const excluiUsuario = <TData = AxiosResponse<void>>(
    id: string, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.default.delete(
      `http://localhost:8080/usuario/${id}/excluir`,options
    );
  }

/**
 * Endpoint para exclusão de uma foto única de um ponto de acessibilidade com base no id
 * @summary Exclui uma foto com base no id do ponto e da foto
 */
const excluiFoto = <TData = AxiosResponse<void>>(
    id: string, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.default.delete(
      `http://localhost:8080/imagens/${id}/excluir`,options
    );
  }

/**
 * Endpoint para a exclusão de um ponto de acessibilidade no banco de dados
 * @summary Exclui um ponto de acessibilidade
 */
const excluiPontoAcessibilidade = <TData = AxiosResponse<void>>(
    id: string, options?: AxiosRequestConfig
 ): Promise<TData> => {
    return axios.default.delete(
      `http://localhost:8080/acessibilidade/${id}/excluir`,options
    );
  }

return {editaUsuario,editaPontoAcessibilidade,login,cadastraUsuario,adicionaFotoPonto,cadastraPontoAcessibilidade,buscaUsuarioId,buscaPontosAcessibilidade,buscaPontoAcessibilidadeId,buscaPontosAcessibilidadeFiltro,excluiUsuario,excluiFoto,excluiPontoAcessibilidade}};
export type EditaUsuarioResult = AxiosResponse<Usuario>
export type EditaPontoAcessibilidadeResult = AxiosResponse<PontoAcessibilidade>
export type LoginResult = AxiosResponse<Login200 | void>
export type CadastraUsuarioResult = AxiosResponse<Usuario>
export type AdicionaFotoPontoResult = AxiosResponse<void>
export type CadastraPontoAcessibilidadeResult = AxiosResponse<PontoAcessibilidade>
export type BuscaUsuarioIdResult = AxiosResponse<Usuario>
export type BuscaPontosAcessibilidadeResult = AxiosResponse<PontoAcessibilidadeDTO[]>
export type BuscaPontoAcessibilidadeIdResult = AxiosResponse<PontoAcessibilidade>
export type BuscaPontosAcessibilidadeFiltroResult = AxiosResponse<PontoAcessibilidadeDTO[]>
export type ExcluiUsuarioResult = AxiosResponse<void>
export type ExcluiFotoResult = AxiosResponse<void>
export type ExcluiPontoAcessibilidadeResult = AxiosResponse<void>
