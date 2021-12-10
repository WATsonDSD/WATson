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

/**
   * Fetches and updates the permissions of the
   * specified 'db' to include the newly created user.
   * 
   */
async function setUserPermissions(db: string, email: string) : Promise<boolean> {
  return new Promise((resolve, reject) => {
    cloudant.getSecurity({
      db: db,
    }).then(async (security) => {
      if (security.result) {
        let updatedSecurity: CloudantV1.JsonObject = {...security.result.cloudant, [email]: ['_reader', '_writer']};
        
        await cloudant.putCloudantSecurityConfiguration({
          db: db,
          cloudant: updatedSecurity,
        }).then(() => {
          resolve(true);
        });
      }
    }).catch((error) => {
      console.log(error);
    });
  });
}

server.post('/setUserPermissions', async (request, reply) => {
  const email: string = JSON.parse(JSON.stringify(request.body)).email;
  const dbs: string[] = ['_users', 'projects', 'images'];

  reply.send((await Promise.all(dbs.map((db) => setUserPermissions(db, email)))).reduce((accumulator, result) => accumulator && result));
});

server.listen(8080, (error, address) => {
  if (error) {
    console.log(error);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});