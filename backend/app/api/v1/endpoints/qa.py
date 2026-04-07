from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.services.rag import RAGService
from typing import Dict, Any

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str

@router.post("/qa", status_code=status.HTTP_200_OK)
async def ask_question(request: QuestionRequest) -> Dict[str, Any]:
    rag_service = RAGService()
    try:
        # Note: In a real app, you'd want to dependency inject the service 
        # or use a global instance to reuse the vector store loaded in memory.
        answer = await rag_service.query(request.question)
        return {"question": request.question, "answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")
