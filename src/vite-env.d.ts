/// <reference types="vite/client" />

declare module 'page-flip' {
  export class PageFlip {
    constructor(element: HTMLElement, setting: Record<string, any>);
    loadFromHTML(items: NodeListOf<Element> | HTMLElement[]): void;
    turnToPage(pageNum: number): void;
    flipNext(corner?: string): void;
    flipPrev(corner?: string): void;
    getCurrentPageIndex(): number;
    getPageCount(): number;
    on(event: string, callback: (e: any) => void): void;
    off(event: string, callback: (e: any) => void): void;
    destroy(): void;
    update(): void;
  }
}
