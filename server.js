const connection = require('./config/connection');
const inquirer = require('inquirer');
const console.table = require('console.table');
const chalk = require('chalk');
const figlet = require('figlet');
const validate = require('./javascript/validate');


connection.connect((error) => {
  if (error) throw error;

  console.log(
    chalk.yellow.bold(
      `====================================================================================`
    )
  );
  console.log(``);
  console.log(
    chalk.greenBright.bold(figlet.textSync('Employee Tracker'))
  );
  console.log(``);
  console.log(`                                                          ` + chalk.greenBright.bold('Created By: Joseph DeWoody'));
  console.log(``);
  console.log(
    chalk.yellow.bold(
      `====================================================================================`
    )
  );
  promptUser();
});

const promptUser = () => {
  inquirer.prompt([
      {
        name: 'choices',
        type: 'list',
        message: 'Please select an option:',
        choices: [
          'View All Employees',
          'View All Roles',
          'View Department Budget',
          'View All Employees By Department',
          'Update Employee Role',
          'Update Employee Manager',
          'Add Employee',
          'Add Role',
          'Add Department',
          'Remove Employee',
          'Remove Role',
          'Remove Department',
          'Exit'
      ]
      }
    ])
    .then((answers) => {
      const {choices} = answers;

        if (choices === 'View All Employees') {
            viewAllEmployees();
        }

        if (choices === 'View All Employees By Department') {
            viewEmployeesByDept();
        }

        if (choices === 'Add Employee') {
            addEmployee();
        }

        if (choices === 'Remove Employee') {
            removeEmployee();
        }

        if (choices === 'Update Employee Role') {
            updateEmployeeRole();
        }

        if (choices === 'Update Employee Manager') {
            updateEmployeeManager();
        }

        if (choices === 'View All Roles') {
            viewAllRoles();
        }

        if (choices === 'Add Role') {
            addRole();
        }

        if (choices === 'Remove Role') {
            removeRole();
        }

        if (choices === 'Add Department') {
            addDept();
        }

        if (choices === 'View Department Budget') {
            viewDeptBudget();
        }

        if (choices === 'Remove Department') {
            removeDept();
        }

        if (choices === 'Exit') {
            connection.end();
        }
  });
};

// ----------------------------------------------------- VIEW -----------------------------------------------------------------------

const viewAllEmployees = () => {
  let sql =     `SELECT employee.id, 
                  employee.first_name, 
                  employee.last_name, 
                  role.title, 
                  department.department_name AS 'department', 
                  role.salary
                  FROM employee, role, department 
                  WHERE department.id = role.department_id 
                  AND role.id = employee.role_id
                  ORDER BY employee.id ASC`;

  connection.promise().query(sql, (error, response) => {
    if (error) throw error;

    console.log(
      chalk.yellow.bold(
        `====================================================================================`
      )
    );
    console.log(`                              ` + chalk.green.bold(`Current Employees:`));
    console.log(
      chalk.yellow.bold(
        `====================================================================================`
      )
    );
    console.table(response);
    console.log(
      chalk.yellow.bold(
        `====================================================================================`
      )
    );
    promptUser();
  });
};

const viewEmployeesByDept = () => {
  const sql = `SELECT employee.first_name, 
              employee.last_name, 
              department.department_name AS department
              FROM employee 
              LEFT JOIN role ON employee.role_id = role.id 
            LEFT JOIN department ON role.department_id = department.id`;

      connection.query(sql, (error, response) => {
          if (error) throw error;

          console.log(
            chalk.yellow.bold(
              `====================================================================================`
            )
          );
          console.log(`                              ` + chalk.green.bold(`Employees by Department:`));
          console.log(
            chalk.yellow.bold(
              `====================================================================================`
            )
          );
          console.table(response);

          console.log(
            chalk.yellow.bold(
              `====================================================================================`
            )
          );

          promptUser();
        });
};

const viewAllRoles = () => {
  console.log(
    chalk.yellow.bold(
      `====================================================================================`
    )
  );
  console.log(`                              ` + chalk.green.bold(`Current Employee Roles:`));
  console.log(
    chalk.yellow.bold(
      `====================================================================================`
    )
  );

  const sql = `SELECT role.id, role.title, department.department_name AS department
                FROM role
                INNER JOIN department ON role.department_id = department.id`;

  connection.promise().query(sql, (error, response) => {
    if (error) throw error;

    response.forEach((role) => {
      console.log(role.title);
    });

    console.log(
      chalk.yellow.bold(
        `====================================================================================`
      )
    );

    promptUser();
  });
};

