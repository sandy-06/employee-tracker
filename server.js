const inquirer = require('inquirer');
const connection = require('./config/connection');

inquirer.prompt(
    [
        {
           type: 'list',
           name: 'options',
           message: 'What do you want to view?',
           choices: [
               {
                   name: 'View all departments',
                   value: 'View_all_departments'
               },
               {
                   name: 'view all roles',
                   value: 'view_all_roles'
               },
               {
                   name: 'view all employees',
                   value: 'view_all employees'
               },
               {
                   name: 'add a department',
                   value: 'add a department'
               },
               {
                   name: 'add a role',
                   value: 'add a role'
               },
               {
                   name: 'add an employee',
                   value: 'add an employee'
               },
               {
                   name: 'update an employee',
                   value: 'update an employee'
               },
               {
                   name: 'quit',
                   value: 'quit'
               }
           ] 
        }
    ]
)
.then( res => {
    switch (res.options) {
        case 'view all departments':
            viewAllDepartments()
            break
        case 'view all roles':
            viewAllRoles()
            break
        case 'view all employees':
            viewAllEmployee()
            break
        case 'add a department':
            addDepartment()
            break
        case 'add a role':
           addRole()
            break
        case 'add an employee':
            addEmployee()
            break
        case 'update an employee':
            updateEmployee()
            break
        case 'quit':
            quit()



        default : 
            console.log('call quit')
    };
});

const viewAllDepartments = () => {
    const sql = `SELECT * FROM  department`;

    connect.query(sql, (err,res) => {
        if (res) {
            const table =consoleTable.getTable(res);
            console.log(table);
        }else{
            console.log('Wrong choice');
        }
    })
};

