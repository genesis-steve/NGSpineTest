export class SpineConfig implements ISpineConfig {
	public assetName: string = 'LightningTallyMeter';
	public position: IPoint;

	public displayButtonContainer: IStyle = {
		id: 'displayButtonContainer',
		position: 'relative',
		overflow: 'auto',
		x: 720,
		y: -1280,
		width: 720,
		height: 1280,
		fontSize: 30,
		margin: '0 10'
	};

	public animationMixer: IStyle = {
		id: 'animationMixer',
		position: 'relative',
		overflow: 'auto',
		x: this.displayButtonContainer.x + this.displayButtonContainer.width,
		y: -1280 - this.displayButtonContainer.height,
		width: 900,
		height: 1280,
		fontSize: 30,
		margin: '0 20'
	};

	public animationButton: IStyle = {
		fontSize: 30,
		margin: '10 0'
	};

	public mixGroup: IStyle = {
		id: 'MixGroup_'
	};

	public track: IStyle = {
		id: 'TrackGroup_',
		margin: '20 0'
	};

	public trackLabel: IStyle = {
		id: 'TrackLabel_',
		textContent: 'Track ',
		backgroundColor: '#A2E9FF'
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
			textContent: 'Set Mix Time (ms) : ',
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
	track: IStyle;
	trackLabel: IStyle;
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
	backgroundColor?: string;
	accept?: string;
}

export interface IInputAnimationButton {
	label: IStyle,
	button: IStyle
}

export interface IMixin {
	label: IStyle,
	input: IStyle
}