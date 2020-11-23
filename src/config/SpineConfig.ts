import { MainConfig } from 'src/config/MainConfig';
import { IStyle } from 'src/utils/HTMLElementCreator';

export class SpineConfig implements ISpineConfig {
	public position: IPoint;

	protected mainConfig = new MainConfig;

	public uploadPage: IUploadPage = {
		IMAGE: {
			label: {
				id: 'uploadLabel_IMAGE',
				htmlFor: 'uploadInput_IMAGE',
				position: 'relative',
				x: 50,
				y: 50,
				fontSize: 20,
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
				fontSize: 20
			}
		},
		ATLAS: {
			label: {
				id: 'uploadLabel_ATLAS',
				htmlFor: 'uploadInput_ATLAS',
				position: 'relative',
				x: 50,
				y: 100,
				fontSize: 20,
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
				fontSize: 20
			}
		},
		JSON: {
			label: {
				id: 'uploadLabel_JSON',
				htmlFor: 'uploadInput_JSON',
				position: 'relative',
				x: 50,
				y: 150,
				fontSize: 20,
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
				fontSize: 20
			}
		},
		CONFIRM: {
			id: 'uploadConfirmButton',
			type: 'button',
			value: 'Confirm',
			position: 'relative',
			x: 65,
			y: 200,
			fontSize: 20
		}
	};

	public backgroundPalette: IBackgroundPalette = {
		container: {
			id: 'backgroundPalette',
			position: 'relative',
			x: this.mainConfig.width,
			y: -this.mainConfig.height,
			width: 50,
			height: this.mainConfig.height,
			backgroundColor: '#E0E0E0'
		},
		button: {
			id: 'backgroundPaletteButton_',
			position: 'relative',
			width: 50,
			height: 50,
			backgroundColor: 'red'
		},
		colorList: [
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
		]
	};

	public singleAnimationDemo: ISingleAnimationDemo = {
		label: {
			id: 'singleAnimationDemoLabel',
			textContent: 'Single Aanimation Demo',
			fontSize: 30,
			fontWeight: 'bold',
			color: '#FFFFFF',
			padding: '0 10',
			backgroundColor: '#4A4A4A'
		},
		description: {
			textContent: 'If you want to make animation looping, please toggle on the checkbox.',
			fontSize: 20
		},
		buttonContainer: {
			id: 'singleAnimationDemo',
			position: 'relative',
			overflow: 'auto',
			x: this.mainConfig.width + this.backgroundPalette.container.width,
			y: -this.mainConfig.height - this.backgroundPalette.container.height,
			width: this.mainConfig.width,
			height: this.mainConfig.height,
			margin: '0 10'
		},
		animationButton: {
			fontSize: 20,
			margin: '5 0'
		}
	};

	public animationMixer: IAnimationMixer = {
		container: {
			id: 'animationMixer',
			position: 'relative',
			overflow: 'auto',
			x: this.singleAnimationDemo.buttonContainer.x + this.singleAnimationDemo.buttonContainer.width,
			y: this.singleAnimationDemo.buttonContainer.y - this.singleAnimationDemo.buttonContainer.height,
			width: 400,
			height: this.mainConfig.height,
			fontSize: 15,
			margin: '0 20'
		},
		mixGroup: {
			container: {
				id: 'MixGroup_'
			},
			track: {
				label: {
					id: 'TrackLabel_',
					textContent: 'Track ',
					backgroundColor: '#A2E9FF'
				},
				container: {
					id: 'TrackGroup_',
					margin: '20 0'
				},
				firstAnimationButton: {
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
				},
				lastAnimationButton: {
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
				},
				mixin: {
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
				}
			}
		},
		playButton: {
			id: 'Play_',
			textContent: 'Play',
			fontSize: 15,
			margin: '5 0 30 0'
		},
		addButton: {
			id: 'AddButton',
			textContent: '+',
			fontSize: 15,
			margin: '5 0'
		}
	};
}

export interface ISpineConfig {
	position: IPoint;
	uploadPage: IUploadPage;
	backgroundPalette: IBackgroundPalette;
	singleAnimationDemo: ISingleAnimationDemo;
	animationMixer: IAnimationMixer;
}

export interface IPoint {
	x: number;
	y: number;
}

export interface IUploadPage {
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
	CONFIRM: IStyle;
}

export interface IBackgroundPalette {
	container: IStyle;
	button: IStyle;
	colorList: Array<string>;
}

export interface ISingleAnimationDemo {
	label: IStyle;
	description: IStyle;
	buttonContainer: IStyle;
	animationButton: IStyle;
}

export interface IAnimationMixer {
	container: IStyle;
	mixGroup: IMixGroup;
	playButton: IStyle;
	addButton: IStyle;
}

export interface IMixGroup {
	container: IStyle;
	track: ITrack;
}

export interface ITrack {
	label: IStyle;
	container: IStyle;
	firstAnimationButton: IInputAnimationButton;
	lastAnimationButton: IInputAnimationButton;
	mixin: IMixin;
}

export interface IInputAnimationButton {
	label: IStyle,
	button: IStyle
}

export interface IMixin {
	label: IStyle,
	input: IStyle
}