const express=require("express"); 
//
const app=express();
const bodyParser=require("body-parser");
const request=require("request");
app.use(bodyParser.urlencoded({extended: true}));
const path=require("path");
const publicPath=path.join(__dirname,"public");
// console.log(publicPath);
app.use(express.static(publicPath));
app.set("view engine","ejs")
const port=process.env.PORT || 3000;
app.get("/",function(req,res)
{
    res.render("home");
})
app.get("/search/:query",function(req,res1)
{
    const query=req.params.query;
    const url="https://www.dictionaryapi.com/api/v3/references/medical/json/"+query+"?key=e5d00089-e3f9-447a-af19-234e2afd2485";
    request(url,function(err,res,body)
    {
        const jsonData=res.body;
        const parsedData=JSON.parse(jsonData);
        var data=[];
        var results=[];
        var related=[];
        for(var i=0;i<1;i++)
        {
                var obj={
                    "definition": parsedData[i]["shortdef"][0]
                };
                if(parsedData[i]["art"]!=undefined)
                {
                    obj["fig_link"]="https://www.merriam-webster.com/assets/mw/static/art/dict/"+ parsedData[i]["art"]["artid"] +".gif";
                    obj["caption"]=parsedData[i]["art"]["capt"];
                }
                results.push(obj);
        }
        for(var i=1;i<parsedData.length;i++)
        {
            if(parsedData[i]["hom"]===undefined)
            related.push(parsedData[i]["meta"]["id"]);
        }
        // console.log(results[0]);
        // console.log(related);
        // console.log(query);
        res1.render("results",{related: related,results: results[0],query: query});
    })
})
app.post("/search",function(req,res1)
{
    // console.log(req.body);
    const query=req.body.query;
    const url="https://www.dictionaryapi.com/api/v3/references/medical/json/"+query+"?key=e5d00089-e3f9-447a-af19-234e2afd2485";
    console.log("URL",url);
    request(url,function(err,res,body)
    {
        const jsonData=res.body;
        const parsedData=JSON.parse(jsonData);
        if(parsedData.length===0 || typeof parsedData[0]!=="object"){
            res1.redirect("/");
            return;
        }
        var data=[];
        var results=[];
        var related=[];
        for(var i=0;i<1;i++)
        {
                var obj={
                    "definition": parsedData[i]["shortdef"][0]
                };
                if(parsedData[i]["art"]!=undefined)
                {
                    obj["fig_link"]="https://www.merriam-webster.com/assets/mw/static/art/dict/"+ parsedData[i]["art"]["artid"] +".gif";
                    obj["caption"]=parsedData[i]["art"]["capt"];
                    var str1=obj["caption"];
                    var str2="";
                    var idx;
                    for(var i=0;i<str1.length;i++)
                    {
                        if(str1[i]==':')
                        {
                            idx=i;
                        }
                        if(i+3<str1.length && str1[i]=='{' && str1[i+1]=='i' && str1[i+2]=='t' && str1[i+3]=='}')
                        {
                            i+=3;
                        }
                        else if(i+4<str1.length && str1[i]=='{' && str1[i+1]=='/' && str1[i+2]=='i' && str1[i+3]=='t' && str1[i+4]=='}')
                        {
                            i+=4;
                            str2+=':';
                        }
                        else
                        {
                            str2+=(str1[i]);
                        }
                    }
                    obj["caption"]=str2.slice(idx+1,str2.length);
                    // console.log("caput",obj["caption"]);
                }
                results.push(obj);
        }
        for(var i=1;i<parsedData.length;i++)
        {
            if(parsedData[i]["hom"]===undefined)
            related.push(parsedData[i]["meta"]["id"]);
        }
        // console.log(results[0].capt);
        // console.log(related);
        res1.render("results",{related: related,results: results[0],query: req.body.query});
    })
})
app.listen(port,function()
{
    console.log("Server has started!!");
})