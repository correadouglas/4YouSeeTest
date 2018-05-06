$(document).ready(function() {
    search();
});

$(document).on("click", ".btn-search", function() {
    search();
});

$(document).on("click", ".btn-eraser", function() {
    $('#title').val(null);
    $('#type').val(null);
    $('#category').val(null);
    search();
});

function search() {
    var params = {
        "title": $('#title').val(),
        "type": $('#type').val(),
        "category": $('#category').val()
    };
    var url = link_to_url(params);
    $.ajax({
        type: 'GET',
        url: url,
        success: function(data) {
            // the api ALWAYS return all the records even i pass params
            var result = search_hash_by_keys(data, params);
            build_html_table(result);
        },
        error: function(e) {
            var tbody = "";
            tbody += "<tr><td class='text-center text-uppercase' colspan='5'><h3 class='no-records'>" + e.responseText + "</h3></td></tr>";
            $('#table-search tbody').html(tbody);
        }
    });
}

var link_to_url = function(params) {
    var base_url = "https://private-7cf60-4youseesocialtest.apiary-mock.com/timeline";
    if (!!params) {
        var _params = [];
        for (i in params) {
            if (!!i) {
                _params.push(i + '=' + params[i]);
            }
        }
        return base_url + "?" + _params.join('&');
    } else {
        return base_url;
    }
};

var search_hash_by_keys = function(hash, params) {
    var result = [];
    if (!!hash && !!params) {
        for (var i = 0; i < hash.length; i++) {
            var keys_present = true;
            for (j in params) {
                if (!!params[j] && hash[i][j].trim().toLowerCase() != params[j].trim().toLowerCase()) {
                    keys_present = false;
                    break;
                }
            }
            if (keys_present) {
                result.push(hash[i]);
            }
        }
    }
    return result.length > 0 ? result : null;
}

function build_html_table(result) {
    var tbody = "";
    if (!!result) {
        for (var i = 0; i < result.length; i++) {
            tbody += "<tr>";
            tbody += "<td width='15%'><img class='thumbnail-midia' src='" + result[i].thumbnail + "'></img></td>";
            tbody += "<td width='20%'>" + result[i].title + "</td>";
            tbody += "<td width='15%'>" + result[i].category + "</td>";
            tbody += "<td width='15%'>" + result[i].type + "</td>";
            tbody += "<td width='35'>" + result[i].description + "</td>";
            tbody += "</tr>";
        }
    } else {
        tbody += "<tr><td class='text-center text-uppercase' colspan='5'><h3 class='no-records'>No records found :(</h3></td></tr>";
    }
    $('#table-search tbody').html(tbody);
}