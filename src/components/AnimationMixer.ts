import { TSMap } from 'typescript-map';
import { spine } from 'pixi.js';
import { IAnimationMixer, IInputAnimationButton, IMixin, IStyle } from 'src/config/SpineConfig';
import { HTMLElementType } from 'src/main';
import { HTMLElementCreator } from 'src/utils/HTMLElementCreator';
import { SpineDataModel } from 'src/core/SpineDataModel';


export class AnimationMixer {

	protected static spineDataModel: SpineDataModel;

	protected static config: IAnimationMixer;

	protected static container: HTMLDivElement;
	protected static mixGroup: TSMap<string, Array<ITrackGroup>>;
	protected static addButton: HTMLButtonElement;

	protected static animation: spine.Spine;

	public static init ( config: IAnimationMixer, animation: spine.Spine ): HTMLDivElement {
		this.config = config;
		this.animation = animation;
		this.container = HTMLElementCreator.createHTMLElement<HTMLDivElement>( HTMLElementType.DIV, config.container );
		this.mixGroup = new TSMap();
		this.createAddMixGroupButton();
		this.createMixGroup();
		return this.container;
	}

	protected static createAddMixGroupButton (): void {
		this.addButton = HTMLElementCreator.createHTMLElement<HTMLButtonElement>( HTMLElementType.BUTTON, this.config.addButton );
		this.addButton.onclick = () => {
			this.createMixGroup();
		}
		this.container.appendChild( this.addButton );
	}

	protected static createMixGroup (): void {
		const config = this.config.mixGroup;
		this.container.removeChild( this.addButton );
		const group: HTMLDivElement = HTMLElementCreator.createHTMLElement<HTMLDivElement>( HTMLElementType.DIV, config.container );
		group.id = config.container.id + this.mixGroup.size();
		this.mixGroup.set( group.id, [] );
		this.container.appendChild( group );

		this.createTracks( group, 2 );
		this.createPlayInput( group );

		const hiven: HTMLHRElement = document.createElement( HTMLElementType.HR );
		group.appendChild( hiven );

		this.container.appendChild( this.addButton );
	}

	protected static createTracks ( group: HTMLDivElement, amount: number ): void {
		for ( let i = 0; i < amount; i++ ) {
			this.mixGroup.get( group.id ).push( {
				firstAnimation: undefined, lastAnimation: undefined, mixinTime: 0
			} );
			const config: IStyle = this.config.mixGroup.track.container;
			const track: HTMLDivElement = HTMLElementCreator.createHTMLElement<HTMLDivElement>( HTMLElementType.DIV, config );
			track.id = `${ config.id }${ this.mixGroup.size() - 1 }_${ i }`;
			this.createTrackLabel( track, i );
			this.createFirstInputButton( track, i, group.id );
			this.createLastInputButton( track, i, group.id );
			this.createMixinTimeInput( track, i );
			group.appendChild( track );
		}
	}

	protected static createTrackLabel ( group: HTMLDivElement, trackIndex: number ): void {
		const config: IStyle = this.config.mixGroup.track.label;

		const label: HTMLLabelElement = HTMLElementCreator.createHTMLElement<HTMLLabelElement>( HTMLElementType.LABEL, config );
		label.id = `${ config.id }${ this.mixGroup.size() - 1 }_${ trackIndex }`;
		label.textContent = config.textContent + trackIndex;
		group.appendChild( label );
		group.appendChild( document.createElement( HTMLElementType.BR ) );
	}

	protected static createFirstInputButton ( group: HTMLDivElement, trackIndex: number, groupId: string ): void {
		const config: IInputAnimationButton = this.config.mixGroup.track.firstAnimationButton;

		const label: HTMLLabelElement = HTMLElementCreator.createHTMLElement<HTMLLabelElement>( HTMLElementType.LABEL, config.label );
		group.appendChild( label );

		const button: HTMLButtonElement = HTMLElementCreator.createHTMLElement<HTMLButtonElement>( HTMLElementType.BUTTON, config.button );
		button.id = `${ config.button.id }${ this.mixGroup.size() - 1 }_${ trackIndex }`;
		group.appendChild( button );
		group.appendChild( document.createElement( HTMLElementType.BR ) );

		button.onclick = () => {
			if ( !this.spineDataModel.waitInputData.isWaiting ) {
				button.textContent = 'Waiting...';
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
		button.id = `${ config.button.id }${ this.mixGroup.size() - 1 }_${ trackIndex }`;
		group.appendChild( button );
		group.appendChild( document.createElement( HTMLElementType.BR ) );

		button.onclick = () => {
			if ( !this.spineDataModel.waitInputData.isWaiting ) {
				button.textContent = 'Waiting...';
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
		label.id = `${ config.label.id }${ this.mixGroup.size() - 1 }_${ trackIndex }`;
		group.appendChild( label );

		const input: HTMLInputElement = HTMLElementCreator.createHTMLElement<HTMLInputElement>( HTMLElementType.INPUT, config.input );
		input.id = `${ config.input.id }${ this.mixGroup.size() - 1 }_${ trackIndex }`;
		group.appendChild( input );
		group.appendChild( document.createElement( HTMLElementType.BR ) );
	}

	protected static createPlayInput ( group: HTMLDivElement ): void {
		const config: IStyle = this.config.playButton;
		const idNum: number = this.mixGroup.size() - 1;

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
		group.appendChild( button );
		group.appendChild( document.createElement( HTMLElementType.BR ) );
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