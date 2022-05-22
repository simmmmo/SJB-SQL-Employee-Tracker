# Employee Tracker (SJB-SQL-Employee-Tracker)

##  Description

Employee Trackeis to build a command-line application to manage a company's employee database. This CMS appplication is built using Node.js, Inquirer, and MySQL.

## User Story

```md
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

## Preview 

###### Using Employee Tracker

![exampleOfUsingEmployeeTracker](./assets/Note%20Taker.gif)

###### Example of adding employee

![exampleOfAddingEmployee](./assets/Note-Taker-Add-Remove-Notes.gif)

###### Example of deleting employee

![exampleOfDeletingEmployee](./assets/JSON-DB-Example.jpg)

## Installation 

###### Local Installation
* Clone the repository from [Github](git@github.com:simmmmo/SJB-SQL-Employee-Tracker.git)
* Ensure Node.js is installed
* Ensure MySQL is installed
* Install dependencies 
[express package](https://www.npmjs.com/package/express)
```bash
npm install
```
```bash
npm i inquirer
```
```bash
npm i mysql2
```
```bash
npm i console.table
```
* Update SQL User and Password to local credentials
```bash
  {
    host: 'localhost',
    user: 'root',
    password: 'Pass123',
    database: 'employee_db'
  },
```
* Log into MySQL and import DB schema and seed files

```bash
mysql -u root -p

source db/schema.sql

source db/seed.sql
```

## Usage 

###### Local Environment 
Run 
```bash
npm start
```

Follow the menu prompts to VIEW/UPDATE/DELETE employee records

* Avaliable Options
Run 
```bash
View All Employees 
View Employees by Manager 
View Employees by Department 
Add Employee 
Update Employee Role 
Update Employee Manager 
Delete Employee 
View All Roles 
Add Role 
Delete Role 
View All Departments 
View Departments Salary Total
Add Department 
Delete Department  
Quit
```

## Technology 
* Node.js
* Express.js
* Inquirer
* MySQL



## Project Links

###### Walkthrough video links
View All Employees, All Departments & All Roles


Add Employees, update Employee's role and manager & delete Employee


View Employees by Manager and department. View Department salary total



###### Repo name

* SJB-SQL-Employee-Tracker

###### GitHub enviroment

* https://github.com/simmmmo/SJB-SQL-Employee-Tracker
* git@github.com:simmmmo/SJB-SQL-Employee-Tracker.git

