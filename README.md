# LockN

LockN is a web application built with Node.js and Express that helps users manage their fitness goals, track exercises, create workout plans, and compete on leaderboards. It features user authentication, task management, and goal tracking to keep users motivated and organized.

## Live Demo

Check out the live version of LockN: [https://lockn-dkxj.onrender.com/](https://lockn-dkxj.onrender.com/)

## Features

- **User Authentication**: Secure login and account creation using bcrypt for password hashing.
- **Exercise Management**: Add and track personal exercises.
- **Goal Setting**: Set and monitor fitness goals.
- **Workout Plans**: Create and manage personalized workout plans.
- **Task Tracking**: Organize and complete fitness-related tasks.
- **Leaderboards**: Compete with others based on tasks and goals completed.
- **Responsive UI**: Built with EJS templates and static assets for a clean user interface.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (with pg and pg-promise)
- **Authentication**: bcrypt, jsonwebtoken, express-session
- **Frontend**: EJS (Embedded JavaScript Templates), CSS
- **Other**: cookie-parser, body-parser, dotenv

## Usage

- Visit the home page to view your dashboard (requires login).
- Create an account or log in to access features.
- Add exercises, set goals, create plans, and track progress.
- View leaderboards to see how you rank against other users.

## Project Structure

- `app.js`: Main application file.
- `db.js`: Database connection and queries.
- `routes/`: Contains route handlers for different features.
- `views/`: EJS templates for rendering pages.
- `public/`: Static assets (CSS, images, fonts).
- `sql/`: Database schema and setup scripts.

## Author

Thompson High