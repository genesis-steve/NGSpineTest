import { MainConfig } from 'src/config/MainConfig';

export class SpineConfig implements ISpineConfig {
	public position: IPoint;

	protected mainConfig = new MainConfig;

	public backgroundPalette: IStyle = {
		id: 'backgroundPalette',
		position: 'relative',
		x: this.mainConfig.width,
		y: -this.mainConfig.height,
		width: 50,
		height: this.mainConfig.height,
		backgroundColor: '#E0E0E0'
	};

	public backgroundPaletteColorList: Array<string> = [
		'#000000',	// black
		'#D5DBDB',	// gray
		'#FFFFFF',	// white
		'#F2D7D5',	// red
		'#D7BDE2',	// purple
		'#A9CCE3',	// blue
		'#A3E4D7',	// green blue
		'#A9DFBF',	// green
		'#F9E79F ',	// yellow
		'#F5CBA7 ',	// orange
	];


	public backgroundPaletteButton: IStyle = {
		id: 'backgroundPaletteButton_',
		position: 'relative',
		width: 50,
		height: 50,
		backgroundColor: 'red'
	};

	public singleAnimationDemo = {
		label: {
			id: 'singleAnimationDemoLabel',
			textContent: 'Single Aanimation Demo',
			fontSize: 30,
			fontWeight: 'bold',
			color: '#FFFFFF',
			padding: '0 10',
			backgroundColor: '#4A4A4A'
		},
		buttonContainer: {
			id: 'singleAnimationDemo',
			position: 'relative',
			overflow: 'auto',
			x: this.mainConfig.width + this.backgroundPalette.width,
			y: -this.mainConfig.height - this.backgroundPalette.height,
			width: this.mainConfig.width,
			height: this.mainConfig.height,
			fontSize: 15,
			margin: '0 10'
		}
	};

	public animationMixer: IStyle = {
		id: 'animationMixer',
		position: 'relative',
		overflow: 'auto',
		x: this.singleAnimationDemo.buttonContainer.x + this.singleAnimationDemo.buttonContainer.width,
		y: this.singleAnimationDemo.buttonContainer.y - this.singleAnimationDemo.buttonContainer.height,
		width: 400,
		height: this.mainConfig.height,
		fontSize: 15,
		margin: '0 20'
	};

	public animationButton: IStyle = {
		fontSize: 15,
		margin: '5 0'
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
			fontSize: 15,
			margin: '5 0'
		},
		button: {
			id: 'FirstAnimBtn_',
			textContent: '...',
			fontSize: 15,
			margin: '5 0'
		}
	};

	public lastAnimationButton: IInputAnimationButton = {
		label: {
			id: 'LastAnimLabel_',
			textContent: 'Last Animation : ',
			fontSize: 15,
			margin: '5 0'
		},
		button: {
			id: 'LastAnimBtn_',
			textContent: '...',
			fontSize: 15,
			margin: '5 0'
		}
	};

	public mixin: IMixin = {
		label: {
			id: 'MixinLabel_',
			textContent: 'Set Mix Time (ms) : ',
			fontSize: 15,
			margin: '5 0'
		},
		input: {
			id: 'Input_',
			type: 'text',
			value: '0',
			fontSize: 15,
			margin: '5 0',
			width: 100
		}
	};

	public playButton: IStyle = {
		id: 'Play_',
		textContent: 'Play',
		fontSize: 15,
		margin: '5 0 30 0'
	};

	public addButton: IStyle = {
		id: 'AddButton',
		textContent: '+',
		fontSize: 15,
		margin: '5 0'
	};

	public uploadButtons: IUploadButtons = {
		IMAGE: {
			label: {
				id: 'uploadLabel_IMAGE',
				htmlFor: 'uploadInput_IMAGE',
				position: 'relative',
				x: 50,
				y: 50,
				fontSize: 15,
				padding: '6px 12px',
				textContent: 'Upload PNG : ',
				display: 'inline-block'
			},
			input: {
				id: 'uploadInput_IMAGE',
				type: 'file',
				accept: '.png',
				position: 'relative',
				x: 50,
				y: 50,
				fontSize: 15
			}
		},
		ATLAS: {
			label: {
				id: 'uploadLabel_ATLAS',
				htmlFor: 'uploadInput_ATLAS',
				position: 'relative',
				x: 50,
				y: 100,
				fontSize: 15,
				padding: '6px 12px',
				textContent: 'Upload ATLAS : ',
				display: 'inline-block'
			},
			input: {
				id: 'uploadInput_ATLAS',
				type: 'file',
				accept: '.atlas',
				position: 'relative',
				x: 50,
				y: 100,
				fontSize: 15
			}
		},
		JSON: {
			label: {
				id: 'uploadLabel_JSON',
				htmlFor: 'uploadInput_JSON',
				position: 'relative',
				x: 50,
				y: 150,
				fontSize: 15,
				padding: '6px 12px',
				textContent: 'Upload JSON : ',
				display: 'inline-block'
			},
			input: {
				id: 'uploadInput_JSON',
				type: 'file',
				accept: '.json',
				position: 'relative',
				x: 50,
				y: 150,
				fontSize: 15
			}
		}
	};

	public uploadConfirmButton: IStyle = {
		id: 'uploadConfirmButton',
		type: 'button',
		value: 'Confirm',
		position: 'relative',
		x: 65,
		y: 200,
		fontSize: 15
	};
}

export interface ISpineConfig {
	position: IPoint;
	backgroundPaletteColorList: Array<string>;
	backgroundPaletteButton: IStyle;
	backgroundPalette: IStyle;
	singleAnimationDemo: {
		label: IStyle,
		buttonContainer: IStyle
	};
	animationMixer: IStyle;
	animationButton: IStyle;
	mixGroup: IStyle;
	track: IStyle;
	trackLabel: IStyle;
	firstAnimationButton: IInputAnimationButton;
	lastAnimationButton: IInputAnimationButton;
	mixin: IMixin;
	playButton: IStyle;
	addButton: IStyle;
	uploadButtons: IUploadButtons;
	uploadConfirmButton: IStyle;
}

export interface IUploadButtons {
	IMAGE: {
		label: IStyle;
		input: IStyle;
	};
	ATLAS: {
		label: IStyle;
		input: IStyle;
	};
	JSON: {
		label: IStyle;
		input: IStyle;
	};
}

export interface IPoint {
	x: number;
	y: number;
}

export interface IStyle {
	id?: string;
	margin?: string;
	padding?: string;
	position?: string;
	overflow?: string;
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	fontSize?: number;
	fontWeight?: string;
	color?: string;
	backgroundColor?: string;
	textContent?: string;
	display?: string;
	value?: string;
	cursor?: string;
	border?: string;
	boxShadow?: string;

	/** label */
	htmlFor?: string;

	/** input */
	type?: string;
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