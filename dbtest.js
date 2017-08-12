/**
 * Created by blackmamba on 10/08/17.
 */

var pgp = require('pg-promise')(/*options*/)
var db = pgp('postgres://postgres:ciao@localhost:5432/pulizia')

var table1 = "hintown_pulito"
var table2 = "hintown_sporco"

db.task(function(t) {
    // creating a sequence of transaction queries:
    const q1 = t.any(' select sum(lsstar) as lsstarTot  from $1:raw ' +
        'WHERE EXTRACT(month from data) = $2 ' +
        'AND EXTRACT(year FROM data) = $3 ' +
        'group by(data)', [table1, 8, '2017']);
    const q2 = t.any('select * from $1:raw primo join $3:raw', [table2, '2017-08-09', table2]);

    return t.batch([q1, q2]); // all of the queries are to be resolved;
})
    .then(function(data) {
        console.log(data[0]); // printing successful transaction output;
        console.log(data[1][0]);
        console.log('success '+table1+'!');
    })
    .catch(function(error) {
        console.log('no', error); // printing the error;
    });
