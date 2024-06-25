import { authorInfo, celebrations, sponsors, env } from "../config.js";
import emoji from "../emoji.js";
import { loadFile } from "../sub/loadFromFs.js";

export const backButtonSVG = `<svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.1905 28.5L2 16L14.1905 3.5L16.2857 5.62054L7.65986 14.4654H30V17.5346H7.65986L16.2857 26.3516L14.1905 28.5Z" fill="#E1E1E1"/>
</svg>`

export const dropdownSVG = `<svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M28 12.0533L16 24L4 12.0533L6.03571 10L14.7188 18.4104L16.25 19.9348L17.7813 18.4104L25.9375 10L28 12.0533Z" fill="#E1E1E1"/>
</svg>`

export const linkSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="currentColor" d="M137.54 186.36a8 8 0 0 1 0 11.31l-9.94 10a56 56 0 0 1-79.22-79.27l24.12-24.12a56 56 0 0 1 76.81-2.28a8 8 0 1 1-10.64 12a40 40 0 0 0-54.85 1.63L59.7 139.72a40 40 0 0 0 56.58 56.58l9.94-9.94a8 8 0 0 1 11.32 0Zm70.08-138a56.08 56.08 0 0 0-79.22 0l-9.94 9.95a8 8 0 0 0 11.32 11.31l9.94-9.94a40 40 0 0 1 56.58 56.58l-24.12 24.14a40 40 0 0 1-54.85 1.6a8 8 0 1 0-10.64 12a56 56 0 0 0 76.81-2.26l24.12-24.12a56.08 56.08 0 0 0 0-79.24Z"/></svg>';
export const instaSVG = '<svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100px" height="100px" viewBox="0 0 169.063 169.063" xml:space="preserve"><g><path d="M122.406,0H46.654C20.929,0,0,20.93,0,46.655v75.752c0,25.726,20.929,46.655,46.654,46.655h75.752c25.727,0,46.656-20.93,46.656-46.655V46.655C169.063,20.93,148.133,0,122.406,0z M154.063,122.407c0,17.455-14.201,31.655-31.656,31.655H46.654C29.2,154.063,15,139.862,15,122.407V46.655C15,29.201,29.2,15,46.654,15h75.752c17.455,0,31.656,14.201,31.656,31.655V122.407z"/><path d="M84.531,40.97c-24.021,0-43.563,19.542-43.563,43.563c0,24.02,19.542,43.561,43.563,43.561s43.563-19.541,43.563-43.561C128.094,60.512,108.552,40.97,84.531,40.97z M84.531,113.093c-15.749,0-28.563-12.812-28.563-28.561c0-15.75,12.813-28.563,28.563-28.563s28.563,12.813,28.563,28.563C113.094,100.281,100.28,113.093,84.531,113.093z"/><path d="M129.921,28.251c-2.89,0-5.729,1.17-7.77,3.22c-2.051,2.04-3.23,4.88-3.23,7.78c0,2.891,1.18,5.73,3.23,7.78c2.04,2.04,4.88,3.22,7.77,3.22c2.9,0,5.73-1.18,7.78-3.22c2.05-2.05,3.22-4.89,3.22-7.78c0-2.9-1.17-5.74-3.22-7.78C135.661,29.421,132.821,28.251,129.921,28.251z"/></g></svg>';

