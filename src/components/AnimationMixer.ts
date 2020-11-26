import { TSMap } from 'typescript-map';
import { spine } from 'pixi.js';
import { IAnimationMixer, IInputAnimationButton, IMixin } from 'src/config/SpineConfig';
import { HTMLElementCreator, HTMLElementType, IStyle } from 'src/utils/HTMLElementCreator';
import { SpineDataModel } from 'src/core/SpineDataModel';


export class AnimationMixer {

	protected static spineDataModel: SpineDataModel;

	protected static config: IAnimationMixer;

	protected static panelContainer: HTMLDivElement;

	protected static addButton: HTMLButtonElement;

	protected static mixGroup: TSMap<string, Array<ITrackGroup>>;
	protected static colorGroup: TSMap<string, string>;

	protected static animation: spine.Spine;

	public static init ( config: IAnimationMixer, animation: spine.Spine ): HTMLDivElement {
		this.config = config;
		this.animation = animation;
		this.panelContainer = HTMLElementCreator.createHTMLElement<HTMLDivElement>( HTMLElementType.DIV, config.container );
		this.mixGroup = new TSMap();
		this.colorGroup = new TSMap();
		this.createTitle( config.title );
		this.createAddMixGroupButton();
		this.createMixGroup();
		return this.panelContainer;
	}

	protected static createTitle ( config: IStyle ): void {
		const title = HTMLElementCreator.createHTMLElement<HTMLButtonElement>( HTMLElementType.P, config );
		this.panelContainer.appendChild( title );
	}

	protected static createAddMixGroupButton (): void {
		this.addButton = HTMLElementCreator.createHTMLElement<HTMLButtonElement>( HTMLElementType.BUTTON, this.config.addButton );
		this.addButton.onclick = () => {
			this.createMixGroup();
		}
		this.panelContainer.appendChild( this.addButton );
	}

	protected static createMixGroup (): void {
		const config = this.config.mixGroup;
		this.panelContainer.removeChild( this.addButton );

		const group: HTMLDivElement = HTMLElementCreator.createHTMLElement<HTMLDivElement>( HTMLElementType.DIV, config.container );
		group.id = config.container.id + this.mixGroup.size();
		this.panelContainer.appendChild( group );

		this.addGroupColor( group.id, config.track.colorList );

		const track = this.createTrack( group );
		group.appendChild( track );

		const playButtonBr: HTMLBRElement = HTMLElementCreator.createHTMLElement( HTMLElementType.BR );
		group.appendChild( playButtonBr );

		const playButton = this.createPlayButton( group );
		group.appendChild( playButton );

		const addTrackButton = this.createAddTrackButton( group );
		group.appendChild( addTrackButton );

		const hiven: HTMLHRElement = HTMLElementCreator.createHTMLElement( HTMLElementType.HR );
		group.appendChild( hiven );

		const addButtonBr: HTMLBRElement = HTMLElementCreator.createHTMLElement( HTMLElementType.BR );
		group.appendChild( addButtonBr );

		addTrackButton.onclick = () => {
			group.removeChild( playButtonBr );
			group.removeChild( playButton );
			group.removeChild( addTrackButton );
			group.removeChild( hiven );
			group.removeChild( addButtonBr );

			const track = this.createTrack( group );
			group.appendChild( track );

			group.appendChild( playButtonBr );
			group.appendChild( playButton );
			group.appendChild( addTrackButton );
			group.appendChild( hiven );
			group.appendChild( addButtonBr );
			this.mixGroup.get( group.id ).push( {
				firstAnimation: undefined, lastAnimation: undefined, mixinTime: 0
			} );
		};
		this.mixGroup.set( group.id, [ {
			firstAnimation: undefined, lastAnimation: undefined, mixinTime: 0
		} ] );
		this.panelContainer.appendChild( this.addButton );
	}

	protected static addGroupColor ( groupId: string, colorList: Array<string> ): void {
		const backgroundColor: string = colorList[ this.mixGroup.size() % colorList.length ];
		this.colorGroup.set( groupId, backgroundColor );
	}

