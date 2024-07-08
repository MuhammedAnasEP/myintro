# My Intro

## Setup and Installation

### Backend

1. Clone the repository:
   ```bash
   git clone https://github.com/MuhammedAnasEP/myintro.git
   cd myintro
   
2. Create a virtual environment and activate it:

   ```bash
     python -m venv venv Or virtualenv venv
     source venv/bin/activate   # On Windows, use `venv\Scripts\activate`

3. Install dependencies:

   ```bash
     pip install -r requirements.txt

4. Connect Database:
   
     I used SQLite for database,
     If your using same non need to change
     Or you want to connect with other engines like Postgresql, MySQL etc. You want to change the engine section also.
     

6. Run migrations:
 
   ```bash
    python manage.py makemigrations
    python manage.py migrate

  
7. Run the server:
    
   ```bash
    python manage.py runserver

## API Endpoints

  None: I used JWT Authentication in all users end point for secruty. And The token is stored in the HTTPOnly Cookie.

  ### For Authentication
    POST /api/auth/register: Register user for authentication
    POST /api/auth/login: Login user get token and store token to the cookies
    POST /api/auth/logout: Logout user and remove token from the cookies
    POST /api/auth/refresh-token: Create new token
    GET /api/auth/user: for fetch the data of current logined user
  

### Front End

1. Go to the frontend folder
     ```bash
     cd frontend

2. Install Dependencies
     ```bash
     npm install

3. run frontend
     ```bash
     npm start
