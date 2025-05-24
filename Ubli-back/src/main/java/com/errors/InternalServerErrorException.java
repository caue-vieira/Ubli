package com.errors;

public class InternalServerErrorException extends RuntimeException {
    public InternalServerErrorException(String errorMessage) {
        super(errorMessage);
    }
}
