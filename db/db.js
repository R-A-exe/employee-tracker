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
            query = 'SELECT * FROM department';
            break;

        case 'role':
            query = 'SELECT role.id, role.title, role.salary, department.name FROM role JOIN department ON department_id = department.id;'
            break;
            
        case 'employee':
            query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id'
    }
    return new Promise(async function (resolve, reject) {
        connection.query(query, (err, res) => {
            if (err) return (reject(err));
            return (resolve(res));
        });
    });
}

async function add(table, obj) {
    return new Promise(async function (resolve, reject) {
        connection.query('INSERT INTO ?? VALUES(default, ?)', [table, obj], (err, res) => {
            if (err) return (reject(err));
            return (resolve(res.insertId));
        });
    });
}

async function updateEmployee(employee, field) {
    return new Promise(async function (resolve, reject) {
        connection.query('UPDATE employee SET ?? = ? WHERE id = ?', [field, employee[field], employee.id], (err, res) => {
            if (err) return (reject(err));
            return (resolve(res.up));
        })
    });

}



module.exports = {
    view,
    add,
    updateEmployee
};