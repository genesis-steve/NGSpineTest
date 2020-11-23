import * as MiniSignal from 'mini-signals';
import { IStyle } from 'src/config/SpineConfig';
import { HTMLElementType } from 'src/main';
import { HTMLElementCreator } from 'src/utils/HTMLElementCreator';


export class BackgroundPalette {
	public static onPixiColorUpdateSignal: MiniSignal = new MiniSignal();

	public static init ( config: IStyle, buttonConfig: IStyle, colorList: string[] ): HTMLDivElement {
		const palette: HTMLDivElement = HTMLElementCreator.createHTMLElement(
			HTMLElementType.DIV, config
		);
		colorList.forEach( color => {
			const paletteButton: HTMLButtonElement = HTMLElementCreator.createHTMLElement(
				HTMLElementType.BUTTON, {
				...buttonConfig,
				backgroundColor: color
			} );
			paletteButton.onclick = () => {
				this.onPixiColorUpdateSignal.dispatch( +color.replace( '#', '0x' ) );
			};
			palette.appendChild( paletteButton );
		} );
		return palette;
	}
}