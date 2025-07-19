import os
from openai import OpenAI

# Set the OpenAI API key
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)


def review_code_changes(diff):
    # Prompt for the AI
    prompt = f"""You are an experienced code reviewer for a Django and Next.js project. Review this diff and provide ONLY important, actionable feedback.

    FOCUS ON:
    - Security vulnerabilities (exposed secrets, SQL injection, XSS, etc.)
    - Critical bugs that would break functionality
    - Performance issues that would significantly impact users
    - Major architectural problems
    
    IGNORE:
    - Minor style issues (use linters for this)
    - Personal preferences
    - Documentation unless it's misleading
    - Small optimizations that don't matter
    - Naming conventions unless they're seriously confusing
    
    If the code looks good, just say "LGTM" (Looks Good To Me).
    
    Keep feedback concise and actionable. Each issue should be 1-2 sentences max.
    
    Diff to review:
    ```
    {diff}
    ```"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a pragmatic senior developer reviewing code. Be direct, focus only on real issues that matter. Skip the fluff."
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    )
    return response.choices[0].message.content


with open('changes.diff', 'r') as f:
    diff_content = f.read()

review_feedback = review_code_changes(diff_content)

# Format output for better readability
print("=" * 60)
print("PR REVIEW")
print("=" * 60)
print(review_feedback)
print("=" * 60)
