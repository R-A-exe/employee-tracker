const db = require('./db/db');
const inquirer = require('inquirer');



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
                process.exit();
        }
    });
}


async function departmentsMenu() {
    var depts = await db.view('department');
    console.table('Departments', depts);

    await inquirer.prompt([
        {
            name: 'action',
            type: 'list',
            choices: ['Add department', 'Delete department', 'View department budget', 'Back'],
            message: 'What would you like to do?'
        }
    ]).then(async e => {
        switch (e.action) {
            case 'Add department':
                addDepartment();
                break;
            case 'Delete department':
                deleteDepartment(depts);
                break;

            case 'View department budget':
                viewDepartmentBudget(depts);
                break;

            case 'Back':
                mainMenu();
                break;
        }
    });
}

async function addDepartment() {
    await inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'Type the name of the new department',
            validate: async (e) => {
                return e.trim() == "" ? 'Please enter a valid name' : true;
            }
        }
    ]).then(async e => {
        try {
            await db.add('department', e.name);
            console.log(`${e.name} successfully added`);
        } catch (err) {
            err.message.includes('ER_DUP_ENTRY') ? console.log('Department already exists.') : console.log(err);
        }
    });

    departmentsMenu();
}

async function deleteDepartment(depts) {
    var del = null
    await inquirer.prompt([
        {
            name: 'name',
            type: 'list',
            choices: depts.map(e => e.name),
            message: "Choose the department you would like to delete."
        }
    ]).then(async e => {
        del = e.name;
        await inquirer.prompt([
            {
                name: 'confirm',
                type: 'confirm',
                message: `Are you sure you would like to delete ${del}?`,
                default: false
            }
        ]).then(async conf => {
            if (conf.confirm) {
                try {
                    await db.deleteRecord('department', depts.find(el => el.name == del));
                    console.log('Successfully deleted');
                } catch (err) {
                    console.log(err);
                }
            }
        });
    });
    departmentsMenu();
}

async function viewDepartmentBudget(depts) {
    await inquirer.prompt([
        {
            name: 'name',
            type: 'list',
            choices: depts.map(e => e.name),
            message: "Choose the department you would like to review."
        }
    ]).then(async e => {
        try {
            var budget = await db.departmentBudget(depts.find(el => el.name == e.name));
            console.log(`The budget for ${e.name} is $${budget[0].department_budget}`);
        } catch (err) {
            console.log(err);
        }
    });
    departmentsMenu();
}

async function rolesMenu() {
    var roles = await db.view('role');
    console.table('Roles', roles);

    await inquirer.prompt([
        {
            name: 'action',
            type: 'list',
            choices: ['Add role', 'Delete role', 'Back'],
            message: 'What would you like to do?'
        }
    ]).then(async e => {
        switch (e.action) {
            case 'Add role':
                addRole();
                break;
            case 'Delete role':
                deleteRole(roles);
                break;

            case 'Back':
                mainMenu();
                break;
        }
    });
}

async function addRole() {
    var depts = await db.view('department');
    await inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'Type the title of the role you would like to add',
            validate: async (e) => {
                return e.trim() == "" ? 'Please enter a valid name.' : true;
            }
        },
        {
            name: 'salary',
            type: 'input',
            message: 'Enter the salary for the role (e.g.50000).',
            validate: async (e) => {
                return /^\d+$/.test(e) ? true : 'Please enter a valid amount';
            }
        },
        {
            name: 'department',
            type: 'list',
            choices: depts.map(e => e.name),
            message: 'Which department does this role belong to?'
        },
    ]).then(async res => {
        try {
            var newRole = [res.title, parseInt(res.salary), depts.find(el => el.name == res.department).id]
            db.add('role', newRole);
            console.log(`Successfully added ${res.title} role.`)
        } catch (err) {
            console.log(err);
        }
    });
    rolesMenu();
}

async function deleteRole(roles){
    var del = null
    var rolesMap = new Map();
    roles.forEach(element=>{
        rolesMap.set(element.title, )
    })
    await inquirer.prompt([
        {
            name: 'id',
            type: 'input',
            message: 'Type the ID the role you would like to delete.',
            validate: async(e)=>{
                return /^\d+$/.test(e) ? true : 'Please enter a valid ID';
            }
        }
    ]).then(async res=>{
        var del = roles.find(e=>e.id==parseInt(res.id));
        console.table(del);
        await inquirer.prompt([
            {
                name: 'confirm',
                type: 'confirm',
                message: `Are you sure you want to delete this role?`,
                default: false
            }
        ]).then(async conf=>{
            if(conf.confirm){
                try{
                    await db.deleteRecord('role', del);
                    console.log('Successfully deleted');
                }catch(err){
                    console.log(err);
                }
            }
        });
    });
    rolesMenu();
}

async function employeesMenu() {
    console.log('Employees menu')
}

mainMenu();