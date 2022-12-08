import fastify, { FastifyReply, FastifyRequest } from "fastify";
import AWS from "aws-sdk";
import get from "lodash/get";
import https from "https";

interface Provider {
  id: number;
  name: string;
  apiUrl: string;
  lambdaUrl?: string;
}


const _app = fastify();
AWS.config.update({ region: process.env.TABLE_REGION });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const partitionKeyName = "id";
const partitionKeyType = "N";

let tableName = "providerstable";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + "-" + process.env.ENV;
}

interface ReadProvidersCondition {
  ComparisonOperator: string;
  [partitionKeyName]?: {
    AttributeValueList: string[]
  }
}

// convert url string param to expected Type
const convertUrlType = (param: string, type: string) => {
  switch(type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

const fetchProviders = (request: FastifyRequest): Promise<Array<Provider>> => new Promise((resolve, reject) => {
  const condition: ReadProvidersCondition = {
    ComparisonOperator: "EQ"
  }

  try {
    condition[partitionKeyName] = {
      AttributeValueList: [convertUrlType(get(request, `params.${partitionKeyName}`, ""), partitionKeyType) as string]
    }
  } catch(err) {
    reject("Wrong column type " + String(err))
  }

  const queryParams = {
    TableName: tableName,
    KeyConditions: condition,
  }

  dynamodb.scan(queryParams, (err, data) => {
    if (err) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      reject("Could not load items: " + err.message);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      resolve(data.Items as Array<Provider>);
    }
  });
});

const getRequest = (url: string) => {
  return new Promise((resolve, reject) => {
    const req = https.get(url, res => {
      let rawData = "";

      res.on("data", chunk => {
        rawData += chunk;
      });

      res.on("end", () => {
        try {
          resolve(JSON.parse(rawData));
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on("error", err => {
      reject(err.message);
    });
  });
};

_app.get("/routes", async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const providers: Array<Provider> = await fetchProviders(request);
    const apiRequests = providers.map(provider => getRequest(provider.lambdaUrl || provider.apiUrl)) as Array<Promise<Provider>>;
    const responses = await Promise.allSettled(apiRequests);
    const response = responses.filter(resp => resp.status === "fulfilled").reduce((agg, current) => {
      return agg.concat(get(current, "value", []));
    }, []);
    await reply.send(response); 
  } catch (error) {
    await reply.code(500).send(error); 
  }
});

export const app = _app;

export default app;
