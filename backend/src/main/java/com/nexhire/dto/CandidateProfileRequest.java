package com.nexhire.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateProfileRequest {

    @NotBlank private String phone;
    @NotBlank private String address;
    @NotNull private LocalDate dateOfBirth;
    @NotNull private Double class10Percentage;
    @NotNull private Integer class10PassingYear;
    @NotNull private Double class12Percentage;
    @NotNull private Integer class12PassingYear;
    @NotNull private Double btechCgpa;
    @NotNull private Integer btechPassingYear;
    @NotBlank private String skills;
    @NotBlank private String locationPreference1;
    @NotBlank private String locationPreference2;
    @NotBlank private String locationPreference3;
}
