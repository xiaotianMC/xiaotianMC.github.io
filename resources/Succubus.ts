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

    export function JSON_DeepCopy(obj: Array<any> | string | number) {
        return JSON.parse(JSON.stringify(obj))
    }

    // ありがとう，私の暗い世界の小さな太陽
    // 复制文本到剪贴板
    // 适用于有多个相同用途的复制按钮（所以上面那个函数到底有什么用啊）
    export function ClipboardCopyByClassT(class_id: string, text: Array<string>, success_event_curse: CallableFunction = () => { }, failed_event_curse: CallableFunction = () => { console.log('Clipboard Write Failed.') }) {
        var elements = document.getElementsByClassName(class_id);
        for (var i = 0; i < elements.length; i++) {
            var element = elements.item(i) as HTMLElement;
            element.addEventListener('click', ((): any => {
                let use_text = text[i]; // 捕获当前循环的文本值
                let sc = success_event_curse
                let fc = failed_event_curse
                return () => {
                    navigator.clipboard.writeText(use_text)
                        .then(
                            () => sc(),
                            () => fc()
                        );
                }
            })());
        }
    }

    // Searching
    interface SearchingFormat {
        (text: string, target: string): number
    }
    export function Searching(text: Array<string>, target: string, format: SearchingFormat) {
        var t_text: Array<string> = JSON_DeepCopy(text)
        var t_text_score: Array<number> = new Array(text.length)
        for (var i = 0; i < text.length; i++) {
            t_text_score[i] = format(t_text[i], target)
        }
        // Sorting
        // 之后想到什么算法再写罢...（如果谁会快速排序能否帮忙写一下w)
        // I don't know how to quickly sort.
        // If anyone knows, could you help me write it down? Thank you.
        for (var j = 0; j < text.length - 1; j++) {
            for (var i = 0; i < text.length - j - 1; i++) {
                if (t_text_score[i] > t_text_score[i + 1]) {
                    // Swap scores
                    let sort_t_num = t_text_score[i]
                    t_text_score[i] = t_text_score[i + 1]
                    t_text_score[i + 1] = sort_t_num
                    // Swap Text
                    let sort_t_text = t_text[i]
                    t_text[i] = t_text[i + 1]
                    t_text[i + 1] = sort_t_text
                }
            }
        }
        return [t_text, t_text_score]
    }
    export function BaseTextMatchCurse(text: string, target: string) {
        let reg = RegExp('[' + target + ']+', 'ig')
        let result = text.match(reg)
        if (result == null)
            return -1
        let max_length = 0
        let great_of_middle_length = 0
        let match_num = result.length
        let length_table = result.map(x => x.length)
        for (let i = 0; i < length_table.length; i++) {
            let lobj = length_table[i]
            if (lobj > max_length)
                max_length = lobj
        }
        for (let i = 0; i < length_table.length; i++) {
            let lobj = length_table[i]
            if (lobj > max_length / 2)
                great_of_middle_length += 1
        }
        return (max_length * 0.9 + match_num * 0.7 / text.length + great_of_middle_length * 0.4 / text.length) / 2
    }
}
