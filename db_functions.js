var pgp = require('pg-promise')(/*options*/)
var db = pgp('postgres://postgres:ciao@localhost:5432/pulizia')
var exports = module.exports = {};

var prezzoOspiti = 6

exports.persistenceValuesHintown = function (value, res) {
    var dateTmp = value.data.split('-')
    var date = dateTmp[2]+'-'+dateTmp[1]+'-'+dateTmp[0]
    var company = value.company
    persistsValuesHintown('hintown_pulito', company, date, trasformInfo(company, 'pulito', 'Pulito', value.values))
    persistsValuesHintown('hintown_sporco', company, date, trasformInfo(company, 'sporco', 'Sporco', value.values))
    persistsValuesHintown('hintown_extrapulito', company, date, trasformInfo(company, 'extrapulito', 'ExtraPulito', value.values))
    persistsValuesHintown('hintown_extramanca', company, date, trasformInfo(company, 'extramanca', 'ExtraManca', value.values))
    persistsValuesExtra('extra', company, date, value.extra.extra)
    res.send('DB update')
}

exports.persistenceValuesBaccini = function (value, res) {
    var dateTmp = value.data.split('-')
    var date = dateTmp[2]+'-'+dateTmp[1]+'-'+dateTmp[0]
    var company = value.company
    persistsValuesBaccini('baccini_pulito', company, date, trasformInfo(company, 'pulito', 'Pulito', value.values))
    persistsValuesBaccini('baccini_sporco', company, date, trasformInfo(company, 'sporco', 'Sporco', value.values))
    persistsValuesBaccini('baccini_extrapulito', company, date, trasformInfo(company, 'extrapulito', 'ExtraPulito', value.values))
    persistsValuesBaccini('baccini_extramanca', company, date, trasformInfo(company, 'extramanca', 'ExtraManca', value.values))
    persistsValuesExtra('extra', company, date, value.extra.extra)
    res.send('DB update')
}

exports.queryMonthYearHintownDb = function (res, date) {

    var table1 = 'hintown_pulito'
    var table2 = 'hintown_sporco'
    var table3 = 'hintown_extrapulito'
    var table4 = 'hintown_extramanca'
    var table5 = 'extra'

    db.task(function(t) {
        // creating a sequence of transaction queries:
        const q1 = t.any('select sum(lsroyal) as lsroyaltot, sum(lsstar) as lsstartot, sum(lmroyal) as lmroyaltot, ' +
                         'sum(lmstar) as lmstartot, sum(f) as ftot, sum(ag) as agtot, sum(am) as amtot, sum(ap) as aptot, ' +
                         'sum(t) as ttot, sum(c) as ctot ' +
                         'FROM $1:raw ' +
                         'WHERE EXTRACT(month FROM data) = $2 ' +
                         'AND EXTRACT(year FROM data) = $3 ' +
                         'group by(data)', [table1, date.split('/')[0], date.split('/')[1]]);
        const q2 = t.any('select sum(lsroyal) as lsroyaltot, sum(lsstar) as lsstartot, sum(lmroyal) as lmroyaltot, ' +
                         'sum(lmstar) as lmstartot, sum(f) as ftot, sum(ag) as agtot, sum(am) as amtot, sum(ap) as aptot, ' +
                         'sum(t) as ttot, sum(c) as ctot ' +
                         'FROM $1:raw ' +
                         'WHERE EXTRACT(month FROM data) = $2 ' +
                         'AND EXTRACT(year FROM data) = $3 ' +
                         'group by(data)', [table2, date.split('/')[0], date.split('/')[1]]);
        const q3 = t.any('select sum(lsroyal) as lsroyaltot, sum(lsstar) as lsstartot, sum(lmroyal) as lmroyaltot, ' +
                         'sum(lmstar) as lmstartot, sum(f) as ftot, sum(ag) as agtot, sum(am) as amtot, sum(ap) as aptot, ' +
                         'sum(t) as ttot, sum(c) as ctot ' +
                         'FROM $1:raw ' +
                         'WHERE EXTRACT(month FROM data) = $2 ' +
                         'AND EXTRACT(year FROM data) = $3 ' +
                         'group by(data)', [table3, date.split('/')[0], date.split('/')[1]]);
        const q4 = t.any('select sum(lsroyal) as lsroyaltot, sum(lsstar) as lsstartot, sum(lmroyal) as lmroyaltot, ' +
                         'sum(lmstar) as lmstartot, sum(f) as ftot, sum(ag) as agtot, sum(am) as amtot, sum(ap) as aptot, ' +
                         'sum(t) as ttot, sum(c) as ctot ' +
                         'FROM $1:raw ' +
                         'WHERE EXTRACT(month FROM data) = $2 ' +
                         'AND EXTRACT(year FROM data) = $3 ' +
                         'group by(data)', [table4, date.split('/')[0], date.split('/')[1]]);
        const q5 = t.any('select sum(lsstar) as lsstartot,  sum(lmstar) as lmstartot, ' +
            'sum(cmm) as cmmtot, sum(cms) as cmstot, sum(extra) as extratot ' +
            'FROM $1:raw ' +
            'WHERE EXTRACT(month FROM data) = $2 ' +
            'AND EXTRACT(year FROM data) = $3 ' +
            'group by(data)', [table5, date.split('/')[0], date.split('/')[1]]);

        return t.batch([q1, q2, q3, q4, q5]); // all of the queries are to be resolved;
    })
        .then(function(data) {
            var result = {
                pulito: data[0][0],
                sporco: data[1][0],
                extrapulito: data[2][0],
                extramanca: data[3][0],
                extra : data[4][0]
            }
            res.send(result)
        })
        .catch(function(error) {
            res.send({})
            console.log('no', error); // printing the error;
        });
}

