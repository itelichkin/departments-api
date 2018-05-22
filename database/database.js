const mongoose = require('../lib/mongoose');
const async = new require('async');
require('../models/department.model');
require('../models/employee.model');

const Schema = mongoose.Schema;

const DepartmentDataSchema = mongoose.models.DepartmentDataSchema;
const EmployeeDataSchema = mongoose.models.EmployeeDataSchema;


const departmentSchema = new Schema();
const employeeSchema = new Schema();

async.series([
    open,
    checkDepartments,
    checkEmployees,
], function (err) {
    if (err) {
        return new Error(err)
    }
    console.log('INIT')
});

function open(callback) {
    mongoose.connection.on('open', function (err) {
        if (err) {
            return new Error(err)
        }
        callback(null, 'open')
    });
}

function checkDepartments(mainCallback) {
    // await DepartmentDataSchema.remove({})
    async.waterfall([
        function (callback) {
            DepartmentDataSchema.find({}, function (error, res) {
                if (error) {
                    return new Error(error)
                }
                callback(null, res);
            });
        },
        function (department, callback) {
            if (!department || department.length === 0) {
                async.each(defaultDepartmentsData, function (departmentData, callback) {
                    const department = new mongoose.models.DepartmentDataSchema(departmentData);
                    department.save();
                });
            }
            callback(null, 'done');
        },
    ], function (err, result) {
        if (err) {
            return new Error(err)
        }
        mainCallback(null, 'department')
    });
}

function checkEmployees(mainCallback) {
    /* await EmployeeDataSchema.remove()*/
    async.waterfall([
        function (callback) {
            EmployeeDataSchema.find({}, function (error, res) {
                if (error) {
                    return new Error(error)
                }
                callback(null, res);
            });
        },
        function (empoyees, callback) {
            if (!empoyees || empoyees.length === 0) {
                async.waterfall([
                    function (callback_2) {
                        DepartmentDataSchema.find({}, function (err, departments) {
                            if (err) {
                                return new Error(err)
                            }
                            callback_2(null, departments);
                        })
                    }, function (departments, callback_2) {
                        let counter = 0;
                        async.each(defaultEmployeesData, function (employeeData, callback) {
                            if (departments && !!departments.length) {
                                if (!!departments[counter]) {
                                    employeeData.count = [departments[counter]._id];
                                }
                                if (!!departments[counter + 1]) {
                                    counter++;
                                }
                            }
                            const employee = new mongoose.models.EmployeeDataSchema(employeeData);
                            employee.save();
                        });
                    }
                ]);
            }
            callback(null, 'done')
        }
    ], function (err, result) {
        if (err) {
            return new Error(err)
        }
        mainCallback(null, 'employee')
    });
}


departmentSchema.statics.getDepartments = function () {
    return new Promise((resolve, reject) => {
        DepartmentDataSchema.find({}, function (err, res) {
            if (err) {
                return new Error(err)
            }
            let departments = [];
            if (res) {
                res.forEach((dep) => {
                    const department = generateDepartmentData(dep);
                    departments.push(department);
                });
            }
            resolve(departments);
        });
    });
};

function generateDepartmentData(dep) {
    return {
        id: dep._id,
        name: dep.name,
    }
}

employeeSchema.statics.getEmployees = function () {
    return new Promise((resolve, reject) => {
        EmployeeDataSchema.find({}, function (err, res) {
            if (err) {
                return new Error(err)
            }
            let employees = [];
            if (res) {
                res.forEach((emp) => {
                    const employee = generateEmployeeData(emp);
                    employees.push(employee);
                });
            }
            resolve(employees);
        });
    });
};


function generateEmployeeData(dep) {
    return {
        id: dep._id,
        name: dep.name,
        count: dep.count
    }
}


const Departments = mongoose.model('Departments', departmentSchema);
const Employees = mongoose.model('Employees', employeeSchema);


const defaultDepartmentsData = [
    {
        'name': 'Department of Politics and International Studies'
    },
    {
        'name': 'Department of Architecture '
    },
    {
        'name': 'Department of Veterinary Medicine'
    },
    {
        'name': 'Main Department'
    }
];
const defaultEmployeesData = [
    {
        'name': 'Peter',
        'count': []
    },
    {
        'name': 'Ivan',
        'count': []
    },
    {
        'name': 'Jack',
        'count': []
    },
    {
        'name': 'Olivia',
        'count': []
    }
];


const mainDBSchema = new Schema({
    departments: Object,
    employees: Object,
});

MainDataBaseModel = mongoose.model('MainDataBaseModel', mainDBSchema);

const DataBase = new MainDataBaseModel({
    departments: Departments,
    employees: Employees,
});

module.exports = DataBase;
