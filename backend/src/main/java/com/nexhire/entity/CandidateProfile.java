package com.nexhire.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String address;
    private LocalDate dateOfBirth;

    // Class 10
    private Double class10Percentage;
    private Integer class10PassingYear;

    // Class 12
    private Double class12Percentage;
    private Integer class12PassingYear;

    // B.Tech
    private Double btechCgpa;
    private Integer btechPassingYear;

    private String skills;

    // Location preferences (names or IDs referencing locations)
    private String locationPreference1;
    private String locationPreference2;
    private String locationPreference3;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
