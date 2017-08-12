/**
 * Created by blackmamba on 08/08/17.
 */

var getTableInfo = function (nameTable) {
    var numberRows  = document.getElementById(nameTable).rows.length
    var numberColums  = document.getElementById(nameTable).rows[1].cells.length
    var tableInfo = {}
    if(nameTable=='tablebacciniapp' || nameTable == 'tablehintownapp'){
        console.log('ciao')
        tableInfo['extra'] = {}
        for(var j=0; j<numberColums; j++){
            for(var i= 1; i<numberRows; i++){
                var value = document.getElementById(nameTable).rows[i].cells[j].getElementsByTagName("input")[0].value
                var name  = document.getElementById(nameTable).rows[i].cells[j].getElementsByTagName("input")[0].name

                console.log(name)
                tableInfo.extra[name] = value
            }
        }
    }
    else{
        tableInfo["pulito"] = {}
        tableInfo["sporco"] = {}
        tableInfo["extrapulito"] = {}
        tableInfo["extramanca"] = {}
        for(var i= 1; i<numberRows; i++){
            for(var j=0; j<numberColums; j++)
                if(j!=0 && j!=2) {
                    var value = document.getElementById(nameTable).rows[i].cells[j].getElementsByTagName("input")[0].value
                    var name  = document.getElementById(nameTable).rows[i].cells[j].getElementsByTagName("input")[0].name
                    switch (j) {
                        case 1 :
                            tableInfo.pulito[name] = value
                            break
                        case 3 :
                            tableInfo.sporco[name] = value
                            break
                        case 4 :
                            tableInfo.extrapulito[name] = value
                            break
                        case 5 :
                            tableInfo.extramanca[name] = value
                            break
                        default :
                            break
                    }
                }
        }
    }
    return tableInfo
}

var addElementsIntoHintown = function () {

    var info = {}

    if(document.getElementById('datepicker').value!=''){
        info['data']= document.getElementById('datepicker').value
        info['company'] = 'Hintown'
        info['values'] = getTableInfo('tablehintown')
        info['extra'] = getTableInfo('tablehintownapp')
        console.log(info)

        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/updateValuesHintown',
            contentType: 'application/json',
            data: JSON.stringify(info),
            success: function (data) {
                document.getElementById('messagge1').style.display="block";
                },
            error: function (error) {
                console.log(error)
            }
        });
    }
    else
        alert('data is mandatory')
}

var addElementsIntoBaccini = function () {

    var info = {}

    if(document.getElementById('datepicker').value!=''){
        info['data']= document.getElementById('datepicker').value
        info['company'] = 'Baccini'
        info['values'] = getTableInfo('tablebaccini')
        info['extra'] = getTableInfo('tablebacciniapp')

        console.log(info)
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/updateValuesBaccini',
            contentType: 'application/json',
            data: JSON.stringify(info),
            success: function (data) {
                document.getElementById('messagge').style.display="block";
            },
            error: function (error) {
                console.log(error)
            }
        });
    }
    else
        alert('data is mandatory')
}

var getPageHintown = function () {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/hintown',
        data: {},
        success: function (data) {
            window.location.replace(data);
        },
        error: function (error) {
            console.log(error)
        }
    });
}

var getPageAgenzia = function () {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/pageAgenzia',
        data: {},
        success: function (data) {
            window.location.replace(data);
        },
        error: function (error) {
            console.log(error)
        }
    });
}

var hideMessage = function (id) {
    document.getElementById(id).style.display="none";
}

var getPageBaccini = function () {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/baccini',
        data: {},
        success: function (data) {
            window.location.replace(data);
        },
        error: function (error) {
            console.log(error)
        }
    });
}

var getPageQueryAzienda = function () {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/pageQuery',
        data: {},
        success: function (data) {
            window.location.replace(data);
        },
        error: function (error) {
            console.log(error)
        }
    });
}

var getPageIndex = function () {
    window.location.replace('http://localhost:3000/');
}

var getpageAgenzieVisualizzaDati = function () {

        $.ajax({
            type: 'GET',
            url: 'http://localhost:3000/agenzieVisualizzaDati',
            data: {},
            success: function (data) {
                window.location.replace(data);
            },
            error: function (error) {
                console.log(error)
            }
        });

}

var hideMonthOrDay = function(value){
    $('input.check').on('change', function() {
        $('input.check').not(this).prop('checked', false);
    });
    if(value==1){
        document.getElementById("meseAnno").style.display="block";
        document.getElementById("giornoMeseAnno").style.display="none";
        document.getElementById('giorno').style.display="none";
        document.getElementById('mese').style.display="none";
    }
    else{
        document.getElementById("meseAnno").style.display="none";
        document.getElementById("giornoMeseAnno").style.display="block";
        document.getElementById('giorno').style.display="none";
        document.getElementById('mese').style.display="none";
    }
}

noDataDBMessage = function () {
    document.getElementById('messaggeDB').style.display="none";
}

var queryDb = function(idAgenzia, idData){
    var data = document.getElementById(idData).value
    var agenzia  = document.getElementById(idAgenzia)
    var agenziaNome = agenzia.options[agenzia.selectedIndex].value;
    var info = {
        data: data,
        agenzia: agenziaNome
    }

    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/query',
        data: {value:info},
        success: function (data) {
            if(jQuery.isEmptyObject(data)){
                document.getElementById('messaggeDB').style.display="block";
            }
            else{
                buildHtmlTable(data)
            }
        },
        error: function (error) {
            console.log(error)
        }
    });
}