exports.queryMonthYearBacciniDb = function (res, date) {

    var table1 = 'baccini_pulito'
    var table2 = 'baccini_sporco'
    var table3 = 'baccini_extrapulito'
    var table4 = 'baccini_extramanca'
    var table5 = 'extra'
    db.task(function(t) {
        // creating a sequence of transaction queries:
        var month = date.split('/')[0]
        var year = date.split('/')[1]
        const q1 = t.any('select sum(ls) as lstot,  sum(lm) as lmtot, ' +
            'sum(f) as ftot, sum(ag) as agtot, sum(am) as amtot, sum(ap) as aptot, ' +
            'sum(t) as ttot, sum(c) as ctot ' +
            'FROM $1:raw ' +
            'WHERE EXTRACT(month FROM data) = $2 ' +
            'AND EXTRACT(year FROM data) = $3 ' +
            'group by(data)', [table1, month, year]);
        const q2 = t.any('select sum(ls) as lstot,  sum(lm) as lmtot, ' +
            'sum(f) as ftot, sum(ag) as agtot, sum(am) as amtot, sum(ap) as aptot, ' +
            'sum(t) as ttot, sum(c) as ctot ' +
            'FROM $1:raw ' +
            'WHERE EXTRACT(month FROM data) = $2 ' +
            'AND EXTRACT(year FROM data) = $3 ' +
            'group by(data)', [table2, month, year]);
        const q3 = t.any('select sum(ls) as lstot,  sum(lm) as lmtot, ' +
            'sum(f) as ftot, sum(ag) as agtot, sum(am) as amtot, sum(ap) as aptot, ' +
            'sum(t) as ttot, sum(c) as ctot ' +
            'FROM $1:raw ' +
            'WHERE EXTRACT(month FROM data) = $2 ' +
            'AND EXTRACT(year FROM data) = $3 ' +
            'group by(data)', [table3, month, year]);
        const q4 = t.any('select sum(ls) as lstot,  sum(lm) as lmtot, ' +
            'sum(f) as ftot, sum(ag) as agtot, sum(am) as amtot, sum(ap) as aptot, ' +
            'sum(t) as ttot, sum(c) as ctot ' +
            'FROM $1:raw ' +
            'WHERE EXTRACT(month FROM data) = $2 ' +
            'AND EXTRACT(year FROM data) = $3 ' +
            'group by(data)', [table4, month, year]);
        const q5 = t.any('select sum(lsstar) as clmtot,  sum(lmstar) as clstot, ' +
            'sum(cmm) as cmmtot, sum(cms) as cmstot, sum(extra) as extratot ' +
            'FROM $1:raw ' +
            'WHERE EXTRACT(month FROM data) = $2 ' +
            'AND EXTRACT(year FROM data) = $3 ' +
            'group by(data)', [table5, date.split('/')[0], date.split('/')[1]]);
        return t.batch([q1, q2, q3, q4, q5]); // all of the queries are to be resolved;
    })
        .then(function(data) {
            var result = {
                pulito: data[0][0],
                sporco: data[1][0],
                extrapulito: data[2][0],
                extramanca: data[3][0],
                extra : data[4][0]
            }
            res.send(result)
        })
        .catch(function(error) {
            res.send({})
            console.log('no', error); // printing the error;
        });
}

