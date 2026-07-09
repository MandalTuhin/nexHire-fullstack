package com.nexhire.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateProfileResponse {
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String address;
    private LocalDate dateOfBirth;
    private Double class10Percentage;
    private Integer class10PassingYear;
    private Double class12Percentage;
    private Integer class12PassingYear;
    private Double btechCgpa;
    private Integer btechPassingYear;
    private String skills;
    private String locationPreference1;
    private String locationPreference2;
    private String locationPreference3;
    private Boolean profileComplete;
}
