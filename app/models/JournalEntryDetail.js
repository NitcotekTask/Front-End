function JournalEntryDetail(data) {
    this.accountId = data ? data.accountId : null;
    this.accountNumber = data ? data.accountNumber : '';
    this.accountName = data ? data.accountName : '';
    this.searchText = data ? data.searchText : '';
    this.searchTextByName = data ? data.searchTextByName : '';
    this.selectedFromDropdown = data ? data.selectedFromDropdown : false;
    this.selectedFromDropdownByName = data ? data.selectedFromDropdownByName : false;
    this.debit = data ? data.debit : 0;
    this.credit = data ? data.credit : 0;
}

JournalEntryDetail.createNew = function() {
    return new JournalEntryDetail({
        accountId: null,
        accountNumber: '',
        accountName: '',
        searchText: '',
        searchTextByName: '',
        selectedFromDropdown: false,
        selectedFromDropdownByName: false,
        debit: 0,
        credit: 0
    });
};
