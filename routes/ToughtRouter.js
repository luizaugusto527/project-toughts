const express = require('express')
const router = express.Router()
const ToughtsController = require('../controllers/ToughtController')

const { checkAuth } = require('../helpers/auth')


router.get('/',ToughtsController.showToughts)
router.get('/add',checkAuth,ToughtsController.createTought)
router.get('/edit/:id',checkAuth,ToughtsController.updateTought)
router.post('/edit',checkAuth,ToughtsController.updateToughtSave)
router.post('/add',checkAuth,ToughtsController.createToughtSave)
router.get('/dashboard',checkAuth,ToughtsController.dashboard)
router.post('/remove',checkAuth,ToughtsController.removeTought)

module.exports = router