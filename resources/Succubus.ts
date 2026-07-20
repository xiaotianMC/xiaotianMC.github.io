/*
    Copyright 2024-2026 Qiong-Mengzi.
    This code is under Do What the Fuck You Want to Public License.

    放一下乱七八糟的东西，反正没人看就对了
*/

namespace Succubus {
    // 获取JSON数据
    export async function FetchJSON(url: string): Promise<any> {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error('[Succubus] FetchJSON: Failed to fetch resource. ' + String(response.status) + ' ' + response.statusText)
        }
        return response.json()
    }

    // 获取文本数据
    export async function FetchText(url: string): Promise<string> {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error('[Succubus] FetchJSON: Failed to fetch resource. ' + String(response.status) + ' ' + response.statusText)
        }
        return response.text()
    }

    // 复制文本到剪贴板
    export function ClipboardCopyById(
        id: string,
        text: string,
        success_event_curse: CallableFunction = (function (): void { }),
        failed_event_curse: CallableFunction = (function (): void { console.log('Clipboard Write Failed.') })
    ): void {
        var element: HTMLElement | null = document.getElementById(id);
        if (element == null) {
            throw new Error('[Succubus] ClipboardCopy: Cannot Find The Element.')
        }
        element.addEventListener('click', (function (): void {
            navigator.clipboard.writeText(text)
                .then(
                    (): void => {
                        success_event_curse()
                    },
                    (): void => {
                        failed_event_curse()
                    }
                )
        }))
    }

    export function JSON_DeepCopy(obj: Array<any> | string | number): any {
        return JSON.parse(JSON.stringify(obj))
    }

    // ありがとう，私の暗い世界の小さな太陽
    // 复制文本到剪贴板
    // 适用于有多个相同用途的复制按钮（所以上面那个函数到底有什么用啊）
    export function ClipboardCopyByClassT(
        class_id: string,
        text: Array<string>,
        success_event_curse: CallableFunction = (): void => { },
        failed_event_curse: CallableFunction = (): void => { console.log('Clipboard Write Failed.') }
    ): void {
        var elements: HTMLCollectionOf<Element> = document.getElementsByClassName(class_id);
        for (var i: number = 0; i < elements.length; i++) {
            var element: HTMLElement = elements.item(i) as HTMLElement;
            element.addEventListener('click', ((): any => {
                let use_text: string = text[i]; // 捕获当前循环的文本值
                let sc: CallableFunction = success_event_curse
                let fc: CallableFunction = failed_event_curse
                return (): void => {
                    navigator.clipboard.writeText(use_text)
                        .then(
                            (): any => sc(),
                            (): any => fc()
                        );
                }
            })());
        }
    }

    // Searching
    interface SearchingFormat {
        (text: string, target: string): number
    }
    export function Searching(text: Array<string>, target: string, format: SearchingFormat): number[][] {
        const t_text: Array<string> = JSON_DeepCopy(text)
        const t_text_score: Array<number> = new Array(text.length)
        const t_IndexTable: Array<number> = new Array(text.length)
        for (var i: number = 0; i < text.length; i++) {
            t_text_score[i] = format(t_text[i], target)
            t_IndexTable[i] = i
        }
        // Sorting
        // 创建索引
        const indices: number[] = Array.from({ length: t_text_score.length }, (_, i) => i)
        // 根据t_text_score排序索引
        indices.sort((a, b) => t_text_score[a] - t_text_score[b])
        // 用排序好的索引排序t_text_score和t_IndexTable
        const sorted_t_IndexTable: number[] = indices.map(i => t_IndexTable[i])
        const sorted_t_text_score: number[] = indices.map(i => t_text_score[i])
        return [sorted_t_IndexTable, sorted_t_text_score]
    }

    /**
     * TODO: 写文档说明这一大堆是什么东西
     * @param text 
     * @param target 
     * @returns 
     */
    export function BaseTextMatchCurse(text: string, target: string): number {
        let reg: RegExp = RegExp('[' + target + ']+', 'ig')
        let result: RegExpMatchArray | null = text.match(reg)
        if (result == null)
            return -1
        let max_length: number = 0
        let great_of_middle_length: number = 0
        let match_num: number = result.length
        let length_table: number[] = result.map(x => x.length)
        for (let i: number = 0; i < length_table.length; i++) {
            let lobj: number = length_table[i]
            if (lobj > max_length)
                max_length = lobj
        }
        for (let i: number = 0; i < length_table.length; i++) {
            let lobj: number = length_table[i]
            if (lobj > max_length / 2)
                great_of_middle_length += 1
        }
        return (max_length * 0.9 + match_num * 0.7 / text.length + great_of_middle_length * 0.4 / text.length) / 2
    }

    export function IndexMap(obj: any[], index: number[]): any[] {
        return index.map(x => obj[x])
    }
}
