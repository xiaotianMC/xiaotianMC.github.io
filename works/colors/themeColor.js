/* =====================================================
 * 萤火盛夏 · 常用颜色页逻辑
 * 原生 JavaScript 实现（无框架依赖）
 * 功能：渲染色板 / 名称与色号搜索 / 点击复制 / 提示反馈
 * ===================================================== */
(function () {
    'use strict';

    var paletteEl = document.getElementById('palette');
    var searchInput = document.getElementById('search-input');
    var searchClear = document.getElementById('search-clear');
    var countEl = document.getElementById('color-count');
    var emptyEl = document.getElementById('empty-state');
    var emptyReset = document.getElementById('empty-reset');
    var toastEl = document.getElementById('toast');

    var colors = [];
    var toastTimer = null;

    /* ---------------- 工具函数 ---------------- */

    // '#RGB' / '#RGBA' / '#RRGGBB' / '#RRGGBBAA' → [r, g, b]（忽略透明度）
    function hexToRgb(hex) {
        if (typeof hex !== 'string' || hex.charAt(0) !== '#') return null;
        var s = hex.slice(1);
        if (!/^[0-9a-fA-F]+$/.test(s)) return null;
        if (s.length === 3 || s.length === 4) {
            s = s.split('').map(function (c) { return c + c; }).join('');
        }
        if (s.length !== 6 && s.length !== 8) return null;
        return [
            parseInt(s.slice(0, 2), 16),
            parseInt(s.slice(2, 4), 16),
            parseInt(s.slice(4, 6), 16)
        ];
    }

    // 加权 RGB 距离（更接近人眼感知）
    function colorDistance(a, b) {
        var rMean = (a[0] + b[0]) / 2;
        var dr = a[0] - b[0];
        var dg = a[1] - b[1];
        var db = a[2] - b[2];
        return Math.sqrt(
            (2 + rMean / 256) * dr * dr +
            4 * dg * dg +
            (2 + (255 - rMean) / 256) * db * db
        );
    }

    function escapeHtml(str) {
        return String(str).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    /* ---------------- 渲染 ---------------- */

    function cardHTML(color, isBestMatch, delayMs) {
        var style = '--swatch:' + color.value;
        if (delayMs) style += ';animation-delay:' + delayMs + 'ms';
        return (
            '<button type="button" class="color-card' + (isBestMatch ? ' is-best' : '') + '"' +
            ' style="' + style + '"' +
            ' data-value="' + color.value + '"' +
            ' aria-label="复制色号 ' + color.value + '（' + color.name + '）">' +
            '<span class="swatch" aria-hidden="true">' +
            (isBestMatch ? '<span class="best-tag">最接近</span>' : '') +
            '</span>' +
            '<span class="card-body">' +
            '<span class="card-name">' + escapeHtml(color.name) + '</span>' +
            '<span class="card-value">' + escapeHtml(color.value) + '</span>' +
            '</span>' +
            '</button>'
        );
    }

    function render(list, bestIndex, animate) {
        paletteEl.innerHTML = list.map(function (c, i) {
            return cardHTML(c, i === bestIndex, animate ? i * 25 : 0);
        }).join('');

        var cards = paletteEl.querySelectorAll('.color-card');
        Array.prototype.forEach.call(cards, function (card) {
            card.addEventListener('click', function () {
                copyText(card.getAttribute('data-value'), card);
            });
        });

        if (countEl) countEl.textContent = String(list.length);
        if (emptyEl) emptyEl.classList.toggle('hidden', list.length > 0);
    }

    /* ---------------- 复制 ---------------- */

    function copyText(text, card) {
        var succeed = function () {
            showToast('已复制 ' + text);
            if (card) {
                card.classList.add('copied');
                setTimeout(function () { card.classList.remove('copied'); }, 1200);
            }
        };
        var fail = function () {
            showToast('复制失败，请手动选择复制', true);
        };

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(succeed, fail);
        } else {
            // 兼容非安全上下文（如 http / 局域网访问）
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
            document.body.appendChild(ta);
            ta.select();
            var ok = false;
            try { ok = document.execCommand('copy'); } catch (e) { /* 忽略 */ }
            document.body.removeChild(ta);
            if (ok) succeed(); else fail();
        }
    }

    function showToast(msg, isError) {
        if (!toastEl) return;
        toastEl.textContent = msg;
        toastEl.classList.toggle('toast-error', !!isError);
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 1600);
    }

    /* ---------------- 搜索 ---------------- */

    // 名称匹配打分：返回 -1 表示不匹配，数字越小越靠前
    function nameScore(name, query) {
        if (name === query) return 0;
        if (name.indexOf(query) === 0) return 1;
        var idx = name.indexOf(query);
        if (idx !== -1) return 2 + idx / name.length;
        // 逐字符顺序匹配（模糊搜索）
        var qi = 0;
        var last = -1;
        for (var i = 0; i < name.length && qi < query.length; i++) {
            if (name.charAt(i) === query.charAt(qi)) { last = i; qi++; }
        }
        if (qi === query.length) return 10 + last / name.length;
        return -1;
    }

    function findNearest(rgb) {
        var bestIndex = -1;
        var bestDist = Infinity;
        colors.forEach(function (c, i) {
            var d = colorDistance(rgb, hexToRgb(c.value));
            if (d < bestDist) { bestDist = d; bestIndex = i; }
        });
        return bestIndex;
    }

    function scrollToCard(index) {
        var card = paletteEl.querySelectorAll('.color-card')[index];
        if (card && card.scrollIntoView) {
            setTimeout(function () {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 60);
        }
    }

    function onSearch() {
        var q = searchInput.value.trim();
        if (searchClear) searchClear.classList.toggle('hidden', q === '');
        if (!q) { render(colors, -1, true); return; }

        // 色号模式：1~6 位或 8 位十六进制（可带 #），7 位不合法
        var digits = q.charAt(0) === '#' ? q.slice(1) : q;
        if (/^(?:[0-9a-fA-F]{1,6}|[0-9a-fA-F]{8})$/.test(digits)) {
            if (digits.length === 6 || digits.length === 8) {
                // 完整色号：匹配最接近的颜色并高亮
                var nearest = findNearest(hexToRgb('#' + digits));
                render(colors, nearest, false);
                scrollToCard(nearest);
            } else {
                // 部分色号（1~5 位）：优先前缀匹配，无命中再按补零近似匹配
                var prefix = digits.toLowerCase();
                var hits = [];
                colors.forEach(function (c, i) {
                    if (c.value.toLowerCase().slice(1).indexOf(prefix) === 0) hits.push(i);
                });
                if (hits.length) {
                    render(hits.map(function (i) { return colors[i]; }), -1, false);
                } else {
                    var padded = '#' + prefix + '0'.repeat(6 - prefix.length);
                    var nearestByPad = findNearest(hexToRgb(padded));
                    render(colors, nearestByPad, false);
                    scrollToCard(nearestByPad);
                }
            }
            return;
        }

        // 名称模式：子串 + 模糊匹配，按相关度排序
        var ql = q.toLowerCase();
        var matched = [];
        colors.forEach(function (c, i) {
            var s = nameScore(c.name.toLowerCase(), ql);
            if (s >= 0) matched.push({ index: i, score: s });
        });
        matched.sort(function (a, b) { return a.score - b.score; });
        render(matched.map(function (m) { return colors[m.index]; }), -1, false);
    }

    /* ---------------- 初始化 ---------------- */

    fetch('themeColor.json')
        .then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
        })
        .then(function (data) {
            colors = Array.isArray(data) ? data : [];
            render(colors, -1, true);
        })
        .catch(function () {
            if (emptyEl) {
                emptyEl.classList.remove('hidden');
                emptyEl.querySelector('p').textContent = '颜色数据加载失败，请刷新页面重试';
            }
            if (countEl) countEl.textContent = '0';
        });

    if (searchInput) {
        searchInput.addEventListener('input', onSearch);
        searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                searchInput.value = '';
                onSearch();
            }
        });
    }
    if (searchClear) {
        searchClear.addEventListener('click', function () {
            searchInput.value = '';
            searchInput.focus();
            onSearch();
        });
    }
    if (emptyReset) {
        emptyReset.addEventListener('click', function () {
            searchInput.value = '';
            searchInput.focus();
            onSearch();
        });
    }
})();
