import * as MiniSignal from 'mini-signals';
import { spine } from 'pixi.js';
import { ISpineSettingsPanel, IPoint, ISpineScaleSettings } from 'src/config/SpineConfig';
import { AtlasParser } from 'src/utils/AtlasParser';
import { HTMLElementCreator, HTMLElementType } from 'src/utils/HTMLElementCreator';


export class SpineSettingsPanel {

	protected static originPosition: IPoint = { x: 1, y: 1 };
	protected static originScale: IPoint = { x: 1, y: 1 };
	protected static scale: number = 1;

	protected static panelContainer: HTMLDivElement;
	protected static scaleAmountText: HTMLParagraphElement;
	public static onPixiColorUpdateSignal: MiniSignal = new MiniSignal();

	public static init ( config: ISpineSettingsPanel, animation: spine.Spine ): HTMLDivElement {
		this.panelContainer = HTMLElementCreator.createHTMLElement(
			HTMLElementType.DIV, config.container
		);
		config.colorList.forEach( color => {
			const paletteButton: HTMLButtonElement = this.createColorPalette( config, color );
			this.panelContainer.appendChild( paletteButton );
		} );

		const addImageInput: HTMLInputElement = this.createAddImageInput( config );
		this.panelContainer.appendChild( addImageInput );

		const addImageLabel: HTMLLabelElement = HTMLElementCreator.createHTMLElement(
			HTMLElementType.LABEL, config.addImageBackground.label
		);
		this.panelContainer.appendChild( addImageLabel );

		this.originPosition = { x: animation.position.x, y: animation.position.y };
		this.originScale = { x: animation.scale.x, y: animation.scale.y };

		const scaleOption = this.createScaleOption( config.scaleSettings, animation );
		this.panelContainer.appendChild( scaleOption );

		const resetButton: HTMLButtonElement = this.createResetButton( config, animation );
		this.panelContainer.appendChild( resetButton );

		return this.panelContainer;
	}

	protected static createColorPalette ( config: ISpineSettingsPanel, color: string ): HTMLButtonElement {
		const paletteButton: HTMLButtonElement = HTMLElementCreator.createHTMLElement(
			HTMLElementType.BUTTON, {
			...config.colorButton,
			background: color
		} );
		paletteButton.onclick = () => {
			this.onPixiColorUpdateSignal.dispatch( color );
		};
		return paletteButton;
	}

	protected static createAddImageInput ( config: ISpineSettingsPanel ): HTMLInputElement {
		const addImageInput: HTMLInputElement = HTMLElementCreator.createHTMLElement(
			HTMLElementType.INPUT, config.addImageBackground.input
		);
		addImageInput.addEventListener( 'change', ( e ) => {
			const file: File = addImageInput.files[ 0 ];
			const url: string = AtlasParser.getObjectUrl( file );
			this.onPixiColorUpdateSignal.dispatch( url, true );
		} );
		return addImageInput;
	}

	protected static createScaleOption ( config: ISpineScaleSettings, animation: spine.Spine ): HTMLDivElement {
		const scaleSettings: HTMLDivElement = HTMLElementCreator.createHTMLElement<HTMLDivElement>(
			HTMLElementType.DIV, config.container
		);

		const scaleDownButton: HTMLButtonElement = HTMLElementCreator.createHTMLElement<HTMLButtonElement>( HTMLElementType.BUTTON, config.scaleDownButton );
		scaleDownButton.onclick = () => {
			if ( this.scale - 0.1 < 0.1 ) {
				return;
			}
			this.scale = Math.round( this.scale * 10 - 1 ) / 10;
			animation.scale.set( this.originScale.x * this.scale, this.originScale.y * this.scale );
			this.scaleAmountText.textContent = 'x ' + this.scale.toString();
		};
		scaleSettings.appendChild( scaleDownButton );

		this.scaleAmountText = HTMLElementCreator.createHTMLElement<HTMLParagraphElement>( HTMLElementType.P, config.scaleAmountText );
		this.scaleAmountText.textContent = 'x ' + this.scale.toString();;
		scaleSettings.appendChild( this.scaleAmountText );

		const scaleUpButton: HTMLButtonElement = HTMLElementCreator.createHTMLElement<HTMLButtonElement>( HTMLElementType.BUTTON, config.scaleUpButton );
		scaleUpButton.onclick = () => {
			this.scale = Math.round( this.scale * 10 + 1 ) / 10;
			animation.scale.set( this.originScale.x * this.scale, this.originScale.y * this.scale );
			this.scaleAmountText.textContent = 'x ' + this.scale.toString();
		};
		scaleSettings.appendChild( scaleUpButton );

		return scaleSettings;
	}

	protected static createResetButton ( config: ISpineSettingsPanel, animation: spine.Spine ): HTMLButtonElement {
		const resetButton: HTMLButtonElement = HTMLElementCreator.createHTMLElement<HTMLButtonElement>( HTMLElementType.BUTTON, config.resetButton );
		resetButton.onclick = () => {
			this.scale = 1;
			animation.position.set( this.originPosition.x, this.originPosition.y );
			animation.scale.set( this.originScale.x, this.originScale.y );
			this.scaleAmountText.textContent = 'x ' + this.scale.toString();
		};
		return resetButton;
	}
}