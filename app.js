const db = require('./db/db');
const Employee = require('./classes/employee');
const Role = require('./classes/role');
const Department = require('./classes/department');
const inquirer = require('inquirer');
const cTable = require('console.table');



function mainMenu() {
    inquirer.prompt([
        {
            name: 'action',
            type: 'list',
            choices: ['Departments', 'Roles', 'Employees', 'Quit'],
            message: 'Choose the field you would like to see.'
        }
    ]).then(e => {
        switch (e.action) {
            case 'Departments':
                departmentsMenu();
                break;

            case 'Roles':
                rolesMenu();
                break;

            case 'Employees':
                employeesMenu();
                break;

            case 'Quit':
                return;
        }
    });
}


async function departmentsMenu(){
    console.log('Department menu')
}

async function rolesMenu(){
    console.log('Roles menu')
}

async function employeesMenu(){
    console.log('Employees menu')
}

mainMenu();