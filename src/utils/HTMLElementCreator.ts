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
		if ( config.lineHeight ) {
			element.style.lineHeight = config.lineHeight.toString();
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
		if ( config.background ) {
			element.style.background = config.background;
		}
		if ( config.textAlign ) {
			element.style.textAlign = config.textAlign;
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

export enum HTMLElementType {
	DIV = 'div',
	BUTTON = 'button',
	LABEL = 'label',
	INPUT = 'input',
	BR = 'br',
	HR = 'hr',
	P = 'p',
	H1 = 'h1',
	H2 = 'h2',
	H3 = 'h3',
	H4 = 'h4',
	H5 = 'h5'
}

export interface IStyle {
	id?: string;
	margin?: string;
	padding?: string;
	position?: string;
	overflow?: string;
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	fontSize?: number;
	fontWeight?: string;
	lineHeight?: number;
	color?: string;
	background?: string;
	textAlign?: string;
	textContent?: string;
	display?: string;
	value?: string;
	cursor?: string;
	border?: string;
	boxShadow?: string;

	/** label */
	htmlFor?: string;

	/** input */
	type?: string;
	accept?: string;
}