var queryRegistroDb = function(idData){
    var data = document.getElementById(idData).value
    var agenzie = document.getElementById("agenzia")
    var appartamenti = document.getElementById("targetselect")

    console.log(agenzie)

    var info = {}
    info['data'] = data
    info['idAgenzia'] = agenzie.options[agenzie.selectedIndex].value
    info['idAppartamento'] = appartamenti.options[appartamenti.selectedIndex].text

    console.log(info)
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/queryRegistro',
        data: {value:info},
        success: function (data) {
            if(jQuery.isEmptyObject(data)){
                document.getElementById('messaggeDB').style.display="block";
            }
            else{
                if(data.tipoquery=='giorno')
                    writeDayQuery(data)
                else{
                    data['appartamento'] = appartamenti.options[appartamenti.selectedIndex].text
                    writeMonthQuery(data)
                }

            }
        },
        error: function (error) {
            console.log(error)
        }
    });
}

var writeDayQuery = function (values) {

    console.log(values)
    document.getElementById('giorno').style.display="block";
    document.getElementById('mese').style.display="none";
    document.getElementById("giornop1").innerHTML = values.agenzia
    document.getElementById("giornop2").innerHTML = values.appartamento
    document.getElementById("giornop3").innerHTML = values.funzionario
    document.getElementById("giornop4").innerHTML = values.persone
}

var writeMonthQuery = function (values) {

    document.getElementById('giorno').style.display="none";
    document.getElementById('mese').style.display="block";
    document.getElementById("mese1").innerHTML = values.agenzia
    document.getElementById("mese2").innerHTML = values.appartamento
    document.getElementById("mese3").innerHTML = values.costoExtraTotMese
    document.getElementById("mese4").innerHTML = values.costoTotAppartamentoMese
    document.getElementById("mese8").innerHTML = values.totpersonemese
    document.getElementById("mese5").innerHTML = values.costoTotPersonaMese
    document.getElementById("mese6").innerHTML = values.extraTot
    document.getElementById("mese7").innerHTML = parseInt(values.costoTotPersonaMese) + parseInt(values.costoExtraTotMese)
}

function buildHtmlTable(obj) {
    var pulito = [],sporco = [], extrapulito =[], extramanca = [], extra = []
    pulito.push(obj.pulito)
    sporco.push(obj.sporco)
    extrapulito.push(obj.extrapulito)
    extramanca.push(obj.extramanca)
    extra.push(obj.extra)
    console.log(obj)
    var c = []

    c.push(pulito)
    c.push(sporco)
    c.push(extrapulito)
    c.push(extramanca)
    c.push(extra)
    console.log('GUARDAAAA ',c)


    //var $el = $("#tableBody");
    //$el.empty(); // remove old options

    for(var j=0; j<5; j++){
        var columns = addAllColumnHeaders(c[j], j);
        for (var i = 0 ; i < c[j].length ; i++) {
            var row$ = $('<tr/>');
            for (var colIndex = 0 ; colIndex < columns.length ; colIndex++) {
                var cellValue = c[j][i][columns[colIndex]];

                if (cellValue == null) { cellValue = ""; }

                row$.append($('<td/>').html(cellValue));
            }
            $("#excelDataTable"+j).append(row$);
        }
    }
    document.getElementById('tableBody').style.display="block";
}

function addAllColumnHeaders(myList, j) {
    var columnSet = [];
    var headerTr$ = $('<tr/>');

    for (var i = 0 ; i < myList.length ; i++) {
        var rowHash = myList[i];
        for (var key in rowHash) {
            if ($.inArray(key, columnSet) == -1){
                columnSet.push(key);
                headerTr$.append($('<th/>').html(key));
            }
        }
    }
    $("#excelDataTable"+j).append(headerTr$);

    return columnSet;
}

var persistsRegistro = function(){
    var extra = 0;
    if(document.getElementById("check").checked)
        extra = 1
    var agenzie = document.getElementById("agenzia")
    var appartamenti = document.getElementById("targetselect")

    var info = {}
    if(document.getElementById('datepicker').value!=''){
        info['data']= document.getElementById('datepicker').value
        info['idAgenzia'] = agenzie.options[agenzie.selectedIndex].value
        info['idAppartamento'] = appartamenti.options[appartamenti.selectedIndex].text
        info['persone'] = parseInt(document.getElementById("persone").value)
        info['funzionario'] = document.getElementById("funzionario").value
        info['extra'] = extra * parseInt(document.getElementById("persone").value)
        info['extraCount'] = extra
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/updateRegistro',
            contentType: 'application/json',
            data: JSON.stringify(info),
            success: function (data) {
                console.log(data)
                if(data=='exists')
                    alert('dati gia registrati')
                else
                    document.getElementById('messagge').style.display="block";
            },
            error: function (error) {
                console.log(error)
            }
        });
    }
    else
        alert('data is mandatory')

}



jQuery(document).ready(function($){
    $('.selectbox').on('change', function(e) {
        var target = $(this).data('target');
        var data = $(this).data();
        data.key = $(this).val();

        $.ajax({
            type: 'GET',
            url: 'http://localhost:3000/getApartamenti',
            data: {id:data.key}
        }).success(function(response){
            //check if response

            if(response.length>0) {

                var $el = $("#targetselect");
                $el.empty(); // remove old options

                $.each(response, function(key, value){
                    $el.append($("<option></option>")
                        .attr('value', value.nome)
                        .text(value.nome));
                });
            }
        });
    })
});