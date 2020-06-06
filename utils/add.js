// Require Dependencies
const inquirer = require('inquirer');
const chalk = require('chalk');
const connection = require('./config');
const application = require('../server');
const validation = require('./validate');

// Holds all add functionality
const add = {
  addEmployee() {
    let query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.id AS 'title_id' `;
    query += `FROM employee, role `;
    query += `WHERE role.id = employee.role_id`;

    connection.query(query, (err, res) => {
      if (err) throw err;
      let managerNamesArr = ['N/A'];

      // Push role titles to array for user choices
      res.forEach((employee) => {
        managerNamesArr.push(`${employee.first_name} ${employee.last_name}`);
      });

      let query = `SELECT role.id, role.title FROM role`;
      connection.query(query, (error, response) => {
        if (error) throw error;
        let rolesArray = [];

        response.forEach((role) => {
          rolesArray.push(role.title);
        });

        inquirer
          .prompt([
            {
              name: 'firstName',
              type: 'input',
              message: 'What is the employees first name?',
              validate: validation.validateString
            },
            {
              name: 'lastName',
              type: 'input',
              message: 'What is the employees last name?',
              validate: validation.validateString
            },
            {
              name: 'employeeRole',
              type: 'list',
              message: 'What is the employees title?',
              choices: rolesArray
            },
            {
              name: 'managerName',
              type: 'list',
              message: 'Who is this employees manager?',
              choices: managerNamesArr
            }
          ])
          .then((answer) => {
            let roleId, managerId;

            // Looping through role SELECT query response to set employee role_id with correct ID from role
            response.forEach((role) => {
              if (answer.employeeRole === role.title) {
                roleId = role.id;
              }
            });

            // Looping through employee SELECT query to set manager ID for new employee
            res.forEach((employee) => {
              if (
                answer.managerName ===
                `${employee.first_name} ${employee.last_name}`
              ) {
                managerId = employee.id;
              }
            });

            // Inserting new employee into Database
            let query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) `;
            query += `VALUES (?, ?, ?, ?)`;
            let params = [answer.firstName, answer.lastName, roleId, managerId];

            connection.query(query, params, (err, res) => {
              if (err) throw err;

              console.log(``);
              console.log(chalk.greenBright(`Employee successfully created!`));
              console.log(``);
              application.init();
            });
          });
      });
    });
  },
  addRole() {
    connection.query('SELECT * FROM department', (err, res) => {
      if (err) throw err;
      let deptNamesArr = [];

      res.forEach((dept) => {
        deptNamesArr.push(dept.department_name);
      });

      // Push 'create department' option to user choices so they can create the dept they want their new role in
      deptNamesArr.push('Create Department');

      inquirer
        .prompt([
          {
            name: 'deptName',
            type: 'list',
            message: 'Which department is this new role in?',
            choices: deptNamesArr
          }
        ])
        .then((answer) => {
          // If the role that's being created does not have a dept, allow user to add dept before continuing
          if (answer.deptName === 'Create Department') {
            this.addDept();
          } else {
            resumeAddRole(answer);
          }
        });

      // Resumes process of adding new role
      const resumeAddRole = (deptData) => {
        inquirer
          .prompt([
            {
              name: 'newRole',
              type: 'input',
              message: 'What is the name of your new role?',
              validate: validation.validateString
            },
            {
              name: 'salary',
              type: 'input',
              message: 'What is the salary of this new role?',
              validate: validation.validateSalary
            }
          ])
          .then((answer) => {
            let createdRole = answer.newRole;
            let deptId;

            // Looping through response from SELECT * FROM department to set role department_id with correct ID from department
            res.forEach((dept) => {
              if (deptData.deptName === dept.department_name) {
                deptId = dept.id;
              }
            });

            let query = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            let params = [createdRole, answer.salary, deptId];

            connection.query(query, params, (err, res) => {
              if (err) throw err;

              console.log(``);
              console.log(chalk.greenBright(`Role successfully created!`));
              console.log(``);

              application.init();
            });
          });
      };
    });
  },
  addDept() {
    inquirer
      .prompt([
        {
          name: 'newDept',
          type: 'input',
          message: 'What is the name of your new Department?',
          validate: validation.validateString
        }
      ])
      .then((answer) => {
        let query = `INSERT INTO department (department_name) VALUES (?)`;

        connection.query(query, [answer.newDept], (err, res) => {
          if (err) throw err;

          console.log(``);
          console.log(chalk.greenBright(`Department successfully created!`));
          console.log(``);

          inquirer
            .prompt([
              {
                name: 'addRole',
                type: 'list',
                message: 'Would you like to create a new role?',
                choices: ['Yes', 'No']
              }
            ])
            .then((selection) => {
              if (selection.addRole === 'Yes') {
                this.addRole();
              } else application.init();
            });
        });
      });
  }
};

// Export
module.exports = add;
