package com.ubli.acessibilidade.service;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.ubli.acessibilidade.model.Usuario;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class AuthService {
    
    @Value("${jwt.secret}")
    private String jwtKey;

    @Value("${jwt.expiration}")
    private long expiration;

    private Key getSignInKey() {
        return Keys.hmacShaKeyFor(jwtKey.getBytes());
    }

    public String generateToken(Usuario usuario) {
        return Jwts.builder()
            .setSubject(usuario.getId().toString())
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getSignInKey(), SignatureAlgorithm.HS256)
            .compact();
    }

    public String getIdFromToken(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(getSignInKey())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSignInKey()).build().parseClaimsJws(token);
            return true;
        } catch(JwtException e) {
            return false;
        }
    }
}
