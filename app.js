const db = require('./db/db');
const Employee = require('./classes/employee');
const Role = require('./classes/role');
const Department = require('./classes/department');
(async ()=>{
    // var dept = new Department('Department1');
    // dept.id = await db.add('department', dept.toDb());
    // var role = new Role('Title', 50000, dept)
    // role.id = await db.add('role', role.toDb());
    // var emp = new Employee('Roy', 'Atallah', role);
    // emp.id = await db.add('employee', emp.toDb());


    // var emp2 = new Employee('Roy2', 'Atallah2', role, emp);
    // await db.add('employee', emp2.toDb());
    var obj = {id: 2};
    console.log(await db.deleteRecord('employee', obj));

})();