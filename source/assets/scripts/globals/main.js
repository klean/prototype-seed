$(document).ready(function(){	
  $('.results-slider').slick({
    slidesToShow: 3,
    slidesToScroll: 3,
	responsive: [
    {
      breakpoint: 960,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 660,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }]
	});

  $('.news-slider').slick({
    slidesToShow: 3,
    slidesToScroll: 3,
	responsive: [
    {
      breakpoint: 960,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 660,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }]
	});

  $(".page-content p,.spot p, .video-wrapper").fitVids();

  $(".main-nav-toggle").on('click', function(){
	 $(".main-nav").toggleClass('show-main-nav');
  });

  $(".close-main-nav").on('click', function(){
    $(".main-nav").removeClass("show-main-nav");
  });

});