exports.queryDayMonthYearHintownDb = function (res, date) {
    console.log(date)
    var table1 = 'hintown_pulito'
    var table2 = 'hintown_sporco'
    var table3 = 'hintown_extrapulito'
    var table4 = 'hintown_extramanca'
    var table5 = 'extra'
    var dataCompleta = date.split('-')[2]+'-'+date.split('-')[1]+'-'+date.split('-')[0]
    db.task(function(t) {
        // creating a sequence of transaction queries:
        const q1 = t.any('select lsroyal as lsroyaltot, lsstar as lsstartot, lmroyal as lmroyaltot, ' +
            'lmstar as lmstartot, f as ftot, ag as agtot, am as amtot, ap as aptot, ' +
            't as ttot, c as ctot ' +
            'FROM $1:raw ' +
            'WHERE data = $2::date', [table1, new Date(dataCompleta)]);
        const q2 = t.any('select lsroyal as lsroyaltot, lsstar as lsstartot, lmroyal as lmroyaltot, ' +
            'lmstar as lmstartot, f as ftot, ag as agtot, am as amtot, ap as aptot, ' +
            't as ttot, c as ctot ' +
            'FROM $1:raw ' +
            'WHERE data = $2 ', [table2, new Date(dataCompleta)]);
        const q3 = t.any('select lsroyal as lsroyaltot, lsstar as lsstartot, lmroyal as lmroyaltot, ' +
            'lmstar as lmstartot, f as ftot, ag as agtot, am as amtot, ap as aptot, ' +
            't as ttot, c as ctot ' +
            'FROM $1:raw ' +
            'WHERE data = $2 ', [table3, new Date(dataCompleta)]);
        const q4 = t.any('select lsroyal as lsroyaltot, lsstar as lsstartot, lmroyal as lmroyaltot, ' +
            'lmstar as lmstartot, f as ftot, ag as agtot, am as amtot, ap as aptot, ' +
            't as ttot, c as ctot ' +
            'FROM $1:raw ' +
            'WHERE data = $2::date ', [table4, new Date(dataCompleta)]);
        const q5 = t.any('select lsstar as lsstartot,  lmstar as lmstartot, ' +
            'cmm as cmmtot, cms as cmstot, extra as extratot ' +
            'FROM $1:raw ' +
            'WHERE data = $2::date ', [table5, new Date(dataCompleta)]);

        return t.batch([q1, q2, q3, q4, q5]); // all of the queries are to be resolved;
    })
        .then(function(data) {
            var result = {
                pulito: data[0][0],
                sporco: data[1][0],
                extrapulito: data[2][0],
                extramanca: data[3][0],
                extra : data[4][0]
            }
            res.send(result)
        }).catch(function(error) {
        res.send({})
        console.log('no', error); // printing the error;
    });
}

