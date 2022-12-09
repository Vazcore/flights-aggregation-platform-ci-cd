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
const cors_1 = __importDefault(require("@fastify/cors"));
const _app = (0, fastify_1.default)({
    logger: true,
});
// eslint-disable-next-line @typescript-eslint/no-floating-promises
_app.register(cors_1.default, {
    origin: "*",
    methods: ["GET"],
});
aws_sdk_1.default.config.update({ region: process.env.TABLE_REGION });
const dynamodb = new aws_sdk_1.default.DynamoDB.DocumentClient();
const partitionKeyName = "id";
const partitionKeyType = "S";
let tableName = "providers";
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
        const from = (0, get_1.default)(request, "query.from", 0);
        const to = (0, get_1.default)(request, "query.to", 100);
        const originAirport = (0, get_1.default)(request, "query.origin", "").toLowerCase();
        const desinationAirport = (0, get_1.default)(request, "query.dest", "").toLowerCase();
        const providers = await fetchProviders(request);
        const apiRequests = providers.map(provider => getRequest(provider.lambdaUrl || provider.apiUrl));
        const responses = await Promise.allSettled(apiRequests);
        let response = responses.filter(resp => resp.status === "fulfilled").reduce((agg, current) => {
            return agg.concat((0, get_1.default)(current, "value", []));
        }, []);
        if (originAirport.length > 0 && desinationAirport.length > 0) {
            response = response.filter(route => ((0, get_1.default)(route, "sourceAirport", "").toLowerCase() === originAirport &&
                (0, get_1.default)(route, "destinationAirport", "").toLowerCase() === desinationAirport));
        }
        await reply.send(response.slice(Number(from), Number(to)));
    }
    catch (error) {
        await reply.code(500).send(error);
    }
});
_app.listen({ port: 3001 }, (err) => {
    if (err) {
        _app.log.error(err);
        process.exit(1);
    }
});
exports.app = _app;
exports.default = exports.app;
