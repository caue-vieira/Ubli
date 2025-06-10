package com.ubli.acessibilidade.errors.exceptions;

public class InternalServerErrorException extends RuntimeException {
    public InternalServerErrorException(String errorMessage) {
        super(errorMessage);
    }
}
