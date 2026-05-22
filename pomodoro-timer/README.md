# Pomodoro Timer with ML-Powered Focus Prediction

A modern Pomodoro timer application with machine learning integration to predict optimal focus readiness and personalize work intervals based on your energy, stress, and motivation levels.

## Features

- **Pomodoro Timer**: Customizable focus and break intervals
- **ML Focus Prediction**: Get personalized work interval recommendations based on your current state
- **Dark Mode**: Toggle between light and dark themes
- **Session History**: Track your daily focus sessions
- **Smart Coach**: AI-powered recommendations tailored to your focus readiness score

## Tech Stack

- **Frontend**: React.js (Port 3000)
- **Backend**: FastAPI + Python (Port 8000)
- **ML Model**: Scikit-Learn (Gradient Boosting Regressor)
- **Data Processing**: NumPy, Pandas

## Prerequisites

- Node.js (v14+) and npm
- Python (v3.8+)

## Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Run this command from the project root
npm run setup-all
```

### Option 2: Manual Setup

#### 1. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

#### 2. Install Frontend Dependencies

```bash
cd ..
npm install
```

#### 3. Start Backend Server (Terminal 1)

```bash
cd backend
python app.py
```

You should see:
```
✓ Focus model loaded successfully
INFO:     Uvicorn running on http://0.0.0.0:8000
```

#### 4. Start Frontend Server (Terminal 2)

```bash
npm start
```

The app will automatically open at `http://localhost:3000`

## Usage

1. **Get ML Recommendation** (Optional):
   - Adjust Energy, Stress, and Motivation sliders (1-10 scale)
   - Click "Get Recommendation" button
   - View your Focus Score and personalized recommendation
   - Timer will automatically set to recommended interval

2. **Run Pomodoro Session**:
   - Click START button to begin focus session
   - Timer will count down the focus duration
   - Break timer starts automatically after focus session ends

3. **View History**:
   - Check "Daily History" sidebar to see your completed sessions


## API Documentation

Once both servers are running, visit: `http://localhost:8000/docs`

### Endpoints

- `POST /api/predict-readiness`: Get focus prediction
  - **Input**: `energy` (1-10), `stress` (1-10), `motivation` (1-10)
  - **Output**: `focus_score` (0-100), `coach_message`, `target_minutes`

- `GET /health`: Health check endpoint

## Focus Score Categories

| Score | Category | Recommendation |
|-------|----------|-----------------|
| 80-100 | Premium Focus Peak | 45-minute deep work sprint |
| 50-79 | Solid State | 25-minute standard Pomodoro |
| 0-49 | Low Readiness | 15-minute micro-focus burst |

## Model Details

The ML model analyzes 4 distinct human personas:

1. **Early Bird**: High focus 7-11 AM, dips 2-5 PM
2. **Night Owl**: High focus 8 PM-12 AM, dips 6-10 AM
3. **Stress-Sensitive**: Focus degrades with high stress
4. **Steady Worker**: Focus tied to energy × motivation

Trained on 10,000 synthetic focus sessions with non-linear interactions.

## Troubleshooting

### Backend won't connect
- Ensure backend is running on port 8000
- Check: `curl http://localhost:8000/health`
- Restart both servers

### "Model not found" error
- Verify `backend/models/focus_model.joblib` exists
- Run the training script: `python backend/focus_model_training.py`

### Port already in use
- Backend: `PORT=8001 python app.py`
- Frontend: `PORT=3001 npm start`

## Available Scripts

```bash
npm start              # Start React dev server
npm test              # Run tests
npm run build         # Build for production
```

## License

MIT License

## Contributing

Feel free to submit issues and enhancement requests!
