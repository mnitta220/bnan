
let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for (let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
    }
    : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    });

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_16(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hf4f0a00cfef81533(arg0, arg1, addHeapObject(arg2));
}

/**
* 起動時処理
*/
export function main() {
    wasm.main();
}

/**
* 疎通確認
*
* # 引数
* input
*
* # 戻り値
* - input + 1
* @param {number} input
* @returns {number}
*/
export function ping(input) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.ping(retptr, input);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return r0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
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
export function load_font() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.load_font(retptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
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
* @param {number} id
* @param {string} title
* @param {number} vertical
* @param {number} font_size
* @param {number} current
*/
export function set_doc(id, title, vertical, font_size, current) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(title, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.set_doc(retptr, id, ptr0, len0, vertical, font_size, current);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* 段落をセットする
*
* # 引数
* ## current
*
* # 戻り値
* なし
* @param {number} current
*/
export function set_section(current) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.set_section(retptr, current);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
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
* @param {number} seq
* @param {string} text
*/
export function set_source(seq, text) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.set_source(retptr, seq, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
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
export function build_tree() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.build_tree(retptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
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
* @param {number} width
* @param {number} height
* @param {boolean} is_dark
* @param {boolean} is_android
*/
export function draw_doc(width, height, is_dark, is_android) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.draw_doc(retptr, width, height, is_dark, is_android);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
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
* @param {number} width
* @param {number} height
* @param {boolean} is_dark
*/
export function resize(width, height, is_dark) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.resize(retptr, width, height, is_dark);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
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
* @param {number} tab
* @param {number} width
* @param {number} height
* @param {boolean} is_dark
* @returns {number}
*/
export function tab_change(tab, width, height, is_dark) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.tab_change(retptr, tab, width, height, is_dark);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return r0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* 現在のセクションを返す
*
* # 引数
* なし
*
* # 戻り値
* セクション
* @returns {number}
*/
export function get_section() {
    const ret = wasm.get_section();
    return ret;
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
* @param {number} x
* @param {number} y
*/
export function touch_start(x, y) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.touch_start(retptr, x, y);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
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
export function touch_move(x, y) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.touch_move(retptr, x, y);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
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
export function touch_end() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.touch_end(retptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return r0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
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
* @param {number} x
* @param {number} y
* @returns {number}
*/
export function single_click(x, y) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.single_click(retptr, x, y);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return r0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
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
* @param {number} x
* @param {number} y
* @returns {number}
*/
export function double_click(x, y) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.double_click(retptr, x, y);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return r0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* 黒塗りモードを変更する
*
* # 引数
* ## black
*
* # 戻り値
* なし
* @param {boolean} black
*/
export function mode_change(black) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.mode_change(retptr, black);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
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
* @param {number} step
* @returns {number}
*/
export function tool_func(step) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.tool_func(retptr, step);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return r0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
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
* @param {number} is_hide
* @returns {number}
*/
export function hide(is_hide) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.hide(retptr, is_hide);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return r0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* 白板・戻る
*
* # 引数
*
* # 戻り値
* なし
*/
export function stroke_back() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.stroke_back(retptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* 白板・消去
*
* # 引数
*
* # 戻り値
* なし
*/
export function stroke_clear() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.stroke_clear(retptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    /*
    if (typeof input === 'undefined') {
        input = new URL('bnanw_bg.wasm', import.meta.url);
    }
    */
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function (arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_string_new = function (arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_cb_drop = function (arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Window_0e6c0f1096d66c3c = function (arg0) {
        const ret = getObject(arg0) instanceof Window;
        return ret;
    };
    imports.wbg.__wbg_document_99eddbbc11ec831e = function (arg0) {
        const ret = getObject(arg0).document;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_fonts_bd3213dac92b76ce = function (arg0) {
        const ret = getObject(arg0).fonts;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getElementById_f83c5de20dc455d6 = function (arg0, arg1, arg2) {
        const ret = getObject(arg0).getElementById(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithstr_61dc80b5fe18741f = function () {
        return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = new FontFace(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
            return addHeapObject(ret);
        }, arguments)
    };
    imports.wbg.__wbg_load_0e466bbab1ae55ae = function () {
        return handleError(function (arg0) {
            const ret = getObject(arg0).load();
            return addHeapObject(ret);
        }, arguments)
    };
    imports.wbg.__wbg_add_56c76c666f2f247e = function () {
        return handleError(function (arg0, arg1) {
            getObject(arg0).add(getObject(arg1));
        }, arguments)
    };
    imports.wbg.__wbg_instanceof_HtmlCanvasElement_b94545433bb4d2ef = function (arg0) {
        const ret = getObject(arg0) instanceof HTMLCanvasElement;
        return ret;
    };
    imports.wbg.__wbg_width_20b7a9ebdd5f4232 = function (arg0) {
        const ret = getObject(arg0).width;
        return ret;
    };
    imports.wbg.__wbg_setwidth_654d8adcd4979eed = function (arg0, arg1) {
        getObject(arg0).width = arg1 >>> 0;
    };
    imports.wbg.__wbg_height_57f43816c2227a89 = function (arg0) {
        const ret = getObject(arg0).height;
        return ret;
    };
    imports.wbg.__wbg_setheight_2b662384bfacb65c = function (arg0, arg1) {
        getObject(arg0).height = arg1 >>> 0;
    };
    imports.wbg.__wbg_getContext_0c19ba5c037e057f = function () {
        return handleError(function (arg0, arg1, arg2) {
            const ret = getObject(arg0).getContext(getStringFromWasm0(arg1, arg2));
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        }, arguments)
    };
    imports.wbg.__wbg_log_e8ba7b992c7ad0eb = function (arg0) {
        console.log(getObject(arg0));
    };
    imports.wbg.__wbg_instanceof_CanvasRenderingContext2d_405495bb0ea92c4f = function (arg0) {
        const ret = getObject(arg0) instanceof CanvasRenderingContext2D;
        return ret;
    };
    imports.wbg.__wbg_setstrokeStyle_32540003cbfe210b = function (arg0, arg1) {
        getObject(arg0).strokeStyle = getObject(arg1);
    };
    imports.wbg.__wbg_setfillStyle_1d391c4891a6ec4d = function (arg0, arg1) {
        getObject(arg0).fillStyle = getObject(arg1);
    };
    imports.wbg.__wbg_setlineWidth_6f1b76036ab98bfc = function (arg0, arg1) {
        getObject(arg0).lineWidth = arg1;
    };
    imports.wbg.__wbg_setfont_7152cc4657609a93 = function (arg0, arg1, arg2) {
        getObject(arg0).font = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_settextAlign_b915113cbbf1e047 = function (arg0, arg1, arg2) {
        getObject(arg0).textAlign = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_settextBaseline_38fba0bc777dfc84 = function (arg0, arg1, arg2) {
        getObject(arg0).textBaseline = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_beginPath_e040b5521d41f537 = function (arg0) {
        getObject(arg0).beginPath();
    };
    imports.wbg.__wbg_fill_b6e37fbbefb55ae0 = function (arg0) {
        getObject(arg0).fill();
    };
    imports.wbg.__wbg_stroke_63664360a52ce7d1 = function (arg0) {
        getObject(arg0).stroke();
    };
    imports.wbg.__wbg_arc_85205a36bd04df0a = function () {
        return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
            getObject(arg0).arc(arg1, arg2, arg3, arg4, arg5);
        }, arguments)
    };
    imports.wbg.__wbg_lineTo_e0f6cb3b8836cedb = function (arg0, arg1, arg2) {
        getObject(arg0).lineTo(arg1, arg2);
    };
    imports.wbg.__wbg_moveTo_8d00712d6e75a749 = function (arg0, arg1, arg2) {
        getObject(arg0).moveTo(arg1, arg2);
    };
    imports.wbg.__wbg_fillRect_59b38b7e6f8d0717 = function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).fillRect(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_strokeRect_469c3838c9d01537 = function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).strokeRect(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_fillText_a9da23f2c00b2b51 = function () {
        return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            getObject(arg0).fillText(getStringFromWasm0(arg1, arg2), arg3, arg4);
        }, arguments)
    };
    imports.wbg.__wbg_measureText_7137f00ee7bb9969 = function () {
        return handleError(function (arg0, arg1, arg2) {
            const ret = getObject(arg0).measureText(getStringFromWasm0(arg1, arg2));
            return addHeapObject(ret);
        }, arguments)
    };
    imports.wbg.__wbg_rotate_fadc4607e79d2c11 = function () {
        return handleError(function (arg0, arg1) {
            getObject(arg0).rotate(arg1);
        }, arguments)
    };
    imports.wbg.__wbg_width_1d637c56a808b6a2 = function (arg0) {
        const ret = getObject(arg0).width;
        return ret;
    };
    imports.wbg.__wbg_newnoargs_e23b458e372830de = function (arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_ae78342adc33730a = function () {
        return handleError(function (arg0, arg1) {
            const ret = getObject(arg0).call(getObject(arg1));
            return addHeapObject(ret);
        }, arguments)
    };
    imports.wbg.__wbindgen_object_clone_ref = function (arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_self_99737b4dcdf6f0d8 = function () {
        return handleError(function () {
            const ret = self.self;
            return addHeapObject(ret);
        }, arguments)
    };
    imports.wbg.__wbg_window_9b61fbbf3564c4fb = function () {
        return handleError(function () {
            const ret = window.window;
            return addHeapObject(ret);
        }, arguments)
    };
    imports.wbg.__wbg_globalThis_8e275ef40caea3a3 = function () {
        return handleError(function () {
            const ret = globalThis.globalThis;
            return addHeapObject(ret);
        }, arguments)
    };
    imports.wbg.__wbg_global_5de1e0f82bddcd27 = function () {
        return handleError(function () {
            const ret = global.global;
            return addHeapObject(ret);
        }, arguments)
    };
    imports.wbg.__wbindgen_is_undefined = function (arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbg_now_04bcd3bf9fb6165e = function () {
        const ret = Date.now();
        return ret;
    };
    imports.wbg.__wbg_resolve_a9a87bdd64e9e62c = function (arg0) {
        const ret = Promise.resolve(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_ce526c837d07b68f = function (arg0, arg1) {
        const ret = getObject(arg0).then(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_842e65b843962f56 = function (arg0, arg1, arg2) {
        const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_debug_string = function (arg0, arg1) {
        const ret = debugString(getObject(arg1));
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_throw = function (arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_closure_wrapper222 = function (arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 39, __wbg_adapter_16);
        return addHeapObject(ret);
    };

    /*
    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }



    const { instance, module } = await load(await input, imports);
    */
    const bin = await (await fetch('assets/pkg/bnanw_bg.wasm')).arrayBuffer();
    const { instance, module } = await WebAssembly.instantiate(bin, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;
    wasm.__wbindgen_start();
    return wasm;
}

export default init;
