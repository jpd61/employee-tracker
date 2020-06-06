// Dependencies
const connection = require('./utils/config');
const inquirer = require('inquirer');
const chalk = require('chalk');
const view = require('./utils/view');
const add = require('./utils/add');
const remove = require('./utils/remove');
const update = require('./utils/update');
const figlet = require('figlet');

// Connecting to DB
connection.connect((err) => {
  if (err) throw err;

  // Use Chalk and Figlet to display heading
  console.log(
    chalk.greenBright(
      `====================================================================================`
    )
  );
  console.log(``);
  console.log(
    chalk.blueBright(figlet.textSync('Employee Tracker'))
  );
  console.log(``);
  console.log(`                                                         ` + chalk.whiteBright.bgBlue.bold('Created By: Joseph DeWoody'));
  console.log(
    chalk.green(
      `====================================================================================`
    )
  );
  init();
});

// Set Menu Options
const menuOptions = [
  'View All Employees',
  'View All Employees By Manager',
  'View All Employees By Department',
  'Add Employee',
  'Remove Employee',
  'Update Employee Role',
  'Update Employee Manager',
  'View All Roles',
  'Add Role',
  'Remove Role',
  'Add Department',
  'View Department Budget',
  'Remove Department',
  'Exit'
];

// Start Inquirer
const init = () => {
  console.log(``);
  inquirer
    .prompt([
      {
        name: 'selection',
        type: 'list',
        message: 'What would you like to do?',
        choices: menuOptions
      }
    ])
    .then((answer) => {
      switch (answer.selection) {
        case 'View All Employees':
          view.viewAllEmployees();
          break;
        case 'View All Employees By Manager':
          view.viewEmployeesByManager();
          break;
        case 'View All Employees By Department':
          view.viewEmployeesByDept();
          break;
        case 'Add Employee':
          add.addEmployee();
          break;
        case 'Remove Employee':
          remove.removeEmployee();
          break;
        case 'Update Employee Role':
          update.updateEmployeeRole();
          break;
        case 'Update Employee Manager':
          update.updateEmployeeManager();
          break;
        case 'View All Roles':
          view.viewAllRoles();
          break;
        case 'Add Role':
          add.addRole();
          break;
        case 'Remove Role':
          remove.removeRole();
          break;
        case 'Add Department':
          add.addDept();
          break;
        case 'View Department Budget':
          view.viewDeptBudget();
          break;
        case 'Remove Department':
          remove.removeDept();
          break;
        case 'Exit':
          connection.end();
          break;
      }
    });
};

// Export init function to be used in utils
exports.init = init;
