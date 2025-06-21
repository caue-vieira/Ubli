// package com.ubli.acessibilidade.security;

// import java.io.IOException;
// import java.util.List;
// import java.util.Optional;
// import java.util.UUID;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.stereotype.Component;
// import org.springframework.web.filter.OncePerRequestFilter;

// import com.ubli.acessibilidade.interfaces.repository.IUsuarioRepository;
// import com.ubli.acessibilidade.model.Usuario;
// import com.ubli.acessibilidade.service.AuthService;

// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;

// @Component
// public class JWTAuthFilter extends OncePerRequestFilter {
    
//     @Autowired
//     private AuthService _authService;

//     @Autowired
//     private IUsuarioRepository _usuarioRepository;

//     @Override
//     protected void doFilterInternal(HttpServletRequest request,
//                                 HttpServletResponse response,
//                                 FilterChain filterChain) throws ServletException, IOException {
        
//         String path = request.getServletPath();
        
//         // Rotas públicas - ignora o filtro
//         if (shouldNotFilter(path)) {
//             filterChain.doFilter(request, response);
//             return;
//         }

//         final String authHeader = request.getHeader("Authorization");

//         // Verifica se o header Authorization existe e está no formato correto
//         if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//             sendUnauthorizedError(response, "Token não fornecido ou formato inválido");
//             return;
//         }

//         try {
//             final String token = authHeader.substring(7);
            
//             if (!_authService.validateToken(token)) {
//                 sendUnauthorizedError(response, "Token inválido ou expirado");
//                 return;
//             }
            
//             String userId = _authService.getIdFromToken(token);
            
//             if (userId == null) {
//                 sendUnauthorizedError(response, "Token inválido");
//                 return;
//             }

//             Optional<Usuario> usuarioOpt = _usuarioRepository.findById(UUID.fromString(userId));
//             if (usuarioOpt.isEmpty()) {
//                 sendUnauthorizedError(response, "Usuário não encontrado");
//                 return;
//             }

//             UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
//                 usuarioOpt.get(), null, List.of());
//             SecurityContextHolder.getContext().setAuthentication(authToken);
            
//             filterChain.doFilter(request, response);
            
//         } catch (Exception e) {
//             sendUnauthorizedError(response, "Falha na autenticação: " + e.getMessage());
//         }
//     }

//     private boolean shouldNotFilter(String path) {
//         return path.equals("/usuario/login") || 
//                path.equals("/usuario/cadastrar") ||
//                path.startsWith("/v3/api-docs") ||
//                path.startsWith("/swagger-ui");
//     }

//     private void sendUnauthorizedError(HttpServletResponse response, String message) throws IOException {
//         response.setContentType("application/json");
//         response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//         response.getWriter().write("{\"error\": \"" + message + "\"}");
//     }
// }