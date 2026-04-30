package com.interviewplatform.backend.service;

import com.interviewplatform.backend.entity.Question;
import com.interviewplatform.backend.entity.Submission;
import com.interviewplatform.backend.entity.SubmissionStatus;
import com.interviewplatform.backend.entity.User;
import com.interviewplatform.backend.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class SubmissionService {
    private final SubmissionRepository submissionRepository;
    private final UserService userService;
    private final QuestionService questionService;

    public Submission submitCode(Long userId, Long questionId, String code, String language) {
        User user = userService.getUserById(userId);
        Question question = questionService.getQuestionById(questionId);

        // Simulated Evaluation Engine
        SubmissionStatus evaluatedStatus = simulateCodeEvaluation(code);

        Submission submission = Submission.builder()
                .user(user)
                .question(question)
                .code(code)
                .language(language)
                .status(evaluatedStatus)
                .executionTimeMs(new Random().nextInt(500) + 10) // random ms
                .memoryUsedKb(new Random().nextInt(5000) + 1000) // random kb
                .build();

        return submissionRepository.save(submission);
    }

    private SubmissionStatus simulateCodeEvaluation(String code) {
        // Simple mock logic: if code contains "error", return error, else ACCEPTED or WRONG_ANSWER
        if (code.toLowerCase().contains("syntax error")) return SubmissionStatus.COMPILATION_ERROR;
        if (code.toLowerCase().contains("while(true)")) return SubmissionStatus.TIME_LIMIT_EXCEEDED;
        
        return new Random().nextBoolean() ? SubmissionStatus.ACCEPTED : SubmissionStatus.WRONG_ANSWER;
    }

    public List<Submission> getUserSubmissions(Long userId) {
        return submissionRepository.findByUserId(userId);
    }
}
