import fastify from "fastify";
import vcap from "./config/vcap-local.json";
import { CloudantV1 } from "@ibm-cloud/cloudant";
import { BasicAuthenticator } from 'ibm-cloud-sdk-core';

// ! There could be a cleaner way to set up environment variables
process.env.CLOUDANT_URL = vcap.services.cloudantNoSQLDB.credentials.url;
process.env.CLOUDANT_APIKEY = vcap.services.cloudantNoSQLDB.credentials.apikey;

const server = fastify()

// ? How do i pass credentials?
const authenticator = new BasicAuthenticator({
  username: '{username}',
  password: '{password}',
});

const cloudant = CloudantV1.newInstance({
  serviceName: "CLOUDANT",
  authenticator: authenticator,
});

// An example with fastify
server.get("/", async (request, reply) => {
  cloudant.getAllDbs().then((response) => {
      reply.send(response.result);
  });
});

server.listen(8080, (error, address) => {
  if (error) {
    console.log(error);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});