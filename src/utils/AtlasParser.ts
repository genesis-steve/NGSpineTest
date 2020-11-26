import * as PIXI from 'pixi.js';
window.PIXI = PIXI;
import 'pixi-spine';
import { spine, Loader, LoaderResource, } from 'pixi.js';
import { throws } from 'assert';

function isJson ( resource: PIXI.LoaderResource ) {
	return resource.type === PIXI.LoaderResource.TYPE.JSON;
}

export function staticImageLoader ( pages: { [ key: string ]: ( PIXI.BaseTexture | PIXI.Texture ) } ) {
	return function ( line: any, callback: any ) {
		let page = pages[ line ] || pages[ 'default' ] as any;
		if ( page && page.baseTexture )
			callback( page.baseTexture );
		else
			callback( page );
	}
}

export function imageLoaderAdapter ( loader: Loader, namePrefix: any, baseUrl: any, imageOptions: any ) {
	if ( baseUrl && baseUrl.lastIndexOf( '/' ) !== ( baseUrl.length - 1 ) ) {
		baseUrl += '/';
	}
	return function ( line: string, callback: ( baseTexture: PIXI.BaseTexture ) => any ) {
		const name = namePrefix + line;
		const url = baseUrl + line;

		const cachedResource = loader.resources[ name ];
		if ( cachedResource ) {
			const done = () => {
				callback( cachedResource.texture.baseTexture )
			}
			if ( cachedResource.texture ) {
				done();
			}
		} else {
			loader.add( name, url, imageOptions, ( resource: PIXI.LoaderResource ) => {
				if ( !resource.error ) {
					callback( resource.texture.baseTexture );
				} else {
					callback( null );
				}
			} );
		}
	}
}

export class AtlasParser {

	public static parseJson ( loader: PIXI.Loader, resource: PIXI.LoaderResource, atlasPath: string, imagePath: string ): void {
		if ( !resource.data ) {
			return;
		}
		const isJsonSpineModel: boolean = isJson( resource ) && resource.data.bones;
		if ( !isJsonSpineModel ) {
			return;
		}
		const parser = new spine.core.SkeletonJson( null );
		let dataToParse = resource.data;

		const metadataSkeletonScale = resource.metadata ? resource.metadata.spineSkeletonScale : null;

		if ( metadataSkeletonScale ) {
			parser.scale = metadataSkeletonScale;
		}

		const metadataAtlas = resource.metadata ? resource.metadata.spineAtlas : null;
		if ( metadataAtlas === false ) {
			return;
		}
		if ( metadataAtlas && metadataAtlas.pages ) {
			//its an atlas!
			parser.attachmentLoader = new spine.core.AtlasAttachmentLoader( metadataAtlas );
			resource.spineData = parser.readSkeletonData( dataToParse );
			resource.spineAtlas = metadataAtlas;
			return;
		}

		const atlasOptions = {
			crossOrigin: resource.crossOrigin,
			xhrType: PIXI.LoaderResource.XHR_RESPONSE_TYPE.TEXT,
			metadata: null,
			parentResource: resource
		};
		const imageOptions = {
			crossOrigin: resource.crossOrigin,
			metadata: resource.metadata.imageMetadata || null,
			parentResource: resource
		};

		const namePrefix: string = '';
		const adapter = resource.metadata.images ? staticImageLoader( resource.metadata.images )
			: resource.metadata.image ? staticImageLoader( { 'default': resource.metadata.image } )
				: resource.metadata.imageLoader ? resource.metadata.imageLoader( this, namePrefix, imagePath, imageOptions )
					: imageLoaderAdapter( loader, namePrefix, imagePath, imageOptions );

		const createSkeletonWithRawAtlas = function ( rawData: string ) {
			new spine.core.TextureAtlas( rawData, adapter, function ( spineAtlas ) {
				if ( spineAtlas ) {
					parser.attachmentLoader = new spine.core.AtlasAttachmentLoader( spineAtlas );
					resource.spineData = parser.readSkeletonData( dataToParse );
					resource.spineAtlas = spineAtlas;
				}
				return;
			} );
		};

		if ( resource.metadata && resource.metadata.atlasRawData ) {
			createSkeletonWithRawAtlas( resource.metadata.atlasRawData )
		} else {
			loader.add( resource.name + '.atlas', atlasPath, atlasOptions, function ( atlasResource: any ) {
				if ( !atlasResource.error ) {
					createSkeletonWithRawAtlas( atlasResource.data );
				} else {
					return;
				}
			} );
		}
	}

	public static getObjectUrl ( file: File ): string {
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
}