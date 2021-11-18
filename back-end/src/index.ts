import fastify from "fastify";
import vcap from "./config/vcap-local.json";
import { CloudantV1 } from "@ibm-cloud/cloudant";

// ! There could be a cleaner way to set up environment variables
process.env.CLOUDANT_URL = vcap.services.cloudantNoSQLDB.credentials.url;
process.env.CLOUDANT_APIKEY = vcap.services.cloudantNoSQLDB.credentials.apikey;

const server = fastify()

const cloudant = CloudantV1.newInstance({
  serviceName: "CLOUDANT",
});

// Lists all the databases on Cloudant
// cloudant.getAllDbs().then((response) => {
//   console.log(response.result);
// });

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