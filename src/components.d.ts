/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface SignitureBuilder {
        "fileUrl": string;
    }
}
export interface SignitureBuilderCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLSignitureBuilderElement;
}
declare global {
    interface HTMLSignitureBuilderElementEventMap {
        "fieldsChanged": Field[];
    }
    interface HTMLSignitureBuilderElement extends Components.SignitureBuilder, HTMLStencilElement {
        addEventListener<K extends keyof HTMLSignitureBuilderElementEventMap>(type: K, listener: (this: HTMLSignitureBuilderElement, ev: SignitureBuilderCustomEvent<HTMLSignitureBuilderElementEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLSignitureBuilderElementEventMap>(type: K, listener: (this: HTMLSignitureBuilderElement, ev: SignitureBuilderCustomEvent<HTMLSignitureBuilderElementEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
    var HTMLSignitureBuilderElement: {
        prototype: HTMLSignitureBuilderElement;
        new (): HTMLSignitureBuilderElement;
    };
    interface HTMLElementTagNameMap {
        "signiture-builder": HTMLSignitureBuilderElement;
    }
}
declare namespace LocalJSX {
    interface SignitureBuilder {
        "fileUrl"?: string;
        "onFieldsChanged"?: (event: SignitureBuilderCustomEvent<Field[]>) => void;
    }
    interface IntrinsicElements {
        "signiture-builder": SignitureBuilder;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "signiture-builder": LocalJSX.SignitureBuilder & JSXBase.HTMLAttributes<HTMLSignitureBuilderElement>;
        }
    }
}
