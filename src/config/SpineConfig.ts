export class SpineConfig implements ISpineConfig {
	public assetName: string = 'LightningTallyMeter';
	public position: IPoint;

	public displayButtonContainer: IDivStyle = {
		position: 'absolute',
		overflow: 'auto',
		x: 730,
		y: 10,
		width: 600,
		height: 1280,
		fontSize: 30
	};

	public animationMixer: IDivStyle = {
		position: 'absolute',
		overflow: 'auto',
		x: this.displayButtonContainer.x + this.displayButtonContainer.width,
		y: 10,
		width: 900,
		height: 1280,
		fontSize: 30
	};
}

export interface ISpineConfig {
	assetName: string;
	position: IPoint;
	displayButtonContainer: IDivStyle;
	animationMixer: IDivStyle;
}

export interface IPoint {
	x: number;
	y: number;
}

export interface IDivStyle {
	position: string;
	overflow?: string;
	x: number;
	y: number;
	width: number;
	height: number;
	fontSize: number;
}