const viewDeptBudget = () => {
  const sql =   `SELECT department_id AS id, 
                department.department_name AS department,
                SUM(salary) AS budget
                FROM  role  
                JOIN department ON role.department_id = department.id GROUP BY  department_id`;

  connection.promise().query(sql, (error, response) => {

    if (error) throw error;

          console.log(
            chalk.yellow.bold(
              `====================================================================================`
            )
          );
          console.log(`                              ` + chalk.green.bold(`Budget By Department:`));
          console.log(
            chalk.yellow.bold(
              `====================================================================================`
            )
          );
          console.table(response);
          console.log(
            chalk.yellow.bold(
              `====================================================================================`
            )
          );

          promptUser();
        });
};

// --------------------------------------------------- ADD --------------------------------------------------------------------

const addEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'fistName',
      message: "What is the employee's first name?",
      validate: addFirstName => {
        if (addFirstName) {
            return true;
        } else {
            console.log('Please enter a first name');
            return false;
        }
      }
    },
    {
      type: 'input',
      name: 'lastName',
      message: "What is the employee's last name?",
      validate: addLastName => {
        if (addLastName) {
            return true;
        } else {
            console.log('Please enter a last name');
            return false;
        }
      }
    }
  ])
    .then(answer => {
    const params = [answer.fistName, answer.lastName]

    const roleSql = `SELECT role.id, role.title FROM role`;
  
    connection.promise().query(roleSql, (error, data) => {
      if (error) throw error; 
      
      const roles = data.map(({ id, title }) => ({ name: title, value: id }));

      inquirer.prompt([
            {
              type: 'list',
              name: 'role',
              message: "What is the employee's role?",
              choices: roles
            }
          ])
            .then(roleChoice => {
              const role = roleChoice.role;
              params.push(role);

              const managerSql = `SELECT * FROM employee`;

              connection.promise().query(managerSql, (error, data) => {
                if (error) throw error;

                const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: managers
                  }
                ])
                  .then(mgrChoice => {
                    const manager = mgrChoice.manager;
                    params.push(manager);
                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?, ?, ?, ?)`;

                    connection.query(sql, params, (error) => {
                    if (error) throw error;
                    console.log("Employee has been added!")

                    viewAllEmployees();
              });
            });
          });
        });
     });
  });
};

const addRole = () => {
  connection.promise().query('SELECT * FROM department', (error, response) => {
      if (error) throw error;
      let deptNamesArr = [];

      response.forEach((dept) => {
        deptNamesArr.push(dept.department_name);
      });

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
          if (answer.deptName === 'Create Department') {
            this.addDept();
          } else {
            addRoleResume(answer);
          }
        });

      // Resumes process of adding new role
      const addRoleResume = (deptData) => {
        inquirer
          .prompt([
            {
              name: 'newRole',
              type: 'input',
              message: 'What is the name of your new role?',
              validate: validate.validateString
            },
            {
              name: 'salary',
              type: 'input',
              message: 'What is the salary of this new role?',
              validate: validate.validateSalary
            }
          ])
          .then((answer) => {
            let createdRole = answer.newRole;
            let deptId;

            response.forEach((dept) => {
              if (deptData.deptName === dept.department_name) {
                deptId = dept.id;
              }
            });

            let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            let params = [createdRole, answer.salary, deptId];

            connection.promise().query(sql, params, (error) => {
              if (error) throw error;

              console.log(``);
              console.log(chalk.greenBright(`Role successfully created!`));
              console.log(``);

              promptUser();
            });
          });
      };
    });
  };

const addDept = () => {
    inquirer
      .prompt([
        {
          name: 'newDepartment',
          type: 'input',
          message: 'What is the name of your new Department?',
          validate: validate.validateString
        }
      ])
      .then((answer) => {
        let sql = `INSERT INTO department (department_name) VALUES (?)`;

        connection.query(sql, answer.newDepartment, (error, response) => {
          if (error) throw error;

          console.log(``);
          console.log(chalk.greenBright(answer.newDepartment + ` Department successfully created!`));
          console.log(``);
          promptUser();
        });
      });
};

// ------------------------------------------------- UPDATE -------------------------------------------------------------------------

const updateEmployeeRole = () => {
    let sql =     `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id"
                    FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;

    connection.promise().query(sql, (error, response) => {
      if (error) throw error;
      let employeeNamesArr = [];

      response.forEach((employee) => {
        employeeNamesArr.push(`${employee.first_name} ${employee.last_name}`);
      });

      let sql = `SELECT role.id, role.title FROM role`;
      connection.promise().query(sql, (error, response) => {
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

            response.forEach((role) => {
              if (answer.chosenRole === role.title) {
                newTitleId = role.id;
              }
            });

            response.forEach((employee) => {
              if (
                answer.chosenEmployee ===
                `${employee.first_name} ${employee.last_name}`
              ) {
                employeeId = employee.id;
              }
            });

            let sql = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;

            connection.query(
              sql,
              [newTitleId, employeeId],
              (error) => {
                if (error) throw error;

                console.log(``);
                console.log(chalk.greenBright(`Employee Role Updated`));
                console.log(``);

                promptUser();
              }
            );
          });
      });
    });
  };

const updateEmployeeManager = () => {
    let sql =     `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id
                    FROM employee`;

     connection.promise().query(sql, (error, response) => {
      let employeeNamesArr = [];

      response.forEach((employee) => {
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

          response.forEach((employee) => {
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

          if (validate.isSame(answer.chosenEmployee, answer.newManager)) {
            console.log(``);
            console.log(chalk.redBright(`Invalid Manager Selection`));
            console.log(``);

            promptUser();
          } else {
            let sql = `UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`;

            connection.query(
              sql,
              [managerId, employeeId],
              (error) => {
                if (error) throw error;

                console.log(``);
                console.log(chalk.greenBright(`Employee Manager Updated`));
                console.log(``);

                promptUser();
              }
            );
          }
        });
    });
};

// -------------------------------------- REMOVE --------------------------------------------------------

const removeEmployee = () => {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;

    connection.promise().query(sql, (error, response) => {
      if (error) throw error;
      let employeeNamesArr = [];

      response.forEach((employee) => {
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

          response.forEach((employee) => {
            if (
              answer.chosenEmployee ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
            }
          });

          let sql = `DELETE FROM employee WHERE employee.id = ?`;
          connection.query(sql, [employeeId], (error) => {
            if (error) throw error;

            console.log(``);
            console.log(chalk.redBright(`Employee Successfully Removed`));
            console.log(``);

            promptUser();
          });
        });
    });
  };

const removeRole = () => {
    let sql = `SELECT role.id, role.title FROM role`;

    connection.promise().query(sql, (error, response) => {
      if (error) throw error;
      let roleNamesArray = [];

      response.forEach((role) => {
        roleNamesArray.push(role.title);
      });

      inquirer
        .prompt([
          {
            name: 'chosenRole',
            type: 'list',
            message: 'Which role would you like to remove?',
            choices: roleNamesArray
          }
        ])
        .then((answer) => {
          let roleId;

          response.forEach((role) => {
            if (answer.chosenRole === role.title) {
              roleId = role.id;
            }
          });

          let sql = `DELETE FROM role WHERE role.id = ?`;
          connection.promise().query(sql, [roleId], (error) => {
            if (error) throw error;

            console.log(``);
            console.log(chalk.greenBright(`Role Successfully Removed`));
            console.log(``);

            promptUser();
          });
        });
    });
  };

const removeDept = () => {
    let sql = `SELECT department.id, department.department_name FROM department`;

    connection.promise().query(sql, (error, response) => {
      if (error) throw error;
      let deptNamesArr = [];

      response.forEach((dept) => {
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

          response.forEach((dept) => {
            if (answer.chosenDept === dept.department_name) {
              deptId = dept.id;
            }
          });

          let sql = `DELETE FROM department WHERE department.id = ?`;
          connection.promise().query(sql, [deptId], (error) => {
            if (error) throw error;

            console.log(``);
            console.log(chalk.greenBright(`Department Successfully Removed`));
            console.log(``);

            promptUser();
          });
        });
    });
};