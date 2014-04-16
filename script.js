$(document).ready(function() {

$('form').submit(function(e){
    e.preventDefault();
	doSearch();
});

$('input').keypress(function(e){
    if(e.keyCode == 13){
	    e.preventDefault();
        doSearch();
    }
});

});//end document ready

var geocoder;
var map;
var markers = Array();

var infos = Array();

var latitude;
var longitude;

function initialize() {
    // prepare Geocoder
    geocoder = new google.maps.Geocoder();

    // set initial position (Alexandria, VA)
    var myLatlng = new google.maps.LatLng(38.8047,-77.0472);

    var myOptions = { // default map options
        zoom: 10,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('gmap_canvas'), myOptions);
}

// clear overlays function
function clearOverlays() {
    if (markers) {
        for (i in markers) {
            markers[i].setMap(null);
        }
        markers = [];
        infos = [];
    }
}

// clear infos function
function clearInfos() {
    if (infos) {
        for (i in infos) {
            if (infos[i].getMap()) {
                infos[i].close();
            }
        }
    }
}





function doSearch() {
	
	 input1 = document.getElementById("city").value;//input from city text box
	var input3 = document.getElementById("query").value; //input from query text box
	var input2 = document.getElementById("distance").value*1609; //input from distance menu
	var input4 = document.getElementById("places").value; //input from number of results text box
	
	  		
	$.ajax({
           
			url: "https://api.foursquare.com/v2/venues/explore?near="+input1+"&radius="+input2+"&query="+input3+"&limit="+input4+ "&client_id=HK254KTU3LYHC5EOHADRHILDZZTBEJEUBQDD5SI4DB3BCAP3&client_secret=FZM1JVCIAXTMLGID4KSKEEFADKD2IRF2LPEDJJML3ITLLHLE&v=20131016",
            
			    success: function(data){
                
				console.log('ajax success',data);
				clearOverlays();
				clearInfos();
				$('#results').empty();
                var data_group = data.response.groups[0];
				for (j=0; j < data_group.items.length; j++){
			       console.log(j,data_group.items.length,data_group.items[j].venue.name);
				   
				   vname = data_group.items[j].venue.name;
				   venueNameNS = vname.replace(/[^a-zA-Z0-9-]/g, '');
				   
			        $('#results').append('<p '+'id="'+venueNameNS+'"><h3>' + data_group.items[j].venue.name + '</h3></p>');
					
					/*$('#results').append('<p><h3>' + data_group.items[j].venue.name + '</h3></p>');*/
					
					$('#results').append('<p>' + data_group.items[j].venue.location.address + '</p>');
					$('#results').append('<p>' + data_group.items[j].venue.location.city + ', ' + data_group.items[j].venue.location.state + ' ' +data_group.items[j].venue.location.postalCode + '</p>');
					
				    $('#results').append('<p>' + data_group.items[j].venue.contact.formattedPhone + '</p><br/>');
				   
				   					
			
			        
				    latitude = data_group.items[j].venue.location.lat;
				    longitude = data_group.items[j].venue.location.lng;
					address = data_group.items[j].venue.location.address;
					city = data_group.items[j].venue.location.city;
					state = data_group.items[j].venue.location.state;
					postal = data_group.items[j].venue.location.postalCode;
					
				
				
				
				drawMarkers(latitude, longitude,vname,address, venueNameNS);
				map.setCenter(new google.maps.LatLng(latitude, longitude));
			
			
			
			
			}
			
												
			
				
            },
            error: function(data){
                console.log('ajax error',data)
            }
        });
	
}//end doSearch function


function drawMarkers(lat, lng, venueName, address, venueNameNS){

        var contentString = '<div style= "overflow: auto; white-space: nowrap; height: 50px;">' + venueName + '<br/>' + '<a href="http://maps.google.com/maps?daddr={' + address + ' ' + city + ', ' + state + ' ' + postal + '}" target="_blank">Get Directions</a></div>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        }); 

        var markerOptions = {
            map: map,
            position: new google.maps.LatLng(lat, lng)
        };
        var marker = new google.maps.Marker(markerOptions);
		
		markers.push(marker);
		
		/*$('"#'+vname+'"').click(function() {
      
            infowindow.open(map,marker);
       	
	    });*/

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
        });
		
		google.maps.event.addListener(marker, 'mouseout', function() {
            infowindow.close(map,marker);
        });
		
		infos.push(infowindow);
        

        $("#" + venueNameNS).mouseenter(function(){
            infowindow.open(map,marker);
        });
        $("#" + venueNameNS).mouseleave(function(){
            infowindow.close(map,marker);
        }); 

    }






