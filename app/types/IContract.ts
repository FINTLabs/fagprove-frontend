export interface IContract {
  adapterId: string;
  orgId: string;
  userName: string;
  heartBeatIntervalInMinutes: number;
  time: number;
  capabilities: ICapabilties[];
}

export interface ICapabilties {
  domainName: String;
  packageName: String;
  resourceName: string;
  fullSyncIntervalInDays: number;
  detaSyncInterval: String;
}

export interface IContractModal {
  open: boolean;
  contract: IContract | null;
}
