const mongoose = require('../lib/mongoose');
const Schema = mongoose.Schema;

const departmentsDataSchema = new Schema({
    id: Schema.Types.ObjectId,
    name: {
        type: String,
        unique: true,
        required: true
    }
});

exports.DepartmentDataSchema = mongoose.model('DepartmentDataSchema', departmentsDataSchema);