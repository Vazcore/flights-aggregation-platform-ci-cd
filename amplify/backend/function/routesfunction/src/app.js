"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const fastify_1 = __importDefault(require("fastify"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const get_1 = __importDefault(require("lodash/get"));
const https_1 = __importDefault(require("https"));
const _app = (0, fastify_1.default)();
aws_sdk_1.default.config.update({ region: process.env.TABLE_REGION });
const dynamodb = new aws_sdk_1.default.DynamoDB.DocumentClient();
const partitionKeyName = "id";
const partitionKeyType = "N";
let tableName = "providerstable";
if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName = tableName + "-" + process.env.ENV;
}
// convert url string param to expected Type
const convertUrlType = (param, type) => {
    switch (type) {
        case "N":
            return Number.parseInt(param);
        default:
            return param;
    }
};
const fetchProviders = (request) => new Promise((resolve, reject) => {
    const condition = {
        ComparisonOperator: "EQ"
    };
    try {
        condition[partitionKeyName] = {
            AttributeValueList: [convertUrlType((0, get_1.default)(request, `params.${partitionKeyName}`, ""), partitionKeyType)]
        };
    }
    catch (err) {
        reject("Wrong column type " + String(err));
    }
    const queryParams = {
        TableName: tableName,
        KeyConditions: condition,
    };
    dynamodb.scan(queryParams, (err, data) => {
        if (err) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            reject("Could not load items: " + err.message);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            resolve(data.Items);
        }
    });
});
const getRequest = (url) => {
    return new Promise((resolve, reject) => {
        const req = https_1.default.get(url, res => {
            let rawData = "";
            res.on("data", chunk => {
                rawData += chunk;
            });
            res.on("end", () => {
                try {
                    resolve(JSON.parse(rawData));
                }
                catch (err) {
                    reject(err);
                }
            });
        });
        req.on("error", err => {
            reject(err.message);
        });
    });
};
_app.get("/routes", async (request, reply) => {
    try {
        const providers = await fetchProviders(request);
        const apiRequests = providers.map(provider => getRequest(provider.lambdaUrl || provider.apiUrl));
        const responses = await Promise.allSettled(apiRequests);
        const response = responses.filter(resp => resp.status === "fulfilled").reduce((agg, current) => {
            return agg.concat((0, get_1.default)(current, "value", []));
        }, []);
        await reply.send(response);
    }
    catch (error) {
        await reply.code(500).send(error);
    }
});
exports.app = _app;
exports.default = exports.app;