export function switcher(obj) {
    let items = ``;
    if (obj.name === "download") {
        items = obj.items;
    } else {
        for (let i = 0; i < obj.items.length; i++) {
            let classes = obj.items[i]["classes"] ? obj.items[i]["classes"] : [];
            items += `<button id="${obj.name}-${obj.items[i]["action"]}" class="switch${classes.length > 0 ? ' ' + classes.join(' ') : ''}" onclick="changeSwitcher('${obj.name}', '${obj.items[i]["action"]}')">${obj.items[i]["text"] ? obj.items[i]["text"] : obj.items[i]["action"]}</button>`
        }
    }

    if (obj.noParent) return `<div id="${obj.name}" class="switches">${items}</div>`;
    return `<div id="${obj.name}-switcher" class="switch-container">
            ${obj.subtitle ? `<div class="subtitle">${obj.subtitle}</div>` : ``}
            <div class="switches">${items}</div>
            ${obj.explanation ? `<div class="explanation">${obj.explanation}</div>` : ``}
        </div>`
}
export function checkbox(obj) {
    let paddings = ["bottom-margin", "top-margin", "no-margin", "top-margin-only"];
    let checkboxes = ``;
    for (let i = 0; i < obj.length; i++) {
        let paddingClass = obj[i].padding && paddings.includes(obj[i].padding) ? ` ${obj[i].padding}` : '';

        checkboxes += `<label id="${obj[i].action}-chkbx" class="checkbox${paddingClass}">
            <input id="${obj[i].action}" type="checkbox" aria-label="${obj[i].aria ? obj[i].aria : obj[i].name}" onclick="checkbox('${obj[i].action}')">
            <span>${obj[i].name}</span>
        </label>`
    }
    return checkboxes
}
export function sep(paddingType) {
    let paddingClass = ``
    switch(paddingType) {
        case 0: 
            paddingClass += ` top-margin`;
            break;
    }
    return `<div class="separator${paddingClass}"></div>`
}
export function popup(obj) {
    let classes = obj.classes ? obj.classes : [];
    let body = obj.body;
    if (Array.isArray(obj.body)) {
        body = ``
        for (let i = 0; i < obj.body.length; i++) {
            if (obj.body[i]["text"].length > 0) {
                classes = obj.body[i]["classes"] ?? []
                if (i !== obj.body.length - 1 && !obj.body[i]["nopadding"]) {
                    classes.push("desc-padding")
                }
                body += obj.body[i]["raw"] ? obj.body[i]["text"] : `<div class="${['popup-desc', ...classes].join(' ')}">${obj.body[i]["text"]}</div>`
            }
        }
    }
    return `
    ${obj.standalone ? `<div id="popup-${obj.name}" class="popup center${!obj.buttonOnly ? " box" : ''}${classes.length > 0 ? ' ' + classes.join(' ') : ''}">` : ''}
        ${obj.buttonOnly ? obj.header.emoji : ``}
        ${obj.name === "error" ? `` :
            `<div class="popup-header">
                <div class="popup-header-contents">
                    ${obj.header.aboveTitle ? `<a class="popup-above-title" target="_blank" href="${obj.header.aboveTitle.url}">${obj.header.aboveTitle.text}</a>` : ''}
                    ${obj.header.title ? `<div class="popup-title">${obj.header.title}</div>` : ''}
                    ${obj.header.subtitle ? `<div id="popup-subtitle">${obj.header.subtitle}</div>` : ''}
                </div>
                ${!obj.buttonOnly ? `<div class="glass-bkg alone"></div>` : ''}
            </div>`
        }
        <div class="popup-content popup-content-inner">
            ${body}${obj.buttonOnly ? `<button class="close-error switch" onclick="popup('${obj.name}', 0)">${obj.buttonText}</button>` : ''}
        </div>
        ${classes.includes("small") ? `<div class="glass-bkg small"></div>` : ''}
    ${obj.standalone ? `</div>` : ''}`
}

