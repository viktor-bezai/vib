import os
from openai import OpenAI

# Set the OpenAI API key
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)


def review_code_changes(diff):
    # Prompt for the AI
    prompt = f"""You are a code reviewer for a Django and Next.js project. Analyze the following code changes 
    and describe what was modified in this pull request:
    ```
    {diff}
    ```
    Provide detailed feedback for clarity, correctness, and best practices. Highlight areas that need 
    improvement or correction."""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a highly skilled Django and Next.js code reviewer."
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
print("Review Feedback:\n", review_feedback)
