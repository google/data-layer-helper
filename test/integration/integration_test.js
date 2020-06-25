describe('the data layer helper library', function () {
    describe('variables that pollute the global scope', function () {
        it('does not pollute with the variable dataLayer', function () {
            expect(window['dataLayer']).toBe(undefined);
        });
        it('does not pollute with the variable goog', function () {
            expect(window['goog']).toBe(undefined);
        });
        it('does not pollute with the variable helper', function () {
            expect(window['helper']).toBe(undefined);
        });
        it('does not pollute with the variable plain', function () {
            expect(window['plain']).toBe(undefined);
        });
        it('does not pollute with the variable isPlainObject', function () {
            expect(window['isPlainObject']).toBe(undefined);
        });
        it('does not pollute with the variable expandKeyValue_', function () {
            expect(window['explandKeyValue_']).toBe(undefined);
        });
    });

    describe('The DataLayerHelper API', function () {
        let helper;
        beforeEach(function() {
            helper = new DataLayerHelper([]);
        });

        it('should be created with a function named DataLayerHelper', function () {
            expect(typeof DataLayerHelper).toBe('function');
        });

        it('should have a get method', function () {
            expect(helper.get).toBe('function');
        });

        it('should have a flatten method', function () {
            expect(helper.flatten).toBe('function');
        });

        it('hides the private processStates_ method', function () {
            expect(helper.processStates_).toBe(undefined);
        });

        it('hides the private expandKeyValue_ method', function () {
            expect(helper.expandKeyValue_).toBe(undefined);
        });

        it('hides the private isArray_ method', function () {
            expect(helper.isArray_).toBe(undefined);
        });
        it('hides the private merge_ method', function () {
            expect(helper.merge_).toBe(undefined);
        });
    });

});
