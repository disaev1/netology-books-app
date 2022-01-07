const axios = require('axios');

const incrCounter = async (id) => {
  const { data } = await axios.post(`http://counter:3000/counter/${id}/incr`);

  return Number(data.newValue);
};

const getCounters = async (ids) => {
  const responses = await Promise.all(ids.map(id => axios.get(`http://counter:3000/counter/${id}`)));

  return responses.reduce((acc, response, index) => {
    acc[ids[index]] = Number(response.data.value);

    return acc;
  }, {});
}

module.exports = { incrCounter, getCounters };
