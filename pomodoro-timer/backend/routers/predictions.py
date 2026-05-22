from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

router = APIRouter()

# Request model
class FocusReadinessRequest(BaseModel):
    energy: int = Field(..., ge=1, le=10, description="Energy level 1-10")
    stress: int = Field(..., ge=1, le=10, description="Stress level 1-10")
    motivation: int = Field(..., ge=1, le=10, description="Motivation level 1-10")

# Response model
class FocusReadinessResponse(BaseModel):
    focus_score: int = Field(..., description="Predicted focus readiness 0-100")
    coach_message: str = Field(..., description="Personalized coaching recommendation")
    target_minutes: int = Field(..., description="Recommended Pomodoro interval in minutes")
    hour_of_day: int = Field(..., description="System hour used for prediction")
    category: str = Field(..., description="Focus category: Premium, Solid, or Low")

def get_coach_recommendation(score: float) -> tuple[str, int, str]:
    """
    Evaluate focus score and return coach message, target minutes, and category.
    
    Args:
        score: Float between 0-100
        
    Returns:
        Tuple of (coach_message, target_minutes, category)
    """
    score = int(score)
    
    if score >= 80:
        category = "Premium Focus Peak"
        coach_message = (
            f"🔥 Premium Focus Peak ({score}/100)! Your mind is sharp and ready. "
            "This is the perfect time to tackle your most challenging, deep-work task. "
            "Commit to a focused 45-minute sprint—no distractions. You're in the zone!"
        )
        target_minutes = 45
    
    elif 50 <= score < 80:
        category = "Solid State"
        coach_message = (
            f"✅ Solid State ({score}/100). You're in a good place. "
            "Run a standard 25-minute Pomodoro cycle and maintain momentum. "
            "This is reliable, sustainable productivity."
        )
        target_minutes = 25
    
    else:  # score < 50
        category = "Low Readiness"
        coach_message = (
            f"🌱 Low Readiness ({score}/100). No pressure. Take a soft 15-minute "
            "micro-focus burst to build momentum gently. Light tasks, recovery vibes, "
            "and ease back in. Sometimes consistency beats intensity."
        )
        target_minutes = 15
    
    return coach_message, target_minutes, category

@router.post("/predict-readiness", response_model=FocusReadinessResponse)
async def predict_focus_readiness(request: Request, body: FocusReadinessRequest):
    """
    Predict user's current focus readiness based on internal state and time-of-day.
    
    Takes energy, stress, and motivation as inputs.
    Automatically uses current system hour for predictions.
    Returns a focus score and personalized coaching recommendation.
    """
    
    # Check if model is loaded
    if not hasattr(request.app.state, 'focus_model'):
        raise HTTPException(status_code=500, detail="ML model not loaded")
    
    try:
        # Get current hour
        hour_of_day = datetime.now().hour
        
        # Prepare features for prediction
        features = [[
            body.energy,
            body.stress,
            body.motivation,
            hour_of_day
        ]]
        
        # Make prediction
        model = request.app.state.focus_model
        focus_score = model.predict(features)[0]
        
        # Ensure score is in valid range
        focus_score = max(0, min(100, focus_score))
        
        # Get coach recommendation
        coach_message, target_minutes, category = get_coach_recommendation(focus_score)
        
        return FocusReadinessResponse(
            focus_score=int(focus_score),
            coach_message=coach_message,
            target_minutes=target_minutes,
            hour_of_day=hour_of_day,
            category=category
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid input: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")