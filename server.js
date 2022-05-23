// Import and require dependencies
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

// const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    // Update MySQL credentials
    password: 'Pass123',
    database: 'employee_db'
  },
);

// Start database connect, display welcome message and run main menu function
db.connect(err => {
  if (err) throw err;
  console.log(`
  ------------------------------------------------------
 |                                                      |
 |                                                      |
 |                                                      |
 |                  Welcome to the                      |
 |                 Employee Manager                     |
 |                                                      |
 |                                                      |
 |                                                      |
  ------------------------------------------------------
`)
  mainMenu();
});


// Primary menu function of application
function mainMenu(){
  inquirer.prompt([
  {
    type: 'list',
    name:'menuChoice',
    message: 'What would you like to do?',
    choices: [
    'View All Employees',
    'View Employees by Manager',
    'View Employees by Department',
    'Add Employee',
    'Update Employee Role',
    'Update Employee Manager',
    'Delete Employee',
    'View All Roles',
    'Add Role',
    'Delete Role',
    'View All Departments',
    'View Departments Salary Total',
    'Add Department',
    'Delete Department',
    'Quit'
    ]   
  }

  ]).then((res)=>{
    console.log('\n');
    console.log(res.menuChoice);
console.log('\n');
    switch(res.menuChoice) {
      case 'View All Employees':
        viewEmployees();
        break;
      case 'View Employees by Manager':
        viewEmployeeByManager();
        break;
      case 'View Employees by Department':
        viewEmployeeByDepartment();
        break;
      case 'Add Employee':
        addEmployee();
        break;
      case 'Update Employee Role':
        updateEmployee();
        break;
      case 'Update Employee Manager':
        updateEmployeeManager();
        break;
      case 'Delete Employee':
        deleteEmployee();
        break;
      case 'View All Roles':
        viewRoles();
        break;
      case 'Add Role':
        addRoles();
        break;
      case 'Delete Role':
        deleteRoles();
        break;
      case 'View All Departments':
        viewDepartments();
        break;
      case 'View Departments Salary Total':
        viewDepartmentSalaryTotal();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'Delete Department':
        deleteDepartment();
        break;
      case 'Quit':
        db.end();
        break;
      }
      
    }).catch((err)=>{
  if(err)throw err;
  });
}


// Employee function - View All Employee data with role and department details 
function viewEmployees() {
  const query = 
  `SELECT 
      employee.id, 
      employee.first_name, 
      employee.last_name, 
      role.title, 
      department.name AS department, 
      role.salary, 
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager
  FROM employee
  LEFT JOIN role
      ON employee.role_id = role.id
  LEFT JOIN department
      ON department.id = role.department_id
  LEFT JOIN employee manager
      ON manager.id = employee.manager_id`

  db.query(query, (err, res)=>{
    if (err) throw err;
    console.table(res);
    console.log('\n');
    mainMenu();
  });
};

// Employee function - Add new Employee and assign role and manager details 
function addEmployee() {
  db.query('SELECT * FROM role', (err, res) => {
    if (err) console.log(err);
    roleList = res.map((roleList) => {
        return {
            name: roleList.title,
            value: roleList.id,
        };
    });

    db.query('SELECT * FROM employee', (err, res) => {
      if (err) console.log(err);
      managerList = res.map((managerList) => {
          return {
              name: managerList.first_name + " " + managerList.last_name,
              value: managerList.id
          };
      });
      managerList.unshift({ 
        name: "None",  
        value: null 
      });

  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?"
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?"
      },
      {
        type: "list",
        name: "employeeRole",
        message: "What is the employee's role?",
        choices: roleList,
      },
      {
        type: "list",
        name: "managerName",
        message: "Who is the employee's manager?",
        choices: managerList,
      },
    ]).then((res)=>{
      let query = `INSERT INTO employee SET ?`;
      db.query(query, {
          first_name: res.firstName,
          last_name: res.lastName,
          role_id: res.employeeRole,
          manager_id: res.managerName,
      },(err, res)=>{
          if(err) throw err;
          console.log('\n');
          console.log('Added new employess to the database');
          console.log('\n');
          mainMenu();
        });
      });
    });
  });
}

