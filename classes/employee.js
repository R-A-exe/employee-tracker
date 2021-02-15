const role = require('./role');
const department = require('./department');

class employee {
    constructor (firstName, lastName, role, employee){
        this.first_name = firstName;
        this.last_name = lastName;
        this.role_id = role.id;
        this.manager_id = employee.id;
    }
}