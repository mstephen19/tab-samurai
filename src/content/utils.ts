const injectElement = <Tag extends keyof HTMLElementTagNameMap>(
    parent: Element,
    tag: Tag,
    properties: Partial<HTMLElementTagNameMap[Tag]>
) => {
    const element = Object.assign(document.createElement(tag), properties);

    parent.prepend(element);

    return () => element.remove();
};

export const injectScript = (src: string) =>
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
