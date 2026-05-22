from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import os
from dotenv import load_dotenv
from routers import predictions

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Pomodoro Focus Readiness API",
    description="ML-powered focus prediction for optimal Pomodoro intervals",
    version="1.0.0"
)

# Add CORS middleware to allow React frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # React dev server
        "http://127.0.0.1:3000",
        "http://localhost:8080",
        "*"                            # Allow all origins (restrict in production)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML model at startup
@app.on_event("startup")
def load_model():
    """Load the trained focus model into memory once at startup"""
    model_path = os.path.join(os.path.dirname(__file__), 'models', 'focus_model.joblib')
    
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model not found at {model_path}")
    
    app.state.focus_model = joblib.load(model_path)
    print(f"✓ Focus model loaded successfully from {model_path}")

# Include routers
app.include_router(predictions.router, prefix="/api", tags=["predictions"])

# Health check endpoint
@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Pomodoro Focus Readiness API",
        "model_loaded": hasattr(app.state, 'focus_model')
    }

@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Pomodoro Focus Readiness API",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("BACKEND_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)