from langchain_google_genai import ChatGoogleGenerativeAI
import os

class LLMService:
    def __init__(self):
        # Ensure GOOGLE_API_KEY is set in environment or pass it here
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
             print("CRITICAL WARNING: GOOGLE_API_KEY not found in environment variables.")
        else:
             print(f"GOOGLE_API_KEY found: {api_key[:5]}...")
        
        # Using gemini-2.5-flash as found in available models
        self.llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=api_key)

    async def generate_response(self, prompt: str):
        import asyncio
        from google.api_core.exceptions import ResourceExhausted, ServiceUnavailable
        
        max_retries = 3
        base_delay = 2
        
        for attempt in range(max_retries):
            try:
                return await self.llm.ainvoke(prompt)
            except (ResourceExhausted, ServiceUnavailable) as e:
                if attempt == max_retries - 1:
                    raise e
                
                print(f"Quota hit/Service unavailable. Retrying in {base_delay}s... (Attempt {attempt+1}/{max_retries})")
                await asyncio.sleep(base_delay)
                base_delay *= 2  # Exponential backoff
        return None 

