We have three DB's inside CouchDB:

### Users
This one contains data about users, the fields are exactly as described in `types.ts`

### Projects
This one contains data about projects, the fields are exactly as described in `types.ts`

### Images
This one contains data about images, the fields are exactly as described in `types.ts`

***
Note that we don't have a separate DB for `Annotations`, that information is saved in `Images`.