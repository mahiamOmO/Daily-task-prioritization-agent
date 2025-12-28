from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from agent import run_my_agent 

app = FastAPI()

# Enable CORS to allow requests from Next.js (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

class TaskList(BaseModel):
    user_id: str
    raw_tasks: str

@app.post("/api/prioritize")
async def prioritize_tasks(data: TaskList):
    """
    API endpoint that receives raw tasks and returns prioritized data.
    """
    try:
        # Call the AI agent logic
        ai_result = run_my_agent(data.raw_tasks) 
        return {"tasks": ai_result}
    except Exception as e:
        print(f"Server Error: {e}")
        return {"error": str(e), "tasks": []}

if __name__ == "__main__":
    # Changed host to 127.0.0.1 for local development
    # Access this via http://127.0.0.1:8000 in your browser
    uvicorn.run(app, host="127.0.0.1", port=8000)