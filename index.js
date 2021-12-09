const inquirer = require('inquirer');

inquirer.prompt(
    [
        {
           type: 'list',
           name: 'options',
           message: 'What do you want to view?',
           choices: [
               {
                   name: 'View all departments',
                   value: 'View all departments'
               },
               {
                   name: 'view all roles',
                   value: 'view all roles'
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
        case 'View all departments':
            console.log('call function');
            break
        case 'view all roles':
            console.log('number2');
            break
        default : 
            console.log('call quit')
    };
});