exports.queryDayMonthYearBacciniDb = function (res, date) {
    console.log(date)
    var table1 = 'baccini_pulito'
    var table2 = 'baccini_sporco'
    var table3 = 'baccini_extrapulito'
    var table4 = 'baccini_extramanca'
    var table5 = 'extra'

    var dataCompleta = date.split('-')[2]+'-'+date.split('-')[1]+'-'+date.split('-')[0]
    db.task(function(t) {
        // creating a sequence of transaction queries:
        const q1 = t.any('select ls as lstot,  lm as lmtot, ' +
            'f as ftot, ag as agtot, am as amtot, ap as aptot, ' +
            't as ttot, c as ctot ' +
            'FROM $1:raw ' +
            'WHERE data = $2::date', [table1, new Date(dataCompleta)]);
        const q2 = t.any('select ls as lstot,  lm as lmtot, ' +
            'f as ftot, ag as agtot, am as amtot, ap as aptot, ' +
            't as ttot, c as ctot ' +
            'FROM $1:raw ' +
            'WHERE data = $2 ', [table2, new Date(dataCompleta)]);
        const q3 = t.any('select ls as lstot,  lm as lmtot, ' +
            'f as ftot, ag as agtot, am as amtot, ap as aptot, ' +
            't as ttot, c as ctot ' +
            'FROM $1:raw ' +
            'WHERE data = $2 ', [table3, new Date(dataCompleta)]);
        const q4 = t.any('select ls as lstot,  lm as lmtot, ' +
            'f as ftot, ag as agtot, am as amtot, ap as aptot, ' +
            't as ttot, c as ctot ' +
            'FROM $1:raw ' +
            'WHERE data = $2::date ', [table4, new Date(dataCompleta)]);
        const q5 = t.any('select lsstar as clmtot,  lmstar as clstot, ' +
            'cmm as cmmtot, cms as cmstot, extra as extratot ' +
            'FROM $1:raw ' +
            'WHERE data = $2::date ', [table5, new Date(dataCompleta)]);
        return t.batch([q1, q2, q3, q4, q5]); // all of the queries are to be resolved;
    })
        .then(function(data) {
            var result = {
                pulito: data[0][0],
                sporco: data[1][0],
                extrapulito: data[2][0],
                extramanca: data[3][0],
                extra: data[4][0]
            }
            res.send(result)
        }).catch(function(error) {
        res.send({})
        console.log('no', error); // printing the error;
    });
}

exports.queryGetApartaments = function (res, id) {

    db.task(function(t) {
        // creating a sequence of transaction queries:
        const q1 = t.any('select nome '+
            'FROM appartamento ' +
            'WHERE agenzia = $1',id);
        return t.batch([q1]); // all of the queries are to be resolved;
    })
        .then(function(data) {
            console.log(data)
            res.send(data[0])
        }).catch(function(error) {
            res.send({})
        console.log('no', error); // printing the error;
    });
}

exports.persistenceRegistro = function (res, value) {
    var dateTmp = value.data.split('-')
    var date = dateTmp[2]+'-'+dateTmp[1]+'-'+dateTmp[0]
    var dates = new Date(date);
    var idAgenzia = parseInt(value.idAgenzia)
    var idAppartamento = value.idAppartamento
    var persone = value.persone
    var funzionario = value.funzionario
    var extra = value.extra
    var extraCount = value.extraCount

    db.query('select exists(select * from registro where agenzia = $1 and appartamento = $2 and data = $3 )'
        , [idAgenzia, idAppartamento, dates])
        .then(function(data) {
            if (data[0].exists == true)
                res.send('exists')
            else{
                db.tx(function(t) {
                    // creating a sequence of transaction queries:
                    t.one('INSERT INTO registro (data, agenzia, appartamento, persone, extra, funzionario, extraCount) VALUES($1, $2, $3, $4, $5, $6, $7)',
                        [dates,idAgenzia, idAppartamento, persone, extra, funzionario, extraCount]);
                })
                    .then(function(data) {
                        res.send('DB update')
                        console.log('success update '+tableName+'!'); // printing successful transaction output;
                    })
                    .catch(function(error) {
                        res.send({})
                        console.log('no', error); // printing the error;
                    });
            }
        })
}

