const text=document.querySelector("#typeText");
const str="This is doctor's dictionary. You can search words, see diagrams (if available) and related terms. Type in the search box to start querying and exploring.";
let idx=0;
let cs="";
let interval=setInterval(function()
{
    let s=cs+str[idx]+"_";
    text.textContent=(s);
    cs+=str[idx];
    idx++;
    if(idx==str.length)
    {
        clearInterval(interval)
    }
},20)
