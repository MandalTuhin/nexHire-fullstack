package com.nexhire.enums;

public enum BgvStatus {
    NOT_STARTED,
    DOCUMENTS_PENDING,
    DOCUMENTS_SUBMITTED,
    IN_PROGRESS,
    PASSED,
    FAILED,
    // Legacy values kept for compatibility with existing data
    PENDING,
    CLEARED,
    ON_HOLD
}
