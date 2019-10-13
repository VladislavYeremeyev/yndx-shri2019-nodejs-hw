declare namespace gitHandler {
  export interface IRepoHandler {
    directoryPath: string;
  }

  export interface IServer {
		repoHandler: IRepoHandler;
		serverInstance: import('http').Server | null;
		isTesting: boolean;
  }
}

declare module "gitHandler" {
  export = gitHandler;
}
