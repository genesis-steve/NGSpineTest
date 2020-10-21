export class SpineConfig implements ISpineConfig {
	public assetName: string = 'LightningTallyMeter';
	public position: IPoint;
}

export interface ISpineConfig {
	assetName: string;
	position: IPoint;
}

export interface IPoint {
	x: number;
	y: number;
}