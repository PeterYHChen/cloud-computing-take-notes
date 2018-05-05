/*global WildRydes _config*/

var WildRydes = window.WildRydes || {};
WildRydes.map = WildRydes.map || {};

(function rideScopeWrapper($) {
    $("#noteContent").hide();
    $("#noteContentHtml").show();
    $("#noteContentHtml").click(function () {
        $("#noteContent").show();
        $("#noteContentHtml").hide();
    });

    var authToken;
    WildRydes.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
        } else {
            window.location.href = '/signin.html';
        }
    }).catch(function handleTokenError(error) {
        alert(error);
        window.location.href = '/signin.html';
    });

    function getNotes() {
        $.ajax({
            method: 'GET',
            url: _config.api.invokeUrl + '/notes',
            headers: {
                Authorization: authToken
            },
            // data: JSON.stringify({
            //     PickupLocation: {
            //         Latitude: pickupLocation.latitude,
            //         Longitude: pickupLocation.longitude
            //     }
            // }),
            contentType: 'application/json',
            success: onRequestNotesSuccess,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when requesting your unicorn:\n' + jqXHR.responseText);
            }
        });
    }

    function requestUnicorn(pickupLocation) {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/ride',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                PickupLocation: {
                    Latitude: pickupLocation.latitude,
                    Longitude: pickupLocation.longitude
                }
            }),
            contentType: 'application/json',
            success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when requesting your unicorn:\n' + jqXHR.responseText);
            }
        });
    }

    function onRequestNotesSuccess(result) {
        console.log('Note response received from API: ', result);
        result.Items.forEach(note => {
            // Create the new element
            var a = document.createElement('a');
            a.className = 'list-group-item';
            a.innerHTML = note.Title;
            a.href = "#";
            $('#noteTitle').append(a);
            a.onclick = function () {
                console.log("clicked");
                $('#noteEditor').data('markdown').setContent(note.Content);
                $("#noteContentHtml").html($('#noteEditor').data('markdown').parseContent());
                $("#noteContentHtml").show();
                $("#noteContent").hide();
            }
        });
    }

    function completeRequest(result) {
        var unicorn;
        var pronoun;
        console.log('Response received from API: ', result);
        unicorn = result.Unicorn;
        pronoun = unicorn.Gender === 'Male' ? 'his' : 'her';
        displayUpdate(unicorn.Name + ', your ' + unicorn.Color + ' unicorn, is on ' + pronoun + ' way.');
        animateArrival(function animateCallback() {
            displayUpdate(unicorn.Name + ' has arrived. Giddy up!');
            WildRydes.map.unsetLocation();
            $('#request').prop('disabled', 'disabled');
            $('#request').text('Set Pickup');
        });
    }

    // Register click handler for #request button
    $(function onDocReady() {
        $('#noteEditor').height('600');
        $("#noteEditor").markdown({
            savable: true,
            resize: 'vertical',
            // onShow: function (e) {
            //     alert("Showing "
            //         + e.$textarea.prop("tagName").toLowerCase()
            //         + "#"
            //         + e.$textarea.attr("id")
            //         + " as Markdown Editor...")
            // },
            onPreview: function (e) {
                console.log("Preview!")
                return e.parseContent()
            },
            onSave: function (e) {
                $("#noteContent").hide();
                console.log("Saving '" + e.getContent() + "'...")
                $("#noteContentHtml").html(e.parseContent());
                $("#noteContentHtml").show();
            },
            onChange: function (e) {
                console.log("Changed!")
            },
            onFocus: function (e) {
                console.log("Focus triggered!")
            },
            onBlur: function (e) {
                console.log("Blur triggered!")
            }
        });

        getNotes();
        $('#request').click(handleRequestClick);
        $('#signOut').click(function () {
            WildRydes.signOut();
            alert("You have been signed out.");
            window.location = "signin.html";
        });
        $(WildRydes.map).on('pickupChange', handlePickupChanged);

        WildRydes.authToken.then(function updateAuthMessage(token) {
            if (token) {
                displayUpdate('You are authenticated. Click to see your <a href="#authTokenModal" data-toggle="modal">auth token</a>.');
                $('.authToken').text(token);
            }
        });

        if (!_config.api.invokeUrl) {
            $('#noApiMessage').show();
        }
    });

    function handlePickupChanged() {
        var requestButton = $('#request');
        requestButton.text('Request Unicorn');
        requestButton.prop('disabled', false);
    }

    function handleRequestClick(event) {
        var pickupLocation = WildRydes.map.selectedPoint;
        event.preventDefault();
        requestUnicorn(pickupLocation);
    }

    function animateArrival(callback) {
        var dest = WildRydes.map.selectedPoint;
        var origin = {};

        if (dest.latitude > WildRydes.map.center.latitude) {
            origin.latitude = WildRydes.map.extent.minLat;
        } else {
            origin.latitude = WildRydes.map.extent.maxLat;
        }

        if (dest.longitude > WildRydes.map.center.longitude) {
            origin.longitude = WildRydes.map.extent.minLng;
        } else {
            origin.longitude = WildRydes.map.extent.maxLng;
        }

        WildRydes.map.animate(origin, dest, callback);
    }

    function displayUpdate(text) {
        $('#updates').append($('<li>' + text + '</li>'));
    }
}(jQuery));
