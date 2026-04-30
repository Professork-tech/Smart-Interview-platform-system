package com.interviewplatform.backend.controller;

import com.interviewplatform.backend.dto.CodeSubmissionRequest;
import com.interviewplatform.backend.entity.Question;
import com.interviewplatform.backend.entity.Submission;
import com.interviewplatform.backend.security.CustomUserDetails;
import com.interviewplatform.backend.service.QuestionService;
import com.interviewplatform.backend.service.SubmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;
    private final SubmissionService submissionService;

    @GetMapping
    public ResponseEntity<List<Question>> getAllQuestions() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<Submission> submitCode(
            @PathVariable Long id,
            @Valid @RequestBody CodeSubmissionRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
            
        Submission submission = submissionService.submitCode(
                currentUser.getId(), id, request.getCode(), request.getLanguage());
        return ResponseEntity.ok(submission);
    }
}
