const db = require('./db/db');
const inquirer = require('inquirer');
const tcons = require('console.table');



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
                message: `Are you sure you would like to delete this department?`,
                default: false
            }
        ]).then(async conf => {
            if (conf.confirm) {
                try {
                    await db.deleteRecord('department', depts.find(el => el.name == del).id);
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

async function deleteRole(roles) {
    var del = null
    await inquirer.prompt([
        {
            name: 'id',
            type: 'list',
            choices: roles.map(e => e.id),
            message: 'Choose the ID the role you would like to delete.',
        }
    ]).then(async res => {
        del = parseInt(res.id);
        await inquirer.prompt([
            {
                name: 'confirm',
                type: 'confirm',
                message: `Are you sure you want to delete this role?`,
                default: false
            }
        ]).then(async conf => {
            if (conf.confirm) {
                try {
                    await db.deleteRecord('role', del);
                    console.log('Successfully deleted');
                } catch (err) {
                    console.log(err);
                }
            }
        });
    });
    rolesMenu();
}

async function employeesMenu() {
    var employees = await db.view('employee');
    console.table('Employees', employees);

    await inquirer.prompt([
        {
            name: 'action',
            type: 'list',
            choices: ['Add employee', 'Delete employee', 'Update employee', 'View by...', 'Back'],
            message: 'What would you like to do?'
        }
    ]).then(async e => {
        switch (e.action) {
            case 'Add employee':
                addEmployee();
                break;
            case 'Delete employee':
                deleteEmployee(employees);
                break;

            case 'Update employee':
                updateEmployee(employees);
                break;

            case 'View by...':
                viewBy();
                break;

            case 'Back':
                mainMenu();
                break;
        }
    });
}

async function addEmployee() {
    var newEmp = null;
    var roles = await db.view('role');
    await inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'First name:',
            validate: async (e) => {
                return e.trim() == "" ? 'Please enter a valid name.' : true;
            }
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'Last name:',
            validate: async (e) => {
                return e.trim() == "" ? 'Please enter a valid name.' : true;
            }
        }
    ]).then(async res => {
        newEmp = { first: res.firstName, last: res.lastName };
        console.table(roles);
        await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: roles.map(e => e.id),
                message: 'Choose the ID of new employee role.'
            }
        ]).then(async role => {
            newEmp.role = role.role;
            var roleObj = roles.find(e => e.id == newEmp.role);
            const deptEmp = await db.viewBy('department_name', roleObj.department);
            var manList = deptEmp.map(e => e.id);
            manList.push('None');
            console.table(deptEmp);
            await inquirer.prompt([
                {
                    name: 'manager',
                    type: 'list',
                    choices: manList,
                    message: 'Choose the ID of manager.'
                }
            ]).then(async manager => {
                manager.manager == 'None' ? newEmp.manager = null : newEmp.manager = manager.manager;
                try {
                    await db.add('employee', [newEmp.first, newEmp.last, newEmp.role, newEmp.manager]);
                    console.log('Employee successfully added.');
                } catch (err) {
                    err.message.includes('ER_DUP_ENTRY') ? console.log('Department already exists.') : console.log(err);
                }
            })

        });
    });
    employeesMenu();
}

async function deleteEmployee(employees) {
    var del = null

    await inquirer.prompt([
        {
            name: 'id',
            type: 'list',
            choices: employees.map(e => e.id),
            message: 'Choose the ID the employee you would like to delete.',
        }
    ]).then(async res => {
        del = parseInt(res.id);
        await inquirer.prompt([
            {
                name: 'confirm',
                type: 'confirm',
                message: `Are you sure you want to delete this employee record?`,
                default: false
            }
        ]).then(async conf => {
            if (conf.confirm) {
                try {
                    await db.deleteRecord('employee', del);
                    console.log('Successfully deleted');
                } catch (err) {
                    console.log(err);
                }
            }
        });
    });
    employeesMenu();
}

