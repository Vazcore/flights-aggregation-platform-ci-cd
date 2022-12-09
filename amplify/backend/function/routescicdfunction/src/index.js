"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_lambda_1 = __importDefault(require("@fastify/aws-lambda"));
const app_1 = __importDefault(require("./app"));
const proxy = (0, aws_lambda_1.default)(app_1.default);
const handler = async (event, context) => proxy(event, context);
exports.handler = handler;
