package com.interviewplatform.backend.controller;

import com.interviewplatform.backend.entity.Category;
import com.interviewplatform.backend.entity.Question;
import com.interviewplatform.backend.service.CategoryService;
import com.interviewplatform.backend.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final CategoryService categoryService;
    private final QuestionService questionService;

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        return ResponseEntity.ok(categoryService.createCategory(category));
    }

    @PostMapping("/categories/{categoryId}/questions")
    public ResponseEntity<Question> createQuestion(
            @PathVariable Long categoryId,
            @RequestBody Question question) {
        return ResponseEntity.ok(questionService.createQuestion(question, categoryId));
    }
}
