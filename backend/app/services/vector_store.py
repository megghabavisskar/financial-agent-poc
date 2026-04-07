from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
import os

class VectorStoreService:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.vector_store_path = "data/faiss_index"
        self.vector_store = None

    def load_or_create_index(self):
        if os.path.exists(self.vector_store_path):
             self.vector_store = FAISS.load_local(self.vector_store_path, self.embeddings, allow_dangerous_deserialization=True)
        else:
            # Initialize empty store? FAISS needs text to init.
            # We'll handle init on first add.
            pass

    def add_texts(self, texts: list[str], metadatas: list[dict] = None):
        if self.vector_store is None:
            self.load_or_create_index()

        if self.vector_store is None:
            self.vector_store = FAISS.from_texts(texts, self.embeddings, metadatas=metadatas)
        else:
            self.vector_store.add_texts(texts, metadatas=metadatas)
        self.save_index()

    def save_index(self):
        if self.vector_store:
            self.vector_store.save_local(self.vector_store_path)

    def similarity_search(self, query: str, k: int = 4):
        if self.vector_store:
            return self.vector_store.similarity_search(query, k=k)
        return []
