import media from './media?script&module';

const injectElement = <Tag extends keyof HTMLElementTagNameMap>(
    parent: Element,
    tag: Tag,
    properties: Partial<HTMLElementTagNameMap[Tag]>
) => {
    const element = Object.assign(document.createElement(tag), properties);

    parent.prepend(element);

    return () => element.remove();
};

const injectScript = (src: string) =>
    new Promise((resolve, reject) => {
        const remove = injectElement(document.head, 'script', {
            type: 'module',
            src,
            onload: () => {
                resolve(undefined);
                remove();
            },
            onerror: (event) => {
                reject(event);
                remove();
            },
        });
    });

export const injectScripts = async () => void (await Promise.all([media].map((script) => injectScript(chrome.runtime.getURL(script)))));
