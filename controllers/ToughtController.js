const Tought = require('../models/Tought')
const User = require('../models/User')

const {Op} = require('sequelize')


module.exports = class ToughtsController {
    static async showToughts(req,res){
        let search = ''

        if (req.query.search) {
            search = req.query.search
        }
        
        let order = 'DESC'

        if (req.query.order === 'old') {
            order = 'ASC'
        }else{
            order = 'DESC'
        }
        
        const toughtData = await Tought.findAll({
            include:User,
            where:{
                title:{[Op.like]:`%${search}%`}
            },
            order:[['createdAt', order]]
        })

        const toughts = toughtData.map((result)=> result.get({plain:true}))
        let toughtsQty = toughts.length
            res.render('Toughts/home',{toughts,toughtsQty,search})
    }
    static async dashboard(req,res){
        const userId = req.session.userid.id
        const user = await User.findOne({
            where:{id:userId},
            include:Tought,
            plain:true
        })
        if(!user){
            res.redirect('/login')
        }

        const toughts = user.Toughts.map((result)=> result.dataValues)
        let emptyToughts = false
        if (toughts.length === 0) {
            emptyToughts = true
        }
        res.render('Toughts/dashboard',{toughts,emptyToughts})
    }
    static createTought(req,res){
        res.render('Toughts/create')
    }
    static async createToughtSave(req,res){
        const tought = {
            title: req.body.title,
            UserId: req.session.userid.id
        }
        try {
          
            await Tought.create(tought)
            req.flash('message', 'Pensamento criado com sucesso!')
            req.session.save(() => {
              res.redirect('/toughts/dashboard')
            })
        } catch (error) {
            console.log(error);
        }
    }
    static async removeTought(req,res){
        const id = req.body.id
        const userId = req.session.userid.id

        try {
            await Tought.destroy({where:{id:id, userId:userId}})
            req.flash('message', 'Pensamento removido com sucesso!')
            req.session.save(() => {
              res.redirect('/toughts/dashboard')
            })
        } catch (error) {
            console.log(error);
        }
        
       
    }

    static async updateTought(req,res){
        const id = req.params.id

        const tought = await Tought.findOne({where:{id:id}, raw:true})
        res.render('toughts/edit',{tought})
    }

    static async updateToughtSave(req,res){
        const id = req.body.id
        const tought = {
            title: req.body.title
        }

      
        try {
            await Tought.update(tought, {where:{id:id}} )
            req.flash('message', 'Pensamento atualizado com sucesso!')
            req.session.save(() => {
              res.redirect('/toughts/dashboard')
            })
        } catch (error) {
            console.log(error);
        }
        
    }
}