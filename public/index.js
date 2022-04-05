
$( document ).ready(function() {
let handle = null;
$('#handle-submit').click(()=>{
  handle = $('#twitter-handle').val()
  // console.log(handle)
  location.href = "/profile?handle=" + handle
})



    console.log( "ready!" );
});
