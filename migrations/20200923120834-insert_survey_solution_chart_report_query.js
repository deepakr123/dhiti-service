const Uuid = require('cassandra-driver').types.Uuid;
const config = require('../config/config');

module.exports = {
  async up(db) {
    global.migrationMsg = "Insert survey solution chart report query";
    
    
    if (!cassandra) {
      throw new Error("Cassandra connection not available.");
    }

    const query = 'SELECT id FROM ' + config.cassandra.keyspace + '.' + config.cassandra.table + ' WHERE qid = ? ALLOW FILTERING';
    const result = await cassandra.execute(query, ['survey_solution_chart_report_query'], { prepare: true });
    const row = result.rows;

    if (!row.length) {

    let id = Uuid.random();

    let query = 'INSERT INTO ' + config.cassandra.keyspace + '.' + config.cassandra.table +' (id, qid, query) VALUES (?, ?, ?)';
   
    let queries = 
      [{
        query: query,
        params: [id.toString(), 'survey_solution_chart_report_query','{"queryType":"groupBy","dataSource":"sl_survey","dimensions":["questionExternalId","questionName","questionResponseLabel","questionAnswer","solutionName","questionResponseType","instanceParentResponsetype","instanceParentQuestion","instanceParentId","instanceParentExternalId","instanceId"],"aggregations":[{"type":"count","name":"questionAnswerCount","fieldName":"questionAnswer"}],"granularity":"all","postAggregations":[],"intervals":"1901-01-01T00:00:00+00:00/2101-01-01T00:00:00+00:00","filter":{"type":"and","fields":[{"type":"or","fields":[{"type":"selector","dimension":"questionResponseType","value":"radio"},{"type":"selector","dimension":"questionResponseType","value":"multiselect"}]},{"type":"selector","dimension":"solutionId","value":""}]}}']
      }];

      await cassandra.batch(queries, { prepare: true });

      }
      
      return global.migrationMsg;
      },

      async down(db) {
        // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
      }
    };