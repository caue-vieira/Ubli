package com.ubli.acessibilidade.errors;

public class InternalServerErrorException extends RuntimeException {
    public InternalServerErrorException(String errorMessage) {
        super(errorMessage);
    }
}
