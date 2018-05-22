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

    app.delete('/department', async function (req, res, next) {
        const id = req.query.id;
        let status;
        try {
            status = await database.departments.removeDepartment(id);
            res.send({removed: status});
        } catch (e) {
            next(e)
        }
    });

    app.post('/departments', async function (req, res, next) {
        let status;
        try {
            status = await database.departments.createDepartment(req.body);
            res.send({saved: status});
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

    app.delete('/employee', async function (req, res, next) {
        const id = req.query.id;
        let status;
        try {
            status = await database.employees.removeEmployee(id);
            res.send({removed: status});
        } catch (e) {
            next(e)
        }
    });

    app.post('/employees', async function (req, res, next) {
        let status;
        try {
            status = await database.employees.createEmployee(req.body);
            res.send({saved: status});
        } catch (e) {
            next(e)
        }
    });
};