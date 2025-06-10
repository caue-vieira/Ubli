package com.ubli.acessibilidade.errors.exceptions;

public class EmptyFieldException extends RuntimeException {
    public EmptyFieldException(String errorMessage) {
        super(errorMessage);
    }
}
