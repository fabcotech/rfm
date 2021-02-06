"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DID = void 0;
const did_resolver_1 = require("did-resolver");
const rpc_utils_1 = require("rpc-utils");
const did_jwt_1 = require("did-jwt");
const dag_jose_utils_1 = require("dag-jose-utils");
const utils_1 = require("./utils");
function isResolver(resolver) {
    return 'registry' in resolver && 'cache' in resolver;
}
class DID {
    constructor({ provider, resolver = {}, cache } = {}) {
        if (provider != null) {
            this._client = new rpc_utils_1.RPCClient(provider);
        }
        this.setResolver(resolver, cache);
    }
    get authenticated() {
        return this._id != null;
    }
    get id() {
        if (this._id == null) {
            throw new Error('DID is not authenticated');
        }
        return this._id;
    }
    setProvider(provider) {
        if (this._client == null) {
            this._client = new rpc_utils_1.RPCClient(provider);
        }
        else if (this._client.connection !== provider) {
            throw new Error('A different provider is already set, create a new DID instance to use another provider');
        }
    }
    clearProvider() {
        if (this._client !== undefined) {
            this._client = undefined;
        }
    }
    setResolver(resolver, cache) {
        this._resolver = isResolver(resolver) ? resolver : new did_resolver_1.Resolver(resolver, cache);
    }
    authenticate({ provider, paths, aud } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (provider != null) {
                this.setProvider(provider);
            }
            if (this._client == null) {
                throw new Error('No provider available');
            }
            const nonce = utils_1.randomString();
            const jws = yield this._client.request('did_authenticate', {
                nonce,
                aud,
                paths,
            });
            const { kid } = yield this.verifyJWS(jws);
            const payload = utils_1.base64urlToJSON(jws.payload);
            if (!kid.includes(payload.did))
                throw new Error('Invalid authencation response, kid mismatch');
            if (payload.nonce !== nonce)
                throw new Error('Invalid authencation response, wrong nonce');
            if (payload.aud !== aud)
                throw new Error('Invalid authencation response, wrong aud');
            if (payload.exp < Date.now() / 1000)
                throw new Error('Invalid authencation response, expired');
            this._id = payload.did;
            return this._id;
        });
    }
    deauthenticate() {
        this.clearProvider();
        this._id = undefined;
    }
    createJWS(payload, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._client == null)
                throw new Error('No provider available');
            if (this._id == null)
                throw new Error('DID is not authenticated');
            if (!options.did)
                options.did = this._id;
            const { jws } = yield this._client.request('did_createJWS', Object.assign(Object.assign({}, options), { payload }));
            return jws;
        });
    }
    createDagJWS(payload, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cid, linkedBlock } = yield dag_jose_utils_1.encodePayload(payload);
            const payloadCid = utils_1.encodeBase64Url(cid.bytes);
            Object.assign(options, { linkedBlock: utils_1.encodeBase64(linkedBlock) });
            const jws = yield this.createJWS(payloadCid, options);
            jws.link = cid;
            return { jws, linkedBlock };
        });
    }
    verifyJWS(jws) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof jws !== 'string')
                jws = utils_1.fromDagJWS(jws);
            const kid = utils_1.base64urlToJSON(jws.split('.')[0]).kid;
            if (!kid)
                throw new Error('No "kid" found in jws');
            const { publicKey } = yield this.resolve(kid);
            did_jwt_1.verifyJWS(jws, publicKey);
            let payload;
            try {
                payload = utils_1.base64urlToJSON(jws.split('.')[1]);
            }
            catch (e) {
            }
            return { kid, payload };
        });
    }
    createJWE(cleartext, recipients, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._client == null)
                throw new Error('No provider available');
            const didDoc = yield this._resolver.resolve(recipients[0]);
            const recepients = [];
            if (didDoc.publicKey[0].publicKeyHex) {
                recepients.push(didDoc.publicKey[0].publicKeyHex);
            }
            try {
                const { jwe } = yield this._client.request('did_createJWE', Object.assign(Object.assign({}, options), { cleartext, recipients: recepients }));
                return jwe;
            }
            catch (err) {
                const encrypters = yield did_jwt_1.resolveX25519Encrypters(recipients, this._resolver);
                return did_jwt_1.createJWE(cleartext, encrypters, options.protectedHeader, options.aad);
            }
        });
    }
    createDagJWE(cleartext, recipients, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createJWE(dag_jose_utils_1.prepareCleartext(cleartext), recipients, options);
        });
    }
    decryptJWE(jwe, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._client == null)
                throw new Error('No provider available');
            if (this._id == null)
                throw new Error('DID is not authenticated');
            if (!options.did)
                options.did = this._id;
            const { cleartext } = yield this._client.request('did_decryptJWE', Object.assign(Object.assign({}, options), { jwe }));
            return utils_1.decodeBase64(cleartext);
        });
    }
    decryptDagJWE(jwe) {
        return __awaiter(this, void 0, void 0, function* () {
            const bytes = yield this.decryptJWE(jwe);
            return dag_jose_utils_1.decodeCleartext(bytes);
        });
    }
    resolve(didUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._resolver.resolve(didUrl);
        });
    }
}
exports.DID = DID;
//# sourceMappingURL=index.js.map