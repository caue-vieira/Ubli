package com.ubli.acessibilidade.errors;

public class DataNotFoundException extends RuntimeException {
    public DataNotFoundException(String errorMessage) {
        super(errorMessage);
    }
}
