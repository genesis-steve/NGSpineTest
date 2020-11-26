import * as MiniSignal from 'mini-signals';
import { spine } from 'pixi.js';
import { ISpineSettingsPanel, IPoint } from 'src/config/SpineConfig';
import { AtlasParser } from 'src/utils/AtlasParser';
import { HTMLElementCreator, HTMLElementType } from 'src/utils/HTMLElementCreator';


export class SpineSettingsPanel {

	protected static config: ISpineSettingsPanel;
	protected static animation: spine.Spine;

	protected static panelContainer: HTMLDivElement;
	protected static scaleAmountText: HTMLParagraphElement;

	protected static originPosition: IPoint = { x: 1, y: 1 };
	protected static originScale: IPoint = { x: 1, y: 1 };
	protected static scale: number = 1;

	public static onPixiColorUpdateSignal: MiniSignal = new MiniSignal();
	public static onAnimationDraggableChangeSignal: MiniSignal = new MiniSignal();

	public static init ( config: ISpineSettingsPanel, animation: spine.Spine ): HTMLDivElement {
		this.config = config;
		this.animation = animation;
		this.panelContainer = HTMLElementCreator.createHTMLElement(
			HTMLElementType.DIV, config.container
		);
		this.originPosition = { x: animation.position.x, y: animation.position.y };
		this.originScale = { x: animation.scale.x, y: animation.scale.y };
		this.createColorPalette();
		this.createAddImageInput();
		this.createDragCheckbox();
		this.createScaleOption();
		this.createResetButton();

		return this.panelContainer;
	}

	protected static createColorPalette (): void {
		this.config.colorList.forEach( color => {
			const paletteButton: HTMLButtonElement = HTMLElementCreator.createHTMLElement(
				HTMLElementType.BUTTON, {
				...this.config.colorButton,
				background: color
			} );
			paletteButton.onclick = () => {
				this.onPixiColorUpdateSignal.dispatch( color );
			};
			this.panelContainer.appendChild( paletteButton );
		} );
	}

	protected static createAddImageInput (): void {
		const addImageInput: HTMLInputElement = HTMLElementCreator.createHTMLElement(
			HTMLElementType.INPUT, this.config.addImageBackground.input
		);
		addImageInput.addEventListener( 'change', ( e ) => {
			const file: File = addImageInput.files[ 0 ];
			const url: string = AtlasParser.getObjectUrl( file );
			this.onPixiColorUpdateSignal.dispatch( url, true );
		} );
		this.panelContainer.appendChild( addImageInput );

		const addImageLabel: HTMLLabelElement = HTMLElementCreator.createHTMLElement(
			HTMLElementType.LABEL, this.config.addImageBackground.label
		);
		this.panelContainer.appendChild( addImageLabel );
	}

	protected static createDragCheckbox (): void {
		const dragCheckboxInput: HTMLInputElement = HTMLElementCreator.createHTMLElement(
			HTMLElementType.INPUT, this.config.dragCheckbox.input
		);
		dragCheckboxInput.onchange = () => {
			this.onAnimationDraggableChangeSignal.dispatch( dragCheckboxInput.checked );
		};
		this.panelContainer.appendChild( dragCheckboxInput );

		const dragCheckboxLabel: HTMLLabelElement = HTMLElementCreator.createHTMLElement(
			HTMLElementType.LABEL, this.config.dragCheckbox.label
		);
		this.panelContainer.appendChild( dragCheckboxLabel );
	}

	protected static createScaleOption (): void {
		const config = this.config.scaleSettings;
		const scaleOption: HTMLDivElement = HTMLElementCreator.createHTMLElement<HTMLDivElement>(
			HTMLElementType.DIV, config.container
		);
		const scaleDownButton: HTMLButtonElement = HTMLElementCreator.createHTMLElement<HTMLButtonElement>( HTMLElementType.BUTTON, config.scaleDownButton );
		scaleDownButton.onclick = () => {
			if ( this.scale - 0.1 < 0.1 ) {
				return;
			}
			this.scale = Math.round( this.scale * 10 - 1 ) / 10;
			this.animation.scale.set( this.originScale.x * this.scale, this.originScale.y * this.scale );
			this.scaleAmountText.textContent = 'x ' + this.scale.toString();
		};
		scaleOption.appendChild( scaleDownButton );

		this.scaleAmountText = HTMLElementCreator.createHTMLElement<HTMLParagraphElement>( HTMLElementType.P, config.scaleAmountText );
		this.scaleAmountText.textContent = 'x ' + this.scale.toString();;
		scaleOption.appendChild( this.scaleAmountText );

		const scaleUpButton: HTMLButtonElement = HTMLElementCreator.createHTMLElement<HTMLButtonElement>( HTMLElementType.BUTTON, config.scaleUpButton );
		scaleUpButton.onclick = () => {
			this.scale = Math.round( this.scale * 10 + 1 ) / 10;
			this.animation.scale.set( this.originScale.x * this.scale, this.originScale.y * this.scale );
			this.scaleAmountText.textContent = 'x ' + this.scale.toString();
		};
		scaleOption.appendChild( scaleUpButton );
		this.panelContainer.appendChild( scaleOption );
	}

	protected static createResetButton (): void {
		const resetButton: HTMLButtonElement = HTMLElementCreator.createHTMLElement<HTMLButtonElement>( HTMLElementType.BUTTON, this.config.resetButton );
		resetButton.onclick = () => {
			this.scale = 1;
			this.animation.position.set( this.originPosition.x, this.originPosition.y );
			this.animation.scale.set( this.originScale.x, this.originScale.y );
			this.scaleAmountText.textContent = 'x ' + this.scale.toString();
		};
		this.panelContainer.appendChild( resetButton );
	}
}