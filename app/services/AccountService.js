app.service('AccountService', function() {
    
    this.getDisplayName = function(account) {
        return account.Number + ' - ' + account.NameAR;
    };

    this.isValid = function(account) {
        return account.Number && account.NameAR;
    };

    this.mapToModel = function(accountData) {
        return new Account(accountData);
    };

    this.mapArrayToModels = function(accountsData) {
        return accountsData.map(function(accountData) {
            return new Account(accountData);
        });
    };
});
