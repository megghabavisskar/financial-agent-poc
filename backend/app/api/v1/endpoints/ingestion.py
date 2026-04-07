from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.services.ingestion import IngestionService
from app.services.vector_store import VectorStoreService
from typing import Dict, Any

router = APIRouter()

@router.post("/ingest/pdf", status_code=status.HTTP_200_OK)
async def ingest_pdf(file: UploadFile = File(...)) -> Dict[str, Any]:
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    content = await IngestionService.process_pdf(file)
    
    # Add to Vector Store
    vector_store = VectorStoreService()
    vector_store.add_texts([content], metadatas=[{"source": file.filename}])

    return {
        "filename": file.filename,
        "content_length": len(content),
        "content_preview": content[:500] if len(content) > 500 else content,
        "full_content": content
    }

@router.post("/ingest/csv", status_code=status.HTTP_200_OK)
async def ingest_csv(file: UploadFile = File(...)) -> Dict[str, Any]:
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="File must be a CSV")
    
    content = await IngestionService.process_csv(file)

    # Add to Vector Store
    vector_store = VectorStoreService()
    vector_store.add_texts([content], metadatas=[{"source": file.filename}])
    
    return {
        "filename": file.filename,
        "content_length": len(content),
        "content_preview": content[:500] if len(content) > 500 else content,
        "full_content": content
    }
