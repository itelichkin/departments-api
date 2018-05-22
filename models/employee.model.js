const mongoose = require('../lib/mongoose');
const Schema = mongoose.Schema;

const employeeDataSchema = new Schema({
    id: Schema.Types.ObjectId,
    name: {
        type: String,
        unique: true,
        required: true
    },
    count: [String]
});

exports.EmployeeDataSchema = mongoose.model('EmployeeDataSchema', employeeDataSchema);