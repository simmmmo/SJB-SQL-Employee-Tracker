INSERT INTO department (name)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales"),
       ("Service");

INSERT INTO role (title, salary, department_id)
VALUES ("Salesperson", 100000, 4),
       ("Lead Engineer", 100000, 1),
       ("Software Engineer", 100000, 1),
       ("Account Manager", 100000, 5),
       ("Accountant", 100000, 2),
       ("Legal Team Lead", 100000, 3),
       ("Lawyer", 100000, 3);
       
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, NULL),
       ("Mike", "Chan", 1, 1),
       ("Ashley", "Rodriguez", 2, NULL),
       ("Kevin", "Tupik", 2, 3),
       ("Kunal", "Singh", 3, NULL),
       ("Malia", "Brown", 3, 5),
       ("Sarah", "Lourd", 4, NULL),
       ("Tom", "Allan", 4, 7);
