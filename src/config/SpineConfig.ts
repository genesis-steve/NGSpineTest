import { MainConfig } from 'src/config/MainConfig';
import { IStyle } from 'src/utils/HTMLElementCreator';

export class SpineConfig implements ISpineConfig {
	public position: IPoint;

	protected mainConfig = new MainConfig;

	public uploadPage: IUploadPage = {
		uploadImageButton: {
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
		uploadAtlasButton: {
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
		uploadJsonButton: {
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
		confirmButton: {
			id: 'uploadConfirmButton',
			type: 'button',
			value: 'Confirm',
			position: 'relative',
			x: 65,
			y: 200,
			fontSize: 20
		}
	};

	public spineSettingsPanel: ISpineSettingsPanel = {
		container: {
			id: 'backgroundPalette',
			position: 'relative',
			x: this.mainConfig.width,
			y: -this.mainConfig.height,
			width: 50,
			height: this.mainConfig.height,
			background: 'linear-gradient(90deg, rgba(237,237,237,1) 0%, rgba(255,255,255,1) 50%, rgba(237,237,237,1) 100%)'
		},
		colorButton: {
			id: 'backgroundPaletteButton_',
			position: 'relative',
			width: 50,
			height: 50
		},
		colorList: [
			'#000000',	// black
			'#FFFFFF'	// white
		],
		addImageBackground: {
			input: {
				id: 'addImageInput',
				display: 'none',
				type: 'file'
			},
			label: {
				id: 'addImageLabel',
				position: 'relative',
				width: 30,
				height: 30,
				background: '#DADADA',
				textContent: '+',
				fontSize: 30,
				fontWeight: 'bold',
				display: 'block',
				padding: '10',
				textAlign: 'center',
				htmlFor: 'addImageInput'
			}
		},
		dragCheckbox: {
			input: {
				id: 'dragCheckboxInput',
				type: 'checkbox',
				position: 'absolute',
				width: 15,
				height: 15,
				x: 13,
				y: 400
			},
			label: {
				id: 'dragCheckboxLabel',
				position: 'absolute',
				textContent: 'drag',
				fontSize: 15,
				display: 'block',
				textAlign: 'center',
				x: 13,
				y: 420
			}
		},
		scaleSettings: {
			container: {
				position: 'absolute',
				x: 15,
				y: 530
			},
			scaleDownButton: {
				textContent: '-',
				fontSize: 10
			},
			scaleUpButton: {
				textContent: '+',
				fontSize: 10
			},
			scaleAmountText: {
				fontSize: 10,
				margin: '10 5'
			}
		},
		resetButton: {
			position: 'absolute',
			textContent: 'Reset',
			fontSize: 10,
			x: 1,
			y: 620
		}
	};

	public singleAnimationDemo: ISingleAnimationDemo = {
		title: {
			id: 'singleAnimationDemoLabel',
			textContent: 'Single Aanimation Demo',
			fontSize: 30,
			fontWeight: 'bold',
			color: '#FFFFFF',
			padding: '10 10',
			background: ElementColor.TITLE,
			lineHeight: 1,
			margin: '10px 0px 0px 0px',
			textAlign: 'center'
		},
		buttonContainer: {
			id: 'singleAnimationDemo',
			position: 'relative',
			overflow: 'auto',
			x: this.mainConfig.width + this.spineSettingsPanel.container.width,
			y: this.spineSettingsPanel.container.y - this.spineSettingsPanel.container.height,
			width: this.mainConfig.width,
			height: this.mainConfig.height,
			padding: '0 10',
			boxShadow: ElementColor.INBOX_SHADOW
		},
		animationButton: {
			fontSize: 15,
			margin: '5 0'
		},
		loopCheckbox: {
			label: {
				position: 'relative',
				textContent: 'Loop Aanimation',
				fontSize: 20,
				color: '#8C3535',
				margin: '10px 0px',
				x: 5,
				y: -2
			},
			input: {
				position: 'relative',
				type: 'checkbox',
				width: 20,
				height: 20,
				margin: '10px 0px'
			}
		}
	};

	public animationMixer: IAnimationMixer = {
		title: {
			id: 'AnimationMixerTitle',
			textContent: 'Animation Mixer',
			fontSize: 30,
			fontWeight: 'bold',
			color: '#FFFFFF',
			padding: '10 10',
			background: ElementColor.TITLE,
			lineHeight: 1,
			margin: '10px 0px 30px 0px',
			textAlign: 'center'
		},
		container: {
			id: 'AnimationMixerContainer',
			position: 'relative',
			overflow: 'auto',
			x: this.singleAnimationDemo.buttonContainer.x + this.singleAnimationDemo.buttonContainer.width + 20,
			y: this.singleAnimationDemo.buttonContainer.y - this.singleAnimationDemo.buttonContainer.height,
			width: 400,
			height: this.mainConfig.height,
			fontSize: 15,
			padding: '0 10',
			boxShadow: ElementColor.INBOX_SHADOW
		},
		mixGroup: {
			container: {
				id: 'MixGroup_',
				position: 'relative'
			},
			track: {
				title: {
					id: 'TrackLabel_',
					textContent: 'Track ',
					color: '#FFFFFF',
					background: ElementColor.TITLE,
					fontWeight: 'Bold',
					padding: '5 5',
					lineHeight: 1
				},
				container: {
					id: 'TrackGroup_',
					margin: '10 0 0 0'
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
				},
				colorList: [
					'#943E3E', '#94653E', '#94943E', '#4B943E', '#3E9491', '#3E4594', '#8D3E94'
				]
			},
			addTrackButton: {
				id: 'AddTrackButton_',
				position: 'relative',
				fontSize: 15,
				textContent: 'Add Track',
				x: 10
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
	spineSettingsPanel: ISpineSettingsPanel;
	singleAnimationDemo: ISingleAnimationDemo;
	animationMixer: IAnimationMixer;
}

export interface IPoint {
	x: number;
	y: number;
}

export interface IUploadPage {
	uploadImageButton: {
		label: IStyle;
		input: IStyle;
	};
	uploadAtlasButton: {
		label: IStyle;
		input: IStyle;
	};
	uploadJsonButton: {
		label: IStyle;
		input: IStyle;
	};
	confirmButton: IStyle;
}

export interface ISpineSettingsPanel {
	container: IStyle;
	colorButton: IStyle;
	colorList: Array<string>;
	addImageBackground: IInputWithLabel;
	dragCheckbox: IInputWithLabel;
	scaleSettings: ISpineScaleSettings;
	resetButton: IStyle;
}

export interface IInputWithLabel {
	label: IStyle;
	input: IStyle;
}

export interface ISpineScaleSettings {
	container: IStyle;
	scaleDownButton: IStyle;
	scaleUpButton: IStyle;
	scaleAmountText: IStyle;
}

export interface ISingleAnimationDemo {
	title: IStyle;
	buttonContainer: IStyle;
	animationButton: IStyle;
	loopCheckbox: ILoopCheckbox;
}

export interface ILoopCheckbox {
	label: IStyle;
	input: IStyle;
}

export interface IAnimationMixer {
	title: IStyle;
	container: IStyle;
	mixGroup: IMixGroup;
	playButton: IStyle;
	addButton: IStyle;
}

export interface IMixGroup {
	container: IStyle;
	track: ITrack;
	addTrackButton: IStyle;
}

export interface ITrack {
	title: IStyle;
	container: IStyle;
	firstAnimationButton: IInputAnimationButton;
	lastAnimationButton: IInputAnimationButton;
	mixin: IMixin;
	colorList: Array<string>;
}

export interface IInputAnimationButton {
	label: IStyle,
	button: IStyle
}

export interface IMixin {
	label: IStyle,
	input: IStyle
}

export enum ElementColor {
	TITLE = '#4A4A4A',
	INBOX_SHADOW = 'inset 0px 0px 12px -2px #919191'
}