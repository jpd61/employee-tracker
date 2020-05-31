// Dependencies
const inquirer = require('inquirer');
const chalk = require('chalk');
const connection = require('./config');
const application = require('../server');

// Holds all remove functionality
const remove = {
  removeEmployee() {
    let query = `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;

    connection.query(query, (err, res) => {
      if (err) throw err;
      let employeeNamesArr = [];

      res.forEach((employee) => {
        employeeNamesArr.push(`${employee.first_name} ${employee.last_name}`);
      });

      inquirer
        .prompt([
          {
            name: 'chosenEmployee',
            type: 'list',
            message: 'Which employee would you like to remove?',
            choices: employeeNamesArr
          }
        ])
        .then((answer) => {
          let employeeId;

          // Looping through SELECT query to match chosen employee with employee name in db -- once match is found save employee ID to memory for use in DELETE query
          res.forEach((employee) => {
            if (
              answer.chosenEmployee ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
            }
          });

          let query = `DELETE FROM employee WHERE employee.id = ?`;
          connection.query(query, [employeeId], (err, response) => {
            if (err) throw err;

            console.log(``);
            console.log(chalk.greenBright(`Employee Successfully Removed`));
            console.log(``);

            application.init();
          });
        });
    });
  },
  removeRole() {
    let query = `SELECT role.id, role.title FROM role`;

    connection.query(query, (err, res) => {
      if (err) throw err;
      let roleNamesArr = [];

      res.forEach((role) => {
        roleNamesArr.push(role.title);
      });

      inquirer
        .prompt([
          {
            name: 'chosenRole',
            type: 'list',
            message: 'Which role would you like to remove?',
            choices: roleNamesArr
          }
        ])
        .then((answer) => {
          let roleId;

          // Looping through SELECT query to match chosen role with role title in db -- once match is found save role ID to memory for use in DELETE query
          res.forEach((role) => {
            if (answer.chosenRole === role.title) {
              roleId = role.id;
            }
          });

          let query = `DELETE FROM role WHERE role.id = ?`;
          connection.query(query, [roleId], (error, response) => {
            if (error) throw err;

            console.log(``);
            console.log(chalk.greenBright(`Role Successfully Removed`));
            console.log(``);

            application.init();
          });
        });
    });
  },
  removeDept() {
    let query = `SELECT department.id, department.department_name FROM department`;

    connection.query(query, (err, res) => {
      if (err) throw err;
      let deptNamesArr = [];

      res.forEach((dept) => {
        deptNamesArr.push(dept.department_name);
      });

      inquirer
        .prompt([
          {
            name: 'chosenDept',
            type: 'list',
            message: 'Which department would you like to remove?',
            choices: deptNamesArr
          }
        ])
        .then((answer) => {
          let deptId;

          // Looping through SELECT query to match chosen dept with dept name in db -- once match is found save dept ID to memory for use in DELETE query
          res.forEach((dept) => {
            if (answer.chosenDept === dept.department_name) {
              deptId = dept.id;
            }
          });

          let query = `DELETE FROM department WHERE department.id = ?`;
          connection.query(query, [deptId], (error, response) => {
            if (error) throw error;

            console.log(``);
            console.log(chalk.greenBright(`Department Successfully Removed`));
            console.log(``);

            application.init();
          });
        });
    });
  }
};

// Export
module.exports = remove;
