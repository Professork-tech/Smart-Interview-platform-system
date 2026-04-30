package com.interviewplatform.backend.service;

import com.interviewplatform.backend.entity.Question;
import com.interviewplatform.backend.exception.ResourceNotFoundException;
import com.interviewplatform.backend.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final CategoryService categoryService;

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Question getQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", id));
    }

    public Question createQuestion(Question question, Long categoryId) {
        question.setCategory(categoryService.getCategoryById(categoryId));
        return questionRepository.save(question);
    }
}
