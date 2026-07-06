package com.nexhire.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT Authentication Filter - skeleton for Phase 1.
 * Full implementation with token extraction, validation, and SecurityContext setup
 * will be completed in Phase 2.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        // TODO: Phase 2 - Extract JWT from Authorization header
        // TODO: Phase 2 - Validate token and set SecurityContext
        filterChain.doFilter(request, response);
    }
}
