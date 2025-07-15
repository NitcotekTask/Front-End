app.service('JournalEntryService', function() {
    
    this.addDetail = function(entry) {
        entry.details.push(new JournalEntryDetail());
    };

    this.removeDetail = function(entry, index) {
        if (entry.details.length > 1) {
            entry.details.splice(index, 1);
        }
    };

    this.isValid = function(entry) {
        if (!entry.entryDate) {
            return false;
        }
        
        if (!entry.description || entry.description.trim() === '') {
            return false;
        }
        
        var hasValidDetail = entry.details.some(function(detail) {
            return detail.accountId && (detail.debit > 0 || detail.credit > 0);
        });
        
        return hasValidDetail;
    };

    this.getTotalDebit = function(entry) {
        return entry.details.reduce(function(total, detail) {
            return total + (detail.debit || 0);
        }, 0);
    };

    this.getTotalCredit = function(entry) {
        return entry.details.reduce(function(total, detail) {
            return total + (detail.credit || 0);
        }, 0);
    };

    this.isBalanced = function(entry) {
        return this.getTotalDebit(entry) === this.getTotalCredit(entry);
    };

    this.onDebitChange = function(detail) {
        if (detail.debit > 0) {
            detail.credit = 0;
        }
    };

    this.onCreditChange = function(detail) {
        if (detail.credit > 0) {
            detail.debit = 0;
        }
    };
});
