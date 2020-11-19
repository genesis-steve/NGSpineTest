import { TSMap } from 'typescript-map';
import * as PIXI from 'pixi.js';
window.PIXI = PIXI;
import 'pixi-spine';
import { Application, spine, Loader, LoaderResource, IResourceDictionary } from 'pixi.js';
import { IInputAnimationButton, IMixin, ISpineConfig, IStyle, SpineConfig } from 'src/config/SpineConfig';
import { IMainConfig, MainConfig } from 'src/config/MainConfig';
import { AtlasParser } from 'src/utils/AtlasParser';

window.onload = () => {
	new GmaeApplication();
};

export class GmaeApplication {

	protected appConfig: IMainConfig;
	protected spineConfig: ISpineConfig;

	protected assetName: string;

	protected pixi: Application;
	protected loader: Loader;
	protected animation: spine.Spine;

	protected mixGroup: TSMap<string, Array<ITrackGroup>>;

	protected mainContainer: HTMLDivElement;
	protected uploadContainer: HTMLDivElement;
	protected singleAnimationDemo: HTMLDivElement;
	protected animationMixer: HTMLDivElement;

	protected addButton: HTMLButtonElement;

	protected waitInputData: IWaitInputData = {
		isWaiting: false,
		targetId: undefined,
		groupId: undefined,
		trackIndex: undefined
	};

	protected loadUrls: TSMap<string, string> = new TSMap();

	constructor () {
		this.appConfig = new MainConfig();
		document.title = this.appConfig.title;
		document.body.style.overflow = 'hidden';
		this.createElements();
	}

	protected createElements (): void {
		this.spineConfig = new SpineConfig();
		window.addEventListener( 'message', ( e ) => {
			this.loadResource( e )
		} );
		this.mainContainer = <HTMLDivElement> document.getElementById( 'mainContainer' );
		this.mainContainer.appendChild( this.createHTMLElement( HTMLElementType.BR ) );
		this.createUploadPage();
	}

	protected loadResource ( e: MessageEvent<any> ): void {
		if ( !e.data || e.data.type !== 'uploadConfirm' ) {
			return;
		}
		window.removeEventListener( 'message', ( e ) => {
			this.loadResource( e )
		} );
		this.loader = new Loader();
		this.loadUrls.forEach( ( url, extension ) => {
			let loadType: number = LoaderResource.LOAD_TYPE.XHR;
			if ( extension == LoadExtension.PNG ) {
				loadType = LoaderResource.LOAD_TYPE.IMAGE;
			}
			let xhrType: string;
			if ( loadType == LoaderResource.LOAD_TYPE.XHR && extension == LoadExtension.JSON ) {
				xhrType = LoaderResource.XHR_RESPONSE_TYPE.JSON;
			}
			const fullAssetName: string = `${ this.assetName }.${ extension }`;
			this.loader.add( fullAssetName, url, { loadType, xhrType } );
		} );
		this.loader.onComplete.add( () => {
			this.processResourceJson();
			this.onCompleteUpload( this.loader.resources );
		} );
		this.loader.load();
	}

	protected createUploadPage (): void {
		this.uploadContainer = this.createHTMLElement( HTMLElementType.DIV );
		this.mainContainer.appendChild( this.uploadContainer );

		this.createUploadButton( LoadExtension.PNG, this.spineConfig.uploadButtons.IMAGE );
		this.createUploadButton( LoadExtension.ATLAS, this.spineConfig.uploadButtons.ATLAS );
		this.createUploadButton( LoadExtension.JSON, this.spineConfig.uploadButtons.JSON );
		this.createUploadConfirmButton();
	}

	protected processResourceJson (): void {
		this.loader.resources[ `${ this.assetName }.${ LoadExtension.JSON }_atlas` ] = undefined;
		const resourceJson: LoaderResource = this.loader.resources[ `${ this.assetName }.${ LoadExtension.JSON }` ];
		const resourceAtlas: LoaderResource = this.loader.resources[ `${ this.assetName }.${ LoadExtension.ATLAS }` ];
		resourceJson.extension = LoadExtension.JSON;
		resourceJson.metadata.atlasRawData = resourceAtlas.data;
		AtlasParser.parseJson(
			this.loader, this.loader.resources[ `${ this.assetName }.${ LoadExtension.JSON }` ],
			this.loadUrls.get( LoadExtension.ATLAS ),
			this.loadUrls.get( LoadExtension.PNG )
		);
	}

