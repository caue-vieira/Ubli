package com.errors;

public class InvalidFieldException extends RuntimeException {
    public InvalidFieldException(String errorMessage) {
        super(errorMessage);
    }
}
