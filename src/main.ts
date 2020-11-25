import * as PIXI from 'pixi.js';
window.PIXI = PIXI;
import 'pixi-spine';
import { Application, spine, IResourceDictionary } from 'pixi.js';
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

	protected mainContainer: HTMLDivElement;
	protected uploadPage: HTMLDivElement;
	protected backgroundPalette: HTMLDivElement;
	protected singleAnimationDemo: HTMLDivElement;
	protected animationMixer: HTMLDivElement;

	protected isDrag: boolean = false;

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
		SingleAnimationDemo.onSingleAnimationPlaySignal.add( this.onSingleAnimationPlay, this );
		SingleAnimationDemo.onAnimationMixSetSignal.add( this.onAnimationMixSet, this );
	}

	protected onUploadComplete ( data: { res: IResourceDictionary, assetName: string } ): void {
		this.mainContainer.removeChild( this.uploadPage );
		this.setupAnimation( data );
		this.createBackgroundPalette();
		this.createSingleAnimationDemo();
		this.createAnimationMixer();
	}

	protected setupAnimation ( data: { res: IResourceDictionary, assetName: string } ): void {
		this.pixi = new Application( this.appConfig );
		this.pixi.view.style.cursor = 'grab';
		this.animation = new spine.Spine( data.res[ data.assetName + '.json' ].spineData );
		this.animation.scale.set( 0.5, 0.5 )
		this.animation.renderable = false;
		this.pixi.stage.addChild( this.animation );
		this.setDragAnimation();
	}

	protected setDragAnimation (): void {
		let dragStart: IPoint = { x: 0, y: 0 };
		this.pixi.view.onpointerdown = ( event ) => {
			this.isDrag = true;
			dragStart = { x: event.clientX, y: event.clientY };
		};
		this.pixi.view.onpointermove = ( event ) => {
			if ( this.isDrag ) {
				this.pixi.view.style.cursor = 'grabbing';
				const offsetX: number = event.clientX - dragStart.x;
				const offsetY: number = event.clientY - dragStart.y;
				this.animation.position.set( this.animation.position.x + offsetX, this.animation.position.y + offsetY );
				dragStart = { x: event.clientX, y: event.clientY };
			}
		};
		this.pixi.view.onpointerup = () => {
			this.pixi.view.style.cursor = 'grab';
			this.isDrag = false;
		};
		this.pixi.view.onpointerout = () => {
			this.pixi.view.style.cursor = 'grab';
			this.isDrag = false;
		};
	}

	protected onPixiColorUpdate ( color: number ): void {
		this.pixi.renderer.backgroundColor = color;
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

	protected createBackgroundPalette (): void {
		this.backgroundPalette = BackgroundPalette.init( this.spineConfig.backgroundPalette, this.animation );
		this.mainContainer.appendChild( this.backgroundPalette );
	}

	protected createSingleAnimationDemo (): void {
		this.singleAnimationDemo = SingleAnimationDemo.init( this.spineConfig.singleAnimationDemo, this.animation.spineData.animations );
		this.mainContainer.appendChild( this.singleAnimationDemo );
	}

	protected createAnimationMixer (): void {
		this.animationMixer = AnimationMixer.init( this.spineConfig.animationMixer, this.animation );
		this.mainContainer.appendChild( this.animationMixer );
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