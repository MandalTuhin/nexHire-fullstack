package com.nexhire.controller;

import com.nexhire.dto.BulkUploadResult;
import com.nexhire.service.HrBulkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/hr")
@RequiredArgsConstructor
@PreAuthorize("hasRole('HR')")
public class HrBulkController {

    private final HrBulkService hrBulkService;

    /** Upload Excel with assessment/BGC/offer-eligibility data */
    @PostMapping("/bulk-upload")
    public ResponseEntity<BulkUploadResult> bulkUpload(
            @RequestParam("file") MultipartFile file,
            Authentication auth) {
        Long hrUserId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(hrBulkService.processBulkUpload(file, hrUserId));
    }

    /** Generate offer letters for all eligible candidates (QUALIFIED + BGC PASSED) */
    @PostMapping("/bulk-generate-offers")
    public ResponseEntity<Map<String, Object>> bulkGenerateOffers(Authentication auth) {
        Long hrUserId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(hrBulkService.bulkGenerateOffers(hrUserId));
    }

    /** Generate joining letters for all OFFER_ACCEPTED candidates */
    @PostMapping("/bulk-generate-joining")
    public ResponseEntity<Map<String, Object>> bulkGenerateJoining(Authentication auth) {
        Long hrUserId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(hrBulkService.bulkGenerateJoiningLetters(hrUserId));
    }

    /** Download Excel template */
    @GetMapping("/template")
    public ResponseEntity<byte[]> downloadTemplate() {
        byte[] template = hrBulkService.generateTemplate();
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=nexhire_bulk_template.xlsx")
                .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                .body(template);
    }
}
