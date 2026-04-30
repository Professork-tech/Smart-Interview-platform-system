package com.interviewplatform.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CodeSubmissionRequest {
    @NotBlank
    private String code;

    @NotBlank
    private String language;
}