	protected static createTrack ( group: HTMLDivElement ): HTMLDivElement {
		const config: IStyle = this.config.mixGroup.track.container;

		const track: HTMLDivElement = HTMLElementCreator.createHTMLElement<HTMLDivElement>( HTMLElementType.DIV, config );
		const trackIndex: number = this.mixGroup.has( group.id ) ? this.mixGroup.get( group.id ).length : 0;
		track.id = `${ config.id }${ this.mixGroup.size() }_${ trackIndex }`;

		const trackLabel: HTMLParagraphElement = this.createTrackLabel( group.id, trackIndex );
		track.appendChild( trackLabel );
		track.appendChild( document.createElement( HTMLElementType.BR ) );

		this.createFirstInputButton( track, trackIndex, group.id );
		this.createLastInputButton( track, trackIndex, group.id );
		this.createMixinTimeInput( track, trackIndex );
		return track;
	}

	protected static createTrackLabel ( groupId: string, trackIndex: number ): HTMLParagraphElement {
		const config: IStyle = this.config.mixGroup.track.title;
		const label: HTMLParagraphElement = HTMLElementCreator.createHTMLElement<HTMLParagraphElement>( HTMLElementType.P, config );
		label.id = `${ config.id }${ this.mixGroup.size() }_${ trackIndex }`;
		label.style.background = this.colorGroup.get( groupId );
		label.textContent = config.textContent + trackIndex;
		return label;
	}

	protected static createFirstInputButton ( group: HTMLDivElement, trackIndex: number, groupId: string ): void {
		const config: IInputAnimationButton = this.config.mixGroup.track.firstAnimationButton;

		const label: HTMLLabelElement = HTMLElementCreator.createHTMLElement<HTMLLabelElement>( HTMLElementType.LABEL, config.label );
		group.appendChild( label );

		const button: HTMLButtonElement = HTMLElementCreator.createHTMLElement<HTMLButtonElement>( HTMLElementType.BUTTON, config.button );
		button.id = `${ config.button.id }${ this.mixGroup.size() }_${ trackIndex }`;
		group.appendChild( button );
		group.appendChild( document.createElement( HTMLElementType.BR ) );

		button.onclick = () => {
			if ( !this.spineDataModel.waitInputData.isWaiting ) {
				button.textContent = '( Choose the animation from leftside )';
				this.spineDataModel.waitInputData.isWaiting = true;
				this.spineDataModel.waitInputData.targetId = button.id;
				this.spineDataModel.waitInputData.groupId = groupId;
				this.spineDataModel.waitInputData.trackIndex = trackIndex;

			} else {
				const mixConfig: ITrackGroup = this.mixGroup.get( groupId )[ this.spineDataModel.waitInputData.trackIndex ];
				mixConfig.firstAnimation = undefined;
				button.textContent = '...';
				this.spineDataModel.waitInputData.isWaiting = false;
				this.spineDataModel.waitInputData.targetId = undefined;
				this.spineDataModel.waitInputData.groupId = undefined;
				this.spineDataModel.waitInputData.trackIndex = undefined;
			}
		};
	}

	protected static createLastInputButton ( group: HTMLDivElement, trackIndex: number, groupId: string ): void {
		const config: IInputAnimationButton = this.config.mixGroup.track.lastAnimationButton;

		const label: HTMLLabelElement = HTMLElementCreator.createHTMLElement<HTMLLabelElement>( HTMLElementType.LABEL, config.label );
		group.appendChild( label );

		const button: HTMLButtonElement = HTMLElementCreator.createHTMLElement<HTMLButtonElement>( HTMLElementType.BUTTON, config.button );
		button.id = `${ config.button.id }${ this.mixGroup.size() }_${ trackIndex }`;
		group.appendChild( button );
		group.appendChild( document.createElement( HTMLElementType.BR ) );

		button.onclick = () => {
			if ( !this.spineDataModel.waitInputData.isWaiting ) {
				button.textContent = '( Choose the animation from leftside )';
				this.spineDataModel.waitInputData.isWaiting = true;
				this.spineDataModel.waitInputData.targetId = button.id;
				this.spineDataModel.waitInputData.groupId = groupId;
				this.spineDataModel.waitInputData.trackIndex = trackIndex;
			} else {
				const mixConfig: ITrackGroup = this.mixGroup.get( groupId )[ this.spineDataModel.waitInputData.trackIndex ];
				mixConfig.lastAnimation = undefined;
				button.textContent = '...';
				this.spineDataModel.waitInputData.isWaiting = false;
				this.spineDataModel.waitInputData.targetId = undefined;
				this.spineDataModel.waitInputData.groupId = undefined;
				this.spineDataModel.waitInputData.trackIndex = undefined;
			}
		};
	}

