const database = new require('../database/database');

module.exports = function (app) {
    app.get('/departments', async function (req, res, next) {
        let departments;
        try {
            departments = await database.departments.getDepartments();
            res.send(departments)
        } catch (e) {
            next(e)
        }
    });

    app.get('/employees', async function (req, res, next) {
        let employees;
        try {
            employees = await database.employees.getEmployees();
            res.send(employees)
        } catch (e) {
            next(e)
        }
    });
};