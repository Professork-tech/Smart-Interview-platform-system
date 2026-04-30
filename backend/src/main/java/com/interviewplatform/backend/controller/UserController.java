package com.interviewplatform.backend.controller;

import com.interviewplatform.backend.entity.Question;
import com.interviewplatform.backend.entity.Submission;
import com.interviewplatform.backend.entity.User;
import com.interviewplatform.backend.security.CustomUserDetails;
import com.interviewplatform.backend.service.RecommendationService;
import com.interviewplatform.backend.service.SubmissionService;
import com.interviewplatform.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final SubmissionService submissionService;
    private final RecommendationService recommendationService;

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(userService.getUserById(currentUser.getId()));
    }

    @GetMapping("/me/submissions")
    public ResponseEntity<List<Submission>> getUserSubmissions(@AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(submissionService.getUserSubmissions(currentUser.getId()));
    }

    @GetMapping("/me/recommendations")
    public ResponseEntity<List<Question>> getRecommendations(@AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(recommendationService.getRecommendations(currentUser.getId()));
    }
}
