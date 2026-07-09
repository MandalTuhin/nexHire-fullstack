package com.nexhire.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TraineeResponse {

    private Long traineeId;
    private Long userId;
    private Long applicationId;
    private String candidateName;
    private String candidateEmail;
    private String jobTitle;
    private String applicationStatus;
    private Integer progress;
    private String topic;
    private Boolean completed;
    private LocalDate trainingStartDate;
    private LocalDate trainingEndDate;
    private LocalDateTime joinedAt;
    private LocalDateTime updatedAt;
}
