var contextMenuItem = {
    "id": "spendMoney",
    "title": "SpendMoney",
    "contexts": ["selection"]
};
chrome.contextMenus.create(contextMenuItem);

function isInt(value){
    return !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 10));
}

chrome.contextMenus.onClicked.addListener(function(clickData){
    
    // alert(clickData.menuItemId);

    if (clickData.selectionText && clickData.menuItemId == "spendMoney") {

        if (parseInt(clickData.selectionText)) {
            chrome.storage.sync.get(['total','limit'],function(budget){
                var newTotal = 0;

                if (budget.total) {
                    newTotal += parseInt(budget.total);
                }
                newTotal += parseInt(clickData.selectionText);

                chrome.storage.sync.set({'total': newTotal}, function(){
                    
                    if (newTotal >= budget.limit) {
                        var overLimit = newTotal - budget.limit;
                        var notifOptions = {
                        type: 'basic',
                        iconUrl: 'icon48.png',
                        title: 'Limit exceeded',
                        message: "Uh Oh, looks like you're $" + overLimit + " over your limit"
                    };
                        chrome.notifications.clear('selectionNotif');
                        chrome.notifications.create('selectionNotif', notifOptions);
                    }
                });
            });
        }
    }
});

chrome.storage.onChanged.addListener(function(changes, storageName){

});