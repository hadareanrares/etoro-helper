'use strict';

function initWatchListView() {
    try {
        let mainContentEl = document.querySelector('.main-app-view .main-content');
        if (!mainContentEl) {
            return;
        }
        
        prepareView(mainContentEl);
        
        cleanSentiment();
        
        let isListView = mainContentEl.className.indexOf('list-view') > 0;
        if (isListView) {
            let marketEl = mainContentEl.querySelector('.table-body.market');
            let tabletRowEls = marketEl.querySelectorAll('.table-body .table-row');
            tabletRowEls.forEach((el) => {
                                 if (el.className.indexOf('empty') !== -1) {
                                 return;
                                 }
                                 let tableInfoEl = el.querySelector('.table-info');
                                 let sellBtnEl = tableInfoEl.querySelector('.etoro-sell-button');
                                 let buyBtnEl = tableInfoEl.querySelector('.etoro-buy-button');
                                 if (!sellBtnEl || !buyBtnEl) {
                                 return;
                                 }
                                 let sellPrice = sellBtnEl.querySelector('.etoro-price-value').textContent.trim();
                                 let buyPrice = buyBtnEl.querySelector('.etoro-price-value').textContent.trim();
                                 createSpreadColumn(tableInfoEl, buyPrice, sellPrice);
                                 });
        } else {
            let cardListEls = mainContentEl.querySelectorAll('.market-card-ph.pointer');
            cardListEls.forEach((cardEl) => {
                                let btnSellEl = cardEl.querySelector('.etoro-sell-button');
                                let btnBuyEl = cardEl.querySelector('.etoro-buy-button');
                                if (!btnBuyEl || !btnSellEl) {
                                return;
                                }
                                let sellPrice = btnSellEl.querySelector('.etoro-price-value').textContent.trim();
                                let buyPrice = btnBuyEl.querySelector('.etoro-price-value').textContent.trim();
                                let marketHeadEl = cardEl.querySelector('.market-card-head');
                                createSpreadColumn(marketHeadEl, buyPrice, sellPrice);
                                });
        }
    } catch (e) {
        console.log(e);
    }
}

function initialPortfolioOverview() {
    try {
        let portfolioEl = document.querySelector('.main-app-view .p-portfolio .portfolio-overview');
        let tabletRowEls = portfolioEl.querySelectorAll('.ui-table-row-container');
        tabletRowEls.forEach((el) => {
                             if (el.className.indexOf('empty') !== -1) {
                             return;
                             }
                             let cellNameEl = el.querySelector('.ui-table-static-cell');
                             let sellBtnEl = el.querySelector('.etoro-sell-button');
                             let buyBtnEl = el.querySelector('.etoro-buy-button');
                             if (!sellBtnEl || !buyBtnEl) {
                             return;
                             }
                             let sellPrice = sellBtnEl.querySelector('.etoro-price-value').textContent.trim();
                             let buyPrice = buyBtnEl.querySelector('.etoro-price-value').textContent.trim();
                             createSpreadColumn(cellNameEl, buyPrice, sellPrice);
                             });
    } catch (e) {
        console.log(e);
    }
}

function createSpreadColumn(parent, buyPrice, sellPrice) {
    let clsHelperPrice = 'etoro-helper-price';
    let priceDiv = parent.querySelector('.' + clsHelperPrice);
    
    let spreadPrice = Number(buyPrice) - Number(sellPrice);
    let spreadPercent = (spreadPrice / buyPrice) * 100;
    
    let amount = toFixed(spreadPrice);
    let percentage = spreadPercent.toFixed(3) + '%';
    
    if (!priceDiv) {
        let priceDiv = document.createElement('div');
        priceDiv.className += "table-cell small-cell " + clsHelperPrice;
        
        let amountSpan = document.createElement('span');
        amountSpan.className += "gain-num-amount";
        let amountNode = document.createTextNode(amount);
        amountSpan.appendChild(amountNode);
        
        let percentageSpan = document.createElement('span');
        percentageSpan.className += "gain-num-protsent";
        let percentageNode = document.createTextNode(percentage);
        percentageSpan.appendChild(percentageNode);
        
        priceDiv.appendChild(amountSpan);
        priceDiv.appendChild(percentageSpan);
        
        parent.insertBefore(priceDiv, parent.children[2]);
    } else {
        let amountSpan = priceDiv.querySelector('.gain-num-amount');
        amountSpan.innerHTML = amount;
        
        let percentageSpan = priceDiv.querySelector('.gain-num-protsent');
        percentageSpan.innerHTML = percentage;
    }
}

function toFixed(number) {
    let result;
    if (number > 1000) {
        result = Math.round(number);
    } else if (number > 100) {
        result = number.toFixed(1);
    } else if (number > 10) {
        result = number.toFixed(2);
    } else {
        result = Math.floor(number * 1000) === 0 ? number.toFixed(5) : number.toFixed(3);
    }
    return result;
}

function updatePrice() {
    const href = window.location.href;
    if (href.indexOf('/watchlists') > 0) {
        initWatchListView();
    } else if (href.indexOf('/portfolio') > 0) {
        initialPortfolioOverview();
    }
}

function cleanSentiment() {
    let sentimentElements = document.querySelectorAll('.main-app-view .sentiment');
    sentimentElements.forEach((element) => {
                              element.classList.remove('sentiment');
                              });
}

function prepareView(contentElement) {
    let headerElement = contentElement.querySelector('.table-head.market .table-info');
    if (headerElement.children.length === 5) {
        return;
    }
    console.log('preparing view');
    let sentimentColumn = headerElement.children[2];
    
    headerElement.removeChild(headerElement.children[1]);
    
    headerElement.insertBefore(createHeaderColumn('Spread'), sentimentColumn);
    headerElement.insertBefore(createHeaderColumn('BUY'), sentimentColumn);
    headerElement.insertBefore(createHeaderColumn('SELL'), sentimentColumn);
}

function createHeaderColumn(text) {
    let columnDiv = document.createElement('div');
    columnDiv.className += 'table-cell small-cell';
    
    let textNode = document.createTextNode(text);
    textNode.className += 'head-label';
    
    columnDiv.appendChild(textNode);
    return columnDiv;
}

function start() {
    let options = getOptions();
    setInterval(updatePrice, options.refreshTime);
}

function getOptions() {
    return {
    refreshTime: 5000
    };
}

document.addEventListener("DOMContentLoaded", function(event) {
                        let doc = event.target;
                        let win = doc.defaultView;
                        if (win.frameElement) return;
                        console.log('starting');
                        start();
                        });
