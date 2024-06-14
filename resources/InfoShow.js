
function ShowInfo(parent, text, delay){
    let info_elem = document.createElement('p')
    info_elem.setAttribute('id', 'INFO_SHOW_P')
    info_elem.innerHTML = text
    parent.appendChild(info_elem)
    let c = setTimeout(()=>{
        document.getElementById('INFO_SHOW_P').remove()
    }, delay)
}
