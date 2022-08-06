const {DataTypes}= require('sequelize')

const db = require('../db/conn')
const User = require('../models/User')

const Tougth = db.define('Tought',{
    title:{
        type:DataTypes.STRING,
        allowNull:false,
        require:true
    }
})

Tougth.belongsTo(User)
User.hasMany(Tougth)

module.exports = Tougth