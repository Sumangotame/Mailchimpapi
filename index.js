import express, { response } from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import {dirname} from "path";
import path from 'path';
import axios from 'axios';
const __filename =fileURLToPath(import.meta.url)
const currentDir = dirname(__filename)
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(currentDir,'public')));
const port = 3000;
app.get("/",(req,res)=>{
    res.sendFile(path.join( currentDir,"/index.html"))
})
app.post("/",(req,res)=>{
    console.log(req.body)
    var firstName= req.body.fname
    var email=req.body.email
    var lastName= req.body.lname
    var data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }     
            }
        ]     
    }
    var jsonData= JSON.stringify(data)
    var url='https://us17.api.mailchimp.com/3.0/lists/6957092490'
    axios.post(url,jsonData,{
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from('suman35574:c38a171eccb75e40d25e2344ebca1f59-us17').toString('base64')
        }
    })
    .then(response=>{
        console.log('response from the server:'+ JSON.stringify(response.data));
        res.status(200).sendFile(path.join(currentDir,"/success.html"));
    })
    .catch(error=>{
        res.status(400).sendFile(path.join(currentDir,"/failure.html"))
    })
    console.log(firstName)
})
app.post("/failure", (req, res) => {
    res.redirect("/");
});
app.listen(port,()=>{
    console.log(`server is listening at port ${port}`)
})
// c38a171eccb75e40d25e2344ebca1f59-us17
// audience id
//6957092490
// 6957092490