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
    health: String,

}

const schema_user = {
    username: String,
    userpwd: String,
    admin: Boolean 

}
//定义模型
const userdata = mongoose.model('users', schema_user);
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
                //判断是否查询成功
                if(data == 0){
                    ejs.renderFile("result.html",{returnVal:"bad query:"+"请检查你的输入：查无此人"},(err,str)=>{
                        res.send(str)
                    })
                }
                else{
                    ejs.renderFile("result.html",{returnVal:"successful query:"+data[0]._doc.health},(err,str)=>{
                        res.send(str)
                        console.log(data[0]._doc.health)
                        console.log(login_code)
                    })
                }
            })
        }
    }

    if(req.query.submit1=="Login"){
        if(req.query!=""){
            //查询
            userdata.find({username:req.query.username},(err,data)=>{
                if(data == 0){
                    ejs.renderFile("result.html",{returnVal:"bad query:"+"请检查你的输入：查无此人"},(err,str)=>{
                        res.send(str)
                    })
                }
                else if(data[0]._doc.userpwd == req.query.userpwd){
                    if(data[0]._doc.admin == true){queryres = "你是管理员"}
                    else {queryres+ "你是普通用户"}
                    
                    console.log(login_code)
                    var login_code = 1
                    ejs.renderFile("result.html",{returnVal:"登录成功"+queryres},(err,str)=>{
                        res.send(str)
                    })
                }
            })
        }
    }

    if(req.query.submit1=="Register"){
        if(req.query!=""){
            // 注册
            // 查询部分
            userdata.find({username:req.query.username},(err,data)=>{
            if(data == 0){
                //注册部分
                console.log(data[0])
                console.log(req.query.userpwd1,req.query.userpwd2)
                if(req.query.userpwd1 === req.query.userpwd2){
                    user1 = new userdata({ 
                        username: req.query.username,
                        userpwd: req.query.userpwd1,
                        admin: false });
                    
                    console.log(login_code)    
                    user1.save()
                    ejs.renderFile("result.html",{returnVal:"Register successfully"},(err,str)=>{
                    res.send(str)
                })
                }
                else if(req.query.userpwd1 != req.query.userpwd2){
                    ejs.renderFile("public/register.html",{returnVal:"两次输入的密码不一致，请重试"},(err,str)=>{
                        res.send(str)
                    })
                }
                
            }
            else if(data[0]._doc.username == req.query.username){
                    ejs.renderFile("public/register.html",{returnVal:"用户已存在"},(err,str)=>{
                        res.send(str)
                    })
                }
            })
            
            
        }
    }

})
app.listen(10204)