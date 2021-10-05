// time display
function startTime() 
{ 
    var today=new Date() 
    var h=today.getHours() 
    var m=today.getMinutes() 
    m=checkTime(m) 
    document.getElementById('timeN').innerHTML=h+":"+m
    t=setTimeout('startTime()',4000) 
} 
function checkTime(i) 
{ 
    if (i<10) 
        {i="0" + i} 
        return i 
} 


// time greeting
function timeChange()
{
    var timeGet=new Date()
    var analysisTime=timeGet.getHours()
    document.getElementById('timeChange').innerHTML= 
    t=setTimeout('timeChange()',100000) 
    if (analysisTime<12){
        document.getElementById('timeChange').innerHTML= "早上好！新的一天开始了呢，加油吧！"
    } 
    else if (analysisTime<18){
        document.getElementById('timeChange').innerHTML= "中午了，可以休息一下哦~"
    }
    else{
        document.getElementById('timeChange').innerHTML= "晚上好！这一天你开心吗？"
    }
}