export function multiPagePopup(obj) {
    let tabs = `
    <button class="back-button switch tab-${obj.name}" onclick="popup('${obj.name}', 0)" ${obj.closeAria ? `aria-label="${obj.closeAria}"` : ''}>
        ${backButtonSVG}
    </button>`;

    let tabContent = ``;
    for (let i = 0; i < obj.tabs.length; i++) {
        tabs += `<button id="tab-button-${obj.name}-${obj.tabs[i]["name"]}" class="switch tab tab-${obj.name}" onclick="changeTab(event, 'tab-${obj.name}-${obj.tabs[i]["name"]}', '${obj.name}')">${obj.tabs[i]["title"]}</button>`
        tabContent += `<div id="tab-${obj.name}-${obj.tabs[i]["name"]}" class="popup-tab-content tab-content-${obj.name}">${obj.tabs[i]["content"]}</div>`
    }

    return `
    <div id="popup-${obj.name}" class="popup center box scrollable">
        <div class="popup-content">
        ${obj.header ? `<div class="popup-header">
            <div class="popup-header-contents">
                ${obj.header.aboveTitle ? `<a class="popup-above-title" target="_blank" href="${obj.header.aboveTitle.url}">${obj.header.aboveTitle.text}</a>` : ''}
                ${obj.header.title ? `<div class="popup-title">${obj.header.title}</div>` : ''}
                ${obj.header.subtitle ? `<div id="popup-subtitle">${obj.header.subtitle}</div>` : ''}
            </div>
            <div class="glass-bkg alone"></div>
        </div>` : ''}${tabContent}</div>
        <div class="switches popup-tabs">
            <div class="switches popup-tabs-child">${tabs}</div>
            <div class="glass-bkg alone"></div>
        </div>
    </div>`
}
export function collapsibleList(arr) {
    let items = ``;

    for (let i = 0; i < arr.length; i++) {
        let classes = arr[i]["classes"] ? arr[i]["classes"] : [];
        items += `<div id="${arr[i]["name"]}-collapse" class="collapse-list${classes.length > 0 ? ' ' + classes.join(' ') : ''}">
            <div class="collapse-header" onclick="expandCollapsible(event)">
                <div class="collapse-title">${arr[i]["title"]}</div>
                <div class="collapse-indicator">${dropdownSVG}</div>
            </div>
            <div id="${arr[i]["name"]}-body" class="collapse-body">${arr[i]["body"]}</div>
        </div>`
    }
    return items;
}
export function popupWithBottomButtons(obj) {
    let tabs = `
    <button class="back-button switch tab-${obj.name}" onclick="popup('${obj.name}', 0)" ${obj.closeAria ? `aria-label="${obj.closeAria}"` : ''}>
        ${backButtonSVG}
    </button>`

    for (let i = 0; i < obj.buttons.length; i++) {
        tabs += obj.buttons[i]
    }
    return `
    <div id="popup-${obj.name}" class="popup center box scrollable">
        <div class="popup-content">
       ${obj.header ? `<div class="popup-header">
            <div class="popup-header-contents">
                ${obj.header.aboveTitle ? `<a class="popup-above-title" target="_blank" href="${obj.header.aboveTitle.url}">${obj.header.aboveTitle.text}</a>` : ''}
                ${obj.header.title ? `<div class="popup-title">${obj.header.title}</div>` : ''}
                ${obj.header.subtitle ? `<div id="popup-subtitle">${obj.header.subtitle}</div>` : ''}
                ${obj.header.explanation ? `<div class="explanation">${obj.header.explanation}</div>` : ''}
            </div>
            <div class="glass-bkg alone"></div>
        </div>` : ''}${obj.content}</div>
        <div class="switches popup-tabs">
            <div id="picker-buttons" class="switches popup-tabs-child">${tabs}</div>
            <div class="glass-bkg alone"></div>
        </div>
    </div>`
}
export function socialLink(emji, name, url) {
    return `<div class="cobalt-support-link">${emji} <a class="text-backdrop link" href="${url}" target="_blank">${name}</a></div>`
}
export function socialLinks(lang) {
    let links = authorInfo.support[lang] ? authorInfo.support[lang] : authorInfo.support.default;
    let r = ``;
    for (let i in links) {
        r += socialLink(
            emoji(links[i].emoji), links[i].name, links[i].url
        )
    }
    return r
}
export function settingsCategory(obj) {
    return `<div id="settings-${obj.name}" class="settings-category">
        <div class="category-title">${obj.title ?? obj.name}</div>
        <div class="category-content">${obj.body}</div>
    </div>`
}

