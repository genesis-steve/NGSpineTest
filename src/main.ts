import { Application, DisplayObject, spine } from 'pixi.js';
import 'pixi-spine';
import { ISpineConfig, SpineConfig } from 'src/config/SpineConfig';
import { IMainConfig, MainConfig } from 'src/config/MainConfig';

window.onload = () => {
	document.title = 'Spine Test';
	new GmaeApplication();
};

export class GmaeApplication {

	protected appConfig: IMainConfig;
	protected spineConfig: ISpineConfig;

	protected pixi: Application;
	protected animation: spine.Spine;

	protected animationList: string[];
	protected inputButtons: HTMLElement[];

	protected countMixGroup: number = 0;

	protected animationMixer: HTMLElement;

	protected waitInputData: IWaitInputData = {
		isWaiting: false,
		targetId: ''
	};

	constructor () {
		this.appConfig = new MainConfig();
		this.pixi = new Application( this.appConfig );
		this.createElements();
	}

	public addChild ( displayObj: DisplayObject ): void {
		this.pixi.stage.addChild( displayObj );
	}

	protected createElements (): void {
		this.setupAnimation();
	}

	protected setupAnimation (): void {
		this.spineConfig = new SpineConfig();
		PIXI.loader.add( this.spineConfig.assetName, `assets/${ this.spineConfig.assetName }.json` )
			.load( ( loader, res ) => {
				this.animation = new spine.Spine( res[ this.spineConfig.assetName ].spineData );
				this.animation.renderable = false;
				this.addChild( this.animation );
				this.createTestButtons();
				this.createAnimationMixer();
				this.addEventListener();
			} );
	}

	protected createTestButtons (): void {
		const buttonContainer = document.getElementById( 'displayButtonContainer' );
		const config = this.spineConfig.displayButtonContainer;
		buttonContainer.style.position = config.position;
		buttonContainer.style.overflow = config.overflow;
		buttonContainer.style.top = `${ config.y }px`;
		buttonContainer.style.left = `${ config.x }px`;
		buttonContainer.style.width = `${ config.width }px`;
		buttonContainer.style.height = `${ config.height }px`;

		this.animationList = [];
		const buttonIdSuffix: string = '_DisplayBtn';

		this.animation.spineData.animations.forEach( animation => {
			const buttonId: string = animation.name + buttonIdSuffix;
			const buttonHTML: string = this.getButtonHtml( buttonId, animation.name );
			buttonContainer.innerHTML += buttonHTML;
			this.animationList.push( animation.name );
		} );

		this.animationList.forEach( e => {
			document.getElementById( e + buttonIdSuffix ).style.fontSize = `${ config.fontSize }px`;
			document.getElementById( e + buttonIdSuffix ).onclick = () => {
				if ( this.waitInputData.isWaiting ) {
					window.postMessage( {
						type: EventType.SET_ANIMATION_MIX,
						data: {
							animationName: e
						}
					}, '*' );
				} else {
					window.postMessage( {
						type: EventType.PLAY_ANIMATION,
						data: {
							animationName: e
						}
					}, '*' );
				}
			};
		} );
	}

	protected createAnimationMixer (): void {
		const config = this.spineConfig.animationMixer;
		this.animationMixer = document.getElementById( 'animationMixer' );
		this.animationMixer.style.position = config.position;
		this.animationMixer.style.overflow = config.overflow;
		this.animationMixer.style.top = `${ config.y }px`;
		this.animationMixer.style.left = `${ config.x }px`;
		this.animationMixer.style.width = `${ config.width }px`;
		this.animationMixer.style.height = `${ config.height }px`;

		this.inputButtons = [];
		this.createMixGroup();
	}

	protected createMixGroup (): void {
		const config = this.spineConfig.animationMixer;
		const btnPrefix: string = 'Get_';
		const labelPrefix: string = 'GetLabel_';

		const buttonId: string = btnPrefix + this.inputButtons.length.toString();
		const labelId: string = labelPrefix + this.inputButtons.length.toString();
		const inputButtonHTML: string = this.getInputFormHtml( buttonId, labelId );
		this.animationMixer.innerHTML += inputButtonHTML;

		const button = document.getElementById( buttonId );
		const label = document.getElementById( labelId );

		label.innerHTML = 'Empty';
		label.style.fontSize = `${ config.fontSize }px`;
		button.style.fontSize = `${ config.fontSize }px`;

		button.onclick = () => {
			if ( !this.waitInputData.isWaiting ) {
				label.innerHTML = 'Waiting...';
				this.waitInputData.isWaiting = true;
				this.waitInputData.targetId = labelId;
			}
		};
		this.inputButtons.push( button );
		console.error( this.inputButtons[ 0 ].onclick );
	}

	protected addEventListener (): void {
		window.addEventListener( "message", ( event ) => {
			const eventData: IPostMessage = event.data;
			if ( eventData ) {
				if ( eventData.type == EventType.PLAY_ANIMATION ) {
					this.animation.renderable = true;
					this.animation.state.setAnimation( 0, eventData.data.animationName, false );
				} else if ( eventData.type == EventType.SET_ANIMATION_MIX ) {
					document.getElementById( this.waitInputData.targetId ).innerHTML = eventData.data.animationName;
					this.waitInputData.isWaiting = false;
					this.createMixGroup();
				}
			}
		}, false );
	}

	protected getButtonHtml ( id: string, text: string ): string {
		return `<button id = "${ id }">${ text }</button><br>`;
	}

	protected getInputFormHtml ( buttonId: string, labelId: string ): string {
		return `<input id = "${ buttonId }" type="submit" value="Get"><label id="${ labelId }"></label><br>`;
	}

}

export enum EventType {
	PLAY_ANIMATION = 'playAnimation',
	SET_ANIMATION_MIX = 'setAnimationMix'
}

export interface IWaitInputData {
	isWaiting: boolean;
	targetId: string;
}

export interface IPostMessage {
	type: string;
	data: any;
}