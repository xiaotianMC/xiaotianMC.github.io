"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*
  author:Qiong-Mengzi(ものさん/かりなさくら)
  description:依托答辩
  date:2024/04/11
*/
var BBS;
(function (BBS) {
    // 获取论坛相关数据(BBS-Data)
    // ! 调试时应使用服务器而非浏览器直接访问，否则请求会跨域导致失败(?)
    function Fetch_BBS_JSON_DATA(url) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('正在加载论坛相关数据: ' + url);
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error('加载论坛相关数据失败: ' + String(response.status));
            }
            console.log('论坛数据加载完毕');
            return response.json();
        });
    }
    BBS.Fetch_BBS_JSON_DATA = Fetch_BBS_JSON_DATA;
    // 论坛类型
    BBS.BBS_TYPE = {
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
    // 一些固定不变的svg矢量图
    const BBS_TYPE_ABOUT_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">\
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>\
        </svg>';
    const COPY_LINK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">\
            <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>\
        </svg>';
    const VISIT_SITE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">\
            <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>\
            <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>\
        </svg>';
    // 添加论坛类型的评定说明
    function add_bbs_type_info(title, content) {
        var elem = document.createElement('a');
        elem.setAttribute('tabindex', '0');
        //elem.role = 'button';
        elem.setAttribute('role', 'bottom');
        elem.setAttribute('data-bs-toggle', 'popover');
        elem.setAttribute('data-bs-placement', 'top');
        elem.setAttribute('data-bs-trigger', 'focus');
        elem.setAttribute('data-bs-title', title);
        elem.setAttribute('data-bs-content', content);
        elem.innerHTML += BBS_TYPE_ABOUT_SVG;
        return elem;
    }
    // 生成论坛状态(badgeStatus)
    function set_badge_status(data) {
        var elem = document.createElement('div');
        // 备案情况
        if (data['value'] == '已备案 √') {
            elem.innerHTML +=
                '<span class="badge text-bg-success">' + data['value'] + '</span>';
        }
        else {
            elem.innerHTML +=
                '<span class="badge text-bg-danger">' + data['value'] + '</span>';
        }
        // 论坛规模
        elem.innerHTML +=
            '<span class="badge text-bg-primary"><span>' + data['type'] + '</span>' + '</span>';
        elem.getElementsByTagName('span')[1].appendChild(add_bbs_type_info(BBS.BBS_TYPE[data["bbs-type"]]['title'], BBS.BBS_TYPE[data['bbs-type']]['content']));
        return elem;
    }
    // 生成论坛信息(mainInfo)
    function set_main_info(data) {
        var mainInfo = document.createElement('div');
        mainInfo.className = 'mainInfo';
        // 添加论坛图标
        var img = '<img src="' + data['icon'] + '" alt="" srcset="">';
        mainInfo.innerHTML += img;
        // 添加论坛名称和网址
        var mainText_elem = document.createElement('div');
        mainText_elem.className = 'mainText';
        mainText_elem.innerHTML += '<p>' + data['name'] + '</p>'; // 名称
        mainText_elem.innerHTML += '<small class="text-body-secondary">' + data['url'] + '</small>'; // 网址
        mainInfo.appendChild(mainText_elem);
        return mainInfo;
    }
    // 生成论坛链接(btn-group)
    function set_btn_group(data) {
        // 复制链接按钮
        var bottom1 = document.createElement('button');
        bottom1.type = 'button';
        bottom1.className = 'btn btn-secondary';
        bottom1.onclick = (ev) => {
            navigator.clipboard.writeText(data['url'])
                .then(() => {
                console.log("粘贴文本成功");
            }, () => {
                console.log("clipboard write failed");
            });
        };
        bottom1.innerHTML +=
            '<a class="icon-link icon-link-hover">复制网址' + COPY_LINK_SVG + '</a>';
        // 访问按钮
        var bottom2 = document.createElement('button');
        bottom2.type = 'button';
        bottom2.className = 'btn btn-secondary';
        bottom2.onclick = (ev) => {
            window.open(data['url'], '_self');
        };
        bottom2.innerHTML +=
            '<a href="' + data['url'] + '" class="icon-link icon-link-hover">访问' + VISIT_SITE_SVG + '</a>';
        return [bottom1, bottom2];
    }
    function create_bbs_container(data) {
        // HTML框架
        // 每个论坛的外围框架
        var bbsContainer = document.createElement('div');
        bbsContainer.className = 'bbsContainer';
        bbsContainer.innerHTML += '<div class="innerBbs"></div>';
        // 每个论坛的介绍
        var infoCollection = document.createElement('div');
        infoCollection.className = 'infoCollection';
        infoCollection.innerHTML +=
            '<div class="badgeStatus"></div>';
        // 每个论坛的链接
        var btn_group = document.createElement('div');
        btn_group.className = 'btn-group';
        //btn_group.role = 'group';
        btn_group.setAttribute('role', 'group');
        btn_group.ariaLabel = 'Basic example';
        infoCollection.getElementsByClassName('badgeStatus')[0].appendChild(set_badge_status(data));
        infoCollection.append(set_main_info(data));
        var botton_group = set_btn_group(data);
        btn_group.append(botton_group[0], botton_group[1]);
        bbsContainer.getElementsByClassName('innerBbs')[0].append(infoCollection, btn_group);
        return bbsContainer;
    }
    BBS.create_bbs_container = create_bbs_container;
})(BBS || (BBS = {}));
