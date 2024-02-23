import jsondata from './data/Checked.json' assert{ type:'json'} ;



console.log(jsondata);
console.log(typeof jsondata)


const html = "";
for( var i = 0; i< jsondata.legth; i ++){
    html += `
        <tr>
            <td>${result[url]}</td>
            <td>${jsondata[i].url}</td>
            <td class="text-end">${jsondata[i].url}</td>
        </tr>
    `      
}
console.log(html);
var myBody = document.getElementById( "myBody");
myBody.innerHTML = html;

console.log(11)



$.ajax({
    url: "resources/BBS/data/Checked.json",
    type:"GET",
    dataType: "json",
    success :
    function (data){
        html = `
        <tr>
            <td>${jsondata[i].url}</td>
            <td>${jsondata[i].url}</td>
            <td class="text-end">${jsondata[i].url}</td>
        </tr>
    `     
    }
});

fetch("resources/BBS/data/Checked.json")
  .then((response) => response.json())
  .then((data) => console.log(data));
    