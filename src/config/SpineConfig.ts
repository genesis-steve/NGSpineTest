export class SpineConfig implements ISpineConfig {
	public assetName: string = 'LightningTallyMeter';
	public position: IPoint;

	public displayButtonContainer: IStyle = {
		id: 'displayButtonContainer',
		position: 'absolute',
		overflow: 'auto',
		x: 730,
		y: 10,
		width: 720,
		height: 1280,
		fontSize: 30,
		margin: '10 0'
	};

	public animationMixer: IStyle = {
		id: 'animationMixer',
		position: 'absolute',
		overflow: 'auto',
		x: this.displayButtonContainer.x + this.displayButtonContainer.width,
		y: 10,
		width: 900,
		height: 1280,
		fontSize: 30,
		margin: '10 0'
	};

	public animationButton: IStyle = {
		fontSize: 30,
		margin: '10 0'
	};

	public mixGroup: IStyle = {
		id: 'MixGroup_'
	};

	public firstAnimationButton: IInputAnimationButton = {
		label: {
			id: 'FirstAnimLabel_',
			textContent: 'First Animation : ',
			fontSize: 30,
			margin: '10 0'
		},
		button: {
			id: 'FirstAnimBtn_',
			textContent: '...',
			fontSize: 30,
			margin: '10 0'
		}
	};

	public lastAnimationButton: IInputAnimationButton = {
		label: {
			id: 'LastAnimLabel_',
			textContent: 'Last Animation : ',
			fontSize: 30,
			margin: '10 0'
		},
		button: {
			id: 'LastAnimBtn_',
			textContent: '...',
			fontSize: 30,
			margin: '10 0'
		}
	};

	public mixin: IMixin = {
		label: {
			id: 'MixinLabel_',
			textContent: 'Set Mix Time : ',
			fontSize: 30,
			margin: '10 0'
		},
		input: {
			id: 'Input_',
			type: 'text',
			value: '0',
			fontSize: 30,
			margin: '10 0',
			width: 100
		}
	};

	public playButton: IStyle = {
		id: 'Play_',
		textContent: 'Play',
		fontSize: 30,
		margin: '10 0 30 0'
	};

	public addButton: IStyle = {
		id: 'AddButton',
		textContent: '+',
		fontSize: 30,
		margin: '10 0'
	};
}

export interface ISpineConfig {
	assetName: string;
	position: IPoint;
	displayButtonContainer: IStyle;
	animationMixer: IStyle;
	animationButton: IStyle;
	mixGroup: IStyle;
	firstAnimationButton: IInputAnimationButton;
	lastAnimationButton: IInputAnimationButton;
	mixin: {
		label: IStyle,
		input: IStyle
	};
	playButton: IStyle;
	addButton: IStyle;
}

export interface IPoint {
	x: number;
	y: number;
}

export interface IStyle {
	id?: string;
	textContent?: string;
	value?: string;
	position?: string;
	overflow?: string;
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	fontSize?: number;
	margin?: string;
	type?: string;
}

export interface IInputAnimationButton {
	label: IStyle,
	button: IStyle
}

export interface IMixin {
	label: IStyle,
	input: IStyle
}