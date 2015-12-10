setTimeout(function() {
    var elem = document.querySelector('.grid');
    var msnry = new Masonry( elem, {
        itemSelector: '.grid-item'
    });
}, 500);



$('.grid').masonry({
    columnWidth: '.grid-sizer',
    itemSelector: '.grid-item',
    percentPosition: true
});