const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
  async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },

async store (request, response) {
  const { github_username, techs, latitude, longitude } = request.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      try {
      // aguarda uma resposta antes de prosseguir
      const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`)
      // Se o nome de usário não existe, apresenta o erro abaixo.
        .catch(function (error) {
          return response.status(404).json({ error: 'User does not exist on github.'});
      });


      const { name = login, avatar_url, bio } = apiResponse.data;


      const techsArray = parseStringAsArray(techs);

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };

      const dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location,
      })

      // Filtrar conexões de websocket e procurar aquelas que estão a 10km máximo
      // Que possuem pelo menos uma tech das filtradas

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray,
      )

      sendMessage(sendSocketMessageTo, 'new-dev', dev);

      return response.json(dev);
    } catch (error) {
    return response.status(400).json({ error: 'Something did not work as expected.' })
    }
    }else {
      return response.status(400).json({ error: 'Developer already registered in DevRadar.' });
    }

},

};
