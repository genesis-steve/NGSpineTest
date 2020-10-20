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

	protected createElements (): void {
		this.setupAnimation();
	}

	protected setupAnimation (): void {
		this.spineConfig = new SpineConfig();
		PIXI.loader.add( 'LightningTallyMeter', 'assets/LightningTallyMeter.json' )
			.load( ( loader, res ) => {
				this.animation = new spine.Spine( res.LightningTallyMeter.spineData );
				this.addChild( this.animation );
				this.animation.state.setAnimation( 0, 'TallyMeter_03_Appear', false );
			} );
	}

	public addChild ( displayObj: DisplayObject ): void {
		this.pixi.stage.addChild( displayObj );
	}

}

