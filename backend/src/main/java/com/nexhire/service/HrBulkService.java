package com.nexhire.service;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import com.nexhire.dto.BulkUploadResult;
import com.nexhire.entity.*;
import com.nexhire.enums.ApplicationStatus;
import com.nexhire.enums.BgvStatus;
import com.nexhire.enums.LifecycleStatus;
import com.nexhire.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class HrBulkService {

    private final UserRepository userRepository;
    private final JobApplicationRepository applicationRepository;
    private final AssessmentResultRepository assessmentResultRepository;
    private final BackgroundVerificationRepository bgvRepository;
    private final OfferLetterRepository offerLetterRepository;
    private final JoiningLetterRepository joiningLetterRepository;
    private final LocationRepository locationRepository;
    private final HiringBudgetRepository hiringBudgetRepository;
    private final TrainingSeatRepository trainingSeatRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final NotificationService notificationService;

    private static final String OFFERS_DIR = "uploads/offers/";
    private static final String JOINING_DIR = "uploads/joining/";

    // ─── Excel Bulk Upload ──────────────────────────────────────────────────

    @Transactional
    public BulkUploadResult processBulkUpload(MultipartFile file, Long hrUserId) {
        List<String> errors = new ArrayList<>();
        int total = 0, success = 0;
        User hrUser = userRepository.findById(hrUserId).orElse(null);

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                total++;
                try {
                    processRow(row, i, hrUser);
                    success++;
                } catch (Exception e) {
                    errors.add("Row " + (i + 1) + ": " + e.getMessage());
                }
            }
        } catch (IOException e) {
            errors.add("Failed to parse Excel file: " + e.getMessage());
        }

        return BulkUploadResult.builder()
                .totalRows(total)
                .successfulRows(success)
                .failedRows(total - success)
                .errors(errors)
                .build();
    }

    private void processRow(Row row, int rowIdx, User hrUser) {
        String email = getCellString(row, 0);
        if (email == null || email.isBlank()) throw new RuntimeException("Email is empty");

        User user = userRepository.findByEmail(email.trim())
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        JobApplication app = applicationRepository.findByUserId(user.getId()).stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No application for: " + email));

        // Assessment score
        Double score = getCellNumeric(row, 1);
        String remarks = getCellString(row, 2);
        if (score != null) {
            AssessmentResult result = assessmentResultRepository.findByApplicationId(app.getId())
                    .orElse(AssessmentResult.builder().application(app).evaluatedBy(hrUser).evaluatedAt(LocalDateTime.now()).build());
            result.setScore(score);
            result.setRemarks(remarks);
            result.setEvaluatedBy(hrUser);
            result.setEvaluatedAt(LocalDateTime.now());
            assessmentResultRepository.save(result);

            if (app.getStatus() == ApplicationStatus.ASSESSMENT_PENDING || app.getStatus() == ApplicationStatus.APPLIED) {
                app.setStatus(ApplicationStatus.ASSESSMENT_COMPLETED);
            }
        }

        // BGC status
        String bgcStatusStr = getCellString(row, 3);
        String bgcRemarks = getCellString(row, 4);
        if (bgcStatusStr != null && !bgcStatusStr.isBlank()) {
            BgvStatus bgcStatus = BgvStatus.valueOf(bgcStatusStr.trim().toUpperCase());
            BackgroundVerification bgv = bgvRepository.findByApplicationId(app.getId())
                    .orElse(BackgroundVerification.builder().application(app).build());
            bgv.setStatus(bgcStatus);
            bgv.setRemarks(bgcRemarks);
            if (bgcStatus == BgvStatus.PASSED || bgcStatus == BgvStatus.CLEARED) {
                bgv.setCompletedAt(LocalDateTime.now());
            }
            bgvRepository.save(bgv);
        }

        // Offer eligible
        String offerEligible = getCellString(row, 5);
        if ("true".equalsIgnoreCase(offerEligible) || "yes".equalsIgnoreCase(offerEligible)) {
            if (app.getStatus() == ApplicationStatus.ASSESSMENT_COMPLETED) {
                app.setStatus(ApplicationStatus.QUALIFIED);
            }
        }

        applicationRepository.save(app);
    }

    public byte[] generateTemplate() {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Bulk Upload");
            Row header = sheet.createRow(0);
            String[] cols = {"candidateEmail", "assessmentScore", "assessmentRemarks", "bgcStatus", "bgcRemarks", "offerEligible"};
            for (int i = 0; i < cols.length; i++) {
                header.createCell(i).setCellValue(cols[i]);
            }
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate template", e);
        }
    }

    // ─── Bulk Offer Generation ──────────────────────────────────────────────

    @Transactional
    public Map<String, Object> bulkGenerateOffers(Long hrUserId) {
        User hrUser = userRepository.findById(hrUserId).orElse(null);
        List<JobApplication> eligible = applicationRepository.findByStatus(ApplicationStatus.QUALIFIED);
        int generated = 0;

        try { Files.createDirectories(Paths.get(OFFERS_DIR)); } catch (IOException ignored) {}

        for (JobApplication app : eligible) {
            // Check BGC passed
            BackgroundVerification bgv = bgvRepository.findByApplicationId(app.getId()).orElse(null);
            boolean bgcOk = bgv != null && (bgv.getStatus() == BgvStatus.PASSED || bgv.getStatus() == BgvStatus.CLEARED);
            if (!bgcOk) continue;

            // Skip if offer already exists
            if (offerLetterRepository.findByApplicationId(app.getId()).isPresent()) continue;

            String pdfPath = generateOfferPdf(app);

            OfferLetter offer = OfferLetter.builder()
                    .application(app)
                    .content(pdfPath)
                    .sentBy(hrUser)
                    .sentAt(LocalDateTime.now())
                    .build();
            offerLetterRepository.save(offer);

            app.setStatus(ApplicationStatus.OFFER_SENT);
            applicationRepository.save(app);

            notificationService.notify(app.getUser().getId(), "OFFER_RECEIVED",
                    "Offer Letter Generated", "Your offer letter for " + app.getJob().getTitle() + " is ready. Download it from your offers section.");
            generated++;
        }

        return Map.of("totalEligible", eligible.size(), "offersGenerated", generated);
    }

    private String generateOfferPdf(JobApplication app) {
        String fileName = "offer_" + app.getId() + "_" + System.currentTimeMillis() + ".pdf";
        Path path = Paths.get(OFFERS_DIR, fileName);

        try {
            Document doc = new Document(PageSize.A4, 50, 50, 50, 50);
            PdfWriter.getInstance(doc, new FileOutputStream(path.toFile()));
            doc.open();

            Font titleFont = new Font(Font.HELVETICA, 20, Font.BOLD);
            Font bodyFont = new Font(Font.HELVETICA, 12, Font.NORMAL);
            Font boldFont = new Font(Font.HELVETICA, 12, Font.BOLD);

            doc.add(new Paragraph("NEXHIRE TECHNOLOGIES PVT. LTD.", titleFont));
            doc.add(new Paragraph("\n"));
            doc.add(new Paragraph("OFFER OF EMPLOYMENT", new Font(Font.HELVETICA, 16, Font.BOLD)));
            doc.add(new Paragraph("\n\n"));
            doc.add(new Paragraph("Date: " + LocalDate.now(), bodyFont));
            doc.add(new Paragraph("\n"));
            doc.add(new Paragraph("Dear " + app.getUser().getName() + ",", bodyFont));
            doc.add(new Paragraph("\n"));
            doc.add(new Paragraph("We are pleased to offer you the position of " + app.getJob().getTitle() + " at NexHire Technologies Pvt. Ltd.", bodyFont));
            doc.add(new Paragraph("\n"));
            doc.add(new Paragraph("Terms and Conditions:", boldFont));
            doc.add(new Paragraph("1. This offer is subject to successful background verification.", bodyFont));
            doc.add(new Paragraph("2. You are required to join within 30 days of accepting this offer.", bodyFont));
            doc.add(new Paragraph("3. Your initial training period will be 60 days.", bodyFont));
            doc.add(new Paragraph("4. Location assignment will be based on availability and your preferences.", bodyFont));
            doc.add(new Paragraph("\n\n"));
            doc.add(new Paragraph("Please accept or reject this offer through the NexHire portal.", bodyFont));
            doc.add(new Paragraph("\n\n"));
            doc.add(new Paragraph("Best Regards,", bodyFont));
            doc.add(new Paragraph("HR Department", boldFont));
            doc.add(new Paragraph("NexHire Technologies Pvt. Ltd.", bodyFont));

            doc.close();
        } catch (Exception e) {
            log.error("Failed to generate offer PDF for app {}: {}", app.getId(), e.getMessage());
            return "GENERATION_FAILED";
        }

        return path.toString();
    }

    // ─── Bulk Joining Letter Generation ─────────────────────────────────────

    @Transactional
    public Map<String, Object> bulkGenerateJoiningLetters(Long hrUserId) {
        User hrUser = userRepository.findById(hrUserId).orElse(null);
        List<JobApplication> accepted = applicationRepository.findByStatus(ApplicationStatus.OFFER_ACCEPTED);
        int generated = 0, onHold = 0;

        try { Files.createDirectories(Paths.get(JOINING_DIR)); } catch (IOException ignored) {}

        for (JobApplication app : accepted) {
            if (joiningLetterRepository.findByApplicationId(app.getId()).isPresent()) continue;

            Location allocated = allocateLocation(app);
            if (allocated == null) {
                app.setStatus(ApplicationStatus.JOINING_ON_HOLD);
                app.setHoldReason("No location with available budget and training seats.");
                app.setHoldCreatedAt(LocalDateTime.now());
                applicationRepository.save(app);
                onHold++;
                continue;
            }

            // Consume budget + seat
            HiringBudget budget = hiringBudgetRepository.findByLocationId(allocated.getId()).orElse(null);
            TrainingSeat seats = trainingSeatRepository.findByLocationId(allocated.getId()).orElse(null);
            if (budget != null) {
                budget.setUsedSlots(budget.getUsedSlots() + 1);
                budget.setUsedAmount(budget.getUsedAmount() + 50000L);
                hiringBudgetRepository.save(budget);
            }
            if (seats != null) {
                seats.setOccupiedSeats(seats.getOccupiedSeats() + 1);
                trainingSeatRepository.save(seats);
            }

            LocalDate joiningDate = LocalDate.now().plusDays(14);
            String pdfPath = generateJoiningPdf(app, allocated, joiningDate);

            JoiningLetter letter = JoiningLetter.builder()
                    .application(app)
                    .content(pdfPath)
                    .joiningDate(joiningDate)
                    .location(allocated)
                    .sentBy(hrUser)
                    .sentAt(LocalDateTime.now())
                    .build();
            joiningLetterRepository.save(letter);

            app.setStatus(ApplicationStatus.JOINING_LETTER_SENT);
            applicationRepository.save(app);

            notificationService.notify(app.getUser().getId(), "JOINING_LETTER",
                    "Joining Letter Issued", "Your joining letter has been generated. Location: " + allocated.getName() + ". Joining date: " + joiningDate);
            generated++;
        }

        return Map.of("totalAccepted", accepted.size(), "joiningGenerated", generated, "onHold", onHold);
    }

    private Location allocateLocation(JobApplication app) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(app.getUser().getId()).orElse(null);
        List<String> prefs = new ArrayList<>();
        if (profile != null) {
            if (profile.getLocationPreference1() != null) prefs.add(profile.getLocationPreference1());
            if (profile.getLocationPreference2() != null) prefs.add(profile.getLocationPreference2());
            if (profile.getLocationPreference3() != null) prefs.add(profile.getLocationPreference3());
        }

        // Try preferences in order
        for (String pref : prefs) {
            Location loc = locationRepository.findByNameIgnoreCase(pref).orElse(null);
            if (loc != null && hasCapacity(loc)) return loc;
        }

        // Fallback: any location with capacity
        for (Location loc : locationRepository.findAll()) {
            if (hasCapacity(loc)) return loc;
        }

        return null;
    }

    private boolean hasCapacity(Location loc) {
        HiringBudget b = hiringBudgetRepository.findByLocationId(loc.getId()).orElse(null);
        TrainingSeat s = trainingSeatRepository.findByLocationId(loc.getId()).orElse(null);
        if (b == null || s == null) return false;
        return (b.getTotalSlots() - b.getUsedSlots() > 0) && (s.getTotalSeats() - s.getOccupiedSeats() > 0);
    }

    private String generateJoiningPdf(JobApplication app, Location location, LocalDate joiningDate) {
        String fileName = "joining_" + app.getId() + "_" + System.currentTimeMillis() + ".pdf";
        Path path = Paths.get(JOINING_DIR, fileName);

        try {
            Document doc = new Document(PageSize.A4, 50, 50, 50, 50);
            PdfWriter.getInstance(doc, new FileOutputStream(path.toFile()));
            doc.open();

            Font titleFont = new Font(Font.HELVETICA, 20, Font.BOLD);
            Font bodyFont = new Font(Font.HELVETICA, 12, Font.NORMAL);
            Font boldFont = new Font(Font.HELVETICA, 12, Font.BOLD);

            doc.add(new Paragraph("NEXHIRE TECHNOLOGIES PVT. LTD.", titleFont));
            doc.add(new Paragraph("\n"));
            doc.add(new Paragraph("JOINING LETTER", new Font(Font.HELVETICA, 16, Font.BOLD)));
            doc.add(new Paragraph("\n\n"));
            doc.add(new Paragraph("Date: " + LocalDate.now(), bodyFont));
            doc.add(new Paragraph("Ref: NH/" + app.getId() + "/" + LocalDate.now().getYear(), bodyFont));
            doc.add(new Paragraph("\n"));
            doc.add(new Paragraph("Dear " + app.getUser().getName() + ",", bodyFont));
            doc.add(new Paragraph("\n"));
            doc.add(new Paragraph("This is to confirm your joining at NexHire Technologies Pvt. Ltd. as " + app.getJob().getTitle() + ".", bodyFont));
            doc.add(new Paragraph("\n"));
            doc.add(new Paragraph("Joining Details:", boldFont));
            doc.add(new Paragraph("  Location: " + location.getName() + ", " + location.getCity(), bodyFont));
            doc.add(new Paragraph("  Joining Date: " + joiningDate, bodyFont));
            doc.add(new Paragraph("  Training Duration: 60 days", bodyFont));
            doc.add(new Paragraph("\n"));
            doc.add(new Paragraph("Please report to the above location on the joining date with all original documents.", bodyFont));
            doc.add(new Paragraph("\n\n"));
            doc.add(new Paragraph("Best Regards,", bodyFont));
            doc.add(new Paragraph("HR Department", boldFont));
            doc.add(new Paragraph("NexHire Technologies Pvt. Ltd.", bodyFont));

            doc.close();
        } catch (Exception e) {
            log.error("Failed to generate joining PDF for app {}: {}", app.getId(), e.getMessage());
            return "GENERATION_FAILED";
        }

        return path.toString();
    }

    // ─── Helpers ────────────────────────────────────────────────────────────

    private String getCellString(Row row, int col) {
        Cell cell = row.getCell(col);
        if (cell == null) return null;
        if (cell.getCellType() == CellType.STRING) return cell.getStringCellValue();
        if (cell.getCellType() == CellType.NUMERIC) return String.valueOf((long) cell.getNumericCellValue());
        return null;
    }

    private Double getCellNumeric(Row row, int col) {
        Cell cell = row.getCell(col);
        if (cell == null) return null;
        if (cell.getCellType() == CellType.NUMERIC) return cell.getNumericCellValue();
        if (cell.getCellType() == CellType.STRING) {
            try { return Double.parseDouble(cell.getStringCellValue()); } catch (NumberFormatException e) { return null; }
        }
        return null;
    }
}
