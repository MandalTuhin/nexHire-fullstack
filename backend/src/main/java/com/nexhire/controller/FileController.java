package com.nexhire.controller;

import com.nexhire.entity.JoiningLetter;
import com.nexhire.entity.OfferLetter;
import com.nexhire.exception.ResourceNotFoundException;
import com.nexhire.repository.JoiningLetterRepository;
import com.nexhire.repository.OfferLetterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final OfferLetterRepository offerLetterRepository;
    private final JoiningLetterRepository joiningLetterRepository;

    @GetMapping("/offer/{applicationId}")
    public ResponseEntity<Resource> downloadOffer(@PathVariable Long applicationId) {
        OfferLetter offer = offerLetterRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer letter not found"));
        return serveFile(offer.getContent(), "offer_letter_" + applicationId + ".pdf");
    }

    @GetMapping("/joining/{applicationId}")
    public ResponseEntity<Resource> downloadJoining(@PathVariable Long applicationId) {
        JoiningLetter letter = joiningLetterRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Joining letter not found"));
        return serveFile(letter.getContent(), "joining_letter_" + applicationId + ".pdf");
    }

    private ResponseEntity<Resource> serveFile(String filePath, String downloadName) {
        Path path = Paths.get(filePath);
        if (!path.toFile().exists()) {
            throw new ResourceNotFoundException("File not found on disk: " + filePath);
        }
        Resource resource = new FileSystemResource(path);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + downloadName + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }
}
