const express = require("express")
const app=express()
const mongoose = require("mongoose")
const ejs = require("ejs")
var queryres = ""
mongoose.connect('mongodb://localhost/test');
// mongoose.connect('mongodb://172.21.2.236:27017/190110910204');
const schema = {
    name: String,
    age: Number,
    health: String
}

const mydata = mongoose.model('cat1s', schema);

app.use('/',express.static('public'))
app.get("/input",(req,res)=>{
    // res.send(req.query)
    // const kitty1 = new mydata({ name: req.query.first,health: req.query.second });
    // kitty1.save()
    // ejs.renderFile(filename, data, options, function(err, str){
    //     // str => 输出渲染后的 HTML 字符串
    // });
    if(req.query.submit1=="Write"){
        if(req.query!=""){
            //插入
            kitty1 = new mydata({ name: req.query.first,health: req.query.second});
            kitty1.save()
            ejs.renderFile("result.html",{returnVal:"write successfully"},(err,str)=>{
                res.send(str)
            })
        }
    }
    if(req.query.submit1=="Read"){
        if(req.query!=""){
            //查询
            mydata.find({name:req.query.first},(err,data)=>{
                ejs.renderFile("result.html",{returnVal:"successful query:"+data[0]._doc.health},(err,str)=>{
                    res.send(str)
                    console.log(data[0]._doc.health)
                })
            })
        }
    }
})
app.listen(10204)