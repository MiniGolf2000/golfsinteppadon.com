$(function () {

    var _ = {};
    var facts = [];

    _.initialize = function (facts) {
        facts.forEach(function (fact) {
            $("#fact-container").append($(`<span class="fact">${fact}</span>`))
        });

        $('.fact').each(function () {
            $(this).html($(this).html().replace("Chuck Norris", "<span class='chucknorris'>Chuck Norris</span>", "gi"));
        });
        $('#nextfact').on('click', _.showRandomFact);
        setInterval(_.refreshName, 10);
        _.showRandomFact();
    }

    /**
     * Hide current fact and show a random hidden one
     */
    _.showRandomFact = function () {
        $('.fact.visible').removeClass('visible');
        // Add class .visible to random element in $('.fact')
        var $facts = $('.fact');
        $facts.eq(Math.floor(Math.random() * $facts.length)).addClass('visible');

        _.refreshName();
    }

    /**
     * Set all relevant .chucknorris to have the correct name
     */
    _.refreshName = function () {
        var newName = $("#nameinput").val() || "_";
        $('.visible .chucknorris').text(newName);

        var PAGE_TITLE_SUFFIX = " Facts - Golf Sinteppadon";
        document.title = newName + PAGE_TITLE_SUFFIX;
    }

    fetch('/assets/chuck.csv').then(function(resp) {
        return resp.text()
    }).then(function(text) {
        _.initialize(text.split("\n"));
    })


});
