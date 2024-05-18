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
    // ありがとう，私の暗い世界の小さな太陽
    // 复制文本到剪贴板
    // 适用于有多个相同用途的复制按钮（所以上面那个函数到底有什么用啊）
    // 当text中待复制文本小于获取到的元素数量时，其余元素将使用最后一个文本
    function ClipboardCopyByClass(class_id, text, success_event_curse = (function () { }), failed_event_curse = (function () { console.log('Clipboard Write Failed.'); })) {
        var elements = document.getElementsByClassName(class_id);
        for (var i = 0; i < elements.length; i++) {
            // 油猫饼，这么写好难看的欸...
            var element = elements.item(i);
            var use_text = '';
            if (i >= text.length) {
                use_text = text[text.length - 1];
            }
            else {
                use_text = text[i];
            }
            element.addEventListener('click', (function () {
                navigator.clipboard.writeText(use_text)
                    .then(() => {
                    success_event_curse();
                }, () => {
                    failed_event_curse();
                });
            }));
        }
    }
    Succubus.ClipboardCopyByClass = ClipboardCopyByClass;
})(Succubus || (Succubus = {}));
