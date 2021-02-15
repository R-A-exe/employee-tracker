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
            query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, employee2.first_name AS manager_first_name, employee2.last_name AS manager_last_name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee as employee2 ON employee.manager_id = employee2.id';
            break;
    }
    return new Promise(async function (resolve, reject) {
        connection.query(query, (err, res) => {
            if (err) return (reject(err));
            return (resolve(res));
        });
    });
}

async function viewBy(field, obj) {
    switch(field){
        case 'manager':
            field = 'employee.manager_id';
            break;
        case 'role':
            field = 'employee.role_id';
            break;
        case 'department':
            field = 'role.department_id';
    }
    return new Promise(async function(resolve, reject){
        connection.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, employee2.first_name AS manager_first_name, employee2.last_name AS manager_last_name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee as employee2 ON employee.manager_id = employee2.id WHERE ?? = ?',[field, obj.id], (err, res)=>{
            if(err) return (reject(err));
            return (resolve(res))
        });
    })
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
            return (resolve(res.affectedRows));
        })
    });

}


async function deleteRecord (table, obj){
    return new Promise(async function (resolve, rejec){
        connection.query('DELETE FROM ?? WHERE id = ?', [table, obj.id], (err, res)=>{
            if(err)return(reject(err));
            return(resolve(res.affectedRows));
        })
    });
}


module.exports = {
    view,
    add,
    updateEmployee,
    viewBy,
    deleteRecord
};