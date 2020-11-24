import * as MiniSignal from 'mini-signals';
import { Inject } from 'typescript-ioc';
import { spine } from 'pixi.js';
import { IPoint, ISpineSettingsPanel } from 'src/config/SpineConfig';
import { HTMLElementCreator, HTMLElementType } from 'src/utils/HTMLElementCreator';
import { SpineDataModel } from 'src/core/SpineDataModel';


export class SpineSettingsPanel {

	protected static spineDataModel: SpineDataModel;

	public static onSingleAnimationPlaySignal: MiniSignal = new MiniSignal();
	public static onAnimationMixSetSignal: MiniSignal = new MiniSignal();

	protected static originScale: IPoint = { x: 1, y: 1 };
	protected static scale: number = 1;

	public static init ( config: ISpineSettingsPanel, animation: spine.Spine ): HTMLDivElement {
		this.originScale = { x: animation.scale.x, y: animation.scale.y };
		const container: HTMLDivElement = HTMLElementCreator.createHTMLElement<HTMLDivElement>(
			HTMLElementType.DIV, config.container
		);
		const title: HTMLLabelElement = HTMLElementCreator.createHTMLElement<HTMLLabelElement>(
			HTMLElementType.LABEL, config.title
		);
		container.appendChild( title );

		const scaleSettings: HTMLDivElement = HTMLElementCreator.createHTMLElement<HTMLDivElement>(
			HTMLElementType.DIV, config.scaleSettings.container
		);
		container.appendChild( scaleSettings );

		const scaleTitle: HTMLLabelElement = HTMLElementCreator.createHTMLElement<HTMLLabelElement>( HTMLElementType.LABEL, config.scaleSettings.scaleTitle );
		scaleSettings.appendChild( scaleTitle );

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

		const scaleAmountText: HTMLLabelElement = HTMLElementCreator.createHTMLElement<HTMLLabelElement>( HTMLElementType.LABEL, config.scaleSettings.scaleAmountText );
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

		return container;
	}
}