// Employee function - Update Employee role 
function updateEmployee() {
  db.query('SELECT * FROM employee', (err, res) => {
    if (err) console.log(err);
    employeeList = res.map((employeeList) => {
        return {
            name: employeeList.first_name + " " + employeeList.last_name,
            value: employeeList.id
        };
    });

  db.query('SELECT * FROM role', (err, res) => {
      if (err) console.log(err);
      roleList = res.map((roleList) => {
          return {
              name: roleList.title,
              value: roleList.id,
          };
    });
    inquirer
    .prompt([
      {
        type: "list",
        name: "employeeUpdate",
        message: "Which employee's role would you like to update?",
        choices: employeeList,
      },
      {
        type: "list",
        name: "newRole",
        message: "Which role do you want to assign to the selected employee?",
        choices: roleList,
      },
    ]).then((res)=>{
        let query = `UPDATE employee SET ? WHERE ?`;
        db.query(query, [
                {
                  role_id: res.newRole,
                },
                {
                    id: res.employeeUpdate,
                },
              ], (err, res)=>{
            if(err) throw err;
            console.log('\n');
            console.log(`Employee's role has been updated`);
            console.log('\n');
            mainMenu();
        });
      });
    });
  });
}

// Employee function - Update Employee's manager details 
function updateEmployeeManager() {
  db.query('SELECT * FROM employee', (err, res) => {
    if (err) console.log(err);
    employeeList = res.map((employeeList) => {
        return {
            name: employeeList.first_name + " " + employeeList.last_name,
            value: employeeList.id
        };
    });

    db.query('SELECT * FROM employee', (err, res) => {
      if (err) console.log(err);
      managerList = res.map((managerList) => {
          return {
              name: managerList.first_name + " " + managerList.last_name,
              value: managerList.id
          };
      });
      managerList.unshift({ 
        name: "None",  
        value: null 
      });

    inquirer
    .prompt([
      {
        type: "list",
        name: "employeeUpdate",
        message: "Which employee's manager would you like to update?",
        choices: employeeList,
      },
      {
        type: "list",
        name: "newManager",
        message: "Who is the employee's new manager?",
        choices: managerList,
      },
    ]).then((res)=>{
        let query = `UPDATE employee SET ? WHERE ?`;
        db.query(query, [
            {
              manager_id: res.newManager,
            },
            {
                id: res.employeeUpdate,
            },
          ], (err, res)=>{
        if(err) throw err;
        console.log('\n');
        console.log(`Employee's manager has been updated`);
        console.log('\n');
        mainMenu();
        });
      });
    });
  });
}

// Employee function - Delete Employee
function deleteEmployee () {
  db.query('SELECT * FROM employee', (err, res) => {
    if (err) console.log(err);
    employeeList = res.map((employeeList) => {
        return {
            name: employeeList.first_name + " " + employeeList.last_name,
            value: employeeList.id
        };
    });
    inquirer
    .prompt([
      {
        type: "list",
        name: "employeeDelete",
        message: "Which employee would you like to delete?",
        choices: employeeList,
      },
    ]).then((res)=>{
      const query = 
      `DELETE FROM employee WHERE ?`;
      db.query(query, [
        {
          id: res.employeeDelete
        },
      ], (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log(`Employee has been deleted`);
        console.log('\n');
        mainMenu();
      });
    });
  });
};

// Role function - View all roles with the associated department details 
function viewRoles() {
  const query = `SELECT role.id, role.title, department.name AS department, role.salary
  FROM role
  LEFT JOIN department ON (department.id = role.department_id)`;
  db.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      console.log('\n');
      mainMenu();
  });
};

// Role function - Add new role and assign to department
function addRoles() {
  db.query('SELECT * FROM department', (err, res) => {
    if (err) console.log(err);
    depList = res.map((depList) => {
        return {
            name: depList.name,
            value: depList.id
        };
    });
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the name of the role?"
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the role?"
      },
      {
        type: "list",
        name: "departmentList",
        message: "Which department does the role belong to?",
        choices: depList,
      },
    ]).then((res)=>{
      let query = `INSERT INTO role SET ?`;
      db.query(query, {
          title: res.title,
          salary: res.salary,
          department_id: res.departmentList
      },(err, res)=>{
          if(err) throw err;
          console.log('\n');
          console.log(`Added new role to the database`);
          mainMenu();
      });
  });
});
}

// Role function - Delete role
function deleteRoles() {
  db.query('SELECT * FROM role', (err, res) => {
    if (err) console.log(err);
    roleList = res.map((roleList) => {
        return {
            name: roleList.title,
            value: roleList.id,
        };
  });
  inquirer
  .prompt([
    {
      type: "list",
      name: "newRole",
      message: "Which role would you like to delete?",
      choices: roleList,
    },
  ]).then((res)=>{
    const query = 
    `DELETE FROM role WHERE ?`;
    db.query(query, [
      {
        id: res.newRole
      },
  ], (err, res) => {
      if (err) throw err;
      console.log('Role has been deleted');
      console.log('\n');
      mainMenu();
    });
  });
});
};

