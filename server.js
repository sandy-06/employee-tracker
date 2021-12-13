const inquirer = require('inquirer');
const connect = require('./db/connect');
const consoleTable = require('console.table');
const DB = require('./db/index')
const db = require('./db/index');
const { addEmployee } = require('./db/index');



connect.connect((err) => {
    if (err) throw err;
    start();
});

//then i am presented with the options to view or do
function start() {
inquirer.prompt(
    [
        {
            type: 'list',
            name: 'options',
            message: 'What do you want to view?',
            choices: [
                {
                    name: 'view all departments',
                    value: 'view_all_departments'
                },
                {
                    name: 'view all roles',
                    value: 'view_all_roles'
                },
                {
                    name: 'view all employees',
                    value: 'view_all_employees'
                },
                {
                    name: 'add a department',
                    value: 'add_a_department'
                },
                {
                    name: 'add a role',
                    value: 'add_a_role'
                },
                {
                    name: 'add an employee',
                    value: 'add_an_employee'
                },
                {
                    name: 'update an employee',
                    value: 'update_an_employee'
                },
                {
                    name: 'quit',
                    value: 'quit'
                }
            ]
        }
    ]
)
    .then(res => {
        switch (res.options) {
            case 'view_all_departments':
                viewAllDepartments();
                break;
            case 'view_all_roles':
                viewAllRoles();
                break;
            case 'view_all_employees':
                viewAllEmployee()
                break;
            case 'add_a_department':
                addDepartment();
                break;
            case 'add_a_role':
                addRole();
                break;
            case 'add_an_employee':
                addEmployee();
                break;
            case 'update_an_employee':
                updateEmployee()
                break;
            default:
                quit();
        };
    });
}
    // select view all departments

const viewAllDepartments = () => {
    const sql = `SELECT * FROM  department`;

    connect.query(sql, (err, res) => {
        if (res) {
            const table = consoleTable.getTable(res);
            console.log(table);
            start();
        } else {
            console.log('Wrong choice', err);
        }
    })
};

/*WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role*/
const viewAllRoles = () => {
    const sql = `SELECT * FROM roles`;
    

    connect.query (sql, (err, res) => {
        if (res)  {
            const table = consoleTable.getTable(res);
            console.log(table);
            start();
        }else{
            console.log('Something went wrong', err);
        }
    });
};
/*WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids,
 first names, last names, job titles, departments, salaries, and managers that the employees report to*/

const viewAllEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, roles.title,
    department.department-name AS department, roles.salary, 
    CONCAT(manager.first_name'', manager.last_name) AS MANAGER FROM employee
    LEFT JOIN roles
    ON employee.role_id = roles.id
    LEFT JOIN department
    ON roles.department_id = department_id
    LEFT JOIN employee manager
    ON manager.id = employee.manager_id:`;

    connect.query (sql, (err, res) => {
        if (res)  {
            const table = consoleTable.getTable(res);
            console.log(table);
            start();
        }else{
            console.log('Something went wrong', err);
        }
    });
};

/*WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database*/
const addDepartment = () => {
    inquirer.prompt({
        type: 'input',
        name: 'addDepartment',
        message: 'Please enter department name!',

    })
    .then(res => {
        let department = res.addDepartment;
        DB.createDepartment(department).then(() =>
        console.log(`add ${department}`)
        );
    })
    .then(() => start());
};

/*WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department 
for the role and that role is added to the database*/

const addRole = () => {
    DB.findAllDepartments().then(([department]) => {
        const departmentOptions = department.map(({ id, department_name}) => ({
        name: department_name,
        value: id,
        
    }));
    inquirer.prompt([
      {
        type: 'input',
        name: 'addRole',
        message: 'Please enter new role name!',
      },
      {
          type: "input",
          name: 'addsSalary',
          message: 'please enter salary',
      },
      {
          type: 'list',
          name: 'Department',
          message: 'Please enter the department for the role.',
          choices: departmentOptions,
      },
    ]).then(answers => {
        DB.createRole(answers.addRole, answers.department, answers.addSalary)
        .then(() =>
        console.log(`added ${answers.addRole}, added ${answers,department}, added ${answers.addSalary}`
        )
        )
        .then(() => start());
    }
    )})

};

/*WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, 
and that employee is added to the database*/

const addEmployee = () => {
    DB.findAllRoles().then(([employee]) => {
        const employeeRoleOptions = employee.map(({ id, title } => ({
            name: title,
            value: id,
        }));
        DB.findAllEmployees().then(([manager]) =>{
            const managerOptions = manager.map(
               ({ id, first_name, last_name}) => ({
                   name: `${first_name} ${last_name}`,
                   value: id,

               })
            );
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'Please enter employee first name.,'
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'Please enter last name.',

                },
                {
                    type: 'list',
                    name: 'roles',
                    message: ' What is the employees role?',
                    choices: employeeRoleOptions,
                },
                {
                  type: 'list',
                  name: 'manager',
                  message: 'Choose manager',
                  choices: managerOptions,  
                },
            ]).then((answers) => {
                DB.addEmployee(
                    answers.firstName,
                    answers.lastName,
                    answers.roles,
                    answers.manager,
                )
                .then(() =>
                console.log(
                    `added ${answers.roles}, added ${answers.firstName}, add ${answers.lastName}, added ${answers.manager}`
                ))
                .then(() => start());
            });
        });

    });
}





function quit() {
    console.log("Goodbye!");
    process.exit();
  };