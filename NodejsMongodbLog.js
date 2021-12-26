const express = require("express")
const app=express()
const session = require("express-session")
const mongoose = require("mongoose")
const ejs = require("ejs")
//导入用到的包
//链接数据库
mongoose.connect('mongodb://localhost/test');
// mongoose.connect('mongodb://172.21.2.236:27017/190110910204');
//定义一些变量
var queryres = ""

const schema = {
    name: String,
    health: String,
    hostname: String

}

const schema_user = {
    username: String,
    userpwd: String,
    admin: Boolean 

}
//定义模型
const userdata = mongoose.model('users', schema_user);
const petdata = mongoose.model('pets', schema);
//启用session的中间件
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))

//设置use的默认页面
app.use('/',express.static('public'))
app.get("/input",(req,res)=>{
    // res.send(req.query)
    // const kitty1 = new mydata({ name: req.query.first,health: req.query.second });
    // kitty1.save()
    // ejs.renderFile(filename, data, options, function(err, str){
    //     // str => 输出渲染后的 HTML 字符串
    // });
    if(req.query.submit1=="Write"){
        if(req.session.userinfo){
            if(req.query!=""){
                //插入
                pet1 = new petdata({ name: req.query.first,health: req.query.second,hostname:req.query.third});
                pet1.save()
                ejs.renderFile("result.html",{returnVal:"write successfully"},(err,str)=>{
                    res.send(str)
                })
            }
        }
        else {
            ejs.renderFile("result.html",{returnVal:"您当前并未登录"},(err,str)=>{
                res.send(str)
            })
        }
    }

    if(req.query.submit1=="Read"){
        if(req.query!=""){
            if(req.session.userinfo){
                //查询
            petdata.find({name:req.query.first},(err,data)=>{
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
                    })
                }
            })
            }
            else {
                ejs.renderFile("result.html",{returnVal:"您当前并未登录"},(err,str)=>{
                    res.send(str)
                })
            }
        }
    }

    if(req.query.submit1=="Login"){
        if(req.query!=""){
            //查询
            if(req.session.userinfo){
                ejs.renderFile("result.html",{returnVal:"bad login:"+"您已经登录"},(err,str)=>{
                    res.send(str)
                })
            }
            else {
                userdata.find({username:req.query.username},(err,data)=>{
                    if(data == 0){
                        ejs.renderFile("result.html",{returnVal:"bad query:"+"请检查你的输入：查无此人"},(err,str)=>{
                            res.send(str)
                        })
                    }
                    else if(data[0]._doc.userpwd == req.query.userpwd){
                        req.session.userinfo = req.query.username
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
    }

    if(req.query.submit1=="Register"){
        if(req.query!=""){
            // 注册
            // 查询部分
            if(req.session.userinfo){
                ejs.renderFile("public/register.html",{returnVal:"您已经登录!"},(err,str)=>{
                    res.send(str)
                })
            }
            else{
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
    }

    if(req.query.submit1=="Logout"){
        req.session.destroy(function(err){
            console.log(err);
        })
        ejs.renderFile("result.html",{returnVal:"登出成功！"},(err,str)=>{
            res.send(str)
        })
    }


})

app.listen(10204)