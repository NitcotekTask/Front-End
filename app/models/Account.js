function Account(data) {
    this.ID = data ? data.id : null;
    this.Number = data ? data.number : '';
    this.NameAR = data ? data.nameAR : '';
}
    
Account.createNew = function() {
    return new Account({
        id: null,
        number: '',
        nameAR: ''
    });
};
