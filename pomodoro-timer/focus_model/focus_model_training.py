import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import r2_score, mean_absolute_error
import joblib

# Set random seed for reproducibility
np.random.seed(42)

# Parameters
n_samples = 10000
personas = ['Early Bird', 'Night Owl', 'Stress-Sensitive', 'Steady Worker']
samples_per_persona = n_samples // len(personas)

# Initialize lists to store data
data = []

for persona in personas:
    for _ in range(samples_per_persona):
        energy = np.random.randint(1, 11)
        stress = np.random.randint(1, 11)
        motivation = np.random.randint(1, 11)
        hour_of_day = np.random.randint(0, 24)
        
        # Calculate focus_readiness based on persona
        if persona == 'Early Bird':
            # High focus 7-11 AM, sharp dip 2-5 PM
            if 7 <= hour_of_day <= 11:
                base_focus = 75 + energy * 2
            elif 14 <= hour_of_day <= 17:
                base_focus = 20 + energy * 0.5
            else:
                base_focus = 50 + energy
            focus_readiness = np.clip(base_focus + np.random.normal(0, 3), 0, 100)
        
        elif persona == 'Night Owl':
            # High focus 8 PM - 12 AM, sharp dip 6-10 AM
            if 20 <= hour_of_day or hour_of_day <= 0:
                base_focus = 80 + energy * 1.5
            elif 6 <= hour_of_day <= 10:
                base_focus = 15 + energy * 0.3
            else:
                base_focus = 45 + energy * 0.8
            focus_readiness = np.clip(base_focus + np.random.normal(0, 3), 0, 100)
        
        elif persona == 'Stress-Sensitive':
            # Focus degrades exponentially with stress > 5
            if stress > 5:
                base_focus = 70 * np.exp(-(stress - 5) * 0.3) + energy * 2
            else:
                base_focus = 70 + energy * 1.5
            focus_readiness = np.clip(base_focus + np.random.normal(0, 3), 0, 100)
        
        else:  # Steady Worker
            # Focus = Energy * Motivation, independent of hour
            base_focus = (energy * motivation) / 1.2
            focus_readiness = np.clip(base_focus + np.random.normal(0, 2), 0, 100)
        
        data.append({
            'energy': energy,
            'stress': stress,
            'motivation': motivation,
            'hour_of_day': hour_of_day,
            'persona': persona,
            'focus_readiness': focus_readiness
        })

# Create DataFrame
df = pd.DataFrame(data)

print("Dataset Summary:")
print(f"Total samples: {len(df)}")
print(f"\nPersona distribution:\n{df['persona'].value_counts()}")
print(f"\nDataset head:\n{df.head()}")
print(f"\nFocus readiness stats by persona:\n{df.groupby('persona')['focus_readiness'].describe()}\n")

# Prepare features and target
X = df[['energy', 'stress', 'motivation', 'hour_of_day']]
y = df['focus_readiness']

# Split into train/test sets (80/20)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"Training set size: {len(X_train)}")
print(f"Test set size: {len(X_test)}\n")

# Train GradientBoostingRegressor
model = GradientBoostingRegressor(
    n_estimators=200,
    learning_rate=0.1,
    max_depth=5,
    min_samples_split=5,
    random_state=42
)

model.fit(X_train, y_train)

# Make predictions
y_pred_train = model.predict(X_train)
y_pred_test = model.predict(X_test)

# Evaluate model
train_r2 = r2_score(y_train, y_pred_train)
test_r2 = r2_score(y_test, y_pred_test)
train_mae = mean_absolute_error(y_train, y_pred_train)
test_mae = mean_absolute_error(y_test, y_pred_test)

print("=" * 50)
print("MODEL EVALUATION METRICS")
print("=" * 50)
print(f"Training R² Score: {train_r2:.4f}")
print(f"Test R² Score: {test_r2:.4f}")
print(f"Training MAE: {train_mae:.4f}")
print(f"Test MAE: {test_mae:.4f}")
print("=" * 50)

# Feature importance
feature_importance = pd.DataFrame({
    'feature': ['energy', 'stress', 'motivation', 'hour_of_day'],
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print(f"\nFeature Importance:\n{feature_importance}\n")

# Save model
joblib.dump(model, 'focus_model.joblib')
print("Model saved as 'focus_model.joblib'")

# Save dataset for reference
df.to_csv('focus_sessions_dataset.csv', index=False)
print("Dataset saved as 'focus_sessions_dataset.csv'")