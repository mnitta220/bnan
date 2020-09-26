import { Doc } from "./idb";

export class Setting {
  version: string;
  showUsage: boolean = false;
  curDoc: Doc = null;
  height: number;
  admob: boolean = false;
}
