const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('toughts','root','passwordhere',{
    host:'localhost',
    dialect:'mysql'
})

try {
    sequelize.authenticate()
    console.log('Conectamos com sucesso!');
} catch (error) {
    console.log(`Não foi possível conectar: ${err}`);
}

module.exports = sequelize