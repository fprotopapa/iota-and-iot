const fetch = require('node-fetch')
global.Headers = fetch.Headers
global.Request = fetch.Request
global.Response = fetch.Response
global.fetch = fetch

let imports = {};
imports['__wbindgen_placeholder__'] = module.exports;
let wasm;
const { TextDecoder, TextEncoder } = require(`util`);

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

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

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

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

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

function isLikeNone(x) {
    return x === undefined || x === null;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
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
        for(let i = 1; i < length; i++) {
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
function __wbg_adapter_34(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h4db016477959a6a7(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_37(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hadd02343ed34e8d9(arg0, arg1);
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

const u32CvtShim = new Uint32Array(2);

const uint64CvtShim = new BigUint64Array(u32CvtShim.buffer);
/**
* Initializes the console error panic hook for better error messages
*/
module.exports.start = function() {
    wasm.start();
};

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
function __wbg_adapter_209(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures__invoke2_mut__he082682ad225aa53(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

/**
*/
module.exports.set_panic_hook = function() {
    wasm.set_panic_hook();
};

/**
*/
module.exports.ChannelType = Object.freeze({ SingleBranch:0,"0":"SingleBranch",MultiBranch:1,"1":"MultiBranch",SingleDepth:2,"2":"SingleDepth", });
/**
*/
module.exports.LedgerInclusionState = Object.freeze({ Conflicting:0,"0":"Conflicting",Included:1,"1":"Included",NoTransaction:2,"2":"NoTransaction", });
/**
* Tangle representation of a Message Link.
*
* An `Address` is comprised of 2 distinct parts: the channel identifier
* ({@link ChannelAddress}) and the message identifier
* ({@link MsgId}). The channel identifier is unique per channel and is common in the
* `Address` of all messages published in it. The message identifier is
* produced pseudo-randomly out of the the message's sequence number, the
* previous message identifier, and other internal properties.
*/
class Address {

    static __wrap(ptr) {
        const obj = Object.create(Address.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_address_free(ptr);
    }
    /**
    * @param {ChannelAddress} channel_address
    * @param {MsgId} msgid
    */
    constructor(channel_address, msgid) {
        _assertClass(channel_address, ChannelAddress);
        var ptr0 = channel_address.ptr;
        channel_address.ptr = 0;
        _assertClass(msgid, MsgId);
        var ptr1 = msgid.ptr;
        msgid.ptr = 0;
        var ret = wasm.address_new(ptr0, ptr1);
        return Address.__wrap(ret);
    }
    /**
    * @returns {ChannelAddress}
    */
    get channelAddress() {
        var ret = wasm.address_channelAddress(this.ptr);
        return ChannelAddress.__wrap(ret);
    }
    /**
    * @returns {MsgId}
    */
    get msgId() {
        var ret = wasm.address_msgId(this.ptr);
        return MsgId.__wrap(ret);
    }
    /**
    * Generate the hash used to index the {@link Message} published in this address.
    *
    * Currently this hash is computed with {@link https://en.wikipedia.org/wiki/BLAKE_(hash_function)#BLAKE2|Blake2b256}.
    * The returned Uint8Array contains the binary digest of the hash. To obtain the hexadecimal representation of the
    * hash, use the convenience method {@link Address#toMsgIndexHex}.
    * @returns {Uint8Array}
    */
    toMsgIndex() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.address_toMsgIndex(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Generate the hash used to index the {@link Message} published in this address.
    *
    * Currently this hash is computed with {@link https://en.wikipedia.org/wiki/BLAKE_(hash_function)#BLAKE2|Blake2b256}.
    * The returned String contains the hexadecimal digest of the hash. To obtain the binary digest of the hash,
    * use the method {@link Address#toMsgIndex}.
    * @returns {string}
    */
    toMsgIndexHex() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.address_toMsgIndexHex(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Render the `Address` as a colon-separated String of the hex-encoded {@link Address#channelAddress} and
    * {@link Address#msgId} (`<channelAddressHex>:<msgIdHex>`) suitable for exchanging the `Address` between
    * participants. To convert the String back to an `Address`, use {@link Address.parse}.
    *
    * @see Address.parse
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.address_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Decode an `Address` out of a String. The String must follow the format used by {@link Address#toString}
    *
    * @throws Throws an error if String does not follow the format `<channelAddressHex>:<msgIdHex>`
    *
    * @see Address#toString
    * @see ChannelAddress#hex
    * @see MsgId#hex
    * @param {string} string
    * @returns {Address}
    */
    static parse(string) {
        var ptr0 = passStringToWasm0(string, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.address_parse(ptr0, len0);
        return Address.__wrap(ret);
    }
    /**
    * @returns {Address}
    */
    copy() {
        var ret = wasm.address_copy(this.ptr);
        return Address.__wrap(ret);
    }
}
module.exports.Address = Address;
/**
*/
class AddressGetter {

    static __wrap(ptr) {
        const obj = Object.create(AddressGetter.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_addressgetter_free(ptr);
    }
    /**
    * @param {Client} client
    * @param {string} seed
    * @returns {AddressGetter}
    */
    static new(client, seed) {
        _assertClass(client, Client);
        var ptr0 = client.ptr;
        client.ptr = 0;
        var ptr1 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.addressgetter_new(ptr0, ptr1, len1);
        return AddressGetter.__wrap(ret);
    }
    /**
    * Set the account index
    * @param {number} index
    * @returns {AddressGetter}
    */
    accountIndex(index) {
        var ret = wasm.addressgetter_accountIndex(this.ptr, index);
        return AddressGetter.__wrap(ret);
    }
    /**
    * Set the address range
    * @param {number} start
    * @param {number} end
    * @returns {AddressGetter}
    */
    range(start, end) {
        var ret = wasm.addressgetter_range(this.ptr, start, end);
        return AddressGetter.__wrap(ret);
    }
    /**
    * Set the bech32 hrp
    * @param {string} bech32_hrp
    * @returns {AddressGetter}
    */
    bech32Hrp(bech32_hrp) {
        var ptr0 = passStringToWasm0(bech32_hrp, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.addressgetter_bech32Hrp(this.ptr, ptr0, len0);
        return AddressGetter.__wrap(ret);
    }
    /**
    * Include internal addresses
    * @returns {AddressGetter}
    */
    includeInternal() {
        var ret = wasm.addressgetter_includeInternal(this.ptr);
        return AddressGetter.__wrap(ret);
    }
    /**
    * Get the addresses.
    * @returns {Promise<any>}
    */
    get() {
        var ret = wasm.addressgetter_get(this.ptr);
        return takeObject(ret);
    }
}
module.exports.AddressGetter = AddressGetter;
/**
*/
class Author {

    static __wrap(ptr) {
        const obj = Object.create(Author.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_author_free(ptr);
    }
    /**
    * @param {string} seed
    * @param {SendOptions} options
    * @param {number} implementation
    */
    constructor(seed, options, implementation) {
        var ptr0 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        _assertClass(options, SendOptions);
        var ptr1 = options.ptr;
        options.ptr = 0;
        var ret = wasm.author_new(ptr0, len0, ptr1, implementation);
        return Author.__wrap(ret);
    }
    /**
    * @param {StreamsClient} client
    * @param {string} seed
    * @param {number} implementation
    * @returns {Author}
    */
    static fromClient(client, seed, implementation) {
        _assertClass(client, StreamsClient);
        var ptr0 = client.ptr;
        client.ptr = 0;
        var ptr1 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.author_fromClient(ptr0, ptr1, len1, implementation);
        return Author.__wrap(ret);
    }
    /**
    * @param {StreamsClient} client
    * @param {Uint8Array} bytes
    * @param {string} password
    * @returns {Author}
    */
    static import(client, bytes, password) {
        _assertClass(client, StreamsClient);
        var ptr0 = client.ptr;
        client.ptr = 0;
        var ptr1 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        var len1 = WASM_VECTOR_LEN;
        var ptr2 = passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        var ret = wasm.author_import(ptr0, ptr1, len1, ptr2, len2);
        return Author.__wrap(ret);
    }
    /**
    * @param {string} password
    * @returns {Uint8Array}
    */
    export(password) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.author_export(retptr, this.ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} seed
    * @param {Address} ann_address
    * @param {number} implementation
    * @param {SendOptions} options
    * @returns {Promise<Author>}
    */
    static recover(seed, ann_address, implementation, options) {
        var ptr0 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        _assertClass(ann_address, Address);
        var ptr1 = ann_address.ptr;
        ann_address.ptr = 0;
        _assertClass(options, SendOptions);
        var ptr2 = options.ptr;
        options.ptr = 0;
        var ret = wasm.author_recover(ptr0, len0, ptr1, implementation, ptr2);
        return takeObject(ret);
    }
    /**
    * @returns {Author}
    */
    clone() {
        var ret = wasm.author_clone(this.ptr);
        return Author.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    channel_address() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.author_channel_address(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string | undefined}
    */
    announcementLink() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.author_announcementLink(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            let v0;
            if (r0 !== 0) {
                v0 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_free(r0, r1 * 1);
            }
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {boolean}
    */
    is_multi_branching() {
        var ret = wasm.author_is_multi_branching(this.ptr);
        return ret !== 0;
    }
    /**
    * @returns {StreamsClient}
    */
    get_client() {
        var ret = wasm.author_get_client(this.ptr);
        return StreamsClient.__wrap(ret);
    }
    /**
    * @param {string} psk_seed_str
    * @returns {string}
    */
    store_psk(psk_seed_str) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(psk_seed_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.author_store_psk(retptr, this.ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    get_public_key() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.author_get_public_key(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {Promise<UserResponse>}
    */
    send_announce() {
        const ptr = this.__destroy_into_raw();
        var ret = wasm.author_send_announce(ptr);
        return takeObject(ret);
    }
    /**
    * @param {Address} link
    * @returns {Promise<UserResponse>}
    */
    send_keyload_for_everyone(link) {
        const ptr = this.__destroy_into_raw();
        _assertClass(link, Address);
        var ptr0 = link.ptr;
        link.ptr = 0;
        var ret = wasm.author_send_keyload_for_everyone(ptr, ptr0);
        return takeObject(ret);
    }
    /**
    * @param {Address} link
    * @param {PskIds} psk_ids
    * @param {PublicKeys} sig_pks
    * @returns {Promise<UserResponse>}
    */
    send_keyload(link, psk_ids, sig_pks) {
        const ptr = this.__destroy_into_raw();
        _assertClass(link, Address);
        var ptr0 = link.ptr;
        link.ptr = 0;
        _assertClass(psk_ids, PskIds);
        var ptr1 = psk_ids.ptr;
        psk_ids.ptr = 0;
        _assertClass(sig_pks, PublicKeys);
        var ptr2 = sig_pks.ptr;
        sig_pks.ptr = 0;
        var ret = wasm.author_send_keyload(ptr, ptr0, ptr1, ptr2);
        return takeObject(ret);
    }
    /**
    * @param {Address} link
    * @param {Uint8Array} public_payload
    * @param {Uint8Array} masked_payload
    * @returns {Promise<UserResponse>}
    */
    send_tagged_packet(link, public_payload, masked_payload) {
        const ptr = this.__destroy_into_raw();
        _assertClass(link, Address);
        var ptr0 = link.ptr;
        link.ptr = 0;
        var ptr1 = passArray8ToWasm0(public_payload, wasm.__wbindgen_malloc);
        var len1 = WASM_VECTOR_LEN;
        var ptr2 = passArray8ToWasm0(masked_payload, wasm.__wbindgen_malloc);
        var len2 = WASM_VECTOR_LEN;
        var ret = wasm.author_send_tagged_packet(ptr, ptr0, ptr1, len1, ptr2, len2);
        return takeObject(ret);
    }
    /**
    * @param {Address} link
    * @param {Uint8Array} public_payload
    * @param {Uint8Array} masked_payload
    * @returns {Promise<UserResponse>}
    */
    send_signed_packet(link, public_payload, masked_payload) {
        const ptr = this.__destroy_into_raw();
        _assertClass(link, Address);
        var ptr0 = link.ptr;
        link.ptr = 0;
        var ptr1 = passArray8ToWasm0(public_payload, wasm.__wbindgen_malloc);
        var len1 = WASM_VECTOR_LEN;
        var ptr2 = passArray8ToWasm0(masked_payload, wasm.__wbindgen_malloc);
        var len2 = WASM_VECTOR_LEN;
        var ret = wasm.author_send_signed_packet(ptr, ptr0, ptr1, len1, ptr2, len2);
        return takeObject(ret);
    }
    /**
    * @param {Address} link_to
    * @returns {Promise<void>}
    */
    receive_subscribe(link_to) {
        const ptr = this.__destroy_into_raw();
        _assertClass(link_to, Address);
        var ptr0 = link_to.ptr;
        link_to.ptr = 0;
        var ret = wasm.author_receive_subscribe(ptr, ptr0);
        return takeObject(ret);
    }
    /**
    * @param {Address} link_to
    * @returns {Promise<void>}
    */
    receive_unsubscribe(link_to) {
        const ptr = this.__destroy_into_raw();
        _assertClass(link_to, Address);
        var ptr0 = link_to.ptr;
        link_to.ptr = 0;
        var ret = wasm.author_receive_unsubscribe(ptr, ptr0);
        return takeObject(ret);
    }
    /**
    * @param {Address} link
    * @returns {Promise<UserResponse>}
    */
    receive_tagged_packet(link) {
        const ptr = this.__destroy_into_raw();
        _assertClass(link, Address);
        var ptr0 = link.ptr;
        link.ptr = 0;
        var ret = wasm.author_receive_tagged_packet(ptr, ptr0);
        return takeObject(ret);
    }
    /**
    * @param {Address} link
    * @returns {Promise<UserResponse>}
    */
    receive_signed_packet(link) {
        const ptr = this.__destroy_into_raw();
        _assertClass(link, Address);
        var ptr0 = link.ptr;
        link.ptr = 0;
        var ret = wasm.author_receive_signed_packet(ptr, ptr0);
        return takeObject(ret);
    }
    /**
    * @param {Address} link
    * @returns {Promise<Address>}
    */
    receive_sequence(link) {
        const ptr = this.__destroy_into_raw();
        _assertClass(link, Address);
        var ptr0 = link.ptr;
        link.ptr = 0;
        var ret = wasm.author_receive_sequence(ptr, ptr0);
        return takeObject(ret);
    }
    /**
    * @param {Address} link
    * @returns {Promise<UserResponse>}
    */
    receive_msg(link) {
        const ptr = this.__destroy_into_raw();
        _assertClass(link, Address);
        var ptr0 = link.ptr;
        link.ptr = 0;
        var ret = wasm.author_receive_msg(ptr, ptr0);
        return takeObject(ret);
    }
    /**
    * @param {Address} anchor_link
    * @param {number} msg_num
    * @returns {Promise<UserResponse>}
    */
    receive_msg_by_sequence_number(anchor_link, msg_num) {
        const ptr = this.__destroy_into_raw();
        _assertClass(anchor_link, Address);
        var ptr0 = anchor_link.ptr;
        anchor_link.ptr = 0;
        var ret = wasm.author_receive_msg_by_sequence_number(ptr, ptr0, msg_num);
        return takeObject(ret);
    }
    /**
    * @returns {Promise<void>}
    */
    sync_state() {
        const ptr = this.__destroy_into_raw();
        var ret = wasm.author_sync_state(ptr);
        return takeObject(ret);
    }
    /**
    * @returns {Promise<Array<any>>}
    */
    fetch_next_msgs() {
        const ptr = this.__destroy_into_raw();
        var ret = wasm.author_fetch_next_msgs(ptr);
        return takeObject(ret);
    }
    /**
    * @param {Address} link
    * @returns {Promise<UserResponse>}
    */
    fetch_prev_msg(link) {
        const ptr = this.__destroy_into_raw();
        _assertClass(link, Address);
        var ptr0 = link.ptr;
        link.ptr = 0;
        var ret = wasm.author_fetch_prev_msg(ptr, ptr0);
        return takeObject(ret);
    }
    /**
    * @param {Address} link
    * @param {number} num_msgs
    * @returns {Promise<Array<any>>}
    */
    fetch_prev_msgs(link, num_msgs) {
        const ptr = this.__destroy_into_raw();
        _assertClass(link, Address);
        var ptr0 = link.ptr;
        link.ptr = 0;
        var ret = wasm.author_fetch_prev_msgs(ptr, ptr0, num_msgs);
        return takeObject(ret);
    }
    /**
    * @returns {Promise<Array<any>>}
    */
    gen_next_msg_ids() {
        const ptr = this.__destroy_into_raw();
        var ret = wasm.author_gen_next_msg_ids(ptr);
        return takeObject(ret);
    }
    /**
    * @returns {Array<any>}
    */
    fetch_state() {
        var ret = wasm.author_fetch_state(this.ptr);
        return takeObject(ret);
    }
    /**
    */
    reset_state() {
        const ptr = this.__destroy_into_raw();
        wasm.author_reset_state(ptr);
    }
    /**
    * @param {string} pk_str
    */
    store_new_subscriber(pk_str) {
        var ptr0 = passStringToWasm0(pk_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.author_store_new_subscriber(this.ptr, ptr0, len0);
    }
    /**
    * @param {string} pk_str
    */
    remove_subscriber(pk_str) {
        var ptr0 = passStringToWasm0(pk_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.author_remove_subscriber(this.ptr, ptr0, len0);
    }
    /**
    * @param {string} pskid_str
    */
    remove_psk(pskid_str) {
        var ptr0 = passStringToWasm0(pskid_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.author_remove_psk(this.ptr, ptr0, len0);
    }
}
module.exports.Author = Author;
/**
*/
class BalanceGetter {

    static __wrap(ptr) {
        const obj = Object.create(BalanceGetter.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_balancegetter_free(ptr);
    }
    /**
    * @param {Client} client
    * @param {string} seed
    * @returns {BalanceGetter}
    */
    static new(client, seed) {
        _assertClass(client, Client);
        var ptr0 = client.ptr;
        client.ptr = 0;
        var ptr1 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.balancegetter_new(ptr0, ptr1, len1);
        return BalanceGetter.__wrap(ret);
    }
    /**
    * Sets the account index
    * @param {number} index
    * @returns {BalanceGetter}
    */
    accountIndex(index) {
        var ret = wasm.balancegetter_accountIndex(this.ptr, index);
        return BalanceGetter.__wrap(ret);
    }
    /**
    * Sets the address index from which to start looking for balance
    * @param {number} initial_address_index
    * @returns {BalanceGetter}
    */
    initialAddressIndex(initial_address_index) {
        var ret = wasm.balancegetter_initialAddressIndex(this.ptr, initial_address_index);
        return BalanceGetter.__wrap(ret);
    }
    /**
    * Sets the gap limit to specify how many addresses will be checked each round.
    * If gap_limit amount of addresses in a row have no balance the function will return.
    * @param {number} gap_limit
    * @returns {BalanceGetter}
    */
    gap_limit(gap_limit) {
        var ret = wasm.balancegetter_gap_limit(this.ptr, gap_limit);
        return BalanceGetter.__wrap(ret);
    }
    /**
    * Get the balance.
    * @returns {Promise<any>}
    */
    get() {
        var ret = wasm.balancegetter_get(this.ptr);
        return takeObject(ret);
    }
}
module.exports.BalanceGetter = BalanceGetter;
/**
* Channel application instance identifier (40 Byte)
*/
class ChannelAddress {

    static __wrap(ptr) {
        const obj = Object.create(ChannelAddress.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_channeladdress_free(ptr);
    }
    /**
    * Render the `ChannelAddress` as a 40 Byte {@link https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array|Uint8Array}
    *
    * @see ChannelAddress#hex
    * @returns {Uint8Array}
    */
    bytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.channeladdress_bytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Render the `ChannelAddress` as a 40 Byte (80 char) hexadecimal String
    *
    * @see ChannelAddress#bytes
    * @returns {string}
    */
    hex() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.channeladdress_hex(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Render the `ChannelAddress` as an exchangeable String. Currently
    * outputs the same as {@link ChannelAddress#hex}.
    *
    * @see ChannelAddress#hex
    * @see ChannelAddress.parse
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.channeladdress_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Decode a `ChannelAddress` out of a String. The string must be a 80 char long hexadecimal string.
    *
    * @see ChannelAddress#toString
    * @throws Throws error if string does not follow the expected format
    * @param {string} string
    * @returns {ChannelAddress}
    */
    static parse(string) {
        var ptr0 = passStringToWasm0(string, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.channeladdress_parse(ptr0, len0);
        return ChannelAddress.__wrap(ret);
    }
    /**
    * @returns {ChannelAddress}
    */
    copy() {
        var ret = wasm.channeladdress_copy(this.ptr);
        return ChannelAddress.__wrap(ret);
    }
}
module.exports.ChannelAddress = ChannelAddress;
/**
*/
class Client {

    static __wrap(ptr) {
        const obj = Object.create(Client.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_client_free(ptr);
    }
    /**
    * Send a message to the Tangle.
    * @returns {MessageBuilder}
    */
    message() {
        var ret = wasm.client_message(this.ptr);
        return MessageBuilder.__wrap(ret);
    }
    /**
    * Get a message from the Tangle.
    * @returns {MessageGetter}
    */
    getMessage() {
        var ret = wasm.client_getMessage(this.ptr);
        return MessageGetter.__wrap(ret);
    }
    /**
    * Generate addresses.
    * @param {string} seed
    * @returns {AddressGetter}
    */
    getAddresses(seed) {
        var ptr0 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.client_getAddresses(this.ptr, ptr0, len0);
        return AddressGetter.__wrap(ret);
    }
    /**
    * Get an unspent address.
    * @param {string} seed
    * @returns {UnspentAddressGetter}
    */
    getUnspentAddress(seed) {
        var ptr0 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.client_getUnspentAddress(this.ptr, ptr0, len0);
        return UnspentAddressGetter.__wrap(ret);
    }
    /**
    * Get the account balance.
    * @param {string} seed
    * @returns {BalanceGetter}
    */
    getBalance(seed) {
        var ptr0 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.client_getBalance(this.ptr, ptr0, len0);
        return BalanceGetter.__wrap(ret);
    }
    /**
    * GET /api/v1/addresses/{address} endpoint
    * @returns {GetAddressBuilder}
    */
    getAddress() {
        var ret = wasm.client_getAddress(this.ptr);
        return GetAddressBuilder.__wrap(ret);
    }
    /**
    * Get the nodeinfo.
    * @returns {Promise<any>}
    */
    getInfo() {
        var ret = wasm.client_getInfo(this.ptr);
        return takeObject(ret);
    }
    /**
    * Get the nodeinfo.
    * @param {string} url
    * @param {string | undefined} jwt
    * @param {string | undefined} username
    * @param {string | undefined} password
    * @returns {Promise<any>}
    */
    getNodeInfo(url, jwt, username, password) {
        var ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(jwt) ? 0 : passStringToWasm0(jwt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(username) ? 0 : passStringToWasm0(username, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        var ptr3 = isLikeNone(password) ? 0 : passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len3 = WASM_VECTOR_LEN;
        var ret = wasm.client_getNodeInfo(this.ptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3);
        return takeObject(ret);
    }
    /**
    * Gets the network related information such as network_id and min_pow_score
    * and if it's the default one, sync it first.
    * @returns {Promise<any>}
    */
    networkInfo() {
        var ret = wasm.client_networkInfo(this.ptr);
        return takeObject(ret);
    }
    /**
    * Gets the network id of the node we're connecting to.
    * @returns {Promise<any>}
    */
    getNetworkId() {
        var ret = wasm.client_getNetworkId(this.ptr);
        return takeObject(ret);
    }
    /**
    * returns the bech32_hrp
    * @returns {Promise<any>}
    */
    getBech32Hrp() {
        var ret = wasm.client_getBech32Hrp(this.ptr);
        return takeObject(ret);
    }
    /**
    * returns the bech32_hrp
    * @returns {Promise<any>}
    */
    getMinPowScore() {
        var ret = wasm.client_getMinPowScore(this.ptr);
        return takeObject(ret);
    }
    /**
    * Get the node health.
    * @returns {Promise<any>}
    */
    getHealth() {
        var ret = wasm.client_getHealth(this.ptr);
        return takeObject(ret);
    }
    /**
    * Get tips.
    * @returns {Promise<any>}
    */
    getTips() {
        var ret = wasm.client_getTips(this.ptr);
        return takeObject(ret);
    }
    /**
    * Get peers.
    * @returns {Promise<any>}
    */
    getPeers() {
        var ret = wasm.client_getPeers(this.ptr);
        return takeObject(ret);
    }
    /**
    * GET /api/v1/outputs/{outputId} endpoint
    * Find an output by its transaction_id and corresponding output_index.
    * @param {string} output_id
    * @returns {Promise<any>}
    */
    getOutput(output_id) {
        var ptr0 = passStringToWasm0(output_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.client_getOutput(this.ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * Find all messages by provided message IDs and/or indexation_keys.
    * @param {any} indexation_keys
    * @param {any} message_ids
    * @returns {Promise<any>}
    */
    findMessages(indexation_keys, message_ids) {
        var ret = wasm.client_findMessages(this.ptr, addHeapObject(indexation_keys), addHeapObject(message_ids));
        return takeObject(ret);
    }
    /**
    * Function to find inputs from addresses for a provided amount (useful for offline signing)
    * @param {any} addresses
    * @param {BigInt} amount
    * @returns {Promise<any>}
    */
    findInputs(addresses, amount) {
        uint64CvtShim[0] = amount;
        const low0 = u32CvtShim[0];
        const high0 = u32CvtShim[1];
        var ret = wasm.client_findInputs(this.ptr, addHeapObject(addresses), low0, high0);
        return takeObject(ret);
    }
    /**
    * Find all outputs based on the requests criteria. This method will try to query multiple nodes if
    * the request amount exceeds individual node limit.
    * @param {any} outputs
    * @param {any} addresses
    * @returns {Promise<any>}
    */
    findOutputs(outputs, addresses) {
        var ret = wasm.client_findOutputs(this.ptr, addHeapObject(outputs), addHeapObject(addresses));
        return takeObject(ret);
    }
    /**
    * Return the balance in iota for the given addresses; No seed needed to do this since we are only checking and
    * already know the addresses.
    * @param {any} addresses
    * @returns {Promise<any>}
    */
    getAddressBalances(addresses) {
        var ret = wasm.client_getAddressBalances(this.ptr, addHeapObject(addresses));
        return takeObject(ret);
    }
    /**
    * GET /api/v1/milestones/{index} endpoint
    * Get the milestone by the given index.
    * @param {number} index
    * @returns {Promise<any>}
    */
    getMilestone(index) {
        var ret = wasm.client_getMilestone(this.ptr, index);
        return takeObject(ret);
    }
    /**
    * GET /api/v1/milestones/{index}/utxo-changes endpoint
    * Get the milestone by the given index.
    * @param {number} index
    * @returns {Promise<any>}
    */
    getMilestoneUtxoChanges(index) {
        var ret = wasm.client_getMilestoneUtxoChanges(this.ptr, index);
        return takeObject(ret);
    }
    /**
    * GET /api/v1/receipts endpoint
    * Get all receipts.
    * @returns {Promise<any>}
    */
    getReceipts() {
        var ret = wasm.client_getReceipts(this.ptr);
        return takeObject(ret);
    }
    /**
    * GET /api/v1/receipts/{migratedAt} endpoint
    * Get the receipts by the given milestone index.
    * @param {number} milestone_index
    * @returns {Promise<any>}
    */
    getReceiptsMigratedAt(milestone_index) {
        var ret = wasm.client_getReceiptsMigratedAt(this.ptr, milestone_index);
        return takeObject(ret);
    }
    /**
    * GET /api/v1/treasury endpoint
    * Get the treasury output.
    * @returns {Promise<any>}
    */
    getTreasury() {
        var ret = wasm.client_getTreasury(this.ptr);
        return takeObject(ret);
    }
    /**
    * GET /api/v1/transactions/{transactionId}/included-message
    * Returns the included message of the transaction.
    * @param {string} transaction_id
    * @returns {Promise<any>}
    */
    getIncludedMessage(transaction_id) {
        var ptr0 = passStringToWasm0(transaction_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.client_getIncludedMessage(this.ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * Post message.
    * @param {any} message
    * @returns {Promise<any>}
    */
    postMessage(message) {
        var ret = wasm.client_postMessage(this.ptr, addHeapObject(message));
        return takeObject(ret);
    }
    /**
    * Retries (promotes or reattaches) a message for provided message id. Message should only be
    * retried only if they are valid and haven't been confirmed for a while.
    * @param {string} message_id
    * @returns {Promise<any>}
    */
    retry(message_id) {
        var ptr0 = passStringToWasm0(message_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.client_retry(this.ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * Only works in browser because of the timeouts
    * Retries (promotes or reattaches) a message for provided message id until it's included (referenced by a
    * milestone). Default interval is 5 seconds and max attempts is 10. Returns reattached messages
    * @param {string} message_id
    * @param {BigInt | undefined} interval
    * @param {BigInt | undefined} max_attempts
    * @returns {Promise<any>}
    */
    retryUntilIncluded(message_id, interval, max_attempts) {
        var ptr0 = passStringToWasm0(message_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        uint64CvtShim[0] = isLikeNone(interval) ? BigInt(0) : interval;
        const low1 = u32CvtShim[0];
        const high1 = u32CvtShim[1];
        uint64CvtShim[0] = isLikeNone(max_attempts) ? BigInt(0) : max_attempts;
        const low2 = u32CvtShim[0];
        const high2 = u32CvtShim[1];
        var ret = wasm.client_retryUntilIncluded(this.ptr, ptr0, len0, !isLikeNone(interval), low1, high1, !isLikeNone(max_attempts), low2, high2);
        return takeObject(ret);
    }
    /**
    * Reattaches messages for provided message id. Messages can be reattached only if they are valid and haven't been
    * confirmed for a while.
    * @param {string} message_id
    * @returns {Promise<any>}
    */
    reattach(message_id) {
        var ptr0 = passStringToWasm0(message_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.client_reattach(this.ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * Promotes a message. The method should validate if a promotion is necessary through get_message. If not, the
    * method should error out and should not allow unnecessary promotions.
    * @param {string} message_id
    * @returns {Promise<any>}
    */
    promote(message_id) {
        var ptr0 = passStringToWasm0(message_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.client_promote(this.ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * Only works in browser because of the timeouts
    * Function to consolidate all funds from a range of addresses to the address with the lowest index in that range
    * Returns the address to which the funds got consolidated, if any were available
    * @param {string} seed
    * @param {number} account_index
    * @param {number} start_index
    * @param {number} end_index
    * @returns {Promise<any>}
    */
    consolidateFunds(seed, account_index, start_index, end_index) {
        var ptr0 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.client_consolidateFunds(this.ptr, ptr0, len0, account_index, start_index, end_index);
        return takeObject(ret);
    }
    /**
    * Returns a parsed hex String from bech32.
    * @param {string} address
    * @returns {string}
    */
    bech32ToHex(address) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.client_bech32ToHex(retptr, this.ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Returns a parsed bech32 String from hex.
    * @param {string} address
    * @param {string | undefined} bech32
    * @returns {Promise<any>}
    */
    hexToBech32(address, bech32) {
        var ptr0 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(bech32) ? 0 : passStringToWasm0(bech32, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.client_hexToBech32(this.ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * Transforms a hex encoded public key to a bech32 encoded address
    * @param {string} public_key
    * @param {string | undefined} bech32
    * @returns {Promise<any>}
    */
    hexPublicKeyToBech32Address(public_key, bech32) {
        var ptr0 = passStringToWasm0(public_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(bech32) ? 0 : passStringToWasm0(bech32, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.client_hexPublicKeyToBech32Address(this.ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * Checks if a String is a valid bech32 encoded address.
    * @param {string} address
    * @returns {boolean}
    */
    isAddressValid(address) {
        var ptr0 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.client_isAddressValid(this.ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
    * Generates a new mnemonic.
    * @returns {string}
    */
    generateMnemonic() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.client_generateMnemonic(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Returns a hex encoded seed for a mnemonic.
    * @param {string} mnemonic
    * @returns {string}
    */
    mnemonicToHexSeed(mnemonic) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(mnemonic, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.client_mnemonicToHexSeed(retptr, this.ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Returns the message id from a provided message.
    * @param {string} message
    * @returns {string}
    */
    getMessageId(message) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.client_getMessageId(retptr, this.ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
module.exports.Client = Client;
/**
*/
class ClientBuilder {

    static __wrap(ptr) {
        const obj = Object.create(ClientBuilder.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_clientbuilder_free(ptr);
    }
    /**
    * Creates an IOTA client builder.
    */
    constructor() {
        var ret = wasm.clientbuilder_new();
        return ClientBuilder.__wrap(ret);
    }
    /**
    * Adds an IOTA node by its URL.
    * @param {string} url
    * @returns {ClientBuilder}
    */
    node(url) {
        const ptr = this.__destroy_into_raw();
        var ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.clientbuilder_node(ptr, ptr0, len0);
        return ClientBuilder.__wrap(ret);
    }
    /**
    * Adds an IOTA node by its URL to be used as primary node, with optional jwt and or basic authentication
    * @param {string} url
    * @param {string | undefined} jwt
    * @param {string | undefined} username
    * @param {string | undefined} password
    * @returns {ClientBuilder}
    */
    primaryNode(url, jwt, username, password) {
        const ptr = this.__destroy_into_raw();
        var ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(jwt) ? 0 : passStringToWasm0(jwt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(username) ? 0 : passStringToWasm0(username, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        var ptr3 = isLikeNone(password) ? 0 : passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len3 = WASM_VECTOR_LEN;
        var ret = wasm.clientbuilder_primaryNode(ptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3);
        return ClientBuilder.__wrap(ret);
    }
    /**
    * Adds an IOTA node by its URL to be used as primary PoW node (for remote PoW), with optional jwt and or basic
    * authentication
    * @param {string} url
    * @param {string | undefined} jwt
    * @param {string | undefined} username
    * @param {string | undefined} password
    * @returns {ClientBuilder}
    */
    primaryPowNode(url, jwt, username, password) {
        const ptr = this.__destroy_into_raw();
        var ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(jwt) ? 0 : passStringToWasm0(jwt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(username) ? 0 : passStringToWasm0(username, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        var ptr3 = isLikeNone(password) ? 0 : passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len3 = WASM_VECTOR_LEN;
        var ret = wasm.clientbuilder_primaryPowNode(ptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3);
        return ClientBuilder.__wrap(ret);
    }
    /**
    * Adds a permanode by its URL, with optional jwt and or basic authentication
    * @param {string} url
    * @param {string | undefined} jwt
    * @param {string | undefined} username
    * @param {string | undefined} password
    * @returns {ClientBuilder}
    */
    permanode(url, jwt, username, password) {
        const ptr = this.__destroy_into_raw();
        var ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(jwt) ? 0 : passStringToWasm0(jwt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(username) ? 0 : passStringToWasm0(username, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        var ptr3 = isLikeNone(password) ? 0 : passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len3 = WASM_VECTOR_LEN;
        var ret = wasm.clientbuilder_permanode(ptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3);
        return ClientBuilder.__wrap(ret);
    }
    /**
    * Adds an IOTA node by its URL with optional jwt and or basic authentication
    * @param {string} url
    * @param {string | undefined} jwt
    * @param {string | undefined} username
    * @param {string | undefined} password
    * @returns {ClientBuilder}
    */
    nodeAuth(url, jwt, username, password) {
        const ptr = this.__destroy_into_raw();
        var ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(jwt) ? 0 : passStringToWasm0(jwt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(username) ? 0 : passStringToWasm0(username, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        var ptr3 = isLikeNone(password) ? 0 : passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len3 = WASM_VECTOR_LEN;
        var ret = wasm.clientbuilder_nodeAuth(ptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3);
        return ClientBuilder.__wrap(ret);
    }
    /**
    * Adds a list of IOTA nodes by their URLs.
    * @param {any} urls
    * @returns {ClientBuilder}
    */
    nodes(urls) {
        const ptr = this.__destroy_into_raw();
        var ret = wasm.clientbuilder_nodes(ptr, addHeapObject(urls));
        return ClientBuilder.__wrap(ret);
    }
    /**
    * Set the node sync interval (has no effect because we can't spawn another thread in wasm to sync the nodes)
    * @param {number} value
    * @returns {ClientBuilder}
    */
    nodeSyncInterval(value) {
        const ptr = this.__destroy_into_raw();
        var ret = wasm.clientbuilder_nodeSyncInterval(ptr, value);
        return ClientBuilder.__wrap(ret);
    }
    /**
    * Disables the node syncing process.
    * Every node will be considered healthy and ready to use.
    * @returns {ClientBuilder}
    */
    nodeSyncDisabled() {
        const ptr = this.__destroy_into_raw();
        var ret = wasm.clientbuilder_nodeSyncDisabled(ptr);
        return ClientBuilder.__wrap(ret);
    }
    /**
    * Allows creating the client without nodes for offline address generation or signing
    * @returns {ClientBuilder}
    */
    offlineMode() {
        const ptr = this.__destroy_into_raw();
        var ret = wasm.clientbuilder_offlineMode(ptr);
        return ClientBuilder.__wrap(ret);
    }
    /**
    * Get node list from the node_pool_urls
    * @param {any} node_pool_urls
    * @returns {Promise<any>}
    */
    nodePoolUrls(node_pool_urls) {
        const ptr = this.__destroy_into_raw();
        var ret = wasm.clientbuilder_nodePoolUrls(ptr, addHeapObject(node_pool_urls));
        return takeObject(ret);
    }
    /**
    * Set if quroum should be used or not
    * @param {boolean} value
    * @returns {ClientBuilder}
    */
    quorum(value) {
        const ptr = this.__destroy_into_raw();
        var ret = wasm.clientbuilder_quorum(ptr, value);
        return ClientBuilder.__wrap(ret);
    }
    /**
    * Set amount of nodes which should be used for quorum
    * @param {number} value
    * @returns {ClientBuilder}
    */
    quorumSize(value) {
        const ptr = this.__destroy_into_raw();
        var ret = wasm.clientbuilder_quorumSize(ptr, value);
        return ClientBuilder.__wrap(ret);
    }
    /**
    * Set quorum_threshold
    * @param {number} value
    * @returns {ClientBuilder}
    */
    quorumThreshold(value) {
        const ptr = this.__destroy_into_raw();
        var ret = wasm.clientbuilder_quorumThreshold(ptr, value);
        return ClientBuilder.__wrap(ret);
    }
    /**
    * Selects the type of network to get default nodes for it, only "testnet" is supported at the moment.
    * Nodes that don't belong to this network are ignored. Default nodes are only used when no other nodes are
    * provided.
    * @param {string} network
    * @returns {ClientBuilder}
    */
    network(network) {
        const ptr = this.__destroy_into_raw();
        var ptr0 = passStringToWasm0(network, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.clientbuilder_network(ptr, ptr0, len0);
        return ClientBuilder.__wrap(ret);
    }
    /**
    * Since we can only have a single thread in wasm, local PoW is much slower
    * @param {boolean} value
    * @returns {ClientBuilder}
    */
    localPow(value) {
        const ptr = this.__destroy_into_raw();
        var ret = wasm.clientbuilder_localPow(ptr, value);
        return ClientBuilder.__wrap(ret);
    }
    /**
    * Sets after how many seconds new tips will be requested during PoW
    * @param {number} value
    * @returns {ClientBuilder}
    */
    tipsInterval(value) {
        const ptr = this.__destroy_into_raw();
        var ret = wasm.clientbuilder_tipsInterval(ptr, value);
        return ClientBuilder.__wrap(ret);
    }
    /**
    * Sets the default request timeout.
    * @param {number} value
    * @returns {ClientBuilder}
    */
    requestTimeout(value) {
        const ptr = this.__destroy_into_raw();
        var ret = wasm.clientbuilder_requestTimeout(ptr, value);
        return ClientBuilder.__wrap(ret);
    }
    /**
    * Sets the request timeout for a specific API usage.
    * @param {string} api
    * @param {number} timeout
    * @returns {ClientBuilder}
    */
    apiTimeout(api, timeout) {
        const ptr = this.__destroy_into_raw();
        var ptr0 = passStringToWasm0(api, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.clientbuilder_apiTimeout(ptr, ptr0, len0, timeout);
        return ClientBuilder.__wrap(ret);
    }
    /**
    * Build the client.
    * @returns {Promise<any>}
    */
    build() {
        const ptr = this.__destroy_into_raw();
        var ret = wasm.clientbuilder_build(ptr);
        return takeObject(ret);
    }
}
module.exports.ClientBuilder = ClientBuilder;
/**
*/
class Cursor {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_cursor_free(ptr);
    }
}
module.exports.Cursor = Cursor;
/**
*/
class Details {

    static __wrap(ptr) {
        const obj = Object.create(Details.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_details_free(ptr);
    }
    /**
    * @returns {MessageMetadata}
    */
    get_metadata() {
        var ret = wasm.details_get_metadata(this.ptr);
        return MessageMetadata.__wrap(ret);
    }
    /**
    * @returns {MilestoneResponse | undefined}
    */
    get_milestone() {
        var ret = wasm.details_get_milestone(this.ptr);
        return ret === 0 ? undefined : MilestoneResponse.__wrap(ret);
    }
}
module.exports.Details = Details;
/**
*/
class GetAddressBuilder {

    static __wrap(ptr) {
        const obj = Object.create(GetAddressBuilder.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_getaddressbuilder_free(ptr);
    }
    /**
    * @param {Client} client
    * @returns {GetAddressBuilder}
    */
    static new(client) {
        _assertClass(client, Client);
        var ptr0 = client.ptr;
        client.ptr = 0;
        var ret = wasm.getaddressbuilder_new(ptr0);
        return GetAddressBuilder.__wrap(ret);
    }
    /**
    * Consume the builder and get the balance of a given Bech32 encoded address.
    * If count equals maxResults, then there might be more outputs available but those were skipped for performance
    * reasons. User should sweep the address to reduce the amount of outputs.
    * @param {string} address
    * @returns {Promise<any>}
    */
    balance(address) {
        var ptr0 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.getaddressbuilder_balance(this.ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * Consume the builder and get all outputs that use a given address.
    * If count equals maxResults, then there might be more outputs available but those were skipped for performance
    * reasons. User should sweep the address to reduce the amount of outputs.
    * @param {string} address
    * @param {any} options
    * @returns {Promise<any>}
    */
    outputs(address, options) {
        var ptr0 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.getaddressbuilder_outputs(this.ptr, ptr0, len0, addHeapObject(options));
        return takeObject(ret);
    }
}
module.exports.GetAddressBuilder = GetAddressBuilder;
/**
*/
class Message {

    static __wrap(ptr) {
        const obj = Object.create(Message.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_message_free(ptr);
    }
    /**
    * @returns {Message}
    */
    static default() {
        var ret = wasm.message_default();
        return Message.__wrap(ret);
    }
    /**
    * @param {string | undefined} identifier
    * @param {Uint8Array} public_payload
    * @param {Uint8Array} masked_payload
    * @returns {Message}
    */
    static new(identifier, public_payload, masked_payload) {
        var ptr0 = isLikeNone(identifier) ? 0 : passStringToWasm0(identifier, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passArray8ToWasm0(public_payload, wasm.__wbindgen_malloc);
        var len1 = WASM_VECTOR_LEN;
        var ptr2 = passArray8ToWasm0(masked_payload, wasm.__wbindgen_malloc);
        var len2 = WASM_VECTOR_LEN;
        var ret = wasm.message_new(ptr0, len0, ptr1, len1, ptr2, len2);
        return Message.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    get_identifier() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.message_get_identifier(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {Array<any>}
    */
    get_public_payload() {
        var ret = wasm.message_get_public_payload(this.ptr);
        return takeObject(ret);
    }
    /**
    * @returns {Array<any>}
    */
    get_masked_payload() {
        var ret = wasm.message_get_masked_payload(this.ptr);
        return takeObject(ret);
    }
}
module.exports.Message = Message;
/**
*/
class MessageBuilder {

    static __wrap(ptr) {
        const obj = Object.create(MessageBuilder.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_messagebuilder_free(ptr);
    }
    /**
    * @param {Client} client
    * @returns {MessageBuilder}
    */
    static new(client) {
        _assertClass(client, Client);
        var ptr0 = client.ptr;
        client.ptr = 0;
        var ret = wasm.messagebuilder_new(ptr0);
        return MessageBuilder.__wrap(ret);
    }
    /**
    * Set indexation to the builder
    * @param {Uint8Array} index
    * @returns {MessageBuilder}
    */
    index(index) {
        var ptr0 = passArray8ToWasm0(index, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.messagebuilder_index(this.ptr, ptr0, len0);
        return MessageBuilder.__wrap(ret);
    }
    /**
    * Set data to the builder
    * @param {Uint8Array} data
    * @returns {MessageBuilder}
    */
    data(data) {
        var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.messagebuilder_data(this.ptr, ptr0, len0);
        return MessageBuilder.__wrap(ret);
    }
    /**
    * Sets the seed.
    * @param {string} seed
    * @returns {MessageBuilder}
    */
    seed(seed) {
        var ptr0 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.messagebuilder_seed(this.ptr, ptr0, len0);
        return MessageBuilder.__wrap(ret);
    }
    /**
    * Sets the account index.
    * @param {number} account_index
    * @returns {MessageBuilder}
    */
    accountIndex(account_index) {
        var ret = wasm.messagebuilder_accountIndex(this.ptr, account_index);
        return MessageBuilder.__wrap(ret);
    }
    /**
    * Sets the index of the address to start looking for balance.
    * @param {number} initial_address_index
    * @returns {MessageBuilder}
    */
    initialAddressIndex(initial_address_index) {
        var ret = wasm.messagebuilder_initialAddressIndex(this.ptr, initial_address_index);
        return MessageBuilder.__wrap(ret);
    }
    /**
    * Set 1-8 custom parent message ids
    * @param {any} parents
    * @returns {MessageBuilder}
    */
    parents(parents) {
        var ret = wasm.messagebuilder_parents(this.ptr, addHeapObject(parents));
        return MessageBuilder.__wrap(ret);
    }
    /**
    * Set a custom input(transaction output)
    * @param {string} output_id
    * @returns {MessageBuilder}
    */
    input(output_id) {
        var ptr0 = passStringToWasm0(output_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.messagebuilder_input(this.ptr, ptr0, len0);
        return MessageBuilder.__wrap(ret);
    }
    /**
    * Set a custom range in which to search for addresses for custom provided inputs. Default: 0..100
    * @param {number} start
    * @param {number} end
    * @returns {MessageBuilder}
    */
    inputRange(start, end) {
        var ret = wasm.messagebuilder_inputRange(this.ptr, start, end);
        return MessageBuilder.__wrap(ret);
    }
    /**
    * Set a transfer to the builder
    * @param {string} address
    * @param {BigInt} amount
    * @returns {MessageBuilder}
    */
    output(address, amount) {
        var ptr0 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        uint64CvtShim[0] = amount;
        const low1 = u32CvtShim[0];
        const high1 = u32CvtShim[1];
        var ret = wasm.messagebuilder_output(this.ptr, ptr0, len0, low1, high1);
        return MessageBuilder.__wrap(ret);
    }
    /**
    * Set a dust allowance transfer to the builder, address needs to be Bech32 encoded
    * @param {string} address
    * @param {BigInt} amount
    * @returns {MessageBuilder}
    */
    dustAllowanceOutput(address, amount) {
        var ptr0 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        uint64CvtShim[0] = amount;
        const low1 = u32CvtShim[0];
        const high1 = u32CvtShim[1];
        var ret = wasm.messagebuilder_dustAllowanceOutput(this.ptr, ptr0, len0, low1, high1);
        return MessageBuilder.__wrap(ret);
    }
    /**
    * Prepare a transaction
    * @returns {Promise<any>}
    */
    prepareTransaction() {
        var ret = wasm.messagebuilder_prepareTransaction(this.ptr);
        return takeObject(ret);
    }
    /**
    * Sign a transaction
    * @param {any} prepared_transaction_data
    * @param {string} seed
    * @param {number | undefined} input_range_start
    * @param {number | undefined} input_range_end
    * @returns {Promise<any>}
    */
    signTransaction(prepared_transaction_data, seed, input_range_start, input_range_end) {
        var ptr0 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.messagebuilder_signTransaction(this.ptr, addHeapObject(prepared_transaction_data), ptr0, len0, !isLikeNone(input_range_start), isLikeNone(input_range_start) ? 0 : input_range_start, !isLikeNone(input_range_end), isLikeNone(input_range_end) ? 0 : input_range_end);
        return takeObject(ret);
    }
    /**
    * Create a message with a provided payload
    * @param {any} payload
    * @returns {Promise<any>}
    */
    finishMessage(payload) {
        var ret = wasm.messagebuilder_finishMessage(this.ptr, addHeapObject(payload));
        return takeObject(ret);
    }
    /**
    * Build and sumbit the message.
    * @returns {Promise<any>}
    */
    submit() {
        var ret = wasm.messagebuilder_submit(this.ptr);
        return takeObject(ret);
    }
}
module.exports.MessageBuilder = MessageBuilder;
/**
*/
class MessageGetter {

    static __wrap(ptr) {
        const obj = Object.create(MessageGetter.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_messagegetter_free(ptr);
    }
    /**
    * @param {Client} client
    * @returns {MessageGetter}
    */
    static new(client) {
        _assertClass(client, Client);
        var ptr0 = client.ptr;
        client.ptr = 0;
        var ret = wasm.messagegetter_new(ptr0);
        return MessageGetter.__wrap(ret);
    }
    /**
    * Get message ids with an index.
    * @param {Uint8Array} index
    * @returns {Promise<any>}
    */
    index(index) {
        var ptr0 = passArray8ToWasm0(index, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.messagegetter_index(this.ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * Get a message with the message id.
    * @param {string} message_id
    * @returns {Promise<any>}
    */
    data(message_id) {
        var ptr0 = passStringToWasm0(message_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.messagegetter_data(this.ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * Get the raw message with the message id.
    * @param {string} message_id
    * @returns {Promise<any>}
    */
    raw(message_id) {
        var ptr0 = passStringToWasm0(message_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.messagegetter_raw(this.ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * Get the childrens of a message with the message id.
    * @param {string} message_id
    * @returns {Promise<any>}
    */
    children(message_id) {
        var ptr0 = passStringToWasm0(message_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.messagegetter_children(this.ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * Get the metadata of a message with the message id.
    * @param {string} message_id
    * @returns {Promise<any>}
    */
    metadata(message_id) {
        var ptr0 = passStringToWasm0(message_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.messagegetter_metadata(this.ptr, ptr0, len0);
        return takeObject(ret);
    }
}
module.exports.MessageGetter = MessageGetter;
/**
*/
class MessageMetadata {

    static __wrap(ptr) {
        const obj = Object.create(MessageMetadata.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_messagemetadata_free(ptr);
    }
    /**
    */
    get is_solid() {
        var ret = wasm.__wbg_get_messagemetadata_is_solid(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set is_solid(arg0) {
        wasm.__wbg_set_messagemetadata_is_solid(this.ptr, arg0);
    }
    /**
    */
    get referenced_by_milestone_index() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_messagemetadata_referenced_by_milestone_index(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return r0 === 0 ? undefined : r1 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number | undefined} arg0
    */
    set referenced_by_milestone_index(arg0) {
        wasm.__wbg_set_messagemetadata_referenced_by_milestone_index(this.ptr, !isLikeNone(arg0), isLikeNone(arg0) ? 0 : arg0);
    }
    /**
    */
    get milestone_index() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_messagemetadata_milestone_index(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return r0 === 0 ? undefined : r1 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number | undefined} arg0
    */
    set milestone_index(arg0) {
        wasm.__wbg_set_messagemetadata_milestone_index(this.ptr, !isLikeNone(arg0), isLikeNone(arg0) ? 0 : arg0);
    }
    /**
    */
    get ledger_inclusion_state() {
        var ret = wasm.__wbg_get_messagemetadata_ledger_inclusion_state(this.ptr);
        return ret === 3 ? undefined : ret;
    }
    /**
    * @param {number | undefined} arg0
    */
    set ledger_inclusion_state(arg0) {
        wasm.__wbg_set_messagemetadata_ledger_inclusion_state(this.ptr, isLikeNone(arg0) ? 3 : arg0);
    }
    /**
    */
    get conflict_reason() {
        var ret = wasm.__wbg_get_messagemetadata_conflict_reason(this.ptr);
        return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
    * @param {number | undefined} arg0
    */
    set conflict_reason(arg0) {
        wasm.__wbg_set_messagemetadata_conflict_reason(this.ptr, isLikeNone(arg0) ? 0xFFFFFF : arg0);
    }
    /**
    */
    get should_promote() {
        var ret = wasm.__wbg_get_messagemetadata_should_promote(this.ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
    * @param {boolean | undefined} arg0
    */
    set should_promote(arg0) {
        wasm.__wbg_set_messagemetadata_should_promote(this.ptr, isLikeNone(arg0) ? 0xFFFFFF : arg0 ? 1 : 0);
    }
    /**
    */
    get should_reattach() {
        var ret = wasm.__wbg_get_messagemetadata_should_reattach(this.ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
    * @param {boolean | undefined} arg0
    */
    set should_reattach(arg0) {
        wasm.__wbg_set_messagemetadata_should_reattach(this.ptr, isLikeNone(arg0) ? 0xFFFFFF : arg0 ? 1 : 0);
    }
    /**
    * @returns {string}
    */
    get message_id() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.messagemetadata_message_id(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {Array<any>}
    */
    get get_parent_message_ids() {
        var ret = wasm.messagemetadata_get_parent_message_ids(this.ptr);
        return takeObject(ret);
    }
}
module.exports.MessageMetadata = MessageMetadata;
/**
*/
class MilestoneResponse {

    static __wrap(ptr) {
        const obj = Object.create(MilestoneResponse.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_milestoneresponse_free(ptr);
    }
    /**
    * Milestone index.
    */
    get index() {
        var ret = wasm.__wbg_get_milestoneresponse_index(this.ptr);
        return ret >>> 0;
    }
    /**
    * Milestone index.
    * @param {number} arg0
    */
    set index(arg0) {
        wasm.__wbg_set_milestoneresponse_index(this.ptr, arg0);
    }
    /**
    * Milestone timestamp.
    */
    get timestamp() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_milestoneresponse_timestamp(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = uint64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Milestone timestamp.
    * @param {BigInt} arg0
    */
    set timestamp(arg0) {
        uint64CvtShim[0] = arg0;
        const low0 = u32CvtShim[0];
        const high0 = u32CvtShim[1];
        wasm.__wbg_set_milestoneresponse_timestamp(this.ptr, low0, high0);
    }
    /**
    * @returns {string}
    */
    get message_id() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.milestoneresponse_message_id(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
module.exports.MilestoneResponse = MilestoneResponse;
/**
* Message identifier (12 Byte). Unique within a Channel.
*/
class MsgId {

    static __wrap(ptr) {
        const obj = Object.create(MsgId.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_msgid_free(ptr);
    }
    /**
    * Render the `MsgId` as a 12 Byte {@link https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array|Uint8Array}
    *
    * @see MsgId#hex
    * @returns {Uint8Array}
    */
    bytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.msgid_bytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Render the `MsgId` as a 12 Byte (24 char) hexadecimal String
    *
    * @see MsgId#bytes
    * @returns {string}
    */
    hex() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.msgid_hex(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Render the `MsgId` as an exchangeable String. Currently
    * outputs the same as {@link MsgId#hex}.
    *
    * @see MsgId#hex
    * @see MsgId.parse
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.msgid_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Decode a `MsgId` out of a String. The string must be a 24 char long hexadecimal string.
    *
    * @see Msgid#toString
    * @throws Throws error if string does not follow the expected format
    * @param {string} string
    * @returns {MsgId}
    */
    static parse(string) {
        var ptr0 = passStringToWasm0(string, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.msgid_parse(ptr0, len0);
        return MsgId.__wrap(ret);
    }
    /**
    * @returns {MsgId}
    */
    copy() {
        var ret = wasm.msgid_copy(this.ptr);
        return MsgId.__wrap(ret);
    }
}
module.exports.MsgId = MsgId;
/**
*/
class NextMsgId {

    static __wrap(ptr) {
        const obj = Object.create(NextMsgId.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_nextmsgid_free(ptr);
    }
    /**
    * @param {string} identifier
    * @param {Address} msgid
    * @returns {NextMsgId}
    */
    static new(identifier, msgid) {
        var ptr0 = passStringToWasm0(identifier, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        _assertClass(msgid, Address);
        var ptr1 = msgid.ptr;
        msgid.ptr = 0;
        var ret = wasm.nextmsgid_new(ptr0, len0, ptr1);
        return NextMsgId.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    get identifier() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.nextmsgid_identifier(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {Address}
    */
    get link() {
        var ret = wasm.nextmsgid_link(this.ptr);
        return Address.__wrap(ret);
    }
}
module.exports.NextMsgId = NextMsgId;
/**
*/
class PskIds {

    static __wrap(ptr) {
        const obj = Object.create(PskIds.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pskids_free(ptr);
    }
    /**
    * @returns {PskIds}
    */
    static new() {
        var ret = wasm.pskids_new();
        return PskIds.__wrap(ret);
    }
    /**
    * @param {string} id
    */
    add(id) {
        var ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.pskids_add(this.ptr, ptr0, len0);
    }
    /**
    * @returns {Array<any>}
    */
    get_ids() {
        var ret = wasm.pskids_get_ids(this.ptr);
        return takeObject(ret);
    }
}
module.exports.PskIds = PskIds;
/**
* Collection of PublicKeys representing a set of users
*/
class PublicKeys {

    static __wrap(ptr) {
        const obj = Object.create(PublicKeys.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_publickeys_free(ptr);
    }
    /**
    */
    constructor() {
        var ret = wasm.publickeys_new();
        return PublicKeys.__wrap(ret);
    }
    /**
    * Add key to collection
    *
    * Key must be a valid 32 Byte public-key string in its hexadecimal representation.
    *
    * @throws Throws error if string is not a valid public key
    * @param {string} id
    */
    add(id) {
        var ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.publickeys_add(this.ptr, ptr0, len0);
    }
    /**
    * Obtain all the public-keys collected so far in an string array
    * @returns {Array<any>}
    */
    get_pks() {
        var ret = wasm.publickeys_get_pks(this.ptr);
        return takeObject(ret);
    }
}
module.exports.PublicKeys = PublicKeys;
/**
*/
class SendOptions {

    static __wrap(ptr) {
        const obj = Object.create(SendOptions.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_sendoptions_free(ptr);
    }
    /**
    */
    get local_pow() {
        var ret = wasm.__wbg_get_sendoptions_local_pow(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set local_pow(arg0) {
        wasm.__wbg_set_sendoptions_local_pow(this.ptr, arg0);
    }
    /**
    * @param {string} url
    * @param {boolean} local_pow
    */
    constructor(url, local_pow) {
        var ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.sendoptions_new(ptr0, len0, local_pow);
        return SendOptions.__wrap(ret);
    }
    /**
    * @param {string} url
    */
    set url(url) {
        var ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.sendoptions_set_url(this.ptr, ptr0, len0);
    }
    /**
    * @returns {string}
    */
    get url() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.sendoptions_url(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {SendOptions}
    */
    clone() {
        var ret = wasm.sendoptions_clone(this.ptr);
        return SendOptions.__wrap(ret);
    }
}
module.exports.SendOptions = SendOptions;
/**
*/
class StreamsClient {

    static __wrap(ptr) {
        const obj = Object.create(StreamsClient.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_streamsclient_free(ptr);
    }
    /**
    * @param {string} node
    * @param {SendOptions} options
    */
    constructor(node, options) {
        var ptr0 = passStringToWasm0(node, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        _assertClass(options, SendOptions);
        var ptr1 = options.ptr;
        options.ptr = 0;
        var ret = wasm.streamsclient_new(ptr0, len0, ptr1);
        return StreamsClient.__wrap(ret);
    }
    /**
    * @param {Client} client
    * @returns {StreamsClient}
    */
    static fromClient(client) {
        _assertClass(client, Client);
        var ret = wasm.streamsclient_fromClient(client.ptr);
        return StreamsClient.__wrap(ret);
    }
    /**
    * @param {Address} link
    * @returns {Promise<any>}
    */
    get_link_details(link) {
        const ptr = this.__destroy_into_raw();
        _assertClass(link, Address);
        var ret = wasm.streamsclient_get_link_details(ptr, link.ptr);
        return takeObject(ret);
    }
}
module.exports.StreamsClient = StreamsClient;
/**
*/
class Subscriber {

    static __wrap(ptr) {
        const obj = Object.create(Subscriber.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_subscriber_free(ptr);
    }
    /**
    * @param {string} seed
    * @param {SendOptions} options
    */
    constructor(seed, options) {
        var ptr0 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        _assertClass(options, SendOptions);
        var ptr1 = options.ptr;
        options.ptr = 0;
        var ret = wasm.subscriber_new(ptr0, len0, ptr1);
        return Subscriber.__wrap(ret);
    }
    /**
    * @param {StreamsClient} client
    * @param {string} seed
    * @returns {Subscriber}
    */
    static fromClient(client, seed) {
        _assertClass(client, StreamsClient);
        var ptr0 = client.ptr;
        client.ptr = 0;
        var ptr1 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.subscriber_fromClient(ptr0, ptr1, len1);
        return Subscriber.__wrap(ret);
    }
    /**
    * @param {StreamsClient} client
    * @param {Uint8Array} bytes
    * @param {string} password
    * @returns {Subscriber}
    */
    static import(client, bytes, password) {
        _assertClass(client, StreamsClient);
        var ptr0 = client.ptr;
        client.ptr = 0;
        var ptr1 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        var len1 = WASM_VECTOR_LEN;
        var ptr2 = passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        var ret = wasm.subscriber_import(ptr0, ptr1, len1, ptr2, len2);
        return Subscriber.__wrap(ret);
    }
    /**
    * @returns {Subscriber}
    */
    clone() {
        var ret = wasm.subscriber_clone(this.ptr);
        return Subscriber.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    channel_address() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.subscriber_channel_address(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string | undefined}
    */
    announcementLink() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.subscriber_announcementLink(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            let v0;
            if (r0 !== 0) {
                v0 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_free(r0, r1 * 1);
            }
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {StreamsClient}
    */
    get_client() {
        var ret = wasm.subscriber_get_client(this.ptr);
        return StreamsClient.__wrap(ret);
    }
    /**
    * @returns {boolean}
    */
    is_multi_branching() {
        var ret = wasm.subscriber_is_multi_branching(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {string} psk_seed_str
    * @returns {string}
    */
    store_psk(psk_seed_str) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(psk_seed_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.subscriber_store_psk(retptr, this.ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    get_public_key() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.subscriber_get_public_key(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    author_public_key() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.subscriber_author_public_key(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {boolean}
    */
    is_registered() {
        var ret = wasm.subscriber_is_registered(this.ptr);
        return ret !== 0;
    }
    /**
    */
    unregister() {
        wasm.subscriber_unregister(this.ptr);
    }
    /**
    * @param {string} password
    * @returns {Uint8Array}
    */
    export(password) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.subscriber_export(retptr, this.ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Address} link
    * @returns {Promise<void>}
    */
    receive_announcement(link) {
        const ptr = this.__destroy_into_raw();
        _assertClass(link, Address);
        var ptr0 = link.ptr;
        link.ptr = 0;
        var ret = wasm.subscriber_receive_announcement(ptr, ptr0);
        return takeObject(ret);
    }
    /**
    * @param {Address} link
    * @returns {Promise<boolean>}
    */
    receive_keyload(link) {
        const ptr = this.__destroy_into_raw();
        _assertClass(link, Address);
        var ptr0 = link.ptr;
        link.ptr = 0;
        var ret = wasm.subscriber_receive_keyload(ptr, ptr0);
        return takeObject(ret);
    }
    /**
    * @param {Address} link
    * @returns {Promise<UserResponse>}
    */
    receive_tagged_packet(link) {
        const ptr = this.__destroy_into_raw();
        _assertClass(link, Address);
        var ptr0 = link.ptr;
        link.ptr = 0;
        var ret = wasm.subscriber_receive_tagged_packet(ptr, ptr0);
        return takeObject(ret);
    }
    /**
    * @param {Address} link
    * @returns {Promise<UserResponse>}
    */
    receive_signed_packet(link) {
        const ptr = this.__destroy_into_raw();
        _assertClass(link, Address);
        var ptr0 = link.ptr;
        link.ptr = 0;
        var ret = wasm.subscriber_receive_signed_packet(ptr, ptr0);
        return takeObject(ret);
    }
    /**
    * @param {Address} link
    * @returns {Promise<Address>}
    */
    receive_sequence(link) {
        const ptr = this.__destroy_into_raw();
        _assertClass(link, Address);
        var ptr0 = link.ptr;
        link.ptr = 0;
        var ret = wasm.subscriber_receive_sequence(ptr, ptr0);
        return takeObject(ret);
    }
    /**
    * @param {Address} link
    * @returns {Promise<UserResponse>}
    */
    receive_msg(link) {
        const ptr = this.__destroy_into_raw();
        _assertClass(link, Address);
        var ptr0 = link.ptr;
        link.ptr = 0;
        var ret = wasm.subscriber_receive_msg(ptr, ptr0);
        return takeObject(ret);
    }
    /**
    * @param {Address} anchor_link
    * @param {number} msg_num
    * @returns {Promise<UserResponse>}
    */
    receive_msg_by_sequence_number(anchor_link, msg_num) {
        const ptr = this.__destroy_into_raw();
        _assertClass(anchor_link, Address);
        var ptr0 = anchor_link.ptr;
        anchor_link.ptr = 0;
        var ret = wasm.subscriber_receive_msg_by_sequence_number(ptr, ptr0, msg_num);
        return takeObject(ret);
    }
    /**
    * @param {Address} link
    * @returns {Promise<UserResponse>}
    */
    send_subscribe(link) {
        const ptr = this.__destroy_into_raw();
        _assertClass(link, Address);
        var ptr0 = link.ptr;
        link.ptr = 0;
        var ret = wasm.subscriber_send_subscribe(ptr, ptr0);
        return takeObject(ret);
    }
    /**
    * @param {Address} link
    * @returns {Promise<UserResponse>}
    */
    send_unsubscribe(link) {
        const ptr = this.__destroy_into_raw();
        _assertClass(link, Address);
        var ptr0 = link.ptr;
        link.ptr = 0;
        var ret = wasm.subscriber_send_unsubscribe(ptr, ptr0);
        return takeObject(ret);
    }
    /**
    * @param {Address} link
    * @param {Uint8Array} public_payload
    * @param {Uint8Array} masked_payload
    * @returns {Promise<UserResponse>}
    */
    send_tagged_packet(link, public_payload, masked_payload) {
        const ptr = this.__destroy_into_raw();
        _assertClass(link, Address);
        var ptr0 = link.ptr;
        link.ptr = 0;
        var ptr1 = passArray8ToWasm0(public_payload, wasm.__wbindgen_malloc);
        var len1 = WASM_VECTOR_LEN;
        var ptr2 = passArray8ToWasm0(masked_payload, wasm.__wbindgen_malloc);
        var len2 = WASM_VECTOR_LEN;
        var ret = wasm.subscriber_send_tagged_packet(ptr, ptr0, ptr1, len1, ptr2, len2);
        return takeObject(ret);
    }
    /**
    * @param {Address} link
    * @param {Uint8Array} public_payload
    * @param {Uint8Array} masked_payload
    * @returns {Promise<UserResponse>}
    */
    send_signed_packet(link, public_payload, masked_payload) {
        const ptr = this.__destroy_into_raw();
        _assertClass(link, Address);
        var ptr0 = link.ptr;
        link.ptr = 0;
        var ptr1 = passArray8ToWasm0(public_payload, wasm.__wbindgen_malloc);
        var len1 = WASM_VECTOR_LEN;
        var ptr2 = passArray8ToWasm0(masked_payload, wasm.__wbindgen_malloc);
        var len2 = WASM_VECTOR_LEN;
        var ret = wasm.subscriber_send_signed_packet(ptr, ptr0, ptr1, len1, ptr2, len2);
        return takeObject(ret);
    }
    /**
    * @returns {Promise<void>}
    */
    sync_state() {
        const ptr = this.__destroy_into_raw();
        var ret = wasm.subscriber_sync_state(ptr);
        return takeObject(ret);
    }
    /**
    * @returns {Promise<Array<any>>}
    */
    fetch_next_msgs() {
        const ptr = this.__destroy_into_raw();
        var ret = wasm.subscriber_fetch_next_msgs(ptr);
        return takeObject(ret);
    }
    /**
    * @param {Address} link
    * @returns {Promise<UserResponse>}
    */
    fetch_prev_msg(link) {
        const ptr = this.__destroy_into_raw();
        _assertClass(link, Address);
        var ptr0 = link.ptr;
        link.ptr = 0;
        var ret = wasm.subscriber_fetch_prev_msg(ptr, ptr0);
        return takeObject(ret);
    }
    /**
    * @param {Address} link
    * @param {number} num_msgs
    * @returns {Promise<Array<any>>}
    */
    fetch_prev_msgs(link, num_msgs) {
        const ptr = this.__destroy_into_raw();
        _assertClass(link, Address);
        var ptr0 = link.ptr;
        link.ptr = 0;
        var ret = wasm.subscriber_fetch_prev_msgs(ptr, ptr0, num_msgs);
        return takeObject(ret);
    }
    /**
    * @returns {Array<any>}
    */
    fetch_state() {
        var ret = wasm.subscriber_fetch_state(this.ptr);
        return takeObject(ret);
    }
    /**
    */
    reset_state() {
        const ptr = this.__destroy_into_raw();
        wasm.subscriber_reset_state(ptr);
    }
    /**
    * @param {string} pskid_str
    */
    remove_psk(pskid_str) {
        var ptr0 = passStringToWasm0(pskid_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.subscriber_remove_psk(this.ptr, ptr0, len0);
    }
}
module.exports.Subscriber = Subscriber;
/**
*/
class UnspentAddressGetter {

    static __wrap(ptr) {
        const obj = Object.create(UnspentAddressGetter.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_unspentaddressgetter_free(ptr);
    }
    /**
    * @param {Client} client
    * @param {string} seed
    * @returns {UnspentAddressGetter}
    */
    static new(client, seed) {
        _assertClass(client, Client);
        var ptr0 = client.ptr;
        client.ptr = 0;
        var ptr1 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.unspentaddressgetter_new(ptr0, ptr1, len1);
        return UnspentAddressGetter.__wrap(ret);
    }
    /**
    * Sets the account index
    * @param {number} index
    * @returns {UnspentAddressGetter}
    */
    accountIndex(index) {
        var ret = wasm.unspentaddressgetter_accountIndex(this.ptr, index);
        return UnspentAddressGetter.__wrap(ret);
    }
    /**
    * Sets the index of the address to start looking for balance
    * @param {number} index
    * @returns {UnspentAddressGetter}
    */
    initialAddressIndex(index) {
        var ret = wasm.unspentaddressgetter_initialAddressIndex(this.ptr, index);
        return UnspentAddressGetter.__wrap(ret);
    }
    /**
    * Get an unspent address with its index.
    * @returns {Promise<any>}
    */
    get() {
        var ret = wasm.unspentaddressgetter_get(this.ptr);
        return takeObject(ret);
    }
}
module.exports.UnspentAddressGetter = UnspentAddressGetter;
/**
*/
class UserResponse {

    static __wrap(ptr) {
        const obj = Object.create(UserResponse.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_userresponse_free(ptr);
    }
    /**
    * @param {Address} link
    * @param {Address | undefined} seq_link
    * @param {Message | undefined} message
    * @returns {UserResponse}
    */
    static new(link, seq_link, message) {
        _assertClass(link, Address);
        var ptr0 = link.ptr;
        link.ptr = 0;
        let ptr1 = 0;
        if (!isLikeNone(seq_link)) {
            _assertClass(seq_link, Address);
            ptr1 = seq_link.ptr;
            seq_link.ptr = 0;
        }
        let ptr2 = 0;
        if (!isLikeNone(message)) {
            _assertClass(message, Message);
            ptr2 = message.ptr;
            message.ptr = 0;
        }
        var ret = wasm.userresponse_new(ptr0, ptr1, ptr2);
        return UserResponse.__wrap(ret);
    }
    /**
    * @param {string} link
    * @param {string | undefined} seq_link
    * @param {Message | undefined} message
    * @returns {UserResponse}
    */
    static fromStrings(link, seq_link, message) {
        var ptr0 = passStringToWasm0(link, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(seq_link) ? 0 : passStringToWasm0(seq_link, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        let ptr2 = 0;
        if (!isLikeNone(message)) {
            _assertClass(message, Message);
            ptr2 = message.ptr;
            message.ptr = 0;
        }
        var ret = wasm.userresponse_fromStrings(ptr0, len0, ptr1, len1, ptr2);
        return UserResponse.__wrap(ret);
    }
    /**
    * @returns {UserResponse}
    */
    copy() {
        var ret = wasm.userresponse_copy(this.ptr);
        return UserResponse.__wrap(ret);
    }
    /**
    * @returns {Address}
    */
    get link() {
        var ret = wasm.userresponse_link(this.ptr);
        return Address.__wrap(ret);
    }
    /**
    * @returns {Address | undefined}
    */
    get seqLink() {
        var ret = wasm.userresponse_seqLink(this.ptr);
        return ret === 0 ? undefined : Address.__wrap(ret);
    }
    /**
    * @returns {Message | undefined}
    */
    get message() {
        var ret = wasm.userresponse_message(this.ptr);
        return ret === 0 ? undefined : Message.__wrap(ret);
    }
}
module.exports.UserResponse = UserResponse;
/**
*/
class UserState {

    static __wrap(ptr) {
        const obj = Object.create(UserState.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_userstate_free(ptr);
    }
    /**
    * @param {string} identifier
    * @param {Cursor} cursor
    * @returns {UserState}
    */
    static new(identifier, cursor) {
        var ptr0 = passStringToWasm0(identifier, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        _assertClass(cursor, Cursor);
        var ptr1 = cursor.ptr;
        cursor.ptr = 0;
        var ret = wasm.userstate_new(ptr0, len0, ptr1);
        return UserState.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    get identifier() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.userstate_identifier(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {Address}
    */
    get link() {
        var ret = wasm.userstate_link(this.ptr);
        return Address.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    get seqNo() {
        var ret = wasm.userstate_seqNo(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    get branchNo() {
        var ret = wasm.userstate_branchNo(this.ptr);
        return ret >>> 0;
    }
}
module.exports.UserState = UserState;

module.exports.__wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

module.exports.__wbg_call_346669c262382ad7 = function() { return handleError(function (arg0, arg1, arg2) {
    var ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbindgen_string_new = function(arg0, arg1) {
    var ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

module.exports.__wbg_details_new = function(arg0) {
    var ret = Details.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_author_new = function(arg0) {
    var ret = Author.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_new_949bbc1147195c4e = function() {
    var ret = new Array();
    return addHeapObject(ret);
};

module.exports.__wbg_nextmsgid_new = function(arg0) {
    var ret = NextMsgId.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_push_284486ca27c6aa8b = function(arg0, arg1) {
    var ret = getObject(arg0).push(getObject(arg1));
    return ret;
};

module.exports.__wbg_new_342a24ca698edd87 = function(arg0, arg1) {
    var ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

module.exports.__wbg_setname_15d4109043e260cc = function(arg0, arg1, arg2) {
    getObject(arg0).name = getStringFromWasm0(arg1, arg2);
};

module.exports.__wbg_new_b1d61b5687f5e73a = function(arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return __wbg_adapter_209(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        var ret = new Promise(cb0);
        return addHeapObject(ret);
    } finally {
        state0.a = state0.b = 0;
    }
};

module.exports.__wbindgen_json_serialize = function(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = JSON.stringify(obj === undefined ? null : obj);
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

module.exports.__wbg_randomFillSync_64cc7d048f228ca8 = function() { return handleError(function (arg0, arg1, arg2) {
    getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
}, arguments) };

module.exports.__wbg_subarray_8b658422a224f479 = function(arg0, arg1, arg2) {
    var ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

module.exports.__wbg_getRandomValues_98117e9a7e993920 = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).getRandomValues(getObject(arg1));
}, arguments) };

module.exports.__wbindgen_json_parse = function(arg0, arg1) {
    var ret = JSON.parse(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

module.exports.__wbg_new_0b83d3df67ecb33e = function() {
    var ret = new Object();
    return addHeapObject(ret);
};

module.exports.__wbg_instanceof_Response_e1b11afbefa5b563 = function(arg0) {
    var ret = getObject(arg0) instanceof Response;
    return ret;
};

module.exports.__wbg_status_6d8bb444ddc5a7b2 = function(arg0) {
    var ret = getObject(arg0).status;
    return ret;
};

module.exports.__wbg_headers_5ffa990806e04cfc = function(arg0) {
    var ret = getObject(arg0).headers;
    return addHeapObject(ret);
};

module.exports.__wbindgen_string_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

module.exports.__wbg_arrayBuffer_b8937ed04beb0d36 = function() { return handleError(function (arg0) {
    var ret = getObject(arg0).arrayBuffer();
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_new_a7ce447f15ff496f = function(arg0) {
    var ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};

module.exports.__wbg_length_1eb8fc608a0d4cdb = function(arg0) {
    var ret = getObject(arg0).length;
    return ret;
};

module.exports.__wbg_clientbuilder_new = function(arg0) {
    var ret = ClientBuilder.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_client_new = function(arg0) {
    var ret = Client.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_new_693216e109162396 = function() {
    var ret = new Error();
    return addHeapObject(ret);
};

module.exports.__wbg_stack_0ddaca5d1abfb52f = function(arg0, arg1) {
    var ret = getObject(arg1).stack;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

module.exports.__wbg_error_09919627ac0992f5 = function(arg0, arg1) {
    try {
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(arg0, arg1);
    }
};

module.exports.__wbg_process_2f24d6544ea7b200 = function(arg0) {
    var ret = getObject(arg0).process;
    return addHeapObject(ret);
};

module.exports.__wbindgen_is_object = function(arg0) {
    const val = getObject(arg0);
    var ret = typeof(val) === 'object' && val !== null;
    return ret;
};

module.exports.__wbg_versions_6164651e75405d4a = function(arg0) {
    var ret = getObject(arg0).versions;
    return addHeapObject(ret);
};

module.exports.__wbg_node_4b517d861cbcb3bc = function(arg0) {
    var ret = getObject(arg0).node;
    return addHeapObject(ret);
};

module.exports.__wbindgen_is_string = function(arg0) {
    var ret = typeof(getObject(arg0)) === 'string';
    return ret;
};

module.exports.__wbg_modulerequire_3440a4bcf44437db = function() { return handleError(function (arg0, arg1) {
    var ret = module.require(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_crypto_98fc271021c7d2ad = function(arg0) {
    var ret = getObject(arg0).crypto;
    return addHeapObject(ret);
};

module.exports.__wbg_msCrypto_a2cdb043d2bfe57f = function(arg0) {
    var ret = getObject(arg0).msCrypto;
    return addHeapObject(ret);
};

module.exports.__wbg_newwithlength_929232475839a482 = function(arg0) {
    var ret = new Uint8Array(arg0 >>> 0);
    return addHeapObject(ret);
};

module.exports.__wbg_now_559193109055ebad = function(arg0) {
    var ret = getObject(arg0).now();
    return ret;
};

module.exports.__wbg_next_7720502039b96d00 = function() { return handleError(function (arg0) {
    var ret = getObject(arg0).next();
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_done_b06cf0578e89ff68 = function(arg0) {
    var ret = getObject(arg0).done;
    return ret;
};

module.exports.__wbg_value_e74a542443d92451 = function(arg0) {
    var ret = getObject(arg0).value;
    return addHeapObject(ret);
};

module.exports.__wbg_iterator_4fc4ce93e6b92958 = function() {
    var ret = Symbol.iterator;
    return addHeapObject(ret);
};

module.exports.__wbg_get_4d0f21c2f823742e = function() { return handleError(function (arg0, arg1) {
    var ret = Reflect.get(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbindgen_is_function = function(arg0) {
    var ret = typeof(getObject(arg0)) === 'function';
    return ret;
};

module.exports.__wbg_call_888d259a5fefc347 = function() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_next_c4151d46d5fa7097 = function(arg0) {
    var ret = getObject(arg0).next;
    return addHeapObject(ret);
};

module.exports.__wbindgen_object_clone_ref = function(arg0) {
    var ret = getObject(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_self_c6fbdfc2918d5e58 = function() { return handleError(function () {
    var ret = self.self;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_window_baec038b5ab35c54 = function() { return handleError(function () {
    var ret = window.window;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_globalThis_3f735a5746d41fbd = function() { return handleError(function () {
    var ret = globalThis.globalThis;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_global_1bc0b39582740e95 = function() { return handleError(function () {
    var ret = global.global;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbindgen_is_undefined = function(arg0) {
    var ret = getObject(arg0) === undefined;
    return ret;
};

module.exports.__wbg_newnoargs_be86524d73f67598 = function(arg0, arg1) {
    var ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

module.exports.__wbindgen_memory = function() {
    var ret = wasm.memory;
    return addHeapObject(ret);
};

module.exports.__wbg_buffer_397eaa4d72ee94dd = function(arg0) {
    var ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};

module.exports.__wbg_set_969ad0a60e51d320 = function(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};

module.exports.__wbg_set_82a4e8a85e31ac42 = function() { return handleError(function (arg0, arg1, arg2) {
    var ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
    return ret;
}, arguments) };

module.exports.__wbg_stringify_d4507a59932eed0c = function() { return handleError(function (arg0) {
    var ret = JSON.stringify(getObject(arg0));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_self_86b4b13392c7af56 = function() { return handleError(function () {
    var ret = self.self;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_crypto_b8c92eaac23d0d80 = function(arg0) {
    var ret = getObject(arg0).crypto;
    return addHeapObject(ret);
};

module.exports.__wbg_msCrypto_9ad6677321a08dd8 = function(arg0) {
    var ret = getObject(arg0).msCrypto;
    return addHeapObject(ret);
};

module.exports.__wbg_static_accessor_MODULE_452b4680e8614c81 = function() {
    var ret = module;
    return addHeapObject(ret);
};

module.exports.__wbg_require_f5521a5b85ad2542 = function(arg0, arg1, arg2) {
    var ret = getObject(arg0).require(getStringFromWasm0(arg1, arg2));
    return addHeapObject(ret);
};

module.exports.__wbg_getRandomValues_dd27e6b0652b3236 = function(arg0) {
    var ret = getObject(arg0).getRandomValues;
    return addHeapObject(ret);
};

module.exports.__wbg_randomFillSync_d2ba53160aec6aba = function(arg0, arg1, arg2) {
    getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
};

module.exports.__wbg_getRandomValues_e57c9b75ddead065 = function(arg0, arg1) {
    getObject(arg0).getRandomValues(getObject(arg1));
};

module.exports.__wbg_newwithbyteoffsetandlength_4b9b8c4e3f5adbff = function(arg0, arg1, arg2) {
    var ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

module.exports.__wbg_has_1275b5eec3dc7a7a = function() { return handleError(function (arg0, arg1) {
    var ret = Reflect.has(getObject(arg0), getObject(arg1));
    return ret;
}, arguments) };

module.exports.__wbg_fetch_b4e81012e07ff95a = function(arg0, arg1) {
    var ret = getObject(arg0).fetch(getObject(arg1));
    return addHeapObject(ret);
};

module.exports.__wbg_fetch_8faea3d0d99e2894 = function(arg0) {
    var ret = fetch(getObject(arg0));
    return addHeapObject(ret);
};

module.exports.__wbg_userstate_new = function(arg0) {
    var ret = UserState.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_address_new = function(arg0) {
    var ret = Address.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_userresponse_new = function(arg0) {
    var ret = UserResponse.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbindgen_number_new = function(arg0) {
    var ret = arg0;
    return addHeapObject(ret);
};

module.exports.__wbg_new0_fd3a3a290b25cdac = function() {
    var ret = new Date();
    return addHeapObject(ret);
};

module.exports.__wbg_getTime_10d33f4f2959e5dd = function(arg0) {
    var ret = getObject(arg0).getTime();
    return ret;
};

module.exports.__wbindgen_debug_string = function(arg0, arg1) {
    var ret = debugString(getObject(arg1));
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

module.exports.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

module.exports.__wbindgen_rethrow = function(arg0) {
    throw takeObject(arg0);
};

module.exports.__wbg_then_2fcac196782070cc = function(arg0, arg1) {
    var ret = getObject(arg0).then(getObject(arg1));
    return addHeapObject(ret);
};

module.exports.__wbg_then_8c2d62e8ae5978f7 = function(arg0, arg1, arg2) {
    var ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};

module.exports.__wbg_resolve_d23068002f584f22 = function(arg0) {
    var ret = Promise.resolve(getObject(arg0));
    return addHeapObject(ret);
};

module.exports.__wbindgen_cb_drop = function(arg0) {
    const obj = takeObject(arg0).original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    var ret = false;
    return ret;
};

module.exports.__wbg_setTimeout_df66d951b1726b78 = function() { return handleError(function (arg0, arg1, arg2) {
    var ret = getObject(arg0).setTimeout(getObject(arg1), arg2);
    return ret;
}, arguments) };

module.exports.__wbg_new_9c35e8e8b09fb4a3 = function() { return handleError(function () {
    var ret = new Headers();
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_append_fb85316567f7a798 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
}, arguments) };

module.exports.__wbg_url_50e0bdb6051741be = function(arg0, arg1) {
    var ret = getObject(arg1).url;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

module.exports.__wbg_text_8279d34d73e43c68 = function() { return handleError(function (arg0) {
    var ret = getObject(arg0).text();
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_newwithstrandinit_9b0fa00478c37287 = function() { return handleError(function (arg0, arg1, arg2) {
    var ret = new Request(getStringFromWasm0(arg0, arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbindgen_closure_wrapper6359 = function(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 137, __wbg_adapter_34);
    return addHeapObject(ret);
};

module.exports.__wbindgen_closure_wrapper6397 = function(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 141, __wbg_adapter_37);
    return addHeapObject(ret);
};

const path = require('path').join(__dirname, 'streams_bg.wasm');
const bytes = require('fs').readFileSync(path);

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;

wasm.__wbindgen_start();

