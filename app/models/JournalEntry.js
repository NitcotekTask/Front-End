function JournalEntry(data) {
    this.entryNumber = data ? data.entryNumber : null;
    this.entryDate = data ? data.entryDate : null;
    this.description = data ? data.description : '';
    this.details = data && data.details ? data.details : [new JournalEntryDetail()];
}

JournalEntry.createNew = function() {
    return new JournalEntry({
        entryNumber: null,
        entryDate: null,
        description: '',
        details: [new JournalEntryDetail()]
    });
};
