import fastify from "fastify";
import cors from "fastify-cors";
import vcap from "./config/vcap-local.json";

import { CloudantV1 } from "@ibm-cloud/cloudant";

import { User } from './data';

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

server.get('/getAllUsers', async (request, reply) => {
  let users: User[] = [];

  await cloudant.postAllDocs({
    db: '_users',
    startkey: 'a', // excludes the design documents
    includeDocs: true,
  }).then((response) => {
    if (response) {
      users = response.result.rows.map((row) => {
        return JSON.parse(JSON.stringify(row.doc));
      }).map((doc) => {
        return {
          id: doc._id,
          email: doc.name,
          name: doc.fullname,
          role: doc.roles[0],
          projects: doc.projects,
        };
      });
    }
  }).catch((error) => {
    console.log(error)
  });

  reply.send(users);
});

server.post('/setUserPermissions', async (request, reply) => {
  const email: string = JSON.parse(JSON.stringify(request.body)).email;

  let result: boolean = false;

  /**
   * Fetches and updates the permissions of the
   * specified 'db' to include the new user.
   * 
   * ! In the near future it might be useful to refactor this into a function
   * ! and set the permissions for the other databases as well.
   */
  await cloudant.getSecurity({
    db: '_users'
  }).then(async (security) => {
    if (security.result) {
      let updatedSecurity = {...security.result.cloudant, [email]: ['_reader']};
      
      await cloudant.putCloudantSecurityConfiguration({
        db: '_users',
        cloudant: updatedSecurity,
      }).then(() => {
        result = true;
      });
    }
  }).catch((error) => {
    console.log(error);
  });

  reply.send(result);
});

server.listen(8080, (error, address) => {
  if (error) {
    console.log(error);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});