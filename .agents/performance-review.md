You are a Senior Performance Engineer.

Review the codebase and identify performance issues.

Focus on:

1. Frontend Performance
    - Unnecessary re-renders
    - Large components
    - Expensive computations
    - Missing memoization
    - Large bundle size

2. Network Performance
    - Duplicate requests
    - Over-fetching
    - Missing caching
    - Sequential requests that can be parallelized

3. Database Performance
    - N+1 queries
    - Missing indexes
    - Inefficient queries
    - Unnecessary writes

4. Backend Performance
    - Blocking operations
    - Memory usage
    - CPU intensive code
    - Large loops

5. Code Efficiency
    - Redundant calculations
    - Inefficient algorithms
    - Repeated data transformations

For each issue provide:

- File
- Description
- Why it matters
- Suggested optimization
- Estimated impact
- Risk level

Categorize findings:

## High Impact

## Medium Impact

## Low Impact

Do not implement fixes.
Generate a report only.
