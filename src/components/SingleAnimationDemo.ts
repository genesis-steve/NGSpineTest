import * as MiniSignal from 'mini-signals';
import { Inject } from 'typescript-ioc';
import { spine } from 'pixi.js';
import { ISingleAnimationDemo } from 'src/config/SpineConfig';
import { HTMLElementCreator, HTMLElementType } from 'src/utils/HTMLElementCreator';
import { SpineDataModel } from 'src/core/SpineDataModel';


export class SingleAnimationDemo {

	@Inject
	protected static spineDataModel: SpineDataModel;

	protected static config: ISingleAnimationDemo;
	protected static animation: spine.Spine;
	protected static panelContainer: HTMLDivElement;

	protected static loopCheckBoxInput: HTMLInputElement;

	public static onSingleAnimationPlaySignal: MiniSignal = new MiniSignal();
	public static onAnimationMixSetSignal: MiniSignal = new MiniSignal();

	public static init ( config: ISingleAnimationDemo, animation: spine.Spine ): HTMLDivElement {
		this.config = config;
		this.animation = animation;
		this.panelContainer = HTMLElementCreator.createHTMLElement<HTMLDivElement>(
			HTMLElementType.DIV, config.buttonContainer
		);
		this.createTitle();
		this.createLoopCheckBox();
		this.createAnimationButtons();
		return this.panelContainer;
	}

	protected static createTitle (): void {
		const label: HTMLParagraphElement = HTMLElementCreator.createHTMLElement<HTMLParagraphElement>(
			HTMLElementType.P, this.config.title
		);
		this.panelContainer.appendChild( label );
	}

	protected static createLoopCheckBox (): void {
		this.loopCheckBoxInput = HTMLElementCreator.createHTMLElement<HTMLInputElement>(
			HTMLElementType.INPUT, this.config.loopCheckbox.input
		);
		this.panelContainer.appendChild( this.loopCheckBoxInput );

		const loopCheckBoxLabel: HTMLLabelElement = HTMLElementCreator.createHTMLElement<HTMLLabelElement>(
			HTMLElementType.LABEL, this.config.loopCheckbox.label
		);
		this.panelContainer.appendChild( loopCheckBoxLabel );

		this.panelContainer.appendChild( document.createElement( HTMLElementType.BR ) );
	}

	protected static createAnimationButtons (): void {
		this.animation.spineData.animations.forEach( ( animation ) => {
			const animationButton: HTMLButtonElement = HTMLElementCreator.createHTMLElement<HTMLButtonElement>( HTMLElementType.BUTTON, this.config.animationButton );
			animationButton.id = animation.name + '_Btn';
			animationButton.textContent = animation.name;
			animationButton.onclick = () => {
				if ( this.spineDataModel.waitInputData.isWaiting ) {
					this.onAnimationMixSetSignal.dispatch( animation.name );
				} else {
					this.onSingleAnimationPlaySignal.dispatch( animation.name, this.loopCheckBoxInput.checked );
				}
			};
			this.panelContainer.appendChild( animationButton );
			this.panelContainer.appendChild( document.createElement( HTMLElementType.BR ) );
		} );
	}
}