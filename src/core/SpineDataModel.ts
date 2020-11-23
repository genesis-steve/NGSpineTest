import { Singleton } from 'typescript-ioc';

@Singleton
export class SpineDataModel {
	protected _waitInputData: IWaitInputData = {
		isWaiting: false,
		targetId: undefined,
		groupId: undefined,
		trackIndex: undefined
	};
	public get waitInputData (): IWaitInputData {
		return this._waitInputData;
	}
}

export interface IWaitInputData {
	isWaiting: boolean;
	targetId: string;
	groupId: string;
	trackIndex: number;
}