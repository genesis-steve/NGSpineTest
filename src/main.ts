import { TSMap } from 'typescript-map';
import { Application, spine } from 'pixi.js';
import 'pixi-spine';
import { ISpineConfig, IStyle, SpineConfig } from 'src/config/SpineConfig';
import { IMainConfig, MainConfig } from 'src/config/MainConfig';

window.onload = () => {
	new GmaeApplication();
};

export class GmaeApplication {

	protected appConfig: IMainConfig;
	protected spineConfig: ISpineConfig;

	protected pixi: Application;
	protected animation: spine.Spine;

	protected mixGroup: TSMap<string, IMixGroup>;

	protected mainContainer: HTMLDivElement;
	protected buttonContainer: HTMLDivElement;
	protected animationMixer: HTMLDivElement;

	protected addButton: HTMLButtonElement;

	protected waitInputData: IWaitInputData = {
		isWaiting: false,
		targetId: undefined,
		groupId: undefined
	};

	constructor () {
		this.appConfig = new MainConfig();
		this.pixi = new Application( this.appConfig );
		document.title = this.appConfig.title;
		this.createElements();
	}

	protected createElements (): void {
		this.mainContainer = <HTMLDivElement> document.getElementById( 'mainContainer' );
		this.setupAnimation();
	}

	protected setupAnimation (): void {
		this.spineConfig = new SpineConfig();
		PIXI.loader.add( this.spineConfig.assetName, `assets/${ this.spineConfig.assetName }.json` )
			.load( ( loader, res ) => {
				this.animation = new spine.Spine( res[ this.spineConfig.assetName ].spineData );
				this.animation.renderable = false;
				this.pixi.stage.addChild( this.animation );
				this.createTestButtons();
				this.createAnimationMixer();
				this.addEventListener();
			} );
	}

	protected createTestButtons (): void {
		this.buttonContainer = this.createHtmlElement<HTMLDivElement>( 'div', this.spineConfig.displayButtonContainer );
		this.mainContainer.appendChild( this.buttonContainer );

		this.animation.spineData.animations.forEach( animation => {

			const config = this.spineConfig.animationButton;
			const button = this.createHtmlElement<HTMLButtonElement>( 'button', config );
			button.id = animation.name + '_Btn';
			button.textContent = animation.name;
			button.onclick = () => {
				if ( this.waitInputData.isWaiting ) {
					window.postMessage( {
						type: EventType.SET_ANIMATION_MIX,
						data: {
							animationName: animation.name
						}
					}, '*' );
				} else {
					window.postMessage( {
						type: EventType.PLAY_ANIMATION,
						data: {
							animationName: animation.name
						}
					}, '*' );
				}
			};
			this.buttonContainer.appendChild( button );
			this.buttonContainer.appendChild( document.createElement( 'br' ) );
		} );
	}

	protected createAnimationMixer (): void {
		this.animationMixer = this.createHtmlElement<HTMLDivElement>( 'div', this.spineConfig.animationMixer );
		this.mainContainer.appendChild( this.animationMixer );

		this.mixGroup = new TSMap();
		this.createAddMixGroupButton();
		this.createMixGroup();
	}

	protected createAddMixGroupButton (): void {
		this.addButton = this.createHtmlElement<HTMLButtonElement>( 'button', this.spineConfig.addButton );
		this.addButton.onclick = () => {
			this.createMixGroup();
		}
		this.animationMixer.appendChild( this.addButton );
	}

	protected createMixGroup (): void {
		this.animationMixer.removeChild( this.addButton );
		const config = this.spineConfig.mixGroup;
		const group: HTMLDivElement = this.createHtmlElement<HTMLDivElement>( 'div', config );
		group.id = config.id + this.mixGroup.size();
		this.mixGroup.set( group.id, {
			firstAnimation: undefined,
			lastAnimation: undefined,
			mixinTime: 0
		} );
		this.animationMixer.appendChild( group );
		this.createFirstInputButton( group );
		this.createLastInputButton( group );
		this.createMixinTimeInput( group );
		this.createPlayInput( group );
		this.animationMixer.appendChild( this.addButton );
	}

	protected createFirstInputButton ( group: HTMLDivElement ): void {
		const config = this.spineConfig.firstAnimationButton;

		const label: HTMLLabelElement = this.createHtmlElement<HTMLLabelElement>( 'label', config.label );
		group.appendChild( label );

		const button: HTMLButtonElement = this.createHtmlElement<HTMLButtonElement>( 'button', config.button );
		button.id = config.button.id + ( this.mixGroup.size() - 1 );
		group.appendChild( button );
		group.appendChild( document.createElement( 'br' ) );

		button.onclick = () => {
			if ( !this.waitInputData.isWaiting ) {
				button.textContent = 'Waiting...';
				this.waitInputData.isWaiting = true;
				this.waitInputData.targetId = button.id;
				this.waitInputData.groupId = group.id;
			}
		};
	}