	protected onCompleteUpload ( res: IResourceDictionary ): void {
		this.mainContainer.removeChild( this.uploadContainer );
		this.pixi = new Application( this.appConfig );
		this.animation = new spine.Spine( res[ this.assetName + '.json' ].spineData );
		this.animation.scale.set( 0.5, 0.5 )
		this.animation.renderable = false;
		this.pixi.stage.addChild( this.animation );
		this.createBackgroundPalette();
		this.createSingleAnimationDemo();
		this.createAnimationMixer();
		this.addEventListener();
	}

	protected getObjectUrl ( file: File ): string {
		if ( window[ 'createObjcectURL' ] != undefined ) {
			return window[ 'createObjcectURL' ]( file );
		} else if ( window.URL != undefined ) {
			return window.URL.createObjectURL( file );
		} else if ( window.webkitURL != undefined ) {
			return window.webkitURL.createObjectURL( file );
		} else {
			return undefined;
		}
	}

	protected createUploadButton ( loadType: string, config: { label: IStyle, input: IStyle } ): void {
		const uploadLabel: HTMLInputElement = this.createHTMLElement(
			HTMLElementType.LABEL, config.label
		);
		const uploadInput: HTMLInputElement = this.createHTMLElement(
			HTMLElementType.INPUT, config.input
		);
		uploadInput.addEventListener( 'change', ( e ) => {
			const file: File = uploadInput.files[ 0 ];
			this.loadUrls.set( loadType, this.getObjectUrl( file ) );
			if ( loadType == LoadExtension.JSON ) {
				this.assetName = file.name.replace( '.json', '' );
			}
		} );
		this.uploadContainer.appendChild( uploadLabel );
		this.uploadContainer.appendChild( uploadInput );
		this.uploadContainer.appendChild( this.createHTMLElement( HTMLElementType.BR ) );
	}

	protected createUploadConfirmButton (): void {
		const uploadConfirmButton: HTMLInputElement = this.createHTMLElement(
			HTMLElementType.INPUT, this.spineConfig.uploadConfirmButton
		);
		uploadConfirmButton.onclick = () => {
			if ( !Object.values( LoadExtension ).every( e => this.loadUrls.keys().includes( e ) ) ) {
				return;
			}
			window.postMessage( {
				type: 'uploadConfirm'
			}, '*' );
		};
		this.uploadContainer.appendChild( uploadConfirmButton );
	}

