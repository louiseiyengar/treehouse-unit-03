
$(function() {

    $("#title").on('change', (e) => {
     //   e.stopPropagation();
        $select = e.target;
        console.log($($select).children());
        console.log($(e.target).children());
        console.log($('#title').children());
    });
  });