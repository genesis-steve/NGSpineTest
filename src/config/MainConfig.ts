export class MainConfig implements IMainConfig {
	public width = 720;
	public height = 1280;
	public backgroundColor = 0x1099bb;
	public view = document.querySelector( '#scene' );
}


export interface IMainConfig {
	width: number;
	height: number;
	backgroundColor: number;
	view: any;
}