// Require Dependencies
const inquirer = require('inquirer');
const cTable = require('console.table');
const application = require('../server');
const connection = require('./config');

// View
const view = {
  viewAllEmployees() {
    let query =     `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name AS 'department', role.salary 
                    FROM employee, role, department 
                    WHERE department.id = role.department_id 
                    AND role.id = employee.role_id
                    ORDER BY employee.id ASC`;

    connection.query(query, (err, res) => {
      if (err) throw err;

      console.log(``);
      console.log(`                    Current Employees:`);
      console.log(`--------------------------------------------------------`);
      console.table(res);

      application.init();
    });
  },
  viewEmployeesByManager() {
    let query =     `SELECT employee.id, employee.first_name, employee.last_name, role.title, employee.manager_id 
                    FROM employee, role, department 
                    WHERE department.id = role.department_id 
                    AND role.id = employee.role_id
                    ORDER BY employee.id ASC`;

    connection.query(query, (err, res) => {
      if (err) throw err;
      let employeeNamesArr = [];

      res.forEach((employee) => {
        employeeNamesArr.push(`${employee.first_name} ${employee.last_name}`);
      });

      inquirer
        .prompt([
          {
            name: 'chosenManager',
            type: 'list',
            message: 'Please select an employee to view their team:',
            choices: employeeNamesArr
          }
        ])
        .then((answer) => {
          let managerId;

          res.forEach((employee) => {
            if (
              answer.chosenManager ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              managerId = employee.id;
            }
          });

          let query =   `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary
                        FROM employee, role
                        WHERE role.id = employee.role_id
                        AND employee.manager_id = ?`;

          connection.query(query, [managerId], (error, response) => {
            if (error) throw error;

            console.log(``);
            console.log(`          ${answer.chosenManager}'s Team:`);
            console.log(`-------------------------------------------`);
            console.table(response);

            application.init();
          });
        });
    });
  },
  viewEmployeesByDept() {
    connection.query(`SELECT * FROM department`, (err, res) => {
      let deptNamesArr = [];
      if (err) throw err;

      res.forEach((dept) => {
        deptNamesArr.push(dept.department_name);
      });

      inquirer
        .prompt([
          {
            name: 'deptName',
            type: 'list',
            message: 'What department would you like to see?',
            choices: deptNamesArr
          }
        ])
        .then((answer) => {
          let deptId;

          res.forEach((dept) => {
            if (answer.deptName === dept.department_name) {
              deptId = dept.id;
            }
          });

          let query =   `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary
                        FROM employee, role, department
                        WHERE ? = role.department_id
                        AND role.id = employee.role_id
                        GROUP BY employee.id`;

          connection.query(query, [deptId], (err, response) => {
            if (err) throw err;

            console.log(``);
            console.log(`          ${answer.deptName} Department:`);
            console.log(`-------------------------------------------`);
            console.table(response);

            application.init();
          });
        });
    });
  },
  viewAllRoles() {
    console.log(``);
    console.log(`Current Employee Roles:`);
    console.log(`-----------------------`);

    connection.query('SELECT role.title FROM role', (err, res) => {
      if (err) throw err;

      res.forEach((role) => {
        console.log(role.title);
      });

      application.init();
    });
  },
  viewDeptBudget() {
    connection.query(`SELECT * FROM department`, (err, res) => {
      let deptNamesArr = [];
      if (err) throw err;

      res.forEach((dept) => {
        deptNamesArr.push(dept.department_name);
      });

      inquirer
        .prompt([
          {
            name: 'deptName',
            type: 'list',
            message: 'Which department budget would you like to view?',
            choices: deptNamesArr
          }
        ])
        .then((answer) => {
          let deptId;

          res.forEach((dept) => {
            if (answer.deptName === dept.department_name) {
              deptId = dept.id;
            }
          });

          let query =   `SELECT employee.id, role.salary FROM employee, role, department
                        WHERE ? = role.department_id AND role.id = employee.role_id
                        GROUP BY employee.id`;

          connection.query(query, [deptId], (err, response) => {
            if (err) throw err;
            let annualBudget = 0;
            let monthlyBudget = 0;

            response.forEach((employee) => {
              annualBudget += employee.salary;
            });

            monthlyBudget = annualBudget / 12;

            console.log('');
            console.log(`     ${answer.deptName} Budget:`);
            console.log(`-------------------------------`);
            console.table([
              {
                'Monthly Expense': monthlyBudget.toFixed(2),
                'Annual Expense': annualBudget.toFixed(2)
              }
            ]);

            application.init();
          });
        });
    });
  }
};

module.exports = view;
