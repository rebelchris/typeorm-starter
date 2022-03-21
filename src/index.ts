import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Photo } from './entity/Photo';
import { User } from './entity/User';
import {PublishedPhoto} from "./entity/PublishedPhoto";
const fastify = require('fastify')({ logger: true });

createConnection()
  .then(async (connection) => {
    fastify.post('/seed', async (request, reply) => {
      const user = new User();
      user.firstName = 'Timber';
      user.lastName = 'Saw';
      user.age = 25;
      await connection.manager.save(user);

      const photo = new Photo();
      photo.name = 'Me and Bears';
      photo.description = 'I am near polar bears';
      photo.filename = 'photo-with-bears.jpg';
      photo.views = 1;
      photo.isPublished = true;
      photo.user = user;
      await connection.manager.save(photo);

      const photo2 = new Photo();
      photo2.name = 'Me on a fishing trip';
      photo2.description = 'I caught a massive fish';
      photo2.filename = 'photo-with-fish.jpg';
      photo2.views = 5;
      photo2.isPublished = true;
      photo2.user = user;
      await connection.manager.save(photo2);
      return 'database seeded';
    });

    fastify.get('/', async (request, reply) => {
      const users = await connection.manager.find(User, {
        relations: ['photos'],
      });
      return { users };
    });

    fastify.get('/photos', async (request, reply) => {
      const photos = await connection.manager.find(PublishedPhoto);
      return { photos };
    });

    const start = async () => {
      try {
        await fastify.listen(3000);
      } catch (err) {
        fastify.log.error(err);
        process.exit(1);
      }
    };
    start();
  })
  .catch((error) => console.log(error));
