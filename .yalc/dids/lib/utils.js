"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromDagJWS = exports.randomString = exports.base64urlToJSON = exports.decodeBase64 = exports.encodeBase64Url = exports.encodeBase64 = void 0;
const u8a = __importStar(require("uint8arrays"));
const random_1 = require("@stablelib/random");
const B64 = 'base64pad';
const B64_URL = 'base64url';
function encodeBase64(bytes) {
    return u8a.toString(bytes, B64);
}
exports.encodeBase64 = encodeBase64;
function encodeBase64Url(bytes) {
    return u8a.toString(bytes, B64_URL);
}
exports.encodeBase64Url = encodeBase64Url;
function decodeBase64(s) {
    return u8a.fromString(s, B64);
}
exports.decodeBase64 = decodeBase64;
function base64urlToJSON(s) {
    return JSON.parse(u8a.toString(u8a.fromString(s, B64_URL)));
}
exports.base64urlToJSON = base64urlToJSON;
function randomString() {
    return u8a.toString(random_1.randomBytes(16), 'base64');
}
exports.randomString = randomString;
function fromDagJWS(jws) {
    if (jws.signatures.length > 1)
        throw new Error('Cant convert to compact jws');
    return `${jws.signatures[0].protected}.${jws.payload}.${jws.signatures[0].signature}`;
}
exports.fromDagJWS = fromDagJWS;
//# sourceMappingURL=utils.js.map