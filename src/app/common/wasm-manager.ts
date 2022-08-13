//import init, { ping } from "../../../../bnanw/pkg/bnanw.js";
import init, { ping, set_doc, set_section, set_source, build_tree, load_font, draw_doc, resize, tab_change, mode_change, touch_start, touch_move, touch_end, single_click, double_click, tool_func, stroke_back, stroke_clear, get_section, hide } from "../../assets/pkg/bnanw.js";

export class WasmManager {
  //wasm: any;

  async wasmInit() {
    // console.log("***wasmInit");
    await init();

    let r = ping(100);

    if (r != 101) {
      throw Error("wasm.ping returns: " + r);
    }
  }

  /**
  * 文書をセットする
  *
  * # 引数
  * ## id
  * ## title
  * ## vertical
  * - 1 : 横書き
  * - 2 : 縦書き
  * ## font_size
  * ## current
  *
  * # 戻り値
  * なし
  */
  setDoc(id: number, title: string, vertical: number, font_size: number, current: number): void {
    //console.log("***WasmManager.setDoc");
    set_doc(id, title, vertical, font_size, current);
  }

  /**
  * 段落をセットする
  *
  * # 引数
  * ## current
  *
  * # 戻り値
  * なし
  */
  setSection(current: number): void {
    //console.log("***WasmManager.setDoc");
    set_section(current);
  }

  /**
  * 文書の行をセットする
  *
  * # 引数
  * ## seq
  * ## text
  *
  * # 戻り値
  * なし
  */
  setSource(seq: number, text: string) {
    //console.log("***WasmManager.setSource");
    set_source(seq, text);
  }

  /**
  * 文書ツリーを生成する
  *
  * # 引数
  * なし
  *
  * # 戻り値
  * なし
  */
  buildTree() {
    //console.log("***WasmManager.buildTree");
    build_tree();
  }

  /**
  * Googleフォントロード処理
  *
  * # 引数
  * なし
  *
  * # 戻り値
  * なし
  */
  loadFont() {
    load_font();
  }

  /**
  * 文書を表示する
  *
  * # 引数
  * ## width
  * - キャンバスの幅
  * ## height
  * - キャンバスの高さ
  * ## is_dark
  * - true: ダークモード
  * ## is_android
  * - true: Android
  *
  * # 戻り値
  * なし
  */
  drawDoc(width: number, height: number, is_dark: boolean, is_android: boolean) {
    draw_doc(width, height, is_dark, is_android);
  }

  /**
  * キャンバスサイズ変更
  *
  * # 引数
  * ## width
  * - キャンバスの幅
  * ## height
  * - キャンバスの高さ
  * ## is_dark
  * - true: ダークモード
  *
  * # 戻り値
  * なし
  */
  reSize(width: number, height: number, is_dark: boolean) {
    resize(width, height, is_dark);
  }

  /**
  * タブを切り替える
  *
  * # 引数
  * ## tab
  * - 0: 本文
  * - 1: 目次
  * - 2: Box
  * - 3: 白板
  *
  * # 戻り値
  * なし
  */
  tabChange(tab: number, width: number, height: number, is_dark: boolean): number {
    return tab_change(tab, width, height, is_dark);
  }

  /**
  * 現在のセクションを返す
  *
  * # 引数
  * なし
  *
  * # 戻り値
  * セクション
  */
  getSection(): number {
    return get_section();
  }

  /**
  * 黒塗りモードを変更する
  *
  * # 引数
  * ## black
  *
  * # 戻り値
  * なし
  */
  modeChange(black: boolean) {
    mode_change(black);
  }

  /**
  * タッチ開始
  *
  * # 引数
  * ## x
  * ## y
  *
  * # 戻り値
  * なし
  */
  touchStart(x: number, y: number) {
    touch_start(x, y);
  }

  /**
  * タッチを移動する
  *
  * # 引数
  * ## x
  * ## y
  *
  * # 戻り値
  * なし
  * @param {number} x
  * @param {number} y
  */
  touchMove(x: number, y: number) {
    touch_move(x, y);
  }

  /**
  * タッチ終了
  *
  * # 引数
  * なし
  *
  * # 戻り値
  * - -2 : 正常終了
  * - -1 : Top選択
  * - 0以上 : セクション選択
  * - それ以外 : 異常終了
  * @returns {number}
  */
  touchEnd(): number {
    return touch_end();
  }

  /**
  * シングルクリック
  *
  * # 引数
  * ## x
  * ## y
  *
  * # 戻り値
  * - -3 : 正常終了
  * - -1 : Top選択
  * - 0以上 : セクション選択
  * - それ以外 : 異常終了
  * @returns {number}
  */
  singleClick(x: number, y: number): number {
    return single_click(x, y);
  }

  /**
  * ダブルクリック
  *
  * # 引数
  * ## x
  * ## y
  *
  * # 戻り値
  * - -3 : 正常終了
  * - -1 : Top選択
  * - 0以上 : セクション選択
  * - それ以外 : 異常終了
  * @returns {number}
  */
  doubleClick(x: number, y: number): number {
    return double_click(x, y);
  }

  /**
  * ツールボタンの操作
  *
  * # 引数
  *
  * ## step
  * - 1 : 1区切り進む
  * - 2 : 1区切り戻る
  * - 3 : 1単語進む
  * - 4 : 末尾に進む
  * - 5 : 先頭に戻る
  * - 6 : 次の段・節に進む
  * - 7 : 前の段・節に戻る
  *
  * # 戻り値
  * なし
  */
  toolFunc(step: number) {
    tool_func(step);
  }

  /**
  * 表示/非表示を切り替える
  *
  * # 引数
  *
  * ## is_hide
  * - 1 : 非表示
  * - 0 : 表示
  *
  * # 戻り値
  * なし
  */
  hide(isHide: number) {
    hide(isHide);
  }

  /**
  * 白板・戻る
  *
  * # 引数
  *
  * # 戻り値
  * なし
  */
  strokeBack() {
    stroke_back();
  }

  /**
  * 白板・消去
  *
  * # 引数
  *
  * # 戻り値
  * なし
  */
  strokeClear() {
    stroke_clear();
  }
}
