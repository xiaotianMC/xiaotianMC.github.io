/*
    Copyright 2024 Qiong-Mengzi.
    This code is under Do What the Fuck You Want to Public License.

    放一下乱七八糟的东西，反正没人看就对了
*/

namespace Succubus {
    // 获取JSON数据
    export async function FetchJSON(url: string) {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error('[Succubus] FetchJSON: Failed to fetch resource. ' + String(response.status) + ' ' + response.statusText)
        }
        return response.json()
    }

    // 获取文本数据
    export async function FetchText(url: string) {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error('[Succubus] FetchJSON: Failed to fetch resource. ' + String(response.status) + ' ' + response.statusText)
        }
        return response.text()
    }

    // 复制文本到剪贴板
    export function ClipboardCopyById(id: string, text: string, success_event_curse: CallableFunction = (function () { }), failed_event_curse: CallableFunction = (function () { console.log('Clipboard Write Failed.') })) {
        var element = document.getElementById(id);
        if (element == null) {
            throw new Error('[Succubus] ClipboardCopy: Cannot Find The Element.')
        }
        element.addEventListener('click', (function () {
            navigator.clipboard.writeText(text)
                .then(
                    () => {
                        success_event_curse()
                    },
                    () => {
                        failed_event_curse()
                    }
                )
        }))
    }

    // ありがとう，私の暗い世界の小さな太陽
    // 复制文本到剪贴板
    // 适用于有多个相同用途的复制按钮（所以上面那个函数到底有什么用啊）
    // 当text中待复制文本小于获取到的元素数量时，其余元素将使用最后一个文本
    export function ClipboardCopyByClass(class_id: string, text: Array<string>, success_event_curse: CallableFunction = (function () { }), failed_event_curse: CallableFunction = (function () { console.log('Clipboard Write Failed.') })) {
        var elements = document.getElementsByClassName(class_id)
        for (var i = 0; i < elements.length; i++) {
            // 油猫饼，这么写好难看的欸...
            var element = elements.item(i) as HTMLElement
            var use_text = ''
            if(i >= text.length){
                use_text = text[text.length - 1]
            }else{
                use_text = text[i]
            }
            element.addEventListener('click', (function () {
                navigator.clipboard.writeText(use_text)
                    .then(
                        () => {
                            success_event_curse()
                        },
                        () => {
                            failed_event_curse()
                        }
                    )
            }))
        }
    }

}
