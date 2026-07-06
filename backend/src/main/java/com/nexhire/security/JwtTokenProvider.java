package com.nexhire.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * JWT Token Provider - skeleton for Phase 1.
 * Full implementation with token generation, validation, and claim extraction
 * will be completed in Phase 2.
 */
@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    // TODO: Phase 2 - generateToken(userId, email, role)
    // TODO: Phase 2 - validateToken(token)
    // TODO: Phase 2 - getUserIdFromToken(token)
    // TODO: Phase 2 - getRoleFromToken(token)
}
