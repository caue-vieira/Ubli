package com.ubli.acessibilidade.errors;

public class InvalidFieldException extends RuntimeException {
    public InvalidFieldException(String errorMessage) {
        super(errorMessage);
    }
}
