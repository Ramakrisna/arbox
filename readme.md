#Arbox Home Assignment

## The goal of the task is to build a script that simulates insertion of new clients into the db

***

### There are a couple of assumptions I've taken when building this project:
### 1. Since this is a simulation and not a real world situation, I have the 2 Excel files provided in the task and the way I'm handling the part of connecting to the db is by using 'node-xlsx' and getting the data from those files.
### 2. When importing the data I get the dates as Date object, when I print them to the sql file I use them as a string.
### 3. I didn't create much validation to the different functions because this is a mock db and the specifications are a bit obscure regarding that part.
### 4. When addressing the issue of adding the new members to the membership table, I've used an assumption of getting the last user ID, that wouldn't happen in a real world scenario for the many problems that can arise from doing it this way.

***

Since this is based on existing files to simulate the db, running the project is very simple:
1. Download the project from GitHub (either through the command line or using the browser).
2. Open the command line, go to the directory of the project and then type 'npm install'.
3. Run the project by typing 'npm start' from the command line when inside the project's directory.
4. After it's run its course, a new file named 'update_db.sql' will be created with the relevant sql queries.
