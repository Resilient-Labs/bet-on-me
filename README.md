# bet-on-me
Users can join groups (“clusters”) to work on habit-building together. Each group member selects habits they want to improve and sets a required frequency (weekly/monthly) and time limit for completing each habit. Users can place monetary bets on their own ability to complete the habit, and optionally bet with friends. The system tracks passes/fails for each habit, updates points, and manages the shared money pot. All progress is visible to the group, encouraging accountability and friendly competition.

## How to Build & Run the App

Follow these steps to run the project locally:

### 1. Clone the repository
git clone https://github.com/Resilient-Labs/bet-on-me.git
cd <your-project-folder>

### 2. Install server dependencies
npm install

### 3. Set up environment variables
- Create a `.env` file in config folder and add the following as `key = value`
  - PORT = 3000
  - MONGODB_URI = `your database URI`
  - CLOUD_NAME = `your cloudinary cloud name`
  - API_KEY = `your cloudinary api key`
  - API_SECRET = `your cloudinary api secret`

### 4. Run the server
npm start

### 5. Open the app

Navigate to:

http://localhost:3000   

## Tech Stack: 
| Category  | Tools                               |
| --------- | ----------------------------------- |
| Backend   | Node.js, Express, Mongoose, MongoDB |
| Frontend  | EJS, HTML, Bootstrap, JavaScript    |
| Dev Tools | dotenv                     |