	protected createLastInputButton ( group: HTMLDivElement ): void {
		const config = this.spineConfig.lastAnimationButton;

		const label: HTMLLabelElement = this.createHtmlElement<HTMLLabelElement>( 'label', config.label );
		group.appendChild( label );

		const button: HTMLButtonElement = this.createHtmlElement<HTMLButtonElement>( 'button', config.button );
		button.id = config.button.id + ( this.mixGroup.size() - 1 );
		group.appendChild( button );
		group.appendChild( document.createElement( 'br' ) );

		button.onclick = () => {
			if ( !this.waitInputData.isWaiting ) {
				button.textContent = 'Waiting...';
				this.waitInputData.isWaiting = true;
				this.waitInputData.targetId = button.id;
				this.waitInputData.groupId = group.id;
			}
		};
	}

	protected createMixinTimeInput ( group: HTMLDivElement ): void {
		const config = this.spineConfig.mixin;

		const label: HTMLLabelElement = this.createHtmlElement<HTMLLabelElement>( 'label', config.label );
		label.id = config.label.id + ( this.mixGroup.size() - 1 );
		group.appendChild( label );

		const input: HTMLInputElement = this.createHtmlElement<HTMLInputElement>( 'input', config.input );
		input.id = config.input.id + ( this.mixGroup.size() - 1 );
		group.appendChild( input );
		group.appendChild( document.createElement( 'br' ) );
	}

	protected createPlayInput ( group: HTMLDivElement ): void {
		const config = this.spineConfig.playButton;
		const button: HTMLButtonElement = this.createHtmlElement<HTMLButtonElement>( 'button', config );
		const idNum = this.mixGroup.size() - 1;
		button.id = config.id + idNum;
		button.onclick = () => {
			const mixConfig = this.mixGroup.get( group.id );
			mixConfig.mixinTime = +( document.getElementById( 'Input_' + idNum ) as HTMLInputElement ).value;
			this.animation.stateData.setMix( mixConfig.firstAnimation, mixConfig.lastAnimation, mixConfig.mixinTime );
			this.animation.renderable = true;
			this.animation.state.setAnimation( 0, mixConfig.firstAnimation, false );
			this.animation.state.addAnimation( 0, mixConfig.lastAnimation, false );
		};
		group.appendChild( button );
		group.appendChild( document.createElement( 'br' ) );
	}

	protected addEventListener (): void {
		window.addEventListener( "message", ( event ) => {
			const eventData: IPostMessage = event.data;
			if ( eventData ) {
				if ( eventData.type == EventType.PLAY_ANIMATION ) {
					this.animation.renderable = true;
					this.animation.state.setAnimation( 0, eventData.data.animationName, false );
				} else if ( eventData.type == EventType.SET_ANIMATION_MIX ) {
					document.getElementById( this.waitInputData.targetId ).textContent = eventData.data.animationName;
					if ( this.waitInputData.targetId.includes( this.spineConfig.firstAnimationButton.button.id ) ) {
						this.mixGroup.get( this.waitInputData.groupId ).firstAnimation = eventData.data.animationName;
					} else if ( this.waitInputData.targetId.includes( this.spineConfig.lastAnimationButton.button.id ) ) {
						this.mixGroup.get( this.waitInputData.groupId ).lastAnimation = eventData.data.animationName;
					}
					this.waitInputData.targetId = undefined;
					this.waitInputData.groupId = undefined;
					this.waitInputData.isWaiting = false;
				}
			}
		}, false );
	}

	protected createHtmlElement<T extends HTMLElement> ( type: string, config: IStyle ): T {
		const element = <T> document.createElement( type );
		if ( config.id ) {
			element.id = config.id;
		}
		if ( config.textContent ) {
			element.textContent = config.textContent;
		}
		if ( config.value ) {
			( element as any ).value = config.value;
		}
		if ( config.position ) {
			element.style.position = config.position;
		}
		if ( config.overflow ) {
			element.style.overflow = config.overflow;
		}
		if ( config.x ) {
			element.style.left = config.x.toString();
		}
		if ( config.y ) {
			element.style.top = config.y.toString();
		}
		if ( config.width ) {
			element.style.width = config.width.toString();
		}
		if ( config.height ) {
			element.style.height = config.height.toString();
		}
		if ( config.fontSize ) {
			element.style.fontSize = config.fontSize.toString();
		}
		if ( config.margin ) {
			element.style.margin = config.margin;
		}
		return element;
	}

}

export enum EventType {
	PLAY_ANIMATION = 'playAnimation',
	PLAY_MIXED_ANIMATION = 'playMixedAnimation',
	SET_ANIMATION_MIX = 'setAnimationMix'
}

export interface IWaitInputData {
	isWaiting: boolean;
	targetId: string;
	groupId: string;
}

export interface IPostMessage {
	type: string;
	data: any;
}

export interface IMixGroup {
	firstAnimation: string;
	lastAnimation: string;
	mixinTime: number;
}