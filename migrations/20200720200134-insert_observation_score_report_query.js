const Uuid = require('cassandra-driver').types.Uuid;
const config = require('../config/config');

module.exports = {
  async up(db) {
    global.migrationMsg = "Insert observation_score_report_query";
    
    
    if (!cassandra) {
      throw new Error("Cassandra connection not available.");
    }

    const query = 'SELECT id FROM ' + config.cassandra.keyspace + '.' + config.cassandra.table + ' WHERE qid = ? ALLOW FILTERING';
    const result = await cassandra.execute(query, ['observation_score_report_query'], { prepare: true });
    const row = result.rows;

    if (!row.length) {

    let id = Uuid.random();

    let query = 'INSERT INTO ' + config.cassandra.keyspace + '.' + config.cassandra.table +' (id, qid, query) VALUES (?, ?, ?)';
   
    let queries = 
      [{
        query: query,
        params: [id.toString(), 'observation_score_report_query','{"queryType":"groupBy","dataSource":"sl_observation_qa","dimensions":["observationSubmissionId","completedDate","scoreAchieved","observationName","minScore","maxScore","questionName","questionExternalId","questionResponseType"],"aggregations":[{"type":"count","name":"count"}],"granularity":"all","postAggregations":[],"intervals":"1901-01-01T00:00:00+00:00/2101-01-01T00:00:00+00:00","filter":{"type":"and","fields":[{"type":"selector","dimension":"observationId","value":""},{"type":"or","fields":[{"type":"selector","dimension":"questionResponseType","value":"multiselect"},{"type":"selector","dimension":"questionResponseType","value":"radio"},{"type":"selector","dimension":"questionResponseType","value":"slider"}]}]},"limitSpec":{"type":"default","limit":10000,"columns":[{"dimension":"count","direction":"descending"}]}}']
      }];

      await cassandra.batch(queries, { prepare: true });

      }
      
      return global.migrationMsg;
      },

      async down(db) {
        // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
      }
    };