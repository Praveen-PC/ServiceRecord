const express=require('express')
const router=express.Router()
const recoredcontroller=require('../controller/record')


router.post('/addrecord',recoredcontroller.addRecord)
router.get('/alldetails',recoredcontroller.alldetails)

module.exports=router