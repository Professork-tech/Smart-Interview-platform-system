package com.interviewplatform.backend.config;

import com.interviewplatform.backend.entity.Category;
import com.interviewplatform.backend.entity.Difficulty;
import com.interviewplatform.backend.entity.Question;
import com.interviewplatform.backend.repository.CategoryRepository;
import com.interviewplatform.backend.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final QuestionRepository questionRepository;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            System.out.println("Seeding database with sample data...");

            // Create Categories
            Category arrays = Category.builder().name("Arrays").description("Questions related to Array data structures").build();
            Category dp = Category.builder().name("Dynamic Programming").description("Optimization over plain recursion").build();
            Category strings = Category.builder().name("Strings").description("String manipulation and algorithms").build();

            categoryRepository.saveAll(List.of(arrays, dp, strings));

            // Create Questions
            Question q1 = Question.builder()
                    .title("Two Sum")
                    .description("Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.")
                    .difficulty(Difficulty.EASY)
                    .category(arrays)
                    .constraints("2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9")
                    .examples("Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]")
                    .starterCode("class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}")
                    .build();

            Question q2 = Question.builder()
                    .title("Climbing Stairs")
                    .description("You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?")
                    .difficulty(Difficulty.EASY)
                    .category(dp)
                    .constraints("1 <= n <= 45")
                    .examples("Input: n = 2\nOutput: 2\nExplanation: There are two ways to climb to the top.\n1. 1 step + 1 step\n2. 2 steps")
                    .starterCode("class Solution {\n    public int climbStairs(int n) {\n        // Write your code here\n        return 0;\n    }\n}")
                    .build();

            Question q3 = Question.builder()
                    .title("Longest Substring Without Repeating Characters")
                    .description("Given a string s, find the length of the longest substring without repeating characters.")
                    .difficulty(Difficulty.MEDIUM)
                    .category(strings)
                    .constraints("0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces.")
                    .examples("Input: s = \"abcabcbb\"\nOutput: 3\nExplanation: The answer is \"abc\", with the length of 3.")
                    .starterCode("class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your code here\n        return 0;\n    }\n}")
                    .build();

            questionRepository.saveAll(List.of(q1, q2, q3));

            System.out.println("Sample data seeded successfully!");
        }
    }
}
