
let axios = require('axios');
exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  options
) => {
  const { createNode } = actions;
  const { secret, type, url, payload } = options;

  try {
    let data = JSON.stringify(payload);
    let config = {
      method: 'post',
      url: `${url}`,
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Basic ${secret}`
      },
      data : data
    };

    let res = await axios(config);
    let documents = res.data;

    documents.forEach(document => {
      createNode({
        ...document,
        id: createNodeId(`harperdb-${document.id}`),
        parent: null,
        children: [],
        internal: {
          type: `${type}`,
          content: JSON.stringify(document),
          contentDigest: createContentDigest(document)
        }
      });
    });
  } catch (err) {
    console.error(err);
  }
};
