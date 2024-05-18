import { Doc } from './idb';

export class Setting {
  version?: string;
  showUsage: boolean = false;
  curDoc: Doc | null = null;
  height: number = 0;
  zoom: number = 0;
  //admob: boolean = false;
}
