package com.interviewplatform.backend.service;

import com.interviewplatform.backend.entity.Question;
import com.interviewplatform.backend.entity.Submission;
import com.interviewplatform.backend.entity.SubmissionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final SubmissionService submissionService;
    private final QuestionService questionService;
    private final CategoryService categoryService;

    public List<Question> getRecommendations(Long userId) {
        List<Submission> userSubmissions = submissionService.getUserSubmissions(userId);
        
        // Topic accuracy map: CategoryId -> [Total Attempted, Total Accepted]
        Map<Long, int[]> topicStats = new HashMap<>();
        
        for (Submission sub : userSubmissions) {
            Long categoryId = sub.getQuestion().getCategory().getId();
            topicStats.putIfAbsent(categoryId, new int[]{0, 0});
            
            topicStats.get(categoryId)[0]++; // Total attempted
            if (sub.getStatus() == SubmissionStatus.ACCEPTED) {
                topicStats.get(categoryId)[1]++; // Total accepted
            }
        }

        // Find the weakest topic (lowest accuracy)
        Long weakestTopicId = null;
        double lowestAccuracy = 1.0;

        for (Map.Entry<Long, int[]> entry : topicStats.entrySet()) {
            int total = entry.getValue()[0];
            int accepted = entry.getValue()[1];
            double accuracy = total == 0 ? 0 : (double) accepted / total;
            
            if (accuracy <= lowestAccuracy) {
                lowestAccuracy = accuracy;
                weakestTopicId = entry.getKey();
            }
        }

        // If no topics attempted yet, or no obvious weak topic, just return first category
        if (weakestTopicId == null && !categoryService.getAllCategories().isEmpty()) {
            weakestTopicId = categoryService.getAllCategories().get(0).getId();
        }

        Long finalWeakestTopicId = weakestTopicId;
        
        // Recommend unsolved questions from the weakest topic
        List<Long> solvedQuestionIds = userSubmissions.stream()
                .filter(s -> s.getStatus() == SubmissionStatus.ACCEPTED)
                .map(s -> s.getQuestion().getId())
                .collect(Collectors.toList());

        return questionService.getAllQuestions().stream()
                .filter(q -> q.getCategory().getId().equals(finalWeakestTopicId))
                .filter(q -> !solvedQuestionIds.contains(q.getId()))
                .limit(5) // Max 5 recommendations
                .collect(Collectors.toList());
    }
}
