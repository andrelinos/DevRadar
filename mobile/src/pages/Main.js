import axios from 'axios';
import Dev from '../models/Dev';
import parseStringAsArray from '../utils/parseStringAsArray';

import * as WebSocket from '../websocket';

module.exports = {
  async index(request, response) {
    const { quantity = 20 } = request.query;
    const devs = await Dev.find()
      .sort({ name: 1 })
      .limit(quantity);

    return response.json(devs);
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;

    const dev = await Dev.findOne({ github_username });

    if (!dev) {
      try {
        // aguarda uma resposta antes de prosseguir
        const apiResponse = await axios
          .get(`https://api.github.com/users/${github_username}`)
          .catch(_error => {
            // Se o nome de usário não existe, apresenta o erro abaixo.

            return response
              .status(404)
              .json({ error: 'User does not exist on github.' });
          });

        if (apiResponse.error) {
          return response.json(apiResponse);
        }

        // eslint-disable-next-line no-undef
        const { name = login, avatar_url, bio } = apiResponse.data;

        const techsArray = parseStringAsArray(techs);

        const location = {
          type: 'Point',
          coordinates: [longitude, latitude],
        };

        // eslint-disable-next-line no-shadow
        const dev = await Dev.create({
          github_username,
          name,
          avatar_url,
          bio,
          techs: techsArray,
          location,
        });

        // Filtrar conexões de websocket e procurar aquelas que estão a 10km máximo
        // Que possuem pelo menos uma tech das filtradas

        const sendSocketMessageTo = WebSocket.findConnections(
          { latitude, longitude },
          techsArray
        );

        WebSocket.sendMessage(sendSocketMessageTo, 'new-dev', dev);

        return response.json([
          github_username,
          name,
          techs,
          bio,
          latitude,
          longitude,
        ]);
      } catch (error) {
        return response
          .status(400)
          .json({ error: `Something did not work as expected.${error}` });
      }
    } else {
      return response
        .status(400)
        .json({ error: 'Developer already registered in DevRadar.' });
    }
  },

  async update(request, response, next) {
    const { id } = request.params;

    const { github_username, techs, latitude, longitude } = request.body;

    const dev = await Dev.findById(id);

    if (!dev) {
      return response.status(400).json({ error: 'Developer not found.' });
    }

    // Aguarda uma resposta antes de prosseguir
    const apiResponse = await axios
      .get(`https://api.github.com/users/${github_username}`)
      .catch(_error => {
        // Se o nome de usário não existe, apresenta o erro abaixo.

        return response
          .status(404)
          .json({ error: 'User does not exist on github.' });
      });

    if (apiResponse.error) {
      return response.json(apiResponse);
    }

    const { name = login, avatar_url, bio } = apiResponse.data;

    /** Lê o nome de usuário na base de dados para comparar com o novo */

    const devExist = await Dev.findOne({ github_username });

    console.log(`Log aquiiiiii${devExist._id}`);

    /** Verifica se já existe o nome na base de dados */
    // eslint-disable-next-line no-underscore-dangle
    if (devExist._id !== '5e2a3b1038982a4d590be422') {
      if (devExist) {
        return response
          .status(400)
          .json({ error: 'Developer already registered in DevRadar.' });
      }
      return next();
    }
    /* if ((devExist) {
      return response
        .status(400)
        .json({ error: 'Developer already registered in DevRadar.' });
      } */

    const techsArray = parseStringAsArray(techs);

    const location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    // eslint-disable-next-line no-unused-vars
    const devUpdated = await dev.updateOne({
      github_username,
      techs: techsArray,
      location,
      avatar_url,
      name,
      bio,
    });

    const sendSocketMessageTo = WebSocket.findConnections(
      { latitude, longitude },
      techsArray
    );

    WebSocket.sendMessage(sendSocketMessageTo, 'new-dev', dev);

    return response.json([
      github_username,
      techs,
      location,
      avatar_url,
      name,
      bio,
    ]);
  },

  async delete(request, response) {
    const { id } = request.params;

    try {
      const dev = await Dev.findById(id);

      await dev.delete();

      return response
        .status(200)
        .json({ message: 'Developer deleted success.' });
    } catch (error) {
      return response.status(400).json({ error: 'Developer not found.' });
    }
  },
};
