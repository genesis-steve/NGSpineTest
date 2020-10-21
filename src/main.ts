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
			} );
	}

	protected createTestButtons (): void {
		const buttonContainer = document.getElementById( 'buttonContainer' );
		buttonContainer.style.position = 'absolute';
		buttonContainer.style.top = '10px';
		buttonContainer.style.left = '730px';
		buttonContainer.style.height = '1280px';
		buttonContainer.style.overflow = 'auto';

		let animationList: string[] = [];

		this.animation.spineData.animations.forEach( animation => {
			const buttonHTML: string = '<button id = ' + animation.name + '>' + animation.name + '</button><br>';
			buttonContainer.innerHTML += buttonHTML;
			animationList.push( animation.name );;
		} );

		animationList.forEach( e => {
			document.getElementById( e ).style.fontSize = '30px';
			document.getElementById( e ).onclick = () => {
				window.postMessage( { animationName: e }, '*' );
			};
		} );

		window.addEventListener( "message", ( event ) => {
			this.animation.renderable = true;
			this.animation.state.setAnimation( 0, event.data.animationName, false );
		}, false );
	}

}
