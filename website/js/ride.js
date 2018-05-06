/*global WildRydes _config*/

var WildRydes = window.WildRydes || {};
WildRydes.map = WildRydes.map || {};

(function rideScopeWrapper($) {
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

    var selectedNote;
    function updateSelectedNoteToUI(selectedNote) {
        selectedNote.a.innerHTML = selectedNote.Title;
        $('#noteTitle').val(selectedNote.Title);
        $('#noteEditor').data('markdown').setContent(selectedNote.Content);
        $("#noteContentHtml").html($('#noteEditor').data('markdown').parseContent());
    }

    function getNotes() {
        $.ajax({
            method: 'GET',
            url: _config.api.invokeUrl + '/notes',
            headers: {
                Authorization: authToken
            },
            contentType: 'application/json',
            success: onRequestNotesSuccess,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting note: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when requesting your notes:\n' + jqXHR.responseText);
            }
        });
    }

    function onRequestNotesSuccess(result) {
        console.log('Get all note response received from API: ', result);
        result.Items.forEach(note => {
            // Create the new element
            $('#noteTitleList').append(createNoteElementInList(note));
        });
    }

    function createNote(selectedNote) {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/notes',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                Note: {
                    Title: selectedNote.Title,
                    Content: selectedNote.Content
                }
            }),
            contentType: 'application/json',
            success: onSaveNoteSuccess,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting note: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when requesting your notes:\n' + jqXHR.responseText);
            }
        });
    }

    function onSaveNoteSuccess(note) {
        toastr.success(note.Title, "Successfully save note to your library");
        console.log('Save note response received from API: ', note);
        Object.assign(selectedNote, note);
        selectedNote.isEdited = false;
        updateSelectedNoteToUI(selectedNote);
    }

    function updateNote(selectedNote) {
        console.log("Update Item:", selectedNote);
        $.ajax({
            method: 'PUT',
            url: _config.api.invokeUrl + '/notes',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                Note: {
                    NoteId: selectedNote.NoteId,
                    Title: selectedNote.Title,
                    Content: selectedNote.Content
                }
            }),
            contentType: 'application/json',
            success: onSaveNoteSuccess,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error updating note: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when updating your notes:\n' + jqXHR.responseText);
            }
        });
    }

    function showDeleteModal(selectedNode) {
        $('#deleteNoteModal').on('show.bs.modal', function (event) {
            $(this).find('.modal-body').text('Are you sure to delete "' + selectedNode.Title + '"?');
        });
        $('#deleteNoteModalDeleteButton').click(function () {
            deleteNote(selectedNode);
        });
        $('#deleteNoteModal').modal();
    }

    function deleteNote(selectedNote) {
        console.log("Ready to delete note: ", selectedNote);
        $.ajax({
            method: 'DELETE',
            url: _config.api.invokeUrl + '/notes',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                Note: {
                    NoteId: selectedNote.NoteId
                }
            }),
            contentType: 'application/json',
            success: function () {
                toastr.success(selectedNote.Title, "Successfully delete note from your library");
                selectedNote.a.remove();
                $("#noteContent").hide();
                $("#noteContentHtml").hide();
            },
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error deleting note: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when deleting your note:\n' + jqXHR.responseText);
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

    function createNoteElementInList(note) {
        var a = document.createElement('a');
        a.className = 'list-group-item';
        a.innerHTML = note.Title;
        a.href = "#";
        note.a = a;
        note.isEdited = false;
        a.onclick = function () {
            selectedNote = note; // Reference
            console.log("clicked " + note.Title);
            console.log(selectedNote);
            updateSelectedNoteToUI(selectedNote);
            $("#noteContentHtml").show();
            $("#noteContent").hide();
        };
        return a;
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
        $('#noteContentHtml').css('background', 'rgb(255,255,255)');
        $('#noteContentHtml').css('min-height', '100px');
        $('#noteContentHtml').css('height', 'auto');
        $("#noteContentHtml").click(function () {
            $("#noteContent").show();
            $("#noteContentHtml").hide();
        });
        $('#noteEditor').height('600');
        $("#noteEditor").markdown({
            resize: 'vertical',
            // onShow: function (e) {
            //     alert("Showing "
            //         + e.$textarea.prop("tagName").toLowerCase()
            //         + "#"
            //         + e.$textarea.attr("id")
            //         + " as Markdown Editor...")
            // },
            onPreview: function (e) {
                console.log("Preview!");
                return e.parseContent();
            },
            onChange: function (e) {
                console.log("Changed!");
            },
            onFocus: function (e) {
                console.log("Focus triggered!");
            },
            onBlur: function (e) {
                console.log("Blur triggered!");
            },
            additionalButtons: [
                [{
                    name: "groupSave",
                    data: [{
                        name: "cmdSave",
                        title: "Save",
                        btnText: "Save",
                        btnClass: "btn btn-success btn-sm",
                        callback: function (e) {
                            selectedNote.Title = $("#noteTitle").val();
                            selectedNote.Content = e.getContent();
                            updateSelectedNoteToUI(selectedNote);

                            // If noteId is provided, do update, else do create
                            if (selectedNote.NoteId) {
                                updateNote(selectedNote);
                            } else {
                                createNote(selectedNote);
                            }
                        }
                    }]
                }, {
                    name: "groupDelete",
                    data: [{
                        name: "cmdDelete",
                        title: "Delete",
                        btnText: "Delete",
                        btnClass: "btn btn-danger btn-sm",
                        callback: function (e) {
                            console.log("Delete!");
                            showDeleteModal(selectedNote);
                        }
                    }]
                }]
            ]
        });
        $('#createNoteButton').click(function () {
            var note = {};
            $('#noteTitleList').prepend(createNoteElementInList(note));
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
