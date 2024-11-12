const db = require('../model/db');

const alldetails=(req,res)=>{
    const sql='SELECT * FROM record'
    db.query(sql,(err,result)=>{
        if(err) throw err
        res.json(result)
    })
}

const addRecord=(req,res)=>{
    const {customername,project,district,model,controllersn,issuereported,faultcode,imei,date}=req.body
    const sql='INSERT INTO record (customername,project,district,model,controllersn,issuereported,faultcode,imei,date) VALUES (?,?,?,?,?,?,?,?,CURDATE())'
    db.query(sql,[customername,project,district,model,controllersn,issuereported,faultcode,imei,date],(err,result)=>{
        if (err) {
            console.log(err)
        }
        res.send(result)
    })
}

module.exports = { addRecord,alldetails };
