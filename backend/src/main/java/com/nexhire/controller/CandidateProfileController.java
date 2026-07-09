package com.nexhire.controller;

import com.nexhire.dto.CandidateProfileRequest;
import com.nexhire.dto.CandidateProfileResponse;
import com.nexhire.service.CandidateProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/candidate-profile")
@RequiredArgsConstructor
public class CandidateProfileController {

    private final CandidateProfileService candidateProfileService;

    @GetMapping
    public ResponseEntity<CandidateProfileResponse> getMyProfile(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(candidateProfileService.getProfile(userId));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<CandidateProfileResponse> getProfileByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(candidateProfileService.getProfile(userId));
    }

    @PutMapping
    public ResponseEntity<CandidateProfileResponse> saveProfile(
            @Valid @RequestBody CandidateProfileRequest request,
            Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(candidateProfileService.saveProfile(userId, request));
    }
}