export function footerButtons(obj) {
    let items = ``
    for (let i = 0; i < obj.length; i++) {
        let buttonName = obj[i]["context"] ? `${obj[i]["name"]}-${obj[i]["context"]}` : obj[i]["name"],
            context = obj[i]["context"] ? `, '${obj[i]["context"]}'` : '',
            buttonName2,
            context2;

        if (obj[i + 1]) {
            buttonName2 = obj[i + 1]["context"] ? `${obj[i + 1]["name"]}-${obj[i + 1]["context"]}` : obj[i + 1]["name"];
            context2 = obj[i + 1]["context"] ? `, '${obj[i + 1]["context"]}'` : '';
        }

        items +=
        `<div class="footer-pair">
            <button id="${buttonName}-footer" class="switch footer-button" onclick="popup('${obj[i]["name"]}', 1${context})" aria-label="${obj[i]["aria"]}">${obj[i]["text"]}</button>
            ${obj[i + 1] ? `<button id="${buttonName2}-footer" class="switch footer-button" onclick="popup('${obj[i + 1]["name"]}', 1${context2})" aria-label="${obj[i + 1]["aria"]}">${obj[i + 1]["text"]}</button>` : ''}
        </div>`;
        i++;
    }
    return `
    <div id="footer-buttons">${items}</div>`
}
export function explanation(text) {
    return `<div class="explanation">${text}</div>`
}
export function celebrationsEmoji() {
    try {
        let n = new Date().toISOString().split('T')[0].split('-');
        let dm = `${n[1]}-${n[2]}`;
        let f = Object.keys(celebrations).includes(dm) ? celebrations[dm] : "🐲";
        return f != "🐲" ? emoji(f, 22) : false;
    } catch (e) {
        return false
    }
}
export function urgentNotice(obj) {
    if (obj.visible) {
        return `<div id="urgent-notice" class="urgent-notice explanation">` +
            `<span id="urgent-notice-child" class="urgent-text" onclick="${obj.action}">${obj.text}</span>` +
        `</div>`
    }
    return ``
}
export function keyboardShortcuts(arr) {
    let base = `<div id="keyboard-shortcuts" class="explanation">`;

    for (let i = 0; i < arr.length; i++) {
        base += `<div class="shortcut-category">`;
        for (let c = 0; c < arr[i].items.length; c++) {
            let combo = arr[i].items[c].combo.split('+').map(
                key => `<span class="text-backdrop key">${key}</span>`
            ).join("+")
            base += `<div class="shortcut">${combo}: ${arr[i].items[c].name}</div>`
        }
        base += `</div>`
    }
    base += `</div>`;

    return base;
}
export function webLoc(t, arr) {
    let base = ``;
    for (let i = 0; i < arr.length; i++) {
        base += `${arr[i]}:` + "`" + t(arr[i]) + "`" + `,`
    }
    return `{${base}};`
}

export function sponsoredList() {
    let base = ``;
    let altText = ``
    for (let i = 0; i < sponsors.length; i++) {
        let s = sponsors[i];
        let loadedLogo = loadFile(`./src/front/sponsors/${s.name}.svg`);

        altText += `${s.fullName ? s.fullName : s.name}, `;
        base +=
        `<a class="sponsored-logo ${s.name}" 
            href="${s.url}" target="_blank" 
            style="width: calc(${s.logo.width}px / ${s.logo.scale}); height: calc(${s.logo.height}px / ${s.logo.scale});">
            ${loadedLogo}
        </a>`
    }
    return `<div id="sponsored-logos" aria-label="${altText.slice(0, -2)}">${base}</div>`
}

export function betaTag() {
    return env.isBeta ? '<span class="logo-sub">β</span>' : ''
}
