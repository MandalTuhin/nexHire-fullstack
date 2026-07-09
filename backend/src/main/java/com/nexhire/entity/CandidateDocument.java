package com.nexhire.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** RESUME, CLASS10_CERT, CLASS12_CERT, BTECH_MARKSHEET, ID_PROOF, OTHER */
    @Column(nullable = false)
    private String docType;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String filePath;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime uploadedAt;
}
