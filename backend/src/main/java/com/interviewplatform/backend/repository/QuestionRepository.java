package com.interviewplatform.backend.repository;

import com.interviewplatform.backend.entity.Difficulty;
import com.interviewplatform.backend.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByCategoryId(Long categoryId);
    List<Question> findByDifficulty(Difficulty difficulty);
}
