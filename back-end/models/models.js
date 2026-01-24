const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true,  autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password_hash: {type: DataTypes.STRING}
});

const Deadline = sequelize.define ('deadline', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    course_name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT},
    deadline_date: {type: DataTypes.DATE, allowNull: false},
    type: {type: DataTypes.STRING},
    weight: {type: DataTypes.FLOAT},
    uid_hash: {type: DataTypes.STRING(64)}
});

User.hasMany(Deadline);
Deadline.belongsTo(User);

module.exports = {
    User,
    Deadline
};