	protected createBackgroundPalette (): void {
		const palette: HTMLDivElement = this.createHTMLElement(
			HTMLElementType.DIV, this.spineConfig.backgroundPalette
		);
		this.mainContainer.appendChild( palette );
		this.spineConfig.backgroundPaletteColorList.forEach( color => {
			const paletteButton: HTMLButtonElement = this.createHTMLElement(
				HTMLElementType.BUTTON, {
				...this.spineConfig.backgroundPaletteButton,
				backgroundColor: color
			} );
			paletteButton.onclick = () => {
				this.pixi.renderer.backgroundColor = +color.replace( '#', '0x' );
			};
			palette.appendChild( paletteButton );
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
		this.singleAnimationDemo.appendChild( this.createHTMLElement( HTMLElementType.BR ) );

		this.animation.spineData.animations.forEach( animation => {
			const config: IStyle = this.spineConfig.animationButton;
			const button: HTMLButtonElement = this.createHTMLElement<HTMLButtonElement>( HTMLElementType.BUTTON, config );
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
		const config: IStyle = this.spineConfig.mixGroup;
		const group: HTMLDivElement = this.createHTMLElement<HTMLDivElement>( HTMLElementType.DIV, config );
		group.id = config.id + this.mixGroup.size();
		this.mixGroup.set( group.id, [] );
		this.animationMixer.appendChild( group );

		this.createTracks( group, 2 );
		this.createPlayInput( group );

		const hiven: HTMLHRElement = document.createElement( HTMLElementType.HR );
		group.appendChild( hiven );

		this.animationMixer.appendChild( this.addButton );
	}

	protected createTracks ( group: HTMLDivElement, amount: number ): void {
		for ( let i = 0; i < amount; i++ ) {
			this.mixGroup.get( group.id ).push( {
				firstAnimation: undefined, lastAnimation: undefined, mixinTime: 0
			} );
			const config: IStyle = this.spineConfig.track;
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
		const config: IStyle = this.spineConfig.trackLabel;

		const label: HTMLLabelElement = this.createHTMLElement<HTMLLabelElement>( HTMLElementType.LABEL, config );
		label.id = `${ config.id }${ this.mixGroup.size() - 1 }_${ trackIndex }`;
		label.textContent = config.textContent + trackIndex;
		group.appendChild( label );
		group.appendChild( document.createElement( HTMLElementType.BR ) );
	}

	protected createFirstInputButton ( group: HTMLDivElement, trackIndex: number, groupId: string ): void {
		const config: IInputAnimationButton = this.spineConfig.firstAnimationButton;

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
				const mixConfig: ITrackGroup = this.mixGroup.get( groupId )[ this.waitInputData.trackIndex ];
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
		const config: IInputAnimationButton = this.spineConfig.lastAnimationButton;

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
				const mixConfig: ITrackGroup = this.mixGroup.get( groupId )[ this.waitInputData.trackIndex ];
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
		const config: IMixin = this.spineConfig.mixin;

		const label: HTMLLabelElement = this.createHTMLElement<HTMLLabelElement>( HTMLElementType.LABEL, config.label );
		label.id = `${ config.label.id }${ this.mixGroup.size() - 1 }_${ trackIndex }`;
		group.appendChild( label );

		const input: HTMLInputElement = this.createHTMLElement<HTMLInputElement>( HTMLElementType.INPUT, config.input );
		input.id = `${ config.input.id }${ this.mixGroup.size() - 1 }_${ trackIndex }`;
		group.appendChild( input );
		group.appendChild( document.createElement( HTMLElementType.BR ) );
	}

	protected createPlayInput ( group: HTMLDivElement ): void {
		const config: IStyle = this.spineConfig.playButton;
		const button: HTMLButtonElement = this.createHTMLElement<HTMLButtonElement>( HTMLElementType.BUTTON, config );
		const idNum: number = this.mixGroup.size() - 1;
		button.id = config.id + idNum;
		button.onclick = () => {
			const mixConfigs: Array<ITrackGroup> = this.mixGroup.get( group.id );
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
						this.animation.state.addAnimation( i, mixConfig.lastAnimation, false, 0 );
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
		const element: T = <T> document.createElement( type );
		if ( !config ) {
			return element;
		}
		if ( config.id ) {
			element.id = config.id;
		}
		if ( config.textContent ) {
			element.textContent = config.textContent;
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
		if ( config.border ) {
			element.style.border = config.border;
		}
		if ( config.color ) {
			element.style.color = config.color;
		}
		if ( config.backgroundColor ) {
			element.style.backgroundColor = config.backgroundColor;
		}
		if ( config.display ) {
			( element as HTMLElement as HTMLInputElement ).style.display = config.display;
		}
		if ( config.cursor ) {
			element.style.cursor = config.cursor;
		}
		if ( config.boxShadow ) {
			element.style.boxShadow = config.boxShadow;
		}
		if ( type == HTMLElementType.INPUT || type == HTMLElementType.BUTTON ) {
			if ( config.value ) {
				( element as any ).value = config.value;
			}
		}
		if ( type == HTMLElementType.LABEL ) {
			if ( config.htmlFor ) {
				( element as HTMLElement as HTMLLabelElement ).htmlFor = config.htmlFor;
			}
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

export enum LoadExtension {
	PNG = 'png',
	ATLAS = 'altas',
	JSON = 'json'
}