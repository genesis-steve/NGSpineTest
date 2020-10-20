import * as PIXI from 'pixi.js';

window.onload = () => {
	document.title = 'Spine Test';
	new Application();
};

export class Application {

	protected config: IAppConfig;

	protected pixi: PIXI.Application;

	constructor () {
		this.config = this.getAppConfig();
		this.pixi = new PIXI.Application( this.config );
		this.createElements();
		window.onresize = this.onResize.bind( this );
	}

	protected getAppConfig (): IAppConfig {
		return {
			width: 720,
			height: 1280,
			backgroundColor: 0x1099bb,
			view: document.querySelector( '#scene' )
		};
	}

	protected createElements (): void {
		const texture = PIXI.Texture.from( 'assets/bunny.png' );
		const bunny = new PIXI.Sprite( texture );
		bunny.anchor.set( 0.5 );
		bunny.x = 160;
		bunny.y = 160;
		this.pixi.stage.addChild( bunny );
		this.pixi.ticker.add( ( delta: number ) => {
			bunny.rotation -= 0.01 * delta;
		} );
		this.pixi.renderer.resize( this.config.width, this.config.height );
	}

	protected onResize (): void {
		// window.innerWidth,  window.innerHeight
		const scale = document.documentElement.clientHeight / this.config.height;
		const canvas: HTMLCanvasElement = this.pixi.renderer.view;
		const gameRatio = this.config.width / this.config.height
		console.error( document.documentElement.clientHeight, document.documentElement.clientWidth );
		canvas.style.height = `${ document.documentElement.clientHeight } px`;
		canvas.style.width = `${ document.documentElement.clientHeight * gameRatio } px`;
	}

}

export interface IAppConfig {
	width: number;
	height: number;
	backgroundColor: number;
	view: any;
}

