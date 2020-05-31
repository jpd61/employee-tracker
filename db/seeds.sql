INSERT INTO department(department_name)
VALUES("Engineering"), ("Sales"), ("Finance"), ("Legal");

INSERT INTO role(title, salary, department_id)
VALUES("Engineer", 90000, 1), ("Senior Engineer", 120000, 1);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, 2), ('Charlotte', 'Crow', 1, null), ('Mike', 'Seaux', 1, 2), ('Jimmy', 'Jones', 2, 2);