	protected static createMixinTimeInput ( group: HTMLDivElement, trackIndex: number ): void {
		const config: IMixin = this.config.mixGroup.track.mixin;

		const label: HTMLLabelElement = HTMLElementCreator.createHTMLElement<HTMLLabelElement>( HTMLElementType.LABEL, config.label );
		label.id = `${ config.label.id }${ this.mixGroup.size() }_${ trackIndex }`;
		group.appendChild( label );

		const input: HTMLInputElement = HTMLElementCreator.createHTMLElement<HTMLInputElement>( HTMLElementType.INPUT, config.input );
		input.id = `${ config.input.id }${ this.mixGroup.size() }_${ trackIndex }`;
		group.appendChild( input );
	}

	protected static createAddTrackButton ( group: HTMLDivElement ): HTMLButtonElement {
		const config = this.config.mixGroup.addTrackButton;
		const button: HTMLButtonElement = HTMLElementCreator.createHTMLElement<HTMLButtonElement>( HTMLElementType.BUTTON, config );
		button.id = `${ config.id }${ this.mixGroup.size() }`;
		return button;
	}

	protected static createPlayButton ( group: HTMLDivElement ): HTMLButtonElement {
		const config: IStyle = this.config.playButton;
		const idNum: number = this.mixGroup.size();

		const button: HTMLButtonElement = HTMLElementCreator.createHTMLElement<HTMLButtonElement>( HTMLElementType.BUTTON, config );
		button.id = config.id + idNum;
		button.onclick = () => {
			const mixConfigs: Array<ITrackGroup> = this.mixGroup.get( group.id );
			mixConfigs.forEach( ( mixConfig, i ) => {
				mixConfig.mixinTime = +( document.getElementById( `Input_${ idNum }_${ i }` ) as HTMLInputElement ).value / 1000;
				if ( mixConfig.firstAnimation && mixConfig.lastAnimation ) {
					this.animation.stateData.setMix( mixConfig.firstAnimation, mixConfig.lastAnimation, mixConfig.mixinTime );
				}
				this.animation.renderable = true;
				if ( mixConfig.firstAnimation ) {
					this.animation.state.setAnimation( i, mixConfig.firstAnimation, false );
				}
				if ( mixConfig.lastAnimation ) {
					if ( mixConfig.firstAnimation ) {
						this.animation.state.addAnimation( i, mixConfig.lastAnimation, false, 0 );
					} else {
						this.animation.state.setAnimation( i, mixConfig.lastAnimation, false );
					}
				}
			} );
		};
		return button;
	}

	public static setAnimationMix ( animationName: string ): void {
		document.getElementById( this.spineDataModel.waitInputData.targetId ).textContent = animationName;
		if ( this.spineDataModel.waitInputData.targetId.includes( this.config.mixGroup.track.firstAnimationButton.button.id ) ) {
			this.mixGroup.get( this.spineDataModel.waitInputData.groupId )[ this.spineDataModel.waitInputData.trackIndex ].firstAnimation = animationName;
		} else if ( this.spineDataModel.waitInputData.targetId.includes( this.config.mixGroup.track.lastAnimationButton.button.id ) ) {
			this.mixGroup.get( this.spineDataModel.waitInputData.groupId )[ this.spineDataModel.waitInputData.trackIndex ].lastAnimation = animationName;
		}
		this.spineDataModel.waitInputData.targetId = undefined;
		this.spineDataModel.waitInputData.groupId = undefined;
		this.spineDataModel.waitInputData.trackIndex = undefined;
		this.spineDataModel.waitInputData.isWaiting = false;
	}
}

export interface ITrackGroup {
	firstAnimation: string;
	lastAnimation: string;
	mixinTime: number;
}