# Integrate Elasticsearch With Node.js

## What Do We Do

* We will install Elasticsearch and run it in our system. (We will use Docker, where Elasticsearch will run, it is very easy.
* We will create a huge data storage for live search.
* We will create indexes (+100,000 indexes) from our created data storage.
* We will integrate and search content from our data storage using Elasticsearch.
* We will analyze the search time.
* Delete the indexes of Elasticsearch.

## Run Elasticsearch with Docker

* Pull the image for Elasticsearch using the command below:

        docker pull docker.elastic.co/elasticsearch/elasticsearch:6.4.0

* Run the Docker image using the below command:

        docker run *p 9200:9200 *p 9300:9300 *e "discovery.type=single*node" docker.elastic.co/elasticsearch/elasticsearch:6.4.0

By default, this Docker is running on port 9200. Now, open the browser and hit URL http://localhost:9200 

## Create Data Storage for Live Search

* Download a file named planet*latest_geonames.tsv.gz from [GitHub](https://github.com/geometalab/OSMNames/releases/download/v2.0/planet*latest_geonames.tsv.gz) or [this link](https://github.com/OSMNames/OSMNames/releases)

## Write Code for Indexing and Start Working With Elasticsearch