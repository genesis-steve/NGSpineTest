import * as MiniSignal from 'mini-signals';
import { Inject } from 'typescript-ioc';
import { spine } from 'pixi.js';
import { ISingleAnimationDemo } from 'src/config/SpineConfig';
import { HTMLElementType } from 'src/main';
import { HTMLElementCreator } from 'src/utils/HTMLElementCreator';
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
			HTMLElementType.LABEL, config.label
		);
		container.appendChild( label );
		container.appendChild( HTMLElementCreator.createHTMLElement( HTMLElementType.BR ) );

		animations.forEach( animation => {
			const button: HTMLButtonElement = HTMLElementCreator.createHTMLElement<HTMLButtonElement>( HTMLElementType.BUTTON, config.animationButton );
			button.id = animation.name + '_Btn';
			button.textContent = animation.name;
			button.onclick = () => {
				if ( this.spineDataModel.waitInputData.isWaiting ) {
					this.onAnimationMixSetSignal.dispatch( animation.name );
				} else {
					this.onSingleAnimationPlaySignal.dispatch( animation.name );
				}
			};
			container.appendChild( button );
			container.appendChild( document.createElement( HTMLElementType.BR ) );
		} );
		return container;
	}
}