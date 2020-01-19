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

   const dev = await Dev.findOne({ github_username });

    if (!dev) {
      try {
        // aguarda uma resposta antes de prosseguir
        const apiResponse = await axios
          .get(`https://api.github.com/users/${github_username}`)
          .catch(error => {
        // Se o nome de usário não existe, apresenta o erro abaixo.

          return response.status(404).json({ error: 'User does not exist on github.'});
        });

      if (apiResponse.error) {
        return response.json(apiResponse);
      }

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
      });

      // Filtrar conexões de websocket e procurar aquelas que estão a 10km máximo
      // Que possuem pelo menos uma tech das filtradas

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray,
      );

      sendMessage(sendSocketMessageTo, 'new-dev', dev);

      return response.json([
        github_username,
        name,
        techs,
        latitude,
        longitude,
      ]);
    } catch (error) {
    return response.status(400).json({ error: 'Something did not work as expected.' })
    }
    }else {
      return response.status(400).json({ error: 'Developer already registered in DevRadar.' });
    }

},

async update(request, response) {
  const { github_username, techs, latitude, longitude } = request.body;

  const dev = await Dev.findById(request.params.id);

  if (dev) {
    try {
      // aguarda uma resposta antes de prosseguir
      const apiResponse = await axios
        .get(`https://api.github.com/users/${github_username}`)
        .catch(error => {
      // Se o nome de usário não existe, apresenta o erro abaixo.

        return response.status(404).json({ error: 'User does not exist on github.'});
      });

    if (apiResponse.error) {
      return response.json(apiResponse);
    }

    const { name = login, avatar_url, bio } = apiResponse.data;


    const techsArray = parseStringAsArray(techs);

    const location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };


    const dev = await Dev.updateOne({
      github_username,
      name,
      techs: techsArray,
      avatar_url,
      location,
      bio,
    });

    const sendSocketMessageTo = findConnections(
      { latitude, longitude },
      techsArray,
    );

    sendMessage(sendSocketMessageTo, 'new-dev', dev);

    return response.json([
      github_username,
      techs,
      location,
      avatar_url,
      name,
      bio,
    ] );


  } catch (error) {

  return response.status(400).json({ error: 'Something did not work as expected.' })
  }
  }else {
    return response.status(400).json({ error: 'Developer already registered in DevRadar.' });
  }


},

async delete(request, response) {


  try {
    dev = await Dev.findById(request.params.id);
    if (!dev) return response.status(400).json({ error: 'Developer not found.' });

    await dev.remove();

    return response.status(200).json({ error: 'Developer removed sucess.' });

  } catch (e) {
    return response.status(400).json({ error: 'Something did not work as expected.' });
  }

},

};
