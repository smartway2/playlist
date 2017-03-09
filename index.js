$(document).ready(() => {
  var frontPics = [];
  $.getJSON('http://localhost:8000/index.json', (data) => {
    while(frontPics.length < 3){
      var rand = Math.floor(Math.random() * data['results'].length);
      var ham = frontPics.indexOf(data['results'][rand]['cover_art']);
      frontPics.indexOf(data['results'][rand]['cover_art']) === -1 ? frontPics.push(data['results'][rand]['cover_art']) : null;
    }
    var randPics = `
    <div class="row pic">
      <img src="images/${frontPics[0]}" alt="${frontPics[0]}" class="image1">
    </div>
    <div class="row pic">
      <img src="images/${frontPics[1]}" alt="${frontPics[1]}" class="image1">
    </div>
    <div class="row pic">
      <img src="images/${frontPics[2]}" alt="${frontPics[2]}" class="image1">
    </div>`;
    $('#pics').append(randPics);
  });

  $('button[name=button]').click(() => {
    var newBody = `
    <div class="row top2" style="text-align:left;"><h3 style="margin-left:3vw; margin-top:8vh;">select an album to add its tracks to the bin</h3></div>
    <div class="row main2">
      <div class="row" style="height:20vh;">
        <div id="scroll" style="overflow-x:scroll; height: 20vh;"></div>
      </div>
      <div class="row" style="height:30vh;">
        <div class="col-md-4" style="height:30vh;">
          <div class="row" id="useless" style="margin-top: 3vh;">Add Tracks From:</div>
          <div class="row" id="name">Select an Album!</div>
          <div class="row" id="cover"></div>
        </div>
        <div class="col-md-4" style="height:30vh;">
          <form id="forma" style="margin-top: 3vh;">
            <select id="possible" style="height:30vh;" multiple>
              <option>________________________________</option>
            </select>
            <button type="button" name="add" class="btn btn-default">add</button>
          </form>
        </div>
        <div class="col-md-4" style="height:30vh;">
          <form id="forma2" style="margin-top: 3vh;">
            <select id="toSend" style="height:30vh;" multiple>
              <option>________________________________</option>
            </select>
            <button type="button" name="remove" class="btn btn-default">remove</button>
          </form>
        </div>
      </div>
      <div class="row" style="height:29vh; text-align:left;">
          <button type="button" name="clear" class="btn btn-default" style="margin-left: 8vh; margin-top: 5vh;">clear tracks</button>
          <button type="button" name="submit" class="btn btn-default" style="margin-top: 5vh;">submit bin</button>
      </div>
    </div>
    <div class="row tb" style="text-align:left;"><h3 style="margin-left:3vw; margin-top:-0.3vh;">\u00A9 2017 GJullian Flemister-King</h3></div>`
    $('body').html(newBody);
    var populate = (z) => {
      $.getJSON('http://localhost:8000/index.json', (data) => {
        data['results'].map(y => {
          if(y['id'] === z){
            $('#name').html(y['artist'] + ': ' + y['title']);
            $('#cover').html(`<img src="images/${y['cover_art']}" alt="${y['cover_art']}" style="height:23vh; width:18vw;">`);
            $('#possible').html('');
            y['tracks'].map(w => {
              $('#possible').append(`<option value="${w}">${w}</option>`);
            });
          };
        });
      });
    };
    $.getJSON('http://localhost:8000/index.json', (data) => {
      data['results'].map(x => {
        $('#scroll').append(`<div id="${x['id']}" style="float:left; margin: 1.5vw;"><img src="images/${x['cover_art']}" alt="${x['cover_art']}" style="height:17vh; width:12vw;" class="pointer"></div>`);
        $(`#${x['id']}`).click(() => {
          populate(x['id']);
        });
      });
    });

    $('button[name=add]').click(() => {
      $('#possible').val().map(v => {
        $('#toSend').append(`<option id="${v.replace(/\W/ig, '')}" value="${v}">${v}</option>`);
      });
    });
    $('button[name=remove]').click(() => {
      $('#toSend').val().map(u => {
        $(`#${u.replace(/\W/ig, '')}`).remove();
      });
    });
    $('button[name=clear]').click(() => {
      $('#toSend').html('<option>________________________________</option>');
    });
    $('button[name=submit]').click(() => {
      $('#toSend option').prop('selected', true);
      var yum = $('#toSend').val();
      yum.shift();
      $.post('https://lit-fortress-6467.herokuapp.com/post',
        {
          "playlist": yum
        },
        function(data) {
          console.log('post response: ', data)
        });
      $('#toSend').html('<option>________________________________</option>');
    });
  });
});
