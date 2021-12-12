import fastify from "fastify";
import cors from "fastify-cors";
import vcap from "./config/vcap-local.json";

import { CloudantV1 } from "@ibm-cloud/cloudant";

process.env.CLOUDANT_URL = vcap.services.cloudantNoSQLDB.credentials.url;
process.env.CLOUDANT_APIKEY = vcap.services.cloudantNoSQLDB.credentials.apikey;

const server = fastify()

const cloudant = CloudantV1.newInstance({
  serviceName: "CLOUDANT",
});

server.register(cors, {
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  allowedHeaders: ['Origin', 'Accept', 'Content-Type', 'Authorization'],
});

server.listen(8080, (error, address) => {
  if (error) {
    console.log(error);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});