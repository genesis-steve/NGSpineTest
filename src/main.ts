import { TSMap } from 'typescript-map';
import { Application, DisplayObject, spine } from 'pixi.js';
import 'pixi-spine';
import { ISpineConfig, SpineConfig } from 'src/config/SpineConfig';
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

	protected animationMixer: HTMLElement;

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
		buttonContainer.style.top = config.y.toString();
		buttonContainer.style.left = config.x.toString();
		buttonContainer.style.width = config.width.toString();
		buttonContainer.style.height = config.height.toString();

		const buttonIdSuffix: string = '_DisplayBtn';

		this.animation.spineData.animations.forEach( animation => {
			const buttonId: string = animation.name + buttonIdSuffix;
			const button: HTMLButtonElement = document.createElement( 'button' );
			button.id = buttonId;
			button.textContent = animation.name;
			button.style.fontSize = `${ config.fontSize }px`;
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
			buttonContainer.appendChild( button );
			buttonContainer.appendChild( document.createElement( 'br' ) );
		} );
	}

	protected createAnimationMixer (): void {
		const config = this.spineConfig.animationMixer;
		this.animationMixer = document.getElementById( 'animationMixer' );
		this.animationMixer.style.position = config.position;
		this.animationMixer.style.overflow = config.overflow;
		this.animationMixer.style.top = config.y.toString();
		this.animationMixer.style.left = config.x.toString();
		this.animationMixer.style.width = config.width.toString();
		this.animationMixer.style.height = config.height.toString();

		this.mixGroup = new TSMap();
		this.addMixGroup();
	}

	protected addMixGroup (): void {
		const group: HTMLDivElement = document.createElement( 'div' );
		group.id = 'MixGroup_' + this.mixGroup.size;
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
	}

	protected createFirstInputButton ( group: HTMLDivElement ): void {
		const config = this.spineConfig.animationMixer;

		const btnPrefix: string = 'First_';
		const buttonId: string = btnPrefix + ( this.mixGroup.size() - 1 );

		const button: HTMLButtonElement = document.createElement( 'button' );
		button.id = buttonId;
		button.textContent = 'Get';
		button.style.fontSize = config.fontSize.toString();
		group.appendChild( button );
		group.appendChild( document.createElement( 'br' ) );

		button.onclick = () => {
			if ( !this.waitInputData.isWaiting ) {
				button.textContent = 'Waiting...';
				this.waitInputData.isWaiting = true;
				this.waitInputData.targetId = buttonId;
				this.waitInputData.groupId = group.id;
			}
		};
	}

	protected createLastInputButton ( group: HTMLDivElement ): void {
		const config = this.spineConfig.animationMixer;

		const btnPrefix: string = 'Last_';
		const buttonId: string = btnPrefix + ( this.mixGroup.size() - 1 );

		const button: HTMLButtonElement = document.createElement( 'button' );
		button.id = buttonId;
		button.textContent = 'Get';
		button.style.fontSize = config.fontSize.toString();
		group.appendChild( button );
		group.appendChild( document.createElement( 'br' ) );

		button.onclick = () => {
			if ( !this.waitInputData.isWaiting ) {
				button.textContent = 'Waiting...';
				this.waitInputData.isWaiting = true;
				this.waitInputData.targetId = buttonId;
				this.waitInputData.groupId = group.id;
			}
		};
	}

	protected createMixinTimeInput ( group: HTMLDivElement ): void {
		const input: HTMLInputElement = document.createElement( 'input' );
		const config = this.spineConfig.animationMixer;
		input.id = 'Input_' + ( this.mixGroup.size() - 1 );
		input.type = 'text';
		input.style.fontSize = config.fontSize.toString();
		input.style.width = '100';
		group.appendChild( input );
		group.appendChild( document.createElement( 'br' ) );
	}

	protected createPlayInput ( group: HTMLDivElement ): void {
		const button: HTMLButtonElement = document.createElement( 'button' );
		const config = this.spineConfig.animationMixer;
		const idNum = this.mixGroup.size() - 1;
		button.id = 'Play_' + idNum;
		button.textContent = 'Play';
		button.style.fontSize = config.fontSize.toString();
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
					if ( this.waitInputData.targetId.includes( 'First_' ) ) {
						this.mixGroup.get( this.waitInputData.groupId ).firstAnimation = eventData.data.animationName;
					} else if ( this.waitInputData.targetId.includes( 'Last_' ) ) {
						this.mixGroup.get( this.waitInputData.groupId ).lastAnimation = eventData.data.animationName;
					}
					this.waitInputData.targetId = undefined;
					this.waitInputData.groupId = undefined;
					this.waitInputData.isWaiting = false;
				} else if ( eventData.type == EventType.PLAY_MIXED_ANIMATION ) {
					this.addMixGroup();
				}
			}
		}, false );
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