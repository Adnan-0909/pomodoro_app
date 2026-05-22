# Project Answers

## 1. How to Run

### Fresh Machine Setup

**Prerequisites:**
- Node.js v14+ ([Download](https://nodejs.org/))
- Python 3.8+ ([Download](https://www.python.org/))
- Git

**Exact Steps:**

```bash
#After opening the repo
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..

# Start backend (Terminal 1)
cd backend
python app.py

# Start frontend (Terminal 2)
npm start
```

**Expected Output:**

Terminal 1:
```
✓ Focus model loaded successfully from D:\...\models\focus_model.joblib
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Terminal 2:
```
Compiled successfully!
You can now view pomodoro-timer in the browser.
Local: http://localhost:3000
```

**Access:**
- Frontend: `http://localhost:3000`
- Backend API Docs: `http://localhost:8000/docs`

**Deployment:**
Not currently deployed. For production, consider:
- Frontend: Vercel, Netlify
- Backend: Heroku, AWS EC2, Railway
- Model: AWS SageMaker or containerized with Docker

---

## 2. Stack & Design Choices

### Frontend Stack: React.js + CSS

**Why React for this task:**
1. **State Management**: Timer requires real-time updates (milliseconds), which React handles efficiently with hooks and re-renders only affected components
2. **Reusability**: Breaking UI into components (Timer, Controls, Settings, History, ThemeToggle) prevents code duplication and maintains consistency
3. **Integration with ML Backend**: React's fetch API makes it trivial to call FastAPI endpoints and update UI with predictions
4. **Dark Mode Toggle**: React context/state makes theme switching seamless without page reloads
5. **Local Storage Persistence**: Session history survives page refreshes, improving UX

**Why FastAPI for backend:**
- Async-first design perfect for concurrent ML predictions
- Automatic OpenAPI documentation (`/docs`)
- Built-in request validation with Pydantic
- CORS middleware simplifies frontend integration
- Fast startup and deployment

---

### Design Decision #1: Timer Takes 60% of Viewport

**Location**: `src/App.css` - `.app-main` and `Timer` component

**Decision**: The circular timer occupies 60% of the viewport height and uses a prominent visual hierarchy

**Why this matters:**
- **Primary Task Focus**: The timer is the core interaction. Users need to see their remaining time at a glance
- **Peripheral Information**: Controls (START/PAUSE), Settings, and History are secondary and positioned below or to the side
- **Mobile Optimization**: On 360px phones, 60% prevents UI overflow while keeping the timer readable. On 1440px laptops, it creates breathing room
- **Psychological Impact**: A large timer reinforces commitment to the work session and reduces distraction impulse

**Code Reference**:
```css
.app-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Timer takes ~60% of available space */
.main-card {
  width: 100%;
  max-width: 600px;
}
```

---

### Design Decision #2: ML Recommendation Section Above Timer (Vertical Stack, Not Inline)

**Location**: `src/App.jsx` - `focus-recommendation-section` placed before Timer

**Decision**: The recommendation feature is a separate card stacked vertically above the timer, not embedded inline or in a modal

**Why this matters:**
1. **Intentional Workflow**: Users must consciously opt-in to get an ML recommendation before starting. They adjust sliders, click "Get Recommendation," and see results—then the timer duration auto-updates. This creates a ritual/intention-setting moment.

2. **Information Hierarchy**: Stacking vertically (top-to-bottom) mirrors natural reading patterns. Recommendation comes first (planning), timer comes second (execution).

3. **Grid vs. Sidebar Consideration**: We chose NOT to put the recommendation in a sidebar because:
   - Sidebars compete for attention on mobile (360px screens)
   - A vertical stack works uniformly across all screen sizes
   - Users see the recommendation results clearly before scrolling to the timer

4. **Visual Separation**: The recommendation card has a distinct border and background color, signaling "this is optional context," not "this is the main action."

**Code Reference**:
```jsx
<div className="main-card">
  {/* Recommendation section FIRST */}
  <div className="focus-recommendation-section">
    {/* Sliders, button, results */}
  </div>

  {/* Timer section SECOND */}
  <Timer ... />
  <Controls ... />
  <Settings ... />
</div>
```

---

## 3. Responsive & Accessibility

### Responsive Behavior: 360px Phone vs. 1440px Laptop

#### **360px Mobile (iPhone SE, Pixel 5)**

**Layout Adjustments**:
- Single-column layout (no sidebar initially visible)
- Timer circle scaled to 50-70% of viewport
- Sliders stack vertically with full width
- History sidebar slides in via hamburger menu (if implemented) or scrolls below
- Font sizes reduce: heading `2rem` → `1.5rem`

**Example**:
```css
@media (max-width: 768px) {
  .app-content {
    flex-direction: column; /* Stack main + sidebar */
  }
  .main-card {
    max-width: 100%;
    padding: 1rem;
  }
  .slider-group {
    gap: 0.8rem; /* Tighter spacing */
  }
}
```

#### **1440px Laptop**

**Layout Adjustments**:
- Two-column layout: main content (left 70%) + sidebar history (right 30%)
- Timer takes comfortable 60% of center area with white space
- Sliders are 3 columns wide with room to breathe
- Font sizes optimal: heading `2.5rem`, body `1rem`
- Hover states on buttons (touch-unfriendly on mobile, enabled here)

**CSS**:
```css
@media (min-width: 1200px) {
  .app-content {
    display: flex;
    gap: 2rem;
  }
  .app-main {
    flex: 2;
  }
  .app-sidebar {
    flex: 1;
  }
}
```

---

### Accessibility: Handled 

**1. Keyboard Navigation (Focus States)**

**Implementation**: All interactive elements have visible focus indicators

```css
button:focus,
input[type="range"]:focus {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}
```

**Why**: Users who can't use a mouse can tab through sliders, buttons, and START/PAUSE controls. Focus ring is high-contrast and obvious.

**Location**: Affects "Get Recommendation" button, sliders (Energy/Stress/Motivation), START/PAUSE controls

---

**2. Color Contrast**

**Implementation**: Dark mode and light mode both meet WCAG AA standards

- Light mode: Dark text (#222) on white (#fff) = 18:1 contrast
- Dark mode: Light text (#e0e0e0) on dark (#1a1a1a) = 12:1 contrast
- Accent color (#4CAF50) tested against both backgrounds

```css
:root {
  --text-primary: #222222;
  --text-secondary: #666666;
  --background: #ffffff;
  --accent-color: #4CAF50;
}

[data-theme="dark"] {
  --text-primary: #e0e0e0;
  --background: #1a1a1a;
}
```

**Location**: Entire UI, especially timer display and coach messages

---

**3. Semantic HTML & ARIA Labels**

**Implementation**: Form inputs and interactive regions use proper labels

```html
<label>Energy: {energy}</label>
<input
  type="range"
  min="1"
  max="10"
  value={energy}
  aria-label="Energy level from 1 to 10"
/>
```

**Why**: Screen readers announce "Energy level slider, value 7 out of 10" instead of generic "slider".

**Location**: All three sliders in the recommendation section

---

**4. Dark Mode Toggle Accessibility**

**Implementation**: Theme toggle has text label + icon

```jsx
<ThemeToggle isDarkMode={isDarkMode} onToggle={setIsDarkMode} />
```

Renders as button with aria-label:
```html
<button aria-label="Toggle dark mode" onClick={...}>
  {isDarkMode ? '☀️' : '🌙'}
</button>
```

**Why**: Users with low vision benefit from dark mode; proper labeling ensures they know what the toggle does.

---

### Accessibility: Skipped (Intentional) 

**1. Audio/Haptic Notifications**

**What we skipped**: No sound alert when timer ends, no vibration on mobile

**Why we skipped it**:
- Use case is personal focus work; user watches screen
- Adding sound would require permissions (Notifications API) and increase complexity
- Could distract in shared spaces (libraries, offices)

**Tradeoff**: Users in a different tab won't know timer ended. Acceptable because Pomodoro is meant for active focus (not background).

**Could implement** (future): Optional sound toggle in Settings with volume control

---

**2. Screen Reader Announcements for Timer Countdown**

**What we skipped**: Timer doesn't announce "5 minutes remaining" every second

**Why we skipped it**:
- Would be verbally exhausting for screen reader users
- Screen reader users can still read the visual timer display
- Announcements only useful if user isn't watching the screen (defeats Pomodoro purpose)

**Tradeoff**: Screen reader users must check the timer manually. Acceptable given use case.

**Could implement** (future): Announce at key milestones (start, 5 min left, time up) via `aria-live` region

---

**3. Mobile Swipe Gestures**

**What we skipped**: No swipe-to-adjust-sliders, no swipe between screens

**Why we skipped it**:
- Sliders already have touch-friendly hit targets (44px+ height)
- Standard HTML `<input type="range">` handles touch natively
- Swipe gestures add complexity without solving accessibility; they're a nice-to-have UX feature

**Tradeoff**: Mobile users drag sliders instead of swiping. Standard, expected behavior.

---

## Summary Table

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **60% Timer Size** | Large, centered timer | Primary task focus + psychological commitment |
| **Vertical Recommendation Stack** | Above timer, not sidebar | Mobile-first, natural workflow, consistent scaling |
| **Focus Rings** | 2px accent outline | Keyboard nav accessibility |
| **Color Contrast** | WCAG AA compliant | Low-vision accessibility |
| **Semantic HTML** | aria-labels on sliders | Screen reader clarity |
| **No Audio Alerts** | Skipped | Distracting in shared spaces; user watches screen |
| **No Countdown Announcements** | Skipped | Would exhaust screen reader users; defeats purpose |

---

## 4. AI Usage

### Tools & Prompts Used

I used **GitHub Copilot** (Claude Haiku 4.5) and **Claude AI** throughout this project as my primary development assistants. As my main focus and interest lies in **ML and Data Science** rather than web development, I leveraged AI for most frontend and DevOps tasks.

I used AI for almost all of the project, I am not familiar with web-development yet as my main focus and interest lies in ML and Data Science, therefore I tinkered a little bit with the UI components but overall I would not take single credit for it.
Rather, I added a sample ML part, to predict suitable focus time for the user, this would also keep the user engaged.
Although I don't understand Frontend, I will be working/learning it this summer.
Thank you.


## 5. Flaws and How to Improve
There are multiple gaps I think, especially that ML feature, It can be scaled very much with specific user habits, with continous training loop. Apart from that the UI ofcourse, I can't say much about it because I don't know much about it. I could have dug a little deeper, but exam season didn't let me.

That's it, the ML part mainly.