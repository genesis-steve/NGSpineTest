import * as MiniSignal from 'mini-signals';
import { Inject } from 'typescript-ioc';
import { spine } from 'pixi.js';
import { ISingleAnimationDemo } from 'src/config/SpineConfig';
import { HTMLElementCreator, HTMLElementType } from 'src/utils/HTMLElementCreator';
import { SpineDataModel } from 'src/core/SpineDataModel';


export class SingleAnimationDemo {

	@Inject
	protected static spineDataModel: SpineDataModel;

	public static onSingleAnimationPlaySignal: MiniSignal = new MiniSignal();
	public static onAnimationMixSetSignal: MiniSignal = new MiniSignal();

	public static init ( config: ISingleAnimationDemo, animations: spine.core.Animation[] ): HTMLDivElement {
		const container = HTMLElementCreator.createHTMLElement<HTMLDivElement>(
			HTMLElementType.DIV, config.buttonContainer
		);
		const label: HTMLParagraphElement = HTMLElementCreator.createHTMLElement<HTMLParagraphElement>(
			HTMLElementType.P, config.title
		);
		container.appendChild( label );
		container.appendChild( HTMLElementCreator.createHTMLElement( HTMLElementType.P, config.description ) );

		animations.forEach( ( animation, i ) => {
			const animationButton: HTMLButtonElement = HTMLElementCreator.createHTMLElement<HTMLButtonElement>( HTMLElementType.BUTTON, config.animationButton );
			animationButton.id = animation.name + '_Btn';
			animationButton.textContent = animation.name;
			const loopCheckBox: HTMLInputElement = HTMLElementCreator.createHTMLElement<HTMLInputElement>( HTMLElementType.INPUT, config.loopCheckbox );
			animationButton.onclick = () => {
				if ( this.spineDataModel.waitInputData.isWaiting ) {
					this.onAnimationMixSetSignal.dispatch( animation.name );
				} else {
					this.onSingleAnimationPlaySignal.dispatch( animation.name, loopCheckBox.checked );
				}
			};
			container.appendChild( animationButton );
			container.appendChild( loopCheckBox );
			container.appendChild( document.createElement( HTMLElementType.BR ) );
		} );
		return container;
	}
}