async function updateEmployee(employees) {
    var emp = null;
    await inquirer.prompt([
        {
            name: 'id',
            type: 'list',
            choices: employees.map(e => e.id),
            message: 'Choose the ID the employee you would like to update.',
        }
    ]).then(async res => {
        emp = employees.find(e => e.id == parseInt(res.id));
        console.table(emp);
        await inquirer.prompt([
            {
                name: 'field',
                type: 'list',
                choices: ['Last name', 'Role', 'Manager', 'Back'],
                message: `Which field would you like to update?`,
            }
        ]).then(async field => {
            switch (field.field) {

                case 'Last name':
                    await inquirer.prompt([
                        {
                            name: 'lastName',
                            type: 'input',
                            message: 'Last name:',
                            validate: async (e) => {
                                return e.trim() == "" ? 'Please enter a valid name.' : true;
                            }
                        }
                    ]).then(async val => {
                        emp.last_name = val.lastName;
                        try {
                            await db.updateEmployee(emp, 'last_name');
                            console.log('Employee successfully updated.')
                        } catch (err) {
                            console.log(err);
                        }
                    });
                    break;

                case 'Role':
                    var roles = await db.view('role');
                    console.table(roles);
                    await inquirer.prompt([
                        {
                            name: 'role',
                            type: 'list',
                            choices: roles.map(e => e.id),
                            message: 'Choose the ID of the new role.'
                        }
                    ]).then(async id => {
                        emp.role_id = id.role;
                        try {
                            await db.updateEmployee(emp, 'role_id');
                            console.log('Employee successfully updated.')
                        } catch (err) {
                            console.log(err);
                        }
                    });
                    break;

                case 'Manager':
                    const deptEmp = await db.viewBy('department_name', emp.department);
                    var manList = deptEmp.map(e => e.id);
                    manList.push('None');
                    console.table(deptEmp);
                    await inquirer.prompt([
                        {
                            name: 'manager',
                            type: 'list',
                            choices: manList,
                            message: 'Choose the ID of manager.'
                        }
                    ]).then(async manager => {
                        manager.manager == 'None' ? emp.manager_id = null : emp.manager_id = manager.manager;
                        try {
                            await db.updateEmployee(emp, 'manager_id');
                            console.log('Employee successfully added.');
                        } catch (err) {
                            err.message.includes('ER_DUP_ENTRY') ? console.log('Department already exists.') : console.log(err);
                        }
                    });
                    break;

                case 'Back':
                    updateEmployee();
                    break;
            }
        });
    });
    employeesMenu();
}


async function viewBy() {
    var depts = await db.view('department');
    var field = null;
    var depId = null;
    await inquirer.prompt([
        {
            name: 'filter',
            type: 'list',
            choices: ['Manager', 'Role', 'Department', 'Back'],
            message: 'Choose view.'
        }
    ]).then(async filter => {
        if (filter.filter != 'Back') {
            field = filter.filter;
            console.table(depts);
            await inquirer.prompt([
                {
                    name: 'department',
                    type: 'list',
                    choices: depts.map(e => e.id),
                    message: 'Choose the ID of the department.'
                }
            ]).then(async department => {
                depId = parseInt(department.department);
                switch (field) {
                    case 'Manager':
                        var manList = await db.viewManagersByDept(depId);
                        console.table(manList);
                        await inquirer.prompt([
                            {
                                name: 'manager',
                                type: 'list',
                                choices: manList.map(e => e.id),
                                message: 'Choose the ID of the manager.'
                            }
                        ]).then(async manager => {
                            var list = await db.viewBy('manager', manager.manager);
                            console.table(list);
                        });
                        viewBy();
                        break;

                    case 'Role':
                        var roleList = await db.viewRolesByDept(depId);
                        console.table(roleList);
                        await inquirer.prompt([
                            {
                                name: 'role',
                                type: 'list',
                                choices: roleList.map(e => e.id),
                                message: 'Choose the ID of the role.'
                            }
                        ]).then(async role => {
                            var list = await db.viewBy('role', role.role);
                            console.table(list);
                        });
                        viewBy();
                        break;

                    case 'Department':
                        var list = await db.viewBy('department', depId);
                        console.table(list);
                        viewBy();
                        break;
                }
            });
        } else {
            employeesMenu();
        }
    });
}

mainMenu();
// (async function(){
//     var list = await db.viewBy('department', 1);
//     console.table(list);
// })()