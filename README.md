# TVS SQL ChatBot
 
A full-stack Text-to-SQL chatbot for TVS Dealer Management System (DMS), enabling natural language queries to a SQL Server database. Built with FastAPI (Python) backend and Angular frontend.
 
## Features
 
- Natural language to SQL query conversion using HuggingFace T5 model
- FastAPI backend for model inference and database access
- Angular 20 frontend with chat UI
- Dealer ID input for personalized queries
- SQL results rendered as tables in chat
- Secure, RESTful API integration
 
## Tech Stack
 
- Backend: Python, FastAPI, pyodbc, HuggingFace Transformers, SQL Server
- Frontend: Angular
- Database: SQL Server (ODBC Driver 17)
 
## Setup
 
### Backend
 
1. Install dependencies:
   cd fastapi_backend
   pip install -r requirements.txt
2. Create dataset according to the database schema, refer text2sql_dataset.jsonl.
3. Run train_model.py fro fine tuning the model.
4. Configure your SQL Server connection in main.py.
5. Start the FastAPI server:
   uvicorn main:app --reload
 
### Frontend
 
1. Install dependencies:
   cd tvs-angular-frontend
   npm install
2. Start the Angular app:
   ng serve
 
## Usage
 
- Open the Angular app in your browser.
- Enter your Dealer ID in the chat header.
- Type natural language queries (e.g., "Show my pending orders").
- View SQL results as tables in the chat.
 
## Project Structure
 
fastapi_backend/
  main.py
  requirements.txt
  train_model.py
  ...
tvs-angular-frontend/
  src/app/
    chat/
    dashboard/
    services/
  ...
 
## Model Training
 
- Train the T5 model using train_model.py and your dataset (text2sql_dataset.jsonl).
- The backend loads the trained model for inference.
