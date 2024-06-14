
function colorContainerWrite(color_data){
    result = Array(color_data.length)
    for(var color_index = 0; color_index < color_data.length; color_index++){
        result[color_index] =
'\
<div class="colorContainer">\
<div class="innerColor">\
<div class="color" style="background-color: '
+color_data[color_index]['value']+';"></div>'
+
'<p class="colorNum">'+color_data[color_index]['value']+'</p>\
<p class="colorName">'+color_data[color_index]['name']+'</p>\
<span class="copyNum">\
    <div class="copyIcon">\
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">\
        <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->\
        <path d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z" fill="#f8f9fa"/></svg>\
    </div>\
</span>\
</div>\
</div>\
</div>'
    }
    return result.join('')
}

function ColorText2RGB(color){
    if(color[0] != '#' || (color.length != 4 && color.length != 5 && color.length != 7 && color.length != 9)){
        return null
    }
    color_text = color.slice(1)
    if(color_text.length == 3){
        return [parseInt(color_text.slice(0,1), 16) * 16, parseInt(color_text.slice(1,2), 16) * 16, parseInt(color_text.slice(2,3), 16) * 16]
    }
    if(color_text.length == 4){
        return [parseInt(color_text.slice(0,1), 16) * 16, parseInt(color_text.slice(1,2), 16) * 16, parseInt(color_text.slice(2,3), 16) * 16, parseInt(color_text.slice(6,8), 16) * 16]
    }
    if(color_text.length == 6){
        return [parseInt(color_text.slice(0,2), 16), parseInt(color_text.slice(2,4), 16), parseInt(color_text.slice(4,6), 16)]
    }
    if(color_text.length == 8){
        return [parseInt(color_text.slice(0,2), 16), parseInt(color_text.slice(2,4), 16), parseInt(color_text.slice(4,6), 16), parseInt(color_text.slice(6,8), 16)]
    }
}

function ColorDistance(color, target){
    let r1 = color[0]
    let g1 = color[1]
    let b1 = color[2]
    let r2 = target[0]
    let g2 = target[1]
    let b2 = target[2]
    let r_ = (r1 + r2) / 2
    let R = r1 - r2
    let G = g1 - g2
    let B = b1 - b2
    return Math.sqrt((2 + r_ / 256) * (R*R) + 4 * (G*G) + (2+(255-r_)/256)*(B*B))
}

function themeColorSearchCurse(){
    let textSearch = Succubus.JSON_DeepCopy(document.querySelector('span.Search input').value)
    let color_table = Succubus.JSON_DeepCopy(fetched_data)
    let color_name_table = color_table.map(x=>x['name'])
    let color_value_table = color_table.map(x=>x['value'])
    let result
    let color = ColorText2RGB(textSearch)
    if(textSearch == ''){
        document.getElementsByClassName('palette')[0].innerHTML = colorContainerWrite(color_table)
        Succubus.ClipboardCopyByClassT('copyIcon', color_value_table)

        let clear_elem = document.getElementById('CLEAR_SEARCH_C')
        if(clear_elem !== null)
            clear_elem.remove()
        document.querySelector('span.Search').style.borderColor = 'var(--body-2)'
        return
    }
    if(color !== null && color !== undefined){
        result = Succubus.Searching(color_value_table, textSearch, (text, target)=>{return ColorDistance(ColorText2RGB(text), ColorText2RGB(target))})[0]
        document.querySelector('span.Search').style.borderColor = textSearch
    }else{
        //result = Array.from({length:color_table.length},(_, i)=>(i))
        result = Succubus.Searching(color_name_table, textSearch, Succubus.BaseTextMatchCurse)[0].reverse()
        document.querySelector('span.Search').style.borderColor = 'var(--body-2)'
    }
    let result_table = result.map(x=>color_table[x])
    document.getElementsByClassName('palette')[0].innerHTML = colorContainerWrite(result_table)
    Succubus.ClipboardCopyByClassT('copyIcon', result_table.map(x=>x['value']))
    
    let clear_elem = document.createElement('span')
    if(document.getElementById('CLEAR_SEARCH_C') == null){
        clear_elem.id = 'CLEAR_SEARCH_C'
        clear_elem.innerHTML = '✖'
        clear_elem.onclick = ()=>{
            document.querySelector('span.Search>input').value = ''
            document.getElementById('CLEAR_SEARCH_C').remove()
            document.querySelector('span.Search').style.borderColor = 'var(--body-2)'
        }
        document.getElementsByClassName('Search')[0].appendChild(clear_elem)}
}
