
var axios = require('axios');
exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  options
) => {
  const { createNode } = actions;
  const { secret, operation, schema, table, url, size } = options;

  try {
    
    console.log('createNode is', createNode);
    console.log('secret is', secret);
    console.log('operation is', operation);
    console.log('schema is', schema);
    console.log('table is', table);
    console.log('url is', url);
    console.log('size is', size);

    var data = JSON.stringify({
        "operation": `${operation}`,
        "sql":`SELECT * FROM ${schema}.${table}`
    });
    
    var config = {
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
    console.log('data from harperdb', documents.length);

    documents.forEach(document => {
      console.log('document', document);

      createNode({
        ...document,
        id: createNodeId(`harperdb-${document.id}`),
        parent: null,
        children: [],
        internal: {
          type: `${table}`,
          content: JSON.stringify(document),
          contentDigest: createContentDigest(document)
        }
      });
    });
  } catch (err) {
    console.error(err);
  }
};
