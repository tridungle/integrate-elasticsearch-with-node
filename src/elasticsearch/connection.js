import elasticsearch from "elasticsearch";
import config from "config";

class ElasticSearchConnection {
  connect = async () => {
    const client = new elasticsearch.Client({
      host: config.elasticsearch.host,
      log: "trace"
    });
    await client.ping(
      {
        requestTimeout: 3000
      },
      function(error) {
        if (error) {
          console.trace("elasticsearch cluster is down!");
        } else {
          console.log("Elastic search is running.");
        }
      }
    );
    return client
  };
}

export default new ElasticSearchConnection();

