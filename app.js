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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sui_js_1 = require("@mysten/sui.js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const addresses = {
    johnDoe: '0x03b67b6c52dac0f4c5e06c1b217476e0c08884e482c397377a765ad835d4477a',
    chuckNorris: '0x751d379edda810e5e27ff34e81c8fbb0fbc2e4ea143432ebf09360735e325600',
};
const MNEMONIC = process.env.MNEMONIC || '';
const getProvider = () => __awaiter(void 0, void 0, void 0, function* () {
    const testnetConnection = new sui_js_1.Connection({
        fullnode: 'https://fullnode.testnet.sui.io',
    });
    const provider = new sui_js_1.JsonRpcProvider(testnetConnection);
    return provider;
});
const getOwnedObject = () => __awaiter(void 0, void 0, void 0, function* () {
    const provider = yield getProvider();
    const objects = yield provider.getOwnedObjects({
        owner: addresses.johnDoe,
    });
    console.log('objects', objects.data);
    const objectIds = objects.data.map((data) => { var _a; return (_a = data.data) === null || _a === void 0 ? void 0 : _a.objectId; });
    yield getObjects(objectIds);
});
const getObjects = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    if (!ids)
        return null;
    const provider = yield getProvider();
    const txns = yield provider.multiGetObjects({
        ids,
        options: { showType: true },
    });
    console.log('txns', txns);
});
const transfer = (to) => __awaiter(void 0, void 0, void 0, function* () {
    const provider = yield getProvider();
    const keypair = sui_js_1.Ed25519Keypair.deriveKeypair(MNEMONIC);
    const signer = new sui_js_1.RawSigner(keypair, provider);
    const tx = new sui_js_1.TransactionBlock();
    const [coin] = tx.splitCoins(tx.gas, [tx.pure(100)]);
    tx.transferObjects([coin], tx.pure(to));
    const result = yield signer.signAndExecuteTransactionBlock({
        transactionBlock: tx,
    });
    console.log({ result });
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    // await getOwnedObject()
    yield transfer(addresses.chuckNorris);
});
start()
    .then()
    .catch((err) => console.log(err));
