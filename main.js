var info1;//access starting info for moreInfo
var input = document.querySelector('#input');//search input
var span = document.querySelector('span');//for loader circle
var section = document.querySelector('section');//access html to display results
var selectedBoxes = 0;//to limit selections
var sixthCoin;
var interval; //to enable clearInterval of live reports
function loader() {
    span.classList.add('loader');
    window.onload = () => {
        setTimeout(() => { span.classList.remove('loader'); }, 150)
    };
}
loader();
class Coin {
    constructor(symbol, name) {
        Object.assign(this, { symbol, name });
    }
}
//starting info
fetch('https://api.coingecko.com/api/v3/coins/list').then(val => val.json())
    .then(info => {
        info1 = info;
        //for display
        for (item of info) {
            makeCard(item.symbol, item.name);
        }
        //for local storage
        var arr = [];
        for (item of info) {
            var obj = new Coin(item.symbol, item.name);
            arr.push(obj);
        }
        var ls = JSON.stringify(arr);
        localStorage.setItem("myObj5", ls);
    });
//make cards for coins
function makeCard(symbol, name, check = false) {
    var card = document.createElement('div');
    card.classList.add('card');
    card.id = name;
    //main div
    var main = document.createElement('div');
    main.classList.add('main');
    card.appendChild(main);
    //toggle switch
    var switches = document.createElement('label');
    switches.classList.add('switch');
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    if (check == true) { checkbox.checked = true }//if selected already 
    checkbox.addEventListener('click', selectBoxes, event)//select boxes 
    var slider = document.createElement('span');
    slider.classList.add('slider');
    switches.appendChild(checkbox);
    switches.appendChild(slider);
    main.appendChild(switches);
    //main content
    main.appendChild(document.createTextNode(symbol));
    main.appendChild(document.createElement("br"));
    main.appendChild(document.createTextNode(name));
    main.appendChild(document.createElement("br"));
    //button for more info
    var button = document.createElement('button');
    button.addEventListener('click', moreInfo);
    button.classList.add('more');
    var text1 = document.createTextNode("more info");
    button.appendChild(text1);
    main.appendChild(button);
    section.appendChild(card);
}
$('#home').click( goHome);//home button 
$('#live').click( goLive);//live reports button 
$('#about').click( goAbout);//about button
$('#search').click( goSearch);//search button 
function goHome() {
    loader();
    section.innerHTML = '';//clear screen
    clearInterval(interval);//stop live report
    setTimeout(() => { span.classList.remove('loader'); }, 150);
    var ls = localStorage.getItem("myObj5");
    var arr = JSON.parse(ls);
    arr.forEach(obj => {
        obj.isChecked ? makeCard(obj.symbol, obj.name, obj.isChecked) : makeCard(obj.symbol, obj.name);
    });
}
function goLive() {
    loader();
    section.innerHTML = `<div id="chartContainer" style="height: 300px; width: 100%;"></div>`;
    clearInterval(interval);//stop live report
    list = [];
    var ls = localStorage.getItem("myObj5");
    var arr = JSON.parse(ls);
    arr.forEach(obj => {
        if (obj.isChecked) {
            var coin = obj.symbol;
            list.push(coin.toUpperCase());
        }
    });
    if (list.length == 0) {
        section.innerHTML = '<h2>No currencies were selected</h2>';
        span.classList.remove('loader');
        return;
    }
    var selectedCurrencies = list.join();
    var url = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + selectedCurrencies + '&tsyms=USD';
    list.sort();
    var listCoins;
    var dataPoints1 = [];
    var dataPoints2 = [];
    var dataPoints3 = [];
    var dataPoints4 = [];
    var dataPoints5 = [];
    var updateInterval = 2000;
    var time = new Date();//initial time
    class CoinLive {
        constructor(name, val) {
            this.name = name;
            this.val = val;
        }
    }
    var chart = new CanvasJS.Chart("chartContainer", {
        zoomEnabled: true,
        title: {
            text: list.join(', ') + " to USD"
        },
        axisX: {
            title: "chart updates every 2 secs",
            valueFormatString: " mm:ss",
            labelAngle: 0,
        },
        axisY: {
            title: "Coin Value",
            prefix: "$",
            includeZero: false
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "bottom",
            fontSize: 22,
            fontColor: "dimGrey",
            itemclick: toggleDataSeries
        },
        data: [{
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "$####.00",
            xValueFormatString: "h:mm:ss TT",
            showInLegend: true,
            name: list[0],
            dataPoints: dataPoints1
        },
        {
            type: "line",
            xValueType: "dateTime",
            xValueFormatString: "h:mm:ss TT",
            yValueFormatString: "$####.00",
            showInLegend: true,
            name: list[1],
            dataPoints: dataPoints2
        },
        {
            type: "line",
            xValueType: "dateTime",
            xValueFormatString: "h:mm:ss TT",
            yValueFormatString: "$####.00",
            showInLegend: true,
            name: list[2],
            dataPoints: dataPoints3
        },
        {
            type: "line",
            xValueType: "dateTime",
            xValueFormatString: "h:mm:ss TT",
            yValueFormatString: "$####.00",
            showInLegend: true,
            name: list[3],
            dataPoints: dataPoints4
        },
        {
            type: "line",
            xValueType: "dateTime",
            xValueFormatString: "h:mm:ss TT",
            yValueFormatString: "$####.00",
            showInLegend: true,
            name: list[4],
            dataPoints: dataPoints5
        }]
    });
    //toggle a coin's visibility
    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        }
        else {
            e.dataSeries.visible = true;
        }
        chart.render();
    }
    function updateChart(count) {
        count = count || 1;
        for (var i = 0; i < count; i++) {
            time.setTime(new Date());
            listCoins.forEach((_, i) => {
                var dp = 'dataPoints' + (i + 1);
                dp = eval(dp);
                // limit number of dataPoints visible at any point
                if (dp.length > 18) {
                    dp.shift();
                }
                // pushing the new values
                dp.push({
                    x: time.getTime(),
                    y: listCoins[i].val
                });
            });
        }
        // updating legend text with  updated with y Value 
        list.forEach((_, i) => {
            chart.options.data[i].legendText = list[i];
        });
        chart.render();
    }
    function getApi() {
        listCoins = [];
        fetch(url).then(val => val.json())
            .then(arr => {
                for (item in arr) {
                    var currentCoin = new CoinLive(item, arr[item]['USD'])
                    listCoins.push(currentCoin);
                }
                //sort coins to enable having same order as list when name is only numbers
                listCoins.sort(function (a, b) {
                    return a.name - b.name;
                });
                updateChart();
            })
            .catch(() => {
                clearInterval(interval);//stop live report
                section.innerHTML = `<h2>No results were received for any of the selected currencies.</h2>`;
                span.classList.remove('loader');
                return;
            });
    }
    getApi()// generates first set of dataPoints 
    interval = setInterval(getApi, updateInterval);//constantly updates data
    span.classList.remove('loader');
}
function goAbout() {
    loader();
    section.innerHTML = '';//clear screen
    section.innerHTML = `
    <div id="aboutsection">
    <h2>Cryptocurrency - Project 2</h2>
    <h3>by S. E.</h3>
    <p>The project displays data about cryptocurrencies taken from the Coingecko and Cryptocompare APIs.<br>
    The Home page displays cards of all the currencies. <br>
    Their values in Dollars Euros and NIS are displayed with the More Info button. <br>
    A graph of the coins toggled is displayed in the Live Report page.</div>
    <figure>
    <img src="anonymous.jpg" class='anon-img'>
    <figcaption><small>Anonymous Man by Yaman Chukri</small></figcaption>
    </figure>
    `;
    span.classList.remove('loader');
    clearInterval(interval);//stop live report
}
//search coins
function goSearch() {
    clearInterval(interval);//stop live report
    if (!input.value) {
        return;
    } else {
        section.innerHTML = '';//clear screen
        var val = input.value;
        input.value = '';
        var notFound = true;
        var ls = localStorage.getItem("myObj5");
        var arr = JSON.parse(ls);
        arr.forEach(obj => {
            if (obj.symbol == val && obj.isChecked) {
                makeCard(obj.symbol, obj.name, obj.isChecked);
                notFound = false;
            }
        });
        if (notFound) {
            section.innerHTML = `<h2>${val} not found in selected currencies</h2>`;
        }
    }
}
//get more info
function moreInfo() {
    loader();//show loading circle
    var theBtn = event.target;
    var coin = theBtn.parentNode.parentNode;
    theBtn.removeEventListener('click', moreInfo);//prevent reloading
    setTimeout(reload, 120000, theBtn);//enable reloading after 2 minutes
    theBtn.addEventListener('click', hideMoreInfo, event);//enable hiding more-info div

    var data = [...coin.parentNode.children].indexOf(coin);
    var url = 'https://api.coingecko.com/api/v3/coins/' + info1[data].id;
    fetch(url).then(val => val.json()).then(valu => {
        span.classList.remove('loader');//remove loading circle

        var market = valu.market_data.current_price;
        var div = document.createElement("div");
        div.classList.add('extra-info');

        var img = document.createElement("img");
        img.classList.add('small-img');
        img.setAttribute("src", valu.image.small);
        div.appendChild(img);

        div.appendChild(document.createTextNode('$ ' + market.usd));//alt+36 ascii
        div.appendChild(document.createElement("br"));
        div.appendChild(document.createTextNode('€ ' + market.eur));//alt+0128 ascii
        div.appendChild(document.createElement("br"));
        div.appendChild(document.createTextNode('₪ ' + market.ils));//20aa,alt+x unicode
        coin.appendChild(div);
    });
}
function hideMoreInfo(e) {
    e.target.parentNode.nextElementSibling.classList.toggle("hide");
}
function reload(e) {
    e.addEventListener('click', moreInfo);
    e.removeEventListener('click', hideMoreInfo);
    e.parentNode.nextElementSibling.remove();
}
function selectBoxes(e) {
    if (document.querySelector('.alert')) {
        e.target.checked = true ? false : true;
        return;
    } else {
        var id = e.target.parentNode.parentNode.parentNode.id;
        if (selectedBoxes == 5 && e.target.checked) {
            e.target.checked = false;
            sixthCoin = id;
            alertLimit();
        } else {
            e.target.checked ? selectedBoxes++ : selectedBoxes--;
            var ls = localStorage.getItem("myObj5");
            var arr = JSON.parse(ls);
            var i = arr.findIndex(coin => coin.name == id);
            arr[i].isChecked = e.target.checked ? true : false;
            var nls = JSON.stringify(arr);
            localStorage.setItem("myObj5", nls);
        }
    }
}
function alertLimit() {
    var div = document.createElement('div');
    div.classList.add('alert');
    var header = document.createElement('div');
    header.classList.add('header');
    header.innerHTML = '<h4>Maximum selection of 5. <br> To enable current selection, unselect one of these.</h4>';
    div.appendChild(header);
    section.appendChild(div);
    var middle = document.createElement('div');
    middle.classList.add('middle');
    div.appendChild(middle);

    var ls = localStorage.getItem("myObj5");
    var arr = JSON.parse(ls);
    arr.forEach(obj => {
        if (obj.isChecked) {
            makeCard2(obj.symbol, obj.name);
        }
    });
    var footer = document.createElement('div');
    footer.classList.add('footer');
    var button = document.createElement('button');
    button.innerText = 'Cancel';
    button.addEventListener('click', function () {
        this.parentNode.parentNode.remove();
    });
    footer.appendChild(button);
    div.appendChild(footer);
}
//make cards in alertbox
function makeCard2(symbol, name) {
    var middle = document.querySelector('.middle');
    var card = document.createElement('div');
    card.classList.add('card2');
    card.id = name;
    //main div
    var main = document.createElement('div');
    main.classList.add('main');
    card.appendChild(main);
    //toggle switch
    var switches = document.createElement('label');
    switches.classList.add('switch');
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.addEventListener('click', deselectBoxes, event)//deselect boxes 
    var slider = document.createElement('span');
    slider.classList.add('slider');
    switches.appendChild(checkbox);
    switches.appendChild(slider);
    main.appendChild(switches);
    //main content
    main.appendChild(document.createTextNode(symbol));
    main.appendChild(document.createElement("br"));
    main.appendChild(document.createTextNode(name));
    main.appendChild(document.createElement("br"));
    middle.appendChild(card);
}
//deselecting in alertbox
function deselectBoxes(e) {
    var id = e.target.parentNode.parentNode.parentNode.id;
    var ls = localStorage.getItem("myObj5");
    var arr = JSON.parse(ls);
    var i = arr.findIndex(coin => coin.name == id);
    arr[i].isChecked = false;
    var six = sixthCoin;
    var ind = arr.findIndex(coin => coin.name == six);
    arr[ind].isChecked = true;
    var nls = JSON.stringify(arr);
    localStorage.setItem("myObj5", nls);
    //change checked status in main document
    var checkbox = section.children[i].querySelector('input');
    checkbox.checked = false;
    var checkboxSix = section.children[ind].querySelector('input');
    checkboxSix.checked = true;
    var alert = document.querySelector('.alert');
    alert.remove();
}