exports.queryRegistroMonthYear = function (res, value) {
    var month = value.data.split('/')[0]
    var year = value.data.split('/')[1]
    var idAgenzia = parseInt(value.idAgenzia)
    var idAppartamento = value.idAppartamento

    db.task(function(t) {
        // creating a sequence of transaction queries:
        const q1 = t.one('select prezzo ' +
            'FROM appartamento ' +
            'WHERE agenzia = $1 ' +
            'AND nome = $2', [idAgenzia, idAppartamento]);
        const q2 = t.one('select ' +
            'sum(persone) as personeTot, sum(numero) as nvoltemese, ' +
            'sum(extra) as extraTot, sum(extracount) as extraCountTot ' +
            'from registro ' +
            'WHERE EXTRACT(month FROM data) = $1 ' +
            'AND EXTRACT(year FROM data) = $2 and agenzia = $3 and appartamento = $4' +
            'group by(data)', [month, year, idAgenzia, idAppartamento]);
        const q3 = t.one('select nome from agenzia where id = $1', idAgenzia);
        return t.batch([q1, q2, q3]); // all of the queries are to be resolved;
    })
        .then(function(data) {
            var result = {
                costoTotPersonaMese: data[1].personetot * prezzoOspiti,
                costoTotAppartamentoMese: data[1].nvoltemese * data[0].prezzo,
                costoExtraTotMese: data[1].extratot,
                extraTot : data[1].extracounttot,
                agenzia : data[2].nome,
                totpersonemese : data[1].personetot
            }
            res.send(result)
        })
        .catch(function(error) {
            res.send({})
            console.log('no', error); // printing the error;
        });
}

exports.queryRegistroDayMonthYear = function (res, value) {
    var dataCompleta = value.data.split('-')[2]+'-'+value.data.split('-')[1]+'-'+value.data.split('-')[0]
    var idAgenzia = parseInt(value.idAgenzia)
    var idAppartamento = value.idAppartamento
    db.task(function(t) {
        // creating a sequence of transaction queries:
        const q1 = t.one('select nome from agenzia where id = $1', idAgenzia)
        const q2 = t.one('select *' +
            'from registro ' +
            'WHERE data = $1 and agenzia = $2 and appartamento = $3',
            [new Date(dataCompleta), idAgenzia, idAppartamento])
        return t.batch([q1, q2]); // all of the queries are to be resolved;
    })
        .then(function(data) {
            var result = {
                tipoquery: 'giorno',
                agenzia : data[0].nome,
                appartamento: data[1].appartamento,
                persone: data[1].persone,
                extracount: data[1].extracount,
                funzionario : data[1].funzionario
            }
            res.send(result)
        })
        .catch(function(error) {
            res.send({})
            console.log('no', error); // printing the error;
        });

}

var trasformInfo = function(company, name,catergory, values){
    var obj = {}
    if(company == 'Hintown'){
        obj['LSRoyal'] = parseInt(values[name]['LSRoyal'+catergory])
        obj['LSStar'] = parseInt(values[name]['LSStar'+catergory])
        obj['LMRoyal'] = parseInt(values[name]['LSRoyal'+catergory])
        obj['LMStar'] = parseInt(values[name]['LMStar'+catergory])
    }
    else{
        obj['LS'] = parseInt(values[name]['LS'+catergory])
        obj['LM'] = parseInt(values[name]['LM'+catergory])
    }
    obj['F'] = parseInt(values[name]['F'+catergory])
    obj['AG'] = parseInt(values[name]['AG'+catergory])
    obj['AM'] = parseInt(values[name]['AM'+catergory])
    obj['AP'] = parseInt(values[name]['AP'+catergory])
    obj['T'] = parseInt(values[name]['T'+catergory])
    obj['C'] = parseInt(values[name]['C'+catergory])
    return obj
}

var persistsValuesHintown = function(tableName, company, date, info){
    const obj = info
    var dates = new Date(date);
    db.query('select exists(select * from $1:raw where name_company = $2 and data = $3 )'
        , [tableName, company, dates])
        .then(function(data) {
            if (data[0].exists == true) {
                db.tx(function(t) {
                    // creating a sequence of transaction queries:
                    const q1 = t.none('UPDATE $1:raw SET lsroyal=lsroyal+$2, lsstar=lsstar+$3, lmroyal=lmroyal+$4, lmstar=lmstar+$5, f=f+$6, ag=ag+$7, am=am+$8, t=t+$9, c=c+$10, ap=ap+$11 where name_company= $12 and data = $13',
                        [tableName, obj.LSRoyal, obj.LSStar, obj.LMRoyal, obj.LMStar, obj.F, obj.AG, obj.AM, obj.T, obj.C, obj.AP,company, dates]);
                    return t.batch([q1]); // all of the queries are to be resolved;
                })
                    .then(function(data) {
                        console.log('success update '+tableName+'!'); // printing successful transaction output;
                    })
                    .catch(function(error) {
                        console.log('no', error); // printing the error;
                    });
            }
            else{
                db.tx(function(t) {
                    // creating a sequence of transaction queries:
                    t.one('INSERT INTO $1:raw (name_company, data, lsroyal,     lsstar,       lmroyal,     lmstar,    f,     ag,     am,     t,      c, ap) VALUES($2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
                        [             tableName, company,   dates, obj.LSRoyal, obj.LSStar, obj.LMRoyal, obj.LMStar, obj.F, obj.AG, obj.AM, obj.T, obj.C, obj.AP]);
                })
                    .then(function(data) {
                        console.log('success update '+tableName+'!'); // printing successful transaction output;
                    })
                    .catch(function(error) {
                        console.log('no', error); // printing the error;
                    });
            }
    })

}

