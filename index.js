const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const fileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express()

const conn = require('./db/conn') 

// Models
const Tougth = require('./models/Tought')
const User = require('./models/User')

app.engine('handlebars',exphbs.engine())
app.set('view engine','handlebars')

// Imports Routes
const ToughtRouter = require('./routes/ToughtRouter')
const AuthRouter = require('./routes/AuthRoutes')
const ToughtsController = require('./controllers/ToughtController')

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(
    session({
        name:"session",
        secret:"nosso_secret",
        resave:false,
        saveUninitialized:false,
        store: new fileStore({
            logFn: function () {},
            path: require('path').join(require('os').tmpdir(),'sessions'),

        }),
        cookie:{
            secure:false,
            maxAge:360000,
            expires: new Date(Date.now() + 360000),
            httpOnly:true
        }
    })
)

// flash messages
app.use(flash())
// public path
app.use(express.static('public'))

app.use((req,res,next)=>{
    if (req.session.userid) {
        res.locals.session = req.session
    }
    next()
})

// Routes
app.use('/toughts',ToughtRouter)
app.use('/',AuthRouter)

app.get('/',ToughtsController.showToughts)

conn
    .sync()
    .then(()=>{
        app.listen(3000)
    }).catch((err)=>console.log(err))