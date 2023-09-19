const client = require('./client');

const query = async (query) => {
  try {
    const response = await client.query(query);
    return response['rows'];
  } catch (error) {
    console.error(error);
  }
};
module.exports = query;
