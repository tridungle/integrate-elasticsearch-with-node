import _ from "highland";
import fs from "fs";
import csv from "csv-parser";
import { serverLogger } from "helpers";
import elasticsearchConnection from "./connection";

class ElasticSearch {
  constructor() {
    this.client = elasticsearchConnection.connect();
  }

  createIndex = async (indexName = "demo_elastic_index") => {
    try {
      await this.client.indices.create({ index: indexName });
      serverLogger.debug("created index");
    } catch (e) {
      if (e.status === 400) {
        serverLogger.error("index alread exists");
      } else {
        throw e;
      }
    }

    // process file
    let currentIndex = 0;
    const stream = _(
      fs.createReadStream("./planet-latest-100k_geonames.tsv").pipe(
        csv({
          separator: "\t"
        })
      )
    )
      .map(data => ({
        ...data,
        alternative_names: data.alternative_names.split(","),
        lon_num: parseFloat(data.lon),
        lat_num: parseFloat(data.lat),
        place_rank_num: parseInt(data.place_rank, 10),
        importance_num: parseFloat(data.importance)
      }))
      .map(data => [
        {
          index: { _index: indexName, _type: "place", _id: data.osm_id }
        },
        data
      ])
      .batch(100)
      .each(async entries => {
        stream.pause();
        const body = entries.reduce((acc, val) => acc.concat(val), []);
        await this.client.bulk({ body });
        currentIndex += 100;
        serverLogger.error("Created index :", currentIndex);
        stream.resume();
      })
      .on("end", () => {
        serverLogger.log("done");
        process.exit();
      });
  };

  /**
   * The `query` parameter indicates query context.
   * The `bool` and `match` clauses are used in query context, which means that they are used to score how well each document matches.
   * The `filter` parameter indicates filter context.
   * The `term` and `range` clauses are used in the filter context. They will filter out documents that do not match,
   * but they will not affect the score for matching documents.
   */
  searchData = async (query = "Lewisham") => {
    try {
      const resp = await this.client.search({
        index: indexName,
        type: "place",
        body: {
          sort: [
            {
              place_rank_num: { order: "desc" }
            },
            {
              importance_num: { order: "desc" }
            }
          ],
          query: {
            bool: {
              should: [
                {
                  match: {
                    lat: "51.4624325"
                  }
                },
                {
                  match: {
                    alternative_names: query
                  }
                }
              ]
            }
          }
        }
      });
      const { hits } = resp.hits;
      console.log(hits);
    } catch (e) {
      //   console.log("Error in deleteing index",e);
      if (e.status === 404) {
        console.log("Index Not Found");
      } else {
        throw e;
      }
    }
  };

  deleteIndex = async (indexName = "demo_elastic_index") => {
    try {
      await this.client.indices.delete({ index: indexName });
      console.log("All index is deleted");
    } catch (e) {
      console.log("Error in deleteing index", e);
      if (e.status === 404) {
        console.log("Index Not Found");
      } else {
        throw e;
      }
    }
  };
}

export default new ElasticSearch();
