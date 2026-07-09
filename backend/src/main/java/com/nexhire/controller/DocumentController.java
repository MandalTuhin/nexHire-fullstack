package com.nexhire.controller;

import com.nexhire.entity.CandidateDocument;
import com.nexhire.entity.User;
import com.nexhire.exception.ResourceNotFoundException;
import com.nexhire.repository.CandidateDocumentRepository;
import com.nexhire.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final CandidateDocumentRepository documentRepository;
    private final UserRepository userRepository;

    private static final String UPLOAD_DIR = "uploads/documents/";

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("docType") String docType,
            Authentication auth) throws IOException {
        Long userId = (Long) auth.getPrincipal();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Path dir = Paths.get(UPLOAD_DIR, userId.toString());
        Files.createDirectories(dir);

        String ext = getExtension(file.getOriginalFilename());
        String storedName = docType + "_" + UUID.randomUUID().toString().substring(0, 8) + ext;
        Path filePath = dir.resolve(storedName);
        file.transferTo(filePath.toFile());

        CandidateDocument doc = CandidateDocument.builder()
                .user(user)
                .docType(docType)
                .fileName(file.getOriginalFilename())
                .filePath(filePath.toString())
                .build();
        documentRepository.save(doc);

        return ResponseEntity.ok(Map.of(
                "id", doc.getId(),
                "docType", doc.getDocType(),
                "fileName", doc.getFileName(),
                "uploadedAt", doc.getUploadedAt().toString()
        ));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Map<String, Object>>> myDocuments(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(toList(documentRepository.findByUserId(userId)));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Map<String, Object>>> userDocuments(@PathVariable Long userId) {
        return ResponseEntity.ok(toList(documentRepository.findByUserId(userId)));
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> download(@PathVariable Long id) {
        CandidateDocument doc = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        Path path = Paths.get(doc.getFilePath());
        Resource resource = new FileSystemResource(path);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getFileName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    private List<Map<String, Object>> toList(List<CandidateDocument> docs) {
        return docs.stream().map(d -> Map.<String, Object>of(
                "id", d.getId(),
                "docType", d.getDocType(),
                "fileName", d.getFileName(),
                "uploadedAt", d.getUploadedAt().toString()
        )).toList();
    }

    private String getExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) return "";
        return fileName.substring(fileName.lastIndexOf('.'));
    }
}
