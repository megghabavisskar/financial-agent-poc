from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.agents.graph import create_graph
from typing import Dict, Any

router = APIRouter()

class AnalyzeRequest(BaseModel):
    text: str

@router.post("/analyze", status_code=status.HTTP_200_OK)
async def analyze_document(request: AnalyzeRequest) -> Dict[str, Any]:
    graph = create_graph()
    try:
        inputs = {"extracted_text": request.text}
        result = await graph.ainvoke(inputs)
        
        # Extract relevant parts from state
        return {
            "summary": result.get("summary"),
            "mcqs": result.get("mcqs"),
            "analytics": result.get("analytics_data")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in analysis workflow: {str(e)}")
