const User = require('../models/User')

const bcrypt = require('bcryptjs')

module.exports = class AuthController {
    static login (req,res){
        res.render('auth/login')
    }
    static register (req,res){
        res.render('auth/register')
    }
    static async registerPost (req,res){
        const {name,email,password,confirmPassword} = req.body

        if (password != confirmPassword) {
            req.flash('message','As senhas não conferem, tente novamente!')
            res.render('auth/register')
            return
        } 

        // check if user exist
        const checkUserExists = await User.findOne({where:{email:email}})        
        if(checkUserExists){
            req.flash('message','o e-mail já está em uso!')
            res.render('auth/register')
            return
        }
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password,salt)

        const user = {
            name,
            email,
            password:hashedPassword
        }
        try {
            const createUser = await User.create(user)
            req.session.userid = createUser
            
            req.flash( 'message', 'Cadastro realizado com sucesso')
            
            req.session.save(()=>{
                res.redirect('/')
            })
            
        } catch (error) {
            console.log(error);
            
        }
    }
    static logout(req,res){
        req.session.destroy()
        res.redirect('/login')
    }
    static async loginPost(req,res){
        const {email,password} = req.body

        // find user
        const user = await User.findOne({where:{email:email}})
    
        if(!user){
            req.flash('message','Usuário não cadastrado!')
            res.render('auth/login')
            return

        }
        // password 
        const passwordMatch = bcrypt.compareSync(password,user.password)
        if(!passwordMatch){
            req.flash('message','Senha inválida!')
            res.render('auth/login')
            return

        }
        req.session.userid = user
            
        req.flash( 'message', 'Autenticação realizada com sucesso')
        
        req.session.save(()=>{
            res.redirect('/')
        })
    }
}