
var client = algoliasearch('EUXHYU6U4I', 'dc139b675f3962efc57140dc643e3475');
var index = client.initIndex('ProductSchema');
//initialize autocomplete on search input (ID selector must match)
autocomplete('#aa-search-input',
{ hint: false }, {
    source: autocomplete.sources.hits(index, {hitsPerPage: 5}),
    //value to be displayed in input control after user's suggestion selection
    displayKey: 'name',
    //hash of templates used when rendering dataset
    templates: {
        //'suggestion' templating function used to render a single suggestion
        suggestion: function(suggestion) {
          return '<a href="/product/'+suggestion.objectID+'"><span>' +
            suggestion._highlightResult.name.value + '</span></a>' 
            
        }
    }
});