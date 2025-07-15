app.controller('JournalController', function ($http, $scope, JournalEntryService, AccountService) {
    var view = this;

    view.entry = JournalEntry.createNew();
    view.accounts = [];

    var STORAGE_KEY = 'journalEntryData';

    view.saveToLocalStorage = function() {
        try {
            var dataToSave = {
                entry: {
                    entryNumber: view.entry.entryNumber,
                    entryDate: view.entry.entryDate,
                    description: view.entry.description,
                    details: view.entry.details
                },
                timestamp: new Date().toISOString()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        } catch (error) {
            console.error('Error saving to local storage:', error);
        }
    };

    view.loadFromLocalStorage = function() {
        try {
            var savedData = localStorage.getItem(STORAGE_KEY);
            if (savedData) {
                var parsedData = JSON.parse(savedData);
                if (parsedData.entry) {
                    view.entry = parsedData.entry;
                    if (!view.entry.details || view.entry.details.length === 0) {
                        view.entry.details = [JournalEntryDetail.createNew()];
                    }
                    return true;
                }
            }
        } catch (error) {
            console.error('Error loading from local storage:', error);
        }
        return false;
    };

    view.clearLocalStorage = function() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Error clearing local storage:', error);
        }
    };

    view.autoSave = function() {
        view.saveToLocalStorage();
    };

    view.initializeData = function() {
        if (!view.loadFromLocalStorage()) {
            view.entry = JournalEntry.createNew();
        }
    };

    view.loadAccounts = function () {
        $http.get(`${environment.apiBaseUrl}/Account/GetSelectableAccounts`).then(function (response) {
            view.accounts = AccountService.mapArrayToModels(response.data.data);
            console.log("Accounts loaded:", view.accounts);
        });
    };

    view.addRow = function () {
        if (view.entry.details.length < 5) {
            JournalEntryService.addDetail(view.entry);
            view.autoSave();
        } else {
            alert('لا يمكن إضافة أكثر من 5 صفوف');
        }
    };

    view.deleteIndex = null;

    view.confirmDelete = function (index) {
        if (view.entry.details.length <= 1) {
            alert('يجب أن يكون هناك صف واحد على الأقل');
            return;
        }

        var detail = view.entry.details[index];
        
        if (view.hasRowData(detail)) {
            view.deleteIndex = index;
            var modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
            modal.show();
        } else {
            JournalEntryService.removeDetail(view.entry, index);
            view.autoSave();
        }
    };

    view.onAccountSelect = function(detail, account) {
        if (account && account.ID) {
            detail.accountId = account.ID;
            detail.accountNumber = account.Number;
            detail.accountName = account.NameAR;
            detail.selectedAccountByName = account.NameAR;
            view.autoSave();
        }
    };

    view.onAccountSelectByName = function(detail, account) {
        if (account && account.ID) {
            detail.accountId = account.ID;
            detail.accountNumber = account.Number;
            detail.accountName = account.NameAR;
            detail.selectedAccount = account.Number;
            view.autoSave();
        }
    };

    view.onAccountNumberChange = function(detail) {
        detail.accountNumberTouched = false;
        
        if (!detail.selectedAccount || 
            (typeof detail.selectedAccount === 'string' && detail.selectedAccount.trim() === '')) {
            detail.accountId = null;
            detail.accountNumber = null;
            detail.accountName = null;
            detail.selectedAccountByName = '';
        } else if (typeof detail.selectedAccount === 'string') {
            var matchingAccount = view.accounts.find(function(account) {
                return account.Number.toString() === detail.selectedAccount.trim();
            });
            
            if (matchingAccount) {
                detail.accountId = matchingAccount.ID;
                detail.accountNumber = matchingAccount.Number;
                detail.accountName = matchingAccount.NameAR;
                detail.selectedAccountByName = matchingAccount.NameAR;
            } else {
                detail.accountId = null;
                detail.accountNumber = null;
                detail.accountName = null;
                detail.selectedAccountByName = '';
            }
        }
        view.autoSave();
    };

    view.onAccountNameChange = function(detail) {
        detail.accountNameTouched = false;
        
        if (!detail.selectedAccountByName || 
            (typeof detail.selectedAccountByName === 'string' && detail.selectedAccountByName.trim() === '')) {
            detail.accountId = null;
            detail.accountNumber = null;
            detail.accountName = null;
            detail.selectedAccount = '';
        } else if (typeof detail.selectedAccountByName === 'string') {
            var matchingAccount = view.accounts.find(function(account) {
                return account.NameAR.toLowerCase() === detail.selectedAccountByName.trim().toLowerCase();
            });
            
            if (matchingAccount) {
                detail.accountId = matchingAccount.ID;
                detail.accountNumber = matchingAccount.Number;
                detail.accountName = matchingAccount.NameAR;
                detail.selectedAccount = matchingAccount.Number;
            } else {
                detail.accountId = null;
                detail.accountNumber = null;
                detail.accountName = null;
                detail.selectedAccount = '';
            }
        }
        view.autoSave();
    };

    view.onAccountNumberBlur = function(detail) {
        detail.accountNumberTouched = true;
    };

    view.onAccountNameBlur = function(detail) {
        detail.accountNameTouched = true;
    };

    view.deleteRow = function () {
        if (view.deleteIndex !== null && view.entry.details.length > 1) {
            JournalEntryService.removeDetail(view.entry, view.deleteIndex);
            view.deleteIndex = null;
            view.autoSave();
        }
    };

    view.removeRow = function (index) {
        JournalEntryService.removeDetail(view.entry, index);
        view.autoSave();
    };

    view.onDebitChange = function(detail) {
        JournalEntryService.onDebitChange(detail);
        view.autoSave();
    };

    view.onCreditChange = function(detail) {
        JournalEntryService.onCreditChange(detail);
        view.autoSave();
    };

    view.getTotalDebit = function() {
        return JournalEntryService.getTotalDebit(view.entry);
    };

    view.getTotalCredit = function() {
        return JournalEntryService.getTotalCredit(view.entry);
    };

    view.getTotalDifference = function() {
        return view.getTotalDebit() - view.getTotalCredit();
    };

    view.isBalanced = function() {
        return JournalEntryService.isBalanced(view.entry);
    };

    view.getDisplayName = function(account) {
        return AccountService.getDisplayName(account);
    };

    view.hasDetailError = function(detail) {
        var hasAmount = (detail.debit && detail.debit > 0) || (detail.credit && detail.credit > 0);
        var hasAccount = detail.accountId && detail.accountId !== "" && detail.accountId !== null;
        return hasAmount && !hasAccount;
    };

    view.hasInvalidAccount = function(detail) {
        if (!detail.accountNumberTouched) {
            return false;
        }
        
        var selectedAccount = detail.selectedAccount;
        return (selectedAccount && typeof selectedAccount === 'string' && selectedAccount.trim() !== '') && !detail.accountId;
    };

    view.hasInvalidAccountByName = function(detail) {
        if (!detail.accountNameTouched) {
            return false;
        }
        
        var selectedAccountByName = detail.selectedAccountByName;
        return (selectedAccountByName && typeof selectedAccountByName === 'string' && selectedAccountByName.trim() !== '') && !detail.accountId;
    };

    view.hasInvalidData = function() {
        return view.entry.details.some(function(detail) {
            return view.hasDetailError(detail) || view.hasInvalidAccount(detail) || view.hasInvalidAccountByName(detail);
        });
    };

    view.hasRowData = function(detail) {
        return (detail.debit && detail.debit > 0) || 
               (detail.credit && detail.credit > 0) || 
               (detail.accountId && detail.accountId !== null);
    };

    view.submitEntry = function () {
        if (!JournalEntryService.isBalanced(view.entry)) {
            alert('يجب أن تكون قيمة المدين مساوية لقيمة الدائن');
            return;
        }

        var hasValidDetails = view.entry.details.some(function(detail) {
            return detail.accountId && (detail.debit > 0 || detail.credit > 0);
        });

        if (!hasValidDetails) {
            alert('يجب إدخال تفاصيل القيد على الأقل');
            return;
        }

        if (view.hasInvalidData()) {
            alert('يرجى التأكد من صحة بيانات الحسابات');
            return;
        }

        var entryData = {
            entryNumber: view.entry.entryNumber || 0,
            entryDate: view.entry.entryDate,
            description: view.entry.description,
            details: view.entry.details
                .filter(function(detail) {
                    return detail.accountId && (detail.debit > 0 || detail.credit > 0);
                })
                .map(function(detail) {
                    return {
                        accountId: detail.accountId,
                        debit: detail.debit || 0,
                        credit: detail.credit || 0
                    };
                })
        };

        $http.post(`${environment.apiBaseUrl}/JournalEntry/AddJournalEntry`, entryData).then(function (response) {
            alert(response.data.message || 'تم حفظ القيد بنجاح');
            view.entry = JournalEntry.createNew();
            view.clearLocalStorage(); 
        }, function (error) {
            alert(error.data.message || "حدث خطأ أثناء الحفظ");
        });
    };

    view.hasAutoSavedData = function() {
        try {
            var savedData = localStorage.getItem(STORAGE_KEY);
            return savedData !== null;
        } catch (error) {
            return false;
        }
    };

    view.getCurrentDate = function() {
        var today = new Date();
        return today.toISOString().split('T')[0];
    };

    // i initialize data and load accounts here and this is responsible for getting data from local storage too...
    view.initializeData();
    view.loadAccounts();

    // watching changs..
    $scope.$watch('view.entry.entryNumber', function() {
        view.autoSave();
    });
    
    $scope.$watch('view.entry.entryDate', function() {
        view.autoSave();
    });
    
    $scope.$watch('view.entry.description', function() {
        view.autoSave();
    });
});
