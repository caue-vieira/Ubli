package com.ubli.acessibilidade.errors;

public class EmptyFieldException extends RuntimeException {
    public EmptyFieldException(String errorMessage) {
        super(errorMessage);
    }
}
