import * as MiniSignal from 'mini-signals';
import { IResourceDictionary, Loader, LoaderResource } from 'pixi.js';
import { TSMap } from 'typescript-map';
import { IStyle, IUploadPage } from 'src/config/SpineConfig';
import { HTMLElementType, LoadExtension } from 'src/main';
import { AtlasParser } from 'src/utils/AtlasParser';
import { HTMLElementCreator } from 'src/utils/HTMLElementCreator';

export class UploadPage {

	protected static assetName: string;

	protected static loader: Loader;

	protected static loadUrls: TSMap<string, string> = new TSMap();

	public static onCompleteSignal: MiniSignal = new MiniSignal();

	public static init ( config: IUploadPage ): HTMLDivElement {
		const uploadContainer: HTMLDivElement = HTMLElementCreator.createHTMLElement( HTMLElementType.DIV );
		this.createUploadButton( uploadContainer, LoadExtension.PNG, config.IMAGE );
		this.createUploadButton( uploadContainer, LoadExtension.ATLAS, config.ATLAS );
		this.createUploadButton( uploadContainer, LoadExtension.JSON, config.JSON );
		this.createUploadConfirmButton( uploadContainer, config.CONFIRM );
		return uploadContainer;
	}

	protected static processResourceJson (): void {
		this.loader.resources[ `${ this.assetName }.${ LoadExtension.JSON }_atlas` ] = undefined;
		const resourceJson: LoaderResource = this.loader.resources[ `${ this.assetName }.${ LoadExtension.JSON }` ];
		const resourceAtlas: LoaderResource = this.loader.resources[ `${ this.assetName }.${ LoadExtension.ATLAS }` ];
		resourceJson.extension = LoadExtension.JSON;
		resourceJson.metadata.atlasRawData = resourceAtlas.data;
		AtlasParser.parseJson(
			this.loader, this.loader.resources[ `${ this.assetName }.${ LoadExtension.JSON }` ],
			this.loadUrls.get( LoadExtension.ATLAS ),
			this.loadUrls.get( LoadExtension.PNG )
		);
	}

	protected static onCompleteUpload ( res: IResourceDictionary ): void {
		this.onCompleteSignal.dispatch( { res, assetName: this.assetName } );
	}

	protected static getObjectUrl ( file: File ): string {
		if ( window[ 'createObjcectURL' ] != undefined ) {
			return window[ 'createObjcectURL' ]( file );
		} else if ( window.URL != undefined ) {
			return window.URL.createObjectURL( file );
		} else if ( window.webkitURL != undefined ) {
			return window.webkitURL.createObjectURL( file );
		} else {
			return undefined;
		}
	}

	protected static createUploadButton ( container: HTMLDivElement, loadType: string, config: { label: IStyle, input: IStyle } ): void {
		const uploadLabel: HTMLInputElement = HTMLElementCreator.createHTMLElement(
			HTMLElementType.LABEL, config.label
		);
		const uploadInput: HTMLInputElement = HTMLElementCreator.createHTMLElement(
			HTMLElementType.INPUT, config.input
		);
		uploadInput.addEventListener( 'change', ( e ) => {
			const file: File = uploadInput.files[ 0 ];
			this.loadUrls.set( loadType, this.getObjectUrl( file ) );
			if ( loadType == LoadExtension.JSON ) {
				this.assetName = file.name.replace( '.json', '' );
			}
		} );
		container.appendChild( uploadLabel );
		container.appendChild( uploadInput );
		container.appendChild( HTMLElementCreator.createHTMLElement( HTMLElementType.BR ) );
	}

	public static createUploadConfirmButton ( container: HTMLDivElement, config: IStyle ): void {
		const uploadConfirmButton: HTMLInputElement = HTMLElementCreator.createHTMLElement(
			HTMLElementType.INPUT, config
		);
		uploadConfirmButton.onclick = () => {
			if ( !Object.values( LoadExtension ).every( e => this.loadUrls.keys().includes( e ) ) ) {
				return;
			}
			this.loadResource();
		};
		container.appendChild( uploadConfirmButton );
	}

	protected static loadResource (): void {
		this.loader = new Loader();
		this.loadUrls.forEach( ( url, extension ) => {
			let loadType: number = LoaderResource.LOAD_TYPE.XHR;
			if ( extension == LoadExtension.PNG ) {
				loadType = LoaderResource.LOAD_TYPE.IMAGE;
			}
			let xhrType: string;
			if ( loadType == LoaderResource.LOAD_TYPE.XHR && extension == LoadExtension.JSON ) {
				xhrType = LoaderResource.XHR_RESPONSE_TYPE.JSON;
			}
			const fullAssetName: string = `${ this.assetName }.${ extension }`;
			this.loader.add( fullAssetName, url, { loadType, xhrType } );
		} );
		this.loader.onComplete.add( () => {
			this.processResourceJson();
			this.onCompleteUpload( this.loader.resources );
		} );
		this.loader.load();
	}

}