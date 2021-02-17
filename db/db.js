const mysql = require('mysql');


var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'testUser',
    password: 'password',
    database: 'employeeCMS'
});


async function view(table) {
    var query = null;
    switch (table) {
        case 'department':
            query = 'SELECT * FROM department ORDER BY id ASC';
            break;

        case 'role':
            query = 'SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON department_id = department.id ORDER BY role.id ASC'
            break;

        case 'employee':
            query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, employee2.first_name AS manager_first_name, employee2.last_name AS manager_last_name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee as employee2 ON employee.manager_id = employee2.id ORDER BY employee.id ASC';
            break;
    }
    return new Promise(async function (resolve, reject) {
        connection.query(query, (err, res) => {
            if (err) return (reject(err));
            return (resolve(res));
        });
    });
}

async function viewBy(field, val) {
    switch (field) {
        case 'manager':
            field = 'employee.manager_id';
            break;
        case 'role':
            field = 'employee.role_id';
            break;
        case 'department':
            field = 'role.department_id';
            break;

        case 'department_name':
            field = 'department.name';
            break;
    }
    return new Promise(async function (resolve, reject) {
        connection.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, employee2.first_name AS manager_first_name, employee2.last_name AS manager_last_name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee as employee2 ON employee.manager_id = employee2.id WHERE ?? = ? ORDER BY employee.id ASC', [field, val], (err, res) => {
            if (err) return (reject(err));
            return (resolve(res))
        });
    });
}

async function add(table, arr) {
    return new Promise(async function (resolve, reject) {
        connection.query('INSERT INTO ?? VALUES(default, ?)', [table, arr], (err, res) => {
            if (err) return (reject(err));
            return (resolve(res.insertId));
        });
    });
}

async function updateEmployee(employee, field) {
    return new Promise(async function (resolve, reject) {
        connection.query('UPDATE employee SET ?? = ? WHERE id = ?', [field, employee[field], employee.id], (err, res) => {
            if (err) return (reject(err));
            return (resolve(res.affectedRows));
        })
    });

}


async function deleteRecord(table, id) {
    return new Promise(async function (resolve, reject) {
        connection.query('DELETE FROM ?? WHERE id = ?', [table, id], (err, res) => {
            if (err) return (reject(err));
            return (resolve(res.affectedRows));
        })
    });
}

async function departmentBudget(obj) {
    return new Promise(async function (resolve, reject) {
        connection.query('SELECT SUM(role.salary) AS department_budget FROM employee JOIN role ON employee.role_id = role.id WHERE role.department_id = ?', obj.id, (err, res) => {
            if (err) return (reject(err));
            return (resolve(res));
        })
    })
}

async function viewRolesByDept(id){
    return new Promise(async function(resolve, reject){
        connection.query('SELECT * FROM role WHERE department_id = ? ORDER BY id ASC', id, (err, res)=>{
            if (err) return (reject(err));
            return resolve(res);
        })
    })
}

async function viewManagersByDept(id){
    return new Promise(async function(resolve, reject){
        connection.query('SELECT DISTINCT e.id, e.first_name, e.last_name, role.title FROM employee JOIN employee AS e ON employee.manager_id = e.id JOIN role ON employee.role_id = role.id WHERE department_id = ? ORDER BY e.id ASC', id, (err, res)=>{
            if(err)return reject(err);
            return resolve(res);
        })
    })
}


module.exports = {
    view,
    add,
    updateEmployee,
    viewBy,
    deleteRecord,
    departmentBudget,
    viewRolesByDept,
    viewManagersByDept
};