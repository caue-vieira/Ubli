package com.validators;

import com.errors.EmptyFieldException;
import com.errors.InvalidFieldException;
import com.errors.messages.ErrorMessages;

public class GenericValidator {
    public static void ValidateStringNotEmptyOrNull(String string, String fieldName) {
        if(string.isEmpty() || string == null) {
            throw new EmptyFieldException(ErrorMessages.CAMPO_VAZIO.format(fieldName));
        }
    }

    public static void ValidateIntegerEmpty(Integer number, String fieldName) {
        if(number == 0) {
            throw new EmptyFieldException(ErrorMessages.CAMPO_VAZIO.format(fieldName));
        }
    }

    public static void ValidateEmail(String email) {
        ValidateStringNotEmptyOrNull(email, "Email");

        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        if(!email.matches(emailRegex)) {
            throw new InvalidFieldException(ErrorMessages.EMAIL_INVALIDO.getMensagem());
        }
    }
}