var persistsValuesBaccini = function(tableName, company, date, info){
    const obj = info
    var dates = new Date(date);
    db.query('select exists(select * from $1:raw where name_company = $2 and data = $3 )'
        , [tableName, company, dates])
        .then(function(data) {
            if (data[0].exists == true) {
                db.tx(function(t) {
                    // creating a sequence of transaction queries:
                    const q1 = t.none('UPDATE $1:raw SET ls=ls+$2, lm=lm+$3, f=f+$4, ag=ag+$5, am=am+$6, t=t+$7, c=c+$8,' +
                        ' ap=ap+$9 where name_company= $10 and data = $11',
                        [tableName, obj.LS, obj.LM, obj.F, obj.AG, obj.AM, obj.T, obj.C, obj.AP,company, dates]);
                    return t.batch([q1]); // all of the queries are to be resolved;
                })
                    .then(function(data) {
                        console.log('success update '+tableName+'!'); // printing successful transaction output;
                    })
                    .catch(function(error) {
                        console.log('no', error); // printing the error;
                    });
            }
            else{
                db.tx(function(t) {
                    // creating a sequence of transaction queries:
                    t.one('INSERT INTO $1:raw (name_company, data, ls,     lm,      f,     ag,     am,     t,      c, ap) VALUES($2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
                        [             tableName, company,   dates, obj.LS, obj.LM, obj.F, obj.AG, obj.AM, obj.T, obj.C, obj.AP]);
                })
                    .then(function(data) {
                        console.log('success update '+tableName+'!'); // printing successful transaction output;
                    })
                    .catch(function(error) {
                        console.log('no', error); // printing the error;
                    });
            }
        })

}

var persistsValuesExtra = function(tableName, company, date, info){
    const obj = info
    var dates = new Date(date);

    db.query('select exists(select * from $1:raw where name_company = $2 and data = $3 )'
        , [tableName, company, dates])
        .then(function(data) {
            if (data[0].exists == true) {
                db.tx(function(t) {
                    // creating a sequence of transaction queries:
                    const q1 = t.none('' +
                        'UPDATE $1:raw SET lsstar=lsstar+$2, lmstar=lmstar+$3, cmm=cmm+$4, cms=cms+$5, ' +
                        'extra=extra+$6 ' +
                        'where name_company= $7 and data = $8',
                        [tableName, parseInt(obj.LSStar), parseInt(obj.LMStar), parseInt(obj.cmm), parseInt(obj.cms), parseInt(obj.extra),company, dates]);
                    return t.batch([q1]); // all of the queries are to be resolved;
                })
                    .then(function(data) {
                        console.log('success update '+tableName+'!'); // printing successful transaction output;
                    })
                    .catch(function(error) {
                        console.log('no', error); // printing the error;
                    });
            }
            else{
                db.tx(function(t) {
                    // creating a sequence of transaction queries:
                    t.one('INSERT INTO $1:raw (name_company, data, lsstar, lmstar, cmm, cms, extra) VALUES($2, $3, $4, $5, $6, $7, $8)',
                        [tableName, company, dates, parseInt(obj.LSStar), parseInt(obj.LMStar), parseInt(obj.cmm), parseInt(obj.cms), parseInt(obj.extra)]);
                })
                    .then(function(data) {
                        console.log('success update '+tableName+'!'); // printing successful transaction output;
                    })
                    .catch(function(error) {
                        console.log('no', error); // printing the error;
                    });
            }
        })

}

