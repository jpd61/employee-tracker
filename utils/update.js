// Require Dependencies
const inquirer = require('inquirer');
const chalk = require('chalk');
const connection = require('./config');
const application = require('../server');
const validate = require('./validate');

// Holds all update functionality
const update = {
  updateEmployeeRole() {
    let query =     `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id"
                    FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;

    connection.query(query, (err, res) => {
      if (err) throw err;
      let employeeNamesArr = [];

      // Looping through response to add employee full names to array
      res.forEach((employee) => {
        employeeNamesArr.push(`${employee.first_name} ${employee.last_name}`);
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
              name: 'chosenEmployee',
              type: 'list',
              message: 'Which employee has a new role?',
              choices: employeeNamesArr
            },
            {
              name: 'chosenRole',
              type: 'list',
              message: 'What is their new role?',
              choices: rolesArray
            }
          ])
          .then((answer) => {
            let newTitleId, employeeId;

            // Looping through role SELECT query to set new role ID
            response.forEach((role) => {
              if (answer.chosenRole === role.title) {
                newTitleId = role.id;
              }
            });

            // Looping through employee SELECT query to set employee ID
            res.forEach((employee) => {
              if (
                answer.chosenEmployee ===
                `${employee.first_name} ${employee.last_name}`
              ) {
                employeeId = employee.id;
              }
            });

            let query = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;

            connection.query(
              query,
              [newTitleId, employeeId],
              (err, response) => {
                if (err) throw err;

                console.log(``);
                console.log(chalk.greenBright(`Employee Role Updated`));
                console.log(``);

                application.init();
              }
            );
          });
      });
    });
  },
  updateEmployeeManager() {
    let query =     `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id
                    FROM employee`;

    connection.query(query, (err, res) => {
      let employeeNamesArr = [];

      res.forEach((employee) => {
        employeeNamesArr.push(`${employee.first_name} ${employee.last_name}`);
      });

      inquirer
        .prompt([
          {
            name: 'chosenEmployee',
            type: 'list',
            message: 'Which employee has a new manager?',
            choices: employeeNamesArr
          },
          {
            name: 'newManager',
            type: 'list',
            message: 'Who is their new manager?',
            choices: employeeNamesArr
          }
        ])
        .then((answer) => {
          let employeeId, managerId;

          // Looping through SELECT query to set employee ID and manager Id
          res.forEach((employee) => {
            if (
              answer.chosenEmployee ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
            }

            if (
              answer.newManager ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              managerId = employee.id;
            }
          });

          // Validates that the employee to be updated does not match the new manager
          if (validate.isSame(answer.chosenEmployee, answer.newManager)) {
            console.log(``);
            console.log(chalk.redBright(`Invalid Manager Selection`));
            console.log(``);

            application.init();
          } else {
            let query = `UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`;

            connection.query(
              query,
              [managerId, employeeId],
              (err, response) => {
                if (err) throw error;

                console.log(``);
                console.log(chalk.greenBright(`Employee Manager Updated`));
                console.log(``);

                application.init();
              }
            );
          }
        });
    });
  }
};

// Export
module.exports = update;
