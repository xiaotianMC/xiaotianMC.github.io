"use strict";
/*
    Copyright 2024 Qiong-Mengzi.
    This code is under Do What the Fuck You Want to Public License.

    放一下乱七八糟的东西，反正没人看就对了
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Succubus;
(function (Succubus) {
    // 获取JSON数据
    function FetchJSON(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error('[Succubus] FetchJSON: Failed to fetch resource. ' + String(response.status) + ' ' + response.statusText);
            }
            return response.json();
        });
    }
    Succubus.FetchJSON = FetchJSON;
    // 获取文本数据
    function FetchText(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error('[Succubus] FetchJSON: Failed to fetch resource. ' + String(response.status) + ' ' + response.statusText);
            }
            return response.text();
        });
    }
    Succubus.FetchText = FetchText;
    // 复制文本到剪贴板
    function ClipboardCopyById(id, text, success_event_curse = (function () { }), failed_event_curse = (function () { console.log('Clipboard Write Failed.'); })) {
        var element = document.getElementById(id);
        if (element == null) {
            throw new Error('[Succubus] ClipboardCopy: Cannot Find The Element.');
        }
        element.addEventListener('click', (function () {
            navigator.clipboard.writeText(text)
                .then(() => {
                success_event_curse();
            }, () => {
                failed_event_curse();
            });
        }));
    }
    Succubus.ClipboardCopyById = ClipboardCopyById;
    function JSON_DeepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    Succubus.JSON_DeepCopy = JSON_DeepCopy;
    // ありがとう，私の暗い世界の小さな太陽
    // 复制文本到剪贴板
    // 适用于有多个相同用途的复制按钮（所以上面那个函数到底有什么用啊）
    function ClipboardCopyByClassT(class_id, text, success_event_curse = () => { }, failed_event_curse = () => { console.log('Clipboard Write Failed.'); }) {
        var elements = document.getElementsByClassName(class_id);
        for (var i = 0; i < elements.length; i++) {
            var element = elements.item(i);
            element.addEventListener('click', (() => {
                let use_text = text[i]; // 捕获当前循环的文本值
                let sc = success_event_curse;
                let fc = failed_event_curse;
                return () => {
                    navigator.clipboard.writeText(use_text)
                        .then(() => sc(), () => fc());
                };
            })());
        }
    }
    Succubus.ClipboardCopyByClassT = ClipboardCopyByClassT;
    function Searching(text, target, format) {
        var t_text = JSON_DeepCopy(text);
        var t_text_score = new Array(text.length);
        for (var i = 0; i < text.length; i++) {
            t_text_score[i] = format(t_text[i], target);
        }
        // Sorting
        // 之后想到什么算法再写罢...（如果谁会快速排序能否帮忙写一下w)
        // I don't know how to quickly sort.
        // If anyone knows, could you help me write it down? Thank you.
        for (var j = 0; j < text.length - 1; j++) {
            for (var i = 0; i < text.length - j - 1; i++) {
                if (t_text_score[i] > t_text_score[i + 1]) {
                    // Swap scores
                    let sort_t_num = t_text_score[i];
                    t_text_score[i] = t_text_score[i + 1];
                    t_text_score[i + 1] = sort_t_num;
                    // Swap Text
                    let sort_t_text = t_text[i];
                    t_text[i] = t_text[i + 1];
                    t_text[i + 1] = sort_t_text;
                }
            }
        }
        return [t_text, t_text_score];
    }
    Succubus.Searching = Searching;
    function BaseTextMatchCurse(text, target) {
        let reg = RegExp('[' + target + ']+', 'ig');
        let result = text.match(reg);
        if (result == null)
            return -1;
        let max_length = 0;
        let great_of_middle_length = 0;
        let match_num = result.length;
        let length_table = result.map(x => x.length);
        for (let i = 0; i < length_table.length; i++) {
            let lobj = length_table[i];
            if (lobj > max_length)
                max_length = lobj;
        }
        for (let i = 0; i < length_table.length; i++) {
            let lobj = length_table[i];
            if (lobj > max_length / 2)
                great_of_middle_length += 1;
        }
        return (max_length * 0.9 + match_num * 0.7 / text.length + great_of_middle_length * 0.4 / text.length) / 2;
    }
    Succubus.BaseTextMatchCurse = BaseTextMatchCurse;
})(Succubus || (Succubus = {}));
