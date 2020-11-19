export class MainConfig implements IMainConfig {
	public title: string = 'Spine Test';
	public width = 360;
	public height = 640;
	public backgroundColor = 0x000000;
	public view = document.querySelector( '#scene' );
}


export interface IMainConfig {
	title: string;
	width: number;
	height: number;
	backgroundColor: number;
	view: any;
}