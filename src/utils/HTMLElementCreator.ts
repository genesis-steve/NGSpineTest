import { IStyle } from "src/config/SpineConfig";
import { HTMLElementType } from "src/main";

export class HTMLElementCreator {

	public static createHTMLElement<T extends HTMLElement> ( type: string, config?: IStyle ): T {
		const element: T = <T> document.createElement( type );
		if ( !config ) {
			return element;
		}
		if ( config.id ) {
			element.id = config.id;
		}
		if ( config.textContent ) {
			element.textContent = config.textContent;
		}
		if ( config.position ) {
			element.style.position = config.position;
		}
		if ( config.overflow ) {
			element.style.overflow = config.overflow;
		}
		if ( config.x ) {
			element.style.left = config.x.toString();
		}
		if ( config.y ) {
			element.style.top = config.y.toString();
		}
		if ( config.width ) {
			element.style.width = config.width.toString();
		}
		if ( config.height ) {
			element.style.height = config.height.toString();
		}
		if ( config.fontSize ) {
			element.style.fontSize = config.fontSize.toString();
		}
		if ( config.fontWeight ) {
			element.style.fontWeight = config.fontWeight;
		}
		if ( config.margin ) {
			element.style.margin = config.margin;
		}
		if ( config.padding ) {
			element.style.padding = config.padding;
		}
		if ( config.border ) {
			element.style.border = config.border;
		}
		if ( config.color ) {
			element.style.color = config.color;
		}
		if ( config.backgroundColor ) {
			element.style.backgroundColor = config.backgroundColor;
		}
		if ( config.display ) {
			( element as HTMLElement as HTMLInputElement ).style.display = config.display;
		}
		if ( config.cursor ) {
			element.style.cursor = config.cursor;
		}
		if ( config.boxShadow ) {
			element.style.boxShadow = config.boxShadow;
		}
		if ( type == HTMLElementType.INPUT || type == HTMLElementType.BUTTON ) {
			if ( config.value ) {
				( element as any ).value = config.value;
			}
		}
		if ( type == HTMLElementType.LABEL ) {
			if ( config.htmlFor ) {
				( element as HTMLElement as HTMLLabelElement ).htmlFor = config.htmlFor;
			}
		}
		if ( type == HTMLElementType.INPUT ) {
			if ( config.type ) {
				( element as HTMLElement as HTMLInputElement ).type = config.type;
			}
			if ( config.accept ) {
				( element as HTMLElement as HTMLInputElement ).accept = config.accept;
			}
		}
		return element;
	}
}