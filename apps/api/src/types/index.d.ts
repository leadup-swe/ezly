declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      DATABASE_URL: string;
      CLERK_SECRET_KEY: string;
      SENDBIRD_APPID: string;
    }
  }
}

export interface HandlerService<Return, Parameters> {
  handle: (...params: Parameters) => Return;
}

export type Service<Return, Parameters> = HandlerService<Return, [...Parameters]>;

export type TGqlCtx = { userId: string; orgId: string; query: string[] };
export type TRestCtx = { userId: string; orgId: string };
