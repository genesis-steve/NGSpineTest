import * as PIXI from 'pixi.js';
window.PIXI = PIXI;
import 'pixi-spine';
import { Application, spine, IResourceDictionary } from 'pixi.js';
import { ISpineConfig, SpineConfig } from 'src/config/SpineConfig';
import { IMainConfig, MainConfig } from 'src/config/MainConfig';
import { HTMLElementCreator } from 'src/utils/HTMLElementCreator';
import { UploadPage } from 'src/components/UploadPage';
import { BackgroundPalette } from 'src/components/BackgroundPalette';
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
	protected singleAnimationDemo: HTMLDivElement;
	protected animationMixer: HTMLDivElement;

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
		BackgroundPalette.onPixiColorUpdateSignal.add( this.onPixiColorUpdate, this );
		SingleAnimationDemo.onSingleAnimationPlaySignal.add( this.onSingleAnimationPlay, this );
		SingleAnimationDemo.onAnimationMixSetSignal.add( this.onAnimationMixSet, this );
	}

	protected onUploadComplete ( data: { res: IResourceDictionary, assetName: string } ): void {
		this.mainContainer.removeChild( this.uploadPage );
		this.pixi = new Application( this.appConfig );
		this.animation = new spine.Spine( data.res[ data.assetName + '.json' ].spineData );
		this.animation.scale.set( 0.5, 0.5 )
		this.animation.renderable = false;
		this.pixi.stage.addChild( this.animation );
		this.createBackgroundPalette();
		this.createSingleAnimationDemo();
		this.createAnimationMixer();
	}

	protected onPixiColorUpdate ( color: number ): void {
		this.pixi.renderer.backgroundColor = color;
	}

	protected onSingleAnimationPlay ( animationName: string ): void {
		this.animation.renderable = true;
		this.animation.state.setAnimation( 0, animationName, false );
	}

	protected onAnimationMixSet ( animationName: string ): void {
		AnimationMixer.setAnimationMix( animationName );
	}

	protected createUploadPage (): void {
		this.uploadPage = UploadPage.init( this.spineConfig.uploadPage );
		this.mainContainer.appendChild( this.uploadPage );
	}

	protected createBackgroundPalette (): void {
		this.mainContainer.appendChild( BackgroundPalette.init( this.spineConfig.backgroundPalette ) );
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

export enum HTMLElementType {
	DIV = 'div',
	BUTTON = 'button',
	LABEL = 'label',
	INPUT = 'input',
	BR = 'br',
	HR = 'hr',
	P = 'p'
}