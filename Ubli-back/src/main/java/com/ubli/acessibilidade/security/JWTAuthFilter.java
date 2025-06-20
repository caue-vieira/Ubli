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
        
//         // Ignora rotas públicas
//         if (path.equals("/usuario/login") || path.equals("/usuario/cadastrar")) {
//             filterChain.doFilter(request, response);
//             return;
//         }

//         final String authHeader = request.getHeader("Authorization");

//         if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//             filterChain.doFilter(request, response);
//             return;
//         }

//         try {
//             final String token = authHeader.substring(7);
//             String userId = _authService.getIdFromToken(token);
            
//             if (userId != null) {
//                 Optional<Usuario> usuarioOpt = _usuarioRepository.findById(UUID.fromString(userId));
//                 if (usuarioOpt.isPresent()) {
//                     UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
//                         usuarioOpt.get(), null, List.of());
//                     SecurityContextHolder.getContext().setAuthentication(authToken);
//                 }
//             }
            
//             filterChain.doFilter(request, response);
            
//         } catch (Exception e) {
//             response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//             response.getWriter().write("Token inválido");
//         }
//     }
// }