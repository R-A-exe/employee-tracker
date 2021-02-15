const mysql = require ('mysql');


var connection = mysql.createConnection({
    host:'localhost',
    port: 3306,
    user: 'testUser',
    password: 'password',
    database: 'employeeCMS'
});


async function view(table){
    return new Promise (async function (resolve, reject){
        connection.query('SELECT * FROM ??',table,(err, res)=>{
            if (err) return(reject(err));
            return (resolve(res));
        });
    });
}

async function add(table, obj){
    return new Promise (async function(resolve, reject){
        connection.query('INSERT INTO ?? VALUES(default, ?)', [table, obj],(err, res)=>{    
            if(err) return(reject(err));
            return(resolve(res.insertId));
        });
    });
}

async function updateEmployee(employee, field){
    return new Promise (async function(resolve, reject){
        connection.query('UPDATE employee SET ?? = ? WHERE id = ?',[field, employee[field], employee.id], (err,res)=>{
            if(err) return(reject(err));
            return(resolve(res.up));
        })
    });

}


module.exports = {
    view,
    add,
    updateEmployee
};