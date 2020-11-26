import * as PIXI from 'pixi.js';
window.PIXI = PIXI;
import 'pixi-spine';
import { Application, spine, IResourceDictionary, Texture, Container, Sprite } from 'pixi.js';
import { IPoint, ISpineConfig, SpineConfig } from 'src/config/SpineConfig';
import { IMainConfig, MainConfig } from 'src/config/MainConfig';
import { HTMLElementCreator, HTMLElementType } from 'src/utils/HTMLElementCreator';
import { UploadPage } from 'src/components/UploadPage';
import { SpineSettingsPanel } from 'src/components/SpineSettingsPanel';
import { SingleAnimationDemo } from 'src/components/SingleAnimationDemo';
import { AnimationMixer } from 'src/components/AnimationMixer';

window.onload = () => {
	new GmaeApplication();
};

export class GmaeApplication {

	protected appConfig: IMainConfig;
	protected spineConfig: ISpineConfig;

	protected pixi: Application;
	protected animation: spine.Spine;
	protected background: Sprite;

	protected mainContainer: HTMLDivElement;
	protected uploadPage: HTMLDivElement;
	protected spineSettingsPanel: HTMLDivElement;
	protected singleAnimationDemo: HTMLDivElement;
	protected animationMixer: HTMLDivElement;

	protected isDrag: boolean = false;
	protected draggable: boolean = false;

	constructor () {
		this.appConfig = new MainConfig();
		document.title = this.appConfig.title;
		document.body.style.overflow = 'hidden';
		this.createElements();
	}

	protected createElements (): void {
		this.spineConfig = new SpineConfig();
		this.addListeners();
		this.mainContainer = <HTMLDivElement> document.getElementById( 'mainContainer' );
		this.mainContainer.appendChild( HTMLElementCreator.createHTMLElement( HTMLElementType.BR ) );
		this.createUploadPage();
	}

	protected addListeners (): void {
		UploadPage.onCompleteSignal.add( this.onUploadComplete, this );
		SpineSettingsPanel.onPixiColorUpdateSignal.add( this.onPixiColorUpdate, this );
		SpineSettingsPanel.onAnimationDraggableChangeSignal.add( this.onAnimationDraggableChange, this );
		SingleAnimationDemo.onSingleAnimationPlaySignal.add( this.onSingleAnimationPlay, this );
		SingleAnimationDemo.onAnimationMixSetSignal.add( this.onAnimationMixSet, this );
	}

	protected onUploadComplete ( data: { res: IResourceDictionary, assetName: string } ): void {
		this.mainContainer.removeChild( this.uploadPage );
		this.setupAnimation( data );
		this.createSpineSettingsPanel();
		this.createSingleAnimationDemo();
		this.createAnimationMixer();
	}

	protected setupAnimation ( data: { res: IResourceDictionary, assetName: string } ): void {
		this.pixi = new Application( this.appConfig );

		const backgroundContainer = new Container();
		this.pixi.stage.addChild( backgroundContainer );
		this.background = new PIXI.Sprite();
		this.background.width = this.appConfig.width;
		this.background.height = this.appConfig.height;
		backgroundContainer.addChild( this.background );

		this.animation = new spine.Spine( data.res[ data.assetName + '.json' ].spineData );
		this.animation.scale.set( 0.5, 0.5 )
		this.animation.renderable = false;
		this.pixi.stage.addChild( this.animation );

		this.setDragAnimation();
	}

	protected setDragAnimation (): void {
		let dragStart: IPoint = { x: 0, y: 0 };
		this.pixi.view.onpointerdown = ( event ) => {
			this.setPixiCursorStyle( this.draggable ? 'grabbing' : 'default' );
			this.isDrag = this.draggable;
			dragStart = { x: event.clientX, y: event.clientY };
		};
		this.pixi.view.onpointermove = ( event ) => {
			if ( this.isDrag ) {
				const offsetX: number = event.clientX - dragStart.x;
				const offsetY: number = event.clientY - dragStart.y;
				this.animation.position.set( this.animation.position.x + offsetX, this.animation.position.y + offsetY );
				dragStart = { x: event.clientX, y: event.clientY };
			}
		};
		this.pixi.view.onpointerup = () => {
			this.setPixiCursorStyle( this.draggable ? 'grab' : 'default' );
			this.isDrag = false;
		};
		this.pixi.view.onpointerout = () => {
			this.setPixiCursorStyle( this.draggable ? 'grab' : 'default' );
			this.isDrag = false;
		};
	}

	protected onPixiColorUpdate ( colorOrUrl: string, isImg: boolean ): void {
		if ( isImg ) {
			const texture = Texture.from( colorOrUrl );
			this.background.texture = texture;
		} else {
			this.pixi.renderer.backgroundColor = +colorOrUrl.replace( '#', '0x' );
		}
	}

	protected onAnimationDraggableChange ( draggable: boolean ): void {
		this.draggable = draggable;
		this.setPixiCursorStyle( this.draggable ? 'grab' : 'default' );
	}

	protected onSingleAnimationPlay ( animationName: string, isLoop?: boolean ): void {
		this.animation.renderable = true;
		this.animation.state.setAnimation( 0, animationName, isLoop );
	}

	protected onAnimationMixSet ( animationName: string ): void {
		AnimationMixer.setAnimationMix( animationName );
	}

	protected createUploadPage (): void {
		this.uploadPage = UploadPage.init( this.spineConfig.uploadPage );
		this.mainContainer.appendChild( this.uploadPage );
	}

	protected createSpineSettingsPanel (): void {
		this.spineSettingsPanel = SpineSettingsPanel.init( this.spineConfig.spineSettingsPanel, this.animation );
		this.mainContainer.appendChild( this.spineSettingsPanel );
	}

	protected createSingleAnimationDemo (): void {
		this.singleAnimationDemo = SingleAnimationDemo.init( this.spineConfig.singleAnimationDemo, this.animation );
		this.mainContainer.appendChild( this.singleAnimationDemo );
	}

	protected createAnimationMixer (): void {
		this.animationMixer = AnimationMixer.init( this.spineConfig.animationMixer, this.animation );
		this.mainContainer.appendChild( this.animationMixer );
	}

	protected setPixiCursorStyle ( style: string ): void {
		this.pixi.view.style.cursor = style;
	}

}

export enum EventType {
	PLAY_ANIMATION = 'playAnimation',
	PLAY_MIXED_ANIMATION = 'playMixedAnimation',
	SET_ANIMATION_MIX = 'setAnimationMix'
}

export interface IPostMessage {
	type: string;
	data: any;
}