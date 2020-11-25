import * as MiniSignal from 'mini-signals';
import { spine } from 'pixi.js';
import { IBackgroundPalette, IPoint } from 'src/config/SpineConfig';
import { HTMLElementCreator, HTMLElementType } from 'src/utils/HTMLElementCreator';


export class SpineSettingsPanel {

	protected static originScale: IPoint = { x: 1, y: 1 };
	protected static scale: number = 1;
	public static onPixiColorUpdateSignal: MiniSignal = new MiniSignal();

	public static init ( config: IBackgroundPalette, animation: spine.Spine ): HTMLDivElement {
		const container: HTMLDivElement = HTMLElementCreator.createHTMLElement(
			HTMLElementType.DIV, config.container
		);
		config.colorList.forEach( color => {
			const paletteButton: HTMLButtonElement = HTMLElementCreator.createHTMLElement(
				HTMLElementType.BUTTON, {
				...config.button,
				background: color
			} );
			paletteButton.onclick = () => {
				this.onPixiColorUpdateSignal.dispatch( +color.replace( '#', '0x' ) );
			};
			container.appendChild( paletteButton );
		} );
		///////////////////////



		this.originScale = { x: animation.scale.x, y: animation.scale.y };

		const scaleSettings: HTMLDivElement = HTMLElementCreator.createHTMLElement<HTMLDivElement>(
			HTMLElementType.DIV, config.scaleSettings.container
		);
		container.appendChild( scaleSettings );

		const scaleDownButton: HTMLButtonElement = HTMLElementCreator.createHTMLElement<HTMLButtonElement>( HTMLElementType.BUTTON, config.scaleSettings.scaleDownButton );
		scaleDownButton.onclick = () => {
			if ( this.scale - 0.1 < 0.1 ) {
				return;
			}
			this.scale = Math.round( this.scale * 10 - 1 ) / 10;
			animation.scale.x = this.originScale.x * this.scale;
			animation.scale.y = this.originScale.y * this.scale;
			scaleAmountText.textContent = 'x ' + this.scale.toString();
		};
		scaleSettings.appendChild( scaleDownButton );

		const scaleAmountText: HTMLParagraphElement = HTMLElementCreator.createHTMLElement<HTMLParagraphElement>( HTMLElementType.P, config.scaleSettings.scaleAmountText );
		scaleAmountText.textContent = 'x ' + this.scale.toString();;
		scaleSettings.appendChild( scaleAmountText );

		const scaleUpButton: HTMLButtonElement = HTMLElementCreator.createHTMLElement<HTMLButtonElement>( HTMLElementType.BUTTON, config.scaleSettings.scaleUpButton );
		scaleUpButton.onclick = () => {
			this.scale = Math.round( this.scale * 10 + 1 ) / 10;
			animation.scale.x = this.originScale.x * this.scale;
			animation.scale.y = this.originScale.y * this.scale;
			scaleAmountText.textContent = 'x ' + this.scale.toString();
		};
		scaleSettings.appendChild( scaleUpButton );

		const resetButton: HTMLButtonElement = HTMLElementCreator.createHTMLElement<HTMLButtonElement>( HTMLElementType.BUTTON, config.resetButton );
		resetButton.onclick = () => {
			this.scale = 1;
			animation.scale.x = this.originScale.x;
			animation.scale.y = this.originScale.x;
			scaleAmountText.textContent = 'x ' + this.scale.toString();
		};
		container.appendChild( resetButton );


		///////////////////
		return container;
	}
}