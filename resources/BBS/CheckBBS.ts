async function Get_BBS_JSON(url:string){
    console.log('正在加载json');
    const response = await fetch(url);
    if(!response.ok){
        throw new Error('Error to fetch bbs json from the web : '+String(response.statusText));
    }
    console.log('json加载完毕');
    return response.json();
}

const BBS_TYPE = {
    '大型': {
        'title': '大型论坛评定说明',
        'content': '帖子总数约在4000条以上（标准会发生动态变化）'
    },
    '小型': {
        'title': '小型论坛评定说明',
        'content': '帖子总数约在2000条以下（标准会发生动态变化）'
    },
    '中型': {
        'title': '中型论坛评定说明',
        'content': '帖子总数约在2000条以上，4000条以下（标准会发生动态变化）'
    }
};

interface BBS_TEXT {
    "name":string;
    "type":string;
    "value":boolean;
    "icon":string;
    "url":string;
    "bbs-type":keyof typeof BBS_TYPE;
}

function __AboutElem(title:string,content:string){
    var a = document.createElement('a');
    a.setAttribute('tabindex','0')
    a.role = 'button';
    a.setAttribute('data-bs-toggle','popover');
    a.setAttribute('data-bs-placement','top');
    a.setAttribute('data-bs-trigger','focus');
    a.setAttribute('data-bs-title',title);
    a.setAttribute('data-bs-content',content);
    a.innerHTML += 
        '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">\
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>\
        </svg>'
    
    return a;
}

function Write_BBS_JSON_To_DIV(data:BBS_TEXT){

    console.log(data);

    var elem_bbsContainer = document.createElement('div');
    elem_bbsContainer.className = 'bbsContainer';
    var elem_innerBbs = document.createElement('div');
    elem_innerBbs.className = 'innerBbs';
    
    var elem_infoCollection = document.createElement('div');
    elem_infoCollection.className = 'infoCollection';
    
    var elem_bandageStatus = document.createElement('div');
    elem_bandageStatus.className = 'bandageStatus';

    var elem_tmp = document.createElement('div');
    
    var span1 = document.createElement('span');
    var span2 = document.createElement('span');

    
    span2.className = 'badge text-bg-primary';

    if(data['value'] == true){
        span1.className = 'badge text-bg-success';
        span1.innerHTML = '已备案 √';
    }else{
        span1.className = 'badge text-bg-danger';
        span1.innerHTML = '未备案 ×';
    }
    var span4 = document.createElement('span');
    span4.innerHTML = data['type'];
    span2.appendChild(span4);
    span2.appendChild(__AboutElem(BBS_TYPE[data['bbs-type']]['title'],BBS_TYPE[data['bbs-type']]['content']));

    elem_tmp.appendChild(span1);
    elem_tmp.appendChild(span2);
    elem_bandageStatus.appendChild(elem_tmp);

    var mainInfo = document.createElement('div');
    mainInfo.className = 'mainInfo';

    var img = document.createElement('img');
    img.src = data['icon'];
    img.alt = '';
    img.srcset = '';

    var mainText = document.createElement('div');
    mainText.className = 'mainText';
    var p = document.createElement('p');
    p.innerHTML = data['name'];
    var small = document.createElement('small');
    small.className = 'text-body-secondary'
    small.innerHTML = data['url'];

    mainText.appendChild(p);
    mainText.appendChild(small);

    mainInfo.appendChild(img);
    mainInfo.appendChild(mainText);

    elem_infoCollection.appendChild(elem_bandageStatus);
    elem_infoCollection.appendChild(mainInfo);

    var btn_group = document.createElement('div');
    btn_group.className = 'btn-group';
    btn_group.role = 'group';
    btn_group.ariaLabel = 'Basic example';

    var bottom1 = document.createElement('button');
    bottom1.type = 'button';
    bottom1.className = 'btn btn-secondary';
    bottom1.onclick = (ev) => {
        navigator.clipboard.writeText(data['url'])
            .then(
                () => {
                    console.log("粘贴文本成功");
                },
                () => {
                    console.log("clipboard write failed");
                }
            );
    }

    var a = document.createElement('a');
    a.className = 'icon-link icon-link-hover';
    var span3 = document.createElement('span');
    span3.innerHTML = '复制网址';

    a.appendChild(span3);
    a.innerHTML += 
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">\
        <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>\
    </svg>'
    bottom1.appendChild(a);

    btn_group.appendChild(bottom1);

    var bottom1 = document.createElement('button');
    bottom1.type = 'button';
    bottom1.className = 'btn btn-secondary';
    bottom1.onclick = (ev) => {
        window.open(data['url'],'_self');
    }

    var a = document.createElement('a');
    a.className = 'icon-link icon-link-hover';
    a.href = data['url'];
    var span3 = document.createElement('span');
    span3.innerHTML = '访问';

    a.appendChild(span3);
    a.innerHTML += 
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">\
        <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>\
        <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>\
    </svg>'
    bottom1.appendChild(a);

    btn_group.appendChild(bottom1);

    elem_innerBbs.appendChild(elem_infoCollection);
    elem_innerBbs.appendChild(btn_group);
    elem_bbsContainer.appendChild(elem_innerBbs);

    return elem_bbsContainer;
}

var finished = false;



