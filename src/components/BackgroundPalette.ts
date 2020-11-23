import * as MiniSignal from 'mini-signals';
import { IBackgroundPalette } from 'src/config/SpineConfig';
import { HTMLElementCreator, HTMLElementType } from 'src/utils/HTMLElementCreator';


export class BackgroundPalette {
	public static onPixiColorUpdateSignal: MiniSignal = new MiniSignal();

	public static init ( config: IBackgroundPalette ): HTMLDivElement {
		const palette: HTMLDivElement = HTMLElementCreator.createHTMLElement(
			HTMLElementType.DIV, config.container
		);
		config.colorList.forEach( color => {
			const paletteButton: HTMLButtonElement = HTMLElementCreator.createHTMLElement(
				HTMLElementType.BUTTON, {
				...config.button,
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