// Department function - View all departments 
function viewDepartments() {
  const query = 
  `SELECT id, name AS department FROM department`;
  db.query(query, (err, res)=>{
      if (err) throw err;
      console.table(res);
      console.log('\n');
      mainMenu();
  })
};

// Department function - Create new department 
function addDepartment() {
    inquirer.prompt([
      {
        name: 'addDepartmentName',
        type: 'input',
        message: 'What is the name of the department?'
      }
    ]).then((res)=>{
      const query = 
      `INSERT INTO department SET ?`;
      db.query(query, {
        name: res.addDepartmentName
      }, (err, res) => {
        if (err) throw err;
        console.log(`Added department to the database`);
        console.log('\n');
        mainMenu();
      });
    });
}

// Department function - Delete department 
function deleteDepartment() {
  db.query('SELECT * FROM department', (err, res) => {
    if (err) console.log(err);
    depList = res.map((depList) => {
        return {
            name: depList.name,
            value: depList.id
        };
    });
    inquirer
    .prompt([
      {
        type: "list",
        name: "departmentList",
        message: "Which department would you like to delete?",
        choices: depList,
      },
    ]).then((res)=>{
      const query = 
      `DELETE FROM department WHERE ?`;
      db.query(query, [
        {
          id: res.departmentList
        },
    ], (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log(`Department has been deleted`);
        console.log('\n');
        mainMenu();
      });
    });
  });
}

// View function - View all employees that sit under a manager 
function viewEmployeeByManager() {
  db.query('SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL ORDER BY id ASC;', (err, res) => {
    if (err) console.log(err);
    managerList = res.map((managerList) => {
        return {
          name: managerList.first_name + " " + managerList.last_name,
          value: managerList.id
        };
    });
    inquirer.prompt([
    {
      type: "list",
      name: "manager",
      message: "Please select a manager to search for employees by",
      choices: managerList,
    },
  ]).then((res)=>{
    const query = 
    `SELECT 
              employee.id, 
              employee.first_name, 
              employee.last_name, 
              role.title, 
              department.name AS department,
              CONCAT(manager.first_name, ' ', manager.last_name) AS manager
          FROM employee
          JOIN role
              ON employee.role_id = role.id
          JOIN department
              ON department.id = role.department_id
              LEFT JOIN employee manager
              ON manager.id = employee.manager_id
          WHERE employee.manager_id = ?`
      db.query(query, res.manager,(err, res)=>{
      if (err) throw err;
      console.log('\n');
      console.table(res);
      console.log('\n');
      mainMenu();
    });
  });
});
};

// View function - View all employees that sit under a certain department 
function viewEmployeeByDepartment() {
  db.query('SELECT * FROM department', (err, res) => {
    if (err) console.log(err);
    depList = res.map((depList) => {
        return {
            name: depList.name,
            value: depList.id
        };
    });
    inquirer.prompt([
    {
      type: "list",
      name: "departmentList",
      message: "Please select a manager to search for employees by",
      choices: depList,
    },
  ]).then((res)=>{
    const query = 
    `SELECT 
              employee.id, 
              employee.first_name, 
              employee.last_name, 
              role.title, 
              department.name AS department,
              CONCAT(manager.first_name, ' ', manager.last_name) AS manager
          FROM employee
          JOIN role
              ON employee.role_id = role.id
          JOIN department
              ON department.id = role.department_id
              LEFT JOIN employee manager
              ON manager.id = employee.manager_id
          WHERE department.id = ?`
      db.query(query, res.departmentList,(err, res)=>{
      if (err) throw err;
      console.log('\n');
      console.table(res);
      console.log('\n');
      mainMenu();
    });
  });
});
};

// View function - View the salary totals for each department 
function viewDepartmentSalaryTotal() {
  db.query('SELECT * FROM department', (err, res) => {
    if (err) console.log(err);
    depList = res.map((depList) => {
        return {
            name: depList.name,
            value: depList.id
        };
    });
    inquirer.prompt([
    {
      type: "list",
      name: "departmentList",
      message: "Please department you would like to view a total of the salaries for",
      choices: depList,
    },
  ]).then((res)=>{
    const query = 
    `SELECT   
            department.name AS department,
            SUM(role.salary) AS total
          FROM employee
          JOIN role
              ON employee.role_id = role.id
          JOIN department
              ON department.id = role.department_id
          WHERE department.id = ?`
        db.query(query, res.departmentList,(err, res)=>{
      if (err) throw err;
      console.log('\n');
      console.table(res);
      console.log('\n');
      mainMenu();
    });
  });
});
};


