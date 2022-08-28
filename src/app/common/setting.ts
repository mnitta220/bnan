import { Doc } from "./idb";

export class Setting {
  version: string;
  showUsage: boolean = false;
  curDoc: Doc = null;
  height: number;
  width: number;
  zoom: number;
  hideBlock: boolean = false;
}
