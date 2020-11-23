import * as MiniSignal from 'mini-signals';
import { spine } from 'pixi.js';
import { ISingleAnimationDemo, IStyle } from 'src/config/SpineConfig';
import { EventType, HTMLElementType } from 'src/main';
import { HTMLElementCreator } from 'src/utils/HTMLElementCreator';


export class SingleAnimationDemo {

	public static onAnimationButtonClickSignal: MiniSignal = new MiniSignal();

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
				this.onAnimationButtonClickSignal.dispatch( animation.name );
			};
			container.appendChild( button );
			container.appendChild( document.createElement( HTMLElementType.BR ) );
		} );
		return container;
	}
}