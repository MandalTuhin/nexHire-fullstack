package com.nexhire.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkUploadResult {
    private int totalRows;
    private int successfulRows;
    private int failedRows;
    private List<String> errors;
}
