package com.ubli.acessibilidade.errors.exceptions;

public class InvalidFieldException extends RuntimeException {
    public InvalidFieldException(String errorMessage) {
        super(errorMessage);
    }
}
