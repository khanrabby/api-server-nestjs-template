export interface NestJsResponse {
  send: (a: any) => void;
  status: (a: number) => void;
}
