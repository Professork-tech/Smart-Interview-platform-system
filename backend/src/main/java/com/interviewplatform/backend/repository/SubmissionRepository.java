package com.interviewplatform.backend.repository;

import com.interviewplatform.backend.entity.Submission;
import com.interviewplatform.backend.entity.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUserId(Long userId);
    List<Submission> findByQuestionId(Long questionId);
    List<Submission> findByUserIdAndQuestionId(Long userId, Long questionId);
    Long countByUserIdAndStatus(Long userId, SubmissionStatus status);
}
