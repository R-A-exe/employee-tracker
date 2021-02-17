const db = require('./db/db');
const inquirer = require('inquirer');
const tcons = require('console.table');


//Choose section or quit
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

//View departments table and choose department related actions
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

//Add department
async function addDepartment() {
    //Get department name from user
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
        //Send department name and table to db function to add
        try {
            await db.add('department', e.name);
            console.log(`${e.name} successfully added`);
        } catch (err) {
            err.message.includes('ER_DUP_ENTRY') ? console.log('Department already exists.') : console.log(err);
        }
    });
    //When done, reload departments menu
    departmentsMenu();
}

//Delete department
async function deleteDepartment(depts) {
    var del = null
    //Get department name (unique value)
    await inquirer.prompt([
        {
            name: 'name',
            type: 'list',
            choices: depts.map(e => e.name),
            message: "Choose the department you would like to delete."
        }
    ]).then(async e => {
        //Confirm
        del = e.name;
        await inquirer.prompt([
            {
                name: 'confirm',
                type: 'confirm',
                message: `Are you sure you would like to delete this department?`,
                default: false
            }
        ]).then(async conf => {
            //Send table and row to db function to delete
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
    //When done, reload departments menu
    departmentsMenu();
}

//View department budget
async function viewDepartmentBudget(depts) {
    //Choose department
    await inquirer.prompt([
        {
            name: 'name',
            type: 'list',
            choices: depts.map(e => e.name),
            message: "Choose the department you would like to review."
        }
    ]).then(async e => {
        //Send department id to db function and display response
        try {
            var budget = await db.departmentBudget(depts.find(el => el.name == e.name).id);
            console.log(`The budget for ${e.name} is $${budget[0].department_budget}`);
        } catch (err) {
            console.log(err);
        }
    });
    departmentsMenu();
}

//View roles table and choose role related action
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

//Add role
async function addRole() {
    var depts = await db.view('department');
    //Get role title
    await inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'Type the title of the role you would like to add',
            validate: async (e) => {
                return e.trim() == "" ? 'Please enter a valid name.' : true;
            }
        },
        //Get role salary
        {
            name: 'salary',
            type: 'input',
            message: 'Enter the salary for the role (e.g.50000).',
            validate: async (e) => {
                return /^\d+$/.test(e) ? true : 'Please enter a valid amount';
            }
        },

        //Get role department
        {
            name: 'department',
            type: 'list',
            choices: depts.map(e => e.name),
            message: 'Which department does this role belong to?'
        },
    ]).then(async res => {
        //Send table name and field value to 'add' function in db
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

//Delete role
async function deleteRole(roles) {
    var del = null
    //Get role id 
    await inquirer.prompt([
        {
            name: 'id',
            type: 'list',
            choices: roles.map(e => e.id),
            message: 'Choose the ID the role you would like to delete.',
        }
    ]).then(async res => {
        //Confirm deletion
        del = parseInt(res.id);
        await inquirer.prompt([
            {
                name: 'confirm',
                type: 'confirm',
                message: `Are you sure you want to delete this role?`,
                default: false
            }
        ]).then(async conf => {
            //Send table name and row id to 'delete' function in db
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

//View employees table and choose employee related action
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

//Add employee
async function addEmployee() {
    var newEmp = null;
    var roles = await db.view('role');
    //Get first and last name
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
        //Choose role
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
            //Chose manager from list of department employees
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
                //Send table name and field values to 'add' function in db
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

//Delete employee
async function deleteEmployee(employees) {
    var del = null
    //Get employee id
    await inquirer.prompt([
        {
            name: 'id',
            type: 'list',
            choices: employees.map(e => e.id),
            message: 'Choose the ID the employee you would like to delete.',
        }
    ]).then(async res => {
        //Confirm
        del = parseInt(res.id);
        await inquirer.prompt([
            {
                name: 'confirm',
                type: 'confirm',
                message: `Are you sure you want to delete this employee record?`,
                default: false
            }
        ]).then(async conf => {
            //Send table and id to 'delete' function
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
//Update employee
async function updateEmployee(employees) {
    var emp = null;
    //Get employee id
    await inquirer.prompt([
        {
            name: 'id',
            type: 'list',
            choices: employees.map(e => e.id),
            message: 'Choose the ID the employee you would like to update.',
        }
    ]).then(async res => {
        //Get field to update
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
                //If last name, get new last name and send to 'updateEmployee' function along with id
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
                //If role, get new role id and send to 'updateEmployee' function along with id  
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
                //If manager, get new manager id and send to 'updateEmployee' function along with id
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
                //If back, reload function
                case 'Back':
                    updateEmployee(employees);
                    break;
            }
        });
    });
    employeesMenu();
}

//View employees by department, manager, or role
async function viewBy() {
    var depts = await db.view('department');
    var field = null;
    var depId = null;
    await inquirer.prompt([
        //Choose view
        {
            name: 'filter',
            type: 'list',
            choices: ['Manager', 'Role', 'Department', 'Back'],
            message: 'Choose view.'
        }
    ]).then(async filter => {
        //IF back, reload employee menu, else...
        if (filter.filter != 'Back') {
            field = filter.filter;
            console.table(depts);
            //Get department ID, used to filter other fields or display by department
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
                    //If by manager, get department managers, and get user choice
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
                            //send id and field name (manager) to viewBy function
                            var list = await db.viewBy('manager', manager.manager);
                            console.table(list);
                        });
                        //When done, reload viewBy menu
                        viewBy();
                        break;
                    //If by role, get department roles, and get user choice
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
                            //send id and field name (role) to viewBy function
                            var list = await db.viewBy('role', role.role);
                            console.table(list);
                        });
                        //When done, reload viewBy menu
                        viewBy();
                        break;

                    case 'Department':
                        //send id and field name (department) to viewBy function
                        var list = await db.viewBy('department', depId);
                        console.table(list);
                        //When done, reload viewBy menu
                        viewBy();
                        break;
                }
            });
        } else {
            //when back, reload employee menu
            employeesMenu();
        }
    });
}

//Launch interface
mainMenu();