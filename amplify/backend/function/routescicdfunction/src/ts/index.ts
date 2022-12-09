import { Context } from "aws-lambda";
import awsLambdaFastify from "@fastify/aws-lambda";
import app from "./app";

interface TriggerEvent {
  httpMethod: string;
  path: string;
  queryStringParameters: {
    [key: string]: string;
  },
  headers: {
    [key: string]: string;
  },
}

const proxy = awsLambdaFastify(app);

export const handler = async (event: TriggerEvent, context: Context) => proxy(event, context);
