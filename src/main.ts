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

	protected mixGroup: TSMap<string, Array<ITrackGroup>>;

	protected mainContainer: HTMLDivElement;
	protected singleAnimationDemo: HTMLDivElement;
	protected animationMixer: HTMLDivElement;

	protected addButton: HTMLButtonElement;

	protected waitInputData: IWaitInputData = {
		isWaiting: false,
		targetId: undefined,
		groupId: undefined,
		trackIndex: undefined
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
				this.createSingleAnimationDemo();
				this.createAnimationMixer();
				this.addEventListener();
			} );
	}

	protected createSingleAnimationDemo (): void {
		this.singleAnimationDemo = this.createHTMLElement<HTMLDivElement>(
			HTMLElementType.DIV, this.spineConfig.singleAnimationDemo.buttonContainer
		);
		this.mainContainer.appendChild( this.singleAnimationDemo );

		const label: HTMLParagraphElement = this.createHTMLElement<HTMLParagraphElement>(
			HTMLElementType.LABEL, this.spineConfig.singleAnimationDemo.label
		);
		this.singleAnimationDemo.appendChild( label );

		this.animation.spineData.animations.forEach( animation => {
			const config = this.spineConfig.animationButton;
			const button = this.createHTMLElement<HTMLButtonElement>( HTMLElementType.BUTTON, config );
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
			this.singleAnimationDemo.appendChild( button );
			this.singleAnimationDemo.appendChild( document.createElement( HTMLElementType.BR ) );
		} );
	}

	protected createAnimationMixer (): void {
		this.animationMixer = this.createHTMLElement<HTMLDivElement>( HTMLElementType.DIV, this.spineConfig.animationMixer );
		this.mainContainer.appendChild( this.animationMixer );

		this.mixGroup = new TSMap();
		this.createAddMixGroupButton();
		this.createMixGroup();
	}

	protected createAddMixGroupButton (): void {
		this.addButton = this.createHTMLElement<HTMLButtonElement>( HTMLElementType.BUTTON, this.spineConfig.addButton );
		this.addButton.onclick = () => {
			this.createMixGroup();
		}
		this.animationMixer.appendChild( this.addButton );
	}

	protected createMixGroup (): void {
		this.animationMixer.removeChild( this.addButton );
		const config = this.spineConfig.mixGroup;
		const group: HTMLDivElement = this.createHTMLElement<HTMLDivElement>( HTMLElementType.DIV, config );
		group.id = config.id + this.mixGroup.size();
		this.mixGroup.set( group.id, [] );
		this.animationMixer.appendChild( group );

		this.createTracks( group, 2 );
		this.createPlayInput( group );

		const hiven = document.createElement( HTMLElementType.HR );
		group.appendChild( hiven );

		this.animationMixer.appendChild( this.addButton );
	}

	protected createTracks ( group: HTMLDivElement, amount: number ): void {
		for ( let i = 0; i < amount; i++ ) {
			this.mixGroup.get( group.id ).push( {
				firstAnimation: undefined, lastAnimation: undefined, mixinTime: 0
			} );
			const config = this.spineConfig.track;
			const track: HTMLDivElement = this.createHTMLElement<HTMLDivElement>( HTMLElementType.DIV, config );
			track.id = `${ config.id }${ this.mixGroup.size() - 1 }_${ i }`;
			this.createTrackLabel( track, i );
			this.createFirstInputButton( track, i, group.id );
			this.createLastInputButton( track, i, group.id );
			this.createMixinTimeInput( track, i );
			group.appendChild( track );
		}
	}

	protected createTrackLabel ( group: HTMLDivElement, trackIndex: number ): void {
		const config = this.spineConfig.trackLabel;

		const label: HTMLLabelElement = this.createHTMLElement<HTMLLabelElement>( HTMLElementType.LABEL, config );
		label.id = `${ config.id }${ this.mixGroup.size() - 1 }_${ trackIndex }`;
		label.textContent = config.textContent + trackIndex;
		group.appendChild( label );
		group.appendChild( document.createElement( HTMLElementType.BR ) );
	}

	protected createFirstInputButton ( group: HTMLDivElement, trackIndex: number, groupId: string ): void {
		const config = this.spineConfig.firstAnimationButton;

		const label: HTMLLabelElement = this.createHTMLElement<HTMLLabelElement>( HTMLElementType.LABEL, config.label );
		group.appendChild( label );

		const button: HTMLButtonElement = this.createHTMLElement<HTMLButtonElement>( HTMLElementType.BUTTON, config.button );
		button.id = `${ config.button.id }${ this.mixGroup.size() - 1 }_${ trackIndex }`;
		group.appendChild( button );
		group.appendChild( document.createElement( HTMLElementType.BR ) );

		button.onclick = () => {
			if ( !this.waitInputData.isWaiting ) {
				button.textContent = 'Waiting...';
				this.waitInputData.isWaiting = true;
				this.waitInputData.targetId = button.id;
				this.waitInputData.groupId = groupId;
				this.waitInputData.trackIndex = trackIndex;

			} else {
				const mixConfig = this.mixGroup.get( groupId )[ this.waitInputData.trackIndex ];
				mixConfig.firstAnimation = undefined;
				button.textContent = '...';
				this.waitInputData.isWaiting = false;
				this.waitInputData.targetId = undefined;
				this.waitInputData.groupId = undefined;
				this.waitInputData.trackIndex = undefined;
			}
		};
	}

	protected createLastInputButton ( group: HTMLDivElement, trackIndex: number, groupId: string ): void {
		const config = this.spineConfig.lastAnimationButton;

		const label: HTMLLabelElement = this.createHTMLElement<HTMLLabelElement>( HTMLElementType.LABEL, config.label );
		group.appendChild( label );

		const button: HTMLButtonElement = this.createHTMLElement<HTMLButtonElement>( HTMLElementType.BUTTON, config.button );
		button.id = `${ config.button.id }${ this.mixGroup.size() - 1 }_${ trackIndex }`;
		group.appendChild( button );
		group.appendChild( document.createElement( HTMLElementType.BR ) );

		button.onclick = () => {
			if ( !this.waitInputData.isWaiting ) {
				button.textContent = 'Waiting...';
				this.waitInputData.isWaiting = true;
				this.waitInputData.targetId = button.id;
				this.waitInputData.groupId = groupId;
				this.waitInputData.trackIndex = trackIndex;
			} else {
				const mixConfig = this.mixGroup.get( groupId )[ this.waitInputData.trackIndex ];
				mixConfig.lastAnimation = undefined;
				button.textContent = '...';
				this.waitInputData.isWaiting = false;
				this.waitInputData.targetId = undefined;
				this.waitInputData.groupId = undefined;
				this.waitInputData.trackIndex = undefined;
			}
		};
	}

	protected createMixinTimeInput ( group: HTMLDivElement, trackIndex: number ): void {
		const config = this.spineConfig.mixin;

		const label: HTMLLabelElement = this.createHTMLElement<HTMLLabelElement>( HTMLElementType.LABEL, config.label );
		label.id = `${ config.label.id }${ this.mixGroup.size() - 1 }_${ trackIndex }`;
		group.appendChild( label );

		const input: HTMLInputElement = this.createHTMLElement<HTMLInputElement>( HTMLElementType.INPUT, config.input );
		input.id = `${ config.input.id }${ this.mixGroup.size() - 1 }_${ trackIndex }`;
		group.appendChild( input );
		group.appendChild( document.createElement( HTMLElementType.BR ) );
	}

	protected createPlayInput ( group: HTMLDivElement ): void {
		const config = this.spineConfig.playButton;
		const button: HTMLButtonElement = this.createHTMLElement<HTMLButtonElement>( HTMLElementType.BUTTON, config );
		const idNum = this.mixGroup.size() - 1;
		button.id = config.id + idNum;
		button.onclick = () => {
			const mixConfigs = this.mixGroup.get( group.id );
			mixConfigs.forEach( ( mixConfig, i ) => {
				mixConfig.mixinTime = +( document.getElementById( `Input_${ idNum }_${ i }` ) as HTMLInputElement ).value / 1000;
				if ( mixConfig.firstAnimation && mixConfig.lastAnimation ) {
					this.animation.stateData.setMix( mixConfig.firstAnimation, mixConfig.lastAnimation, mixConfig.mixinTime );
				}
				this.animation.renderable = true;
				if ( mixConfig.firstAnimation ) {
					this.animation.state.setAnimation( i, mixConfig.firstAnimation, false );
				}
				if ( mixConfig.lastAnimation ) {
					if ( mixConfig.firstAnimation ) {
						this.animation.state.addAnimation( i, mixConfig.lastAnimation, false );
					} else {
						this.animation.state.setAnimation( i, mixConfig.lastAnimation, false );
					}
				}
			} );
		};
		group.appendChild( button );
		group.appendChild( document.createElement( HTMLElementType.BR ) );
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
						this.mixGroup.get( this.waitInputData.groupId )[ this.waitInputData.trackIndex ].firstAnimation = eventData.data.animationName;
					} else if ( this.waitInputData.targetId.includes( this.spineConfig.lastAnimationButton.button.id ) ) {
						this.mixGroup.get( this.waitInputData.groupId )[ this.waitInputData.trackIndex ].lastAnimation = eventData.data.animationName;
					}
					this.waitInputData.targetId = undefined;
					this.waitInputData.groupId = undefined;
					this.waitInputData.trackIndex = undefined;
					this.waitInputData.isWaiting = false;
				}
			}
		}, false );
	}

	protected createHTMLElement<T extends HTMLElement> ( type: string, config?: IStyle ): T {
		const element = <T> document.createElement( type );
		if ( !config ) {
			return element;
		}
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
		if ( config.fontWeight ) {
			element.style.fontWeight = config.fontWeight;
		}
		if ( config.margin ) {
			element.style.margin = config.margin;
		}
		if ( config.padding ) {
			element.style.padding = config.padding;
		}
		if ( config.color ) {
			element.style.color = config.color;
		}
		if ( config.backgroundColor ) {
			element.style.backgroundColor = config.backgroundColor;
		}
		if ( type == HTMLElementType.INPUT ) {
			if ( config.type ) {
				( element as HTMLElement as HTMLInputElement ).type = config.type;
			}
			if ( config.accept ) {
				( element as HTMLElement as HTMLInputElement ).accept = config.accept;
			}
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
	trackIndex: number;
}

export interface IPostMessage {
	type: string;
	data: any;
}

export interface ITrackGroup {
	firstAnimation: string;
	lastAnimation: string;
	mixinTime: number;
}

export enum HTMLElementType {
	DIV = 'div',
	BUTTON = 'button',
	LABEL = 'label',
	INPUT = 'input',
	BR = 'br',
	HR = 'hr',
	P = 'p'
}