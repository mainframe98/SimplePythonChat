const urlParams = new URLSearchParams( window.location.search );
const ipAddr = urlParams.get( 'ip' ) || '192.168.99.100';
const port = urlParams.get( 'port' ) || '4000';

$( document ).ready( function() {
    let ws = new WebSocket( 'ws://' + ipAddr + ':' + port + '/' ),
        sendButton = $( '#send' ),
        chatlist = $( '#messages' ),
        textArea = $( '#message' ),
        nickField = $( '#nickname' );

    sendButton.on( 'click', function ( event ) {
        if ( ws.readyState === ws.OPEN && textArea.val() && nickField.val() ) {
            ws.send( JSON.stringify( {
                type: 'message',
                name: nickField.val(),
                message: textArea.val()
            } ) );
            textArea.val( '' );
        }
    } );

    ws.onopen = function( event ) {
        ws.send( JSON.stringify( {
            type: 'register',
            name: nickField.val()
        } ) );
    };

    ws.onmessage = function ( event ) {
        const message = JSON.parse( event.data );

        if ( message['type'] === 'message' ) {
            let li = $( '<li>' )
                .attr( { class: 'message' } )
                .text( message['timestamp'] + ' - ' + message['from'] + ': ' + message['content'] );

            chatlist.append( li );
        } else if ( message['type'] === 'register' ) {
            let li = $( '<li>' )
                .attr( { class: 'message' } )
                .text( message['timestamp'] + ' - ' + message['content'] );

            chatlist.append( li );
        }
    };

    ws.onerror = function () {
        chatlist.append( $( '<li>' ).attr( { class: 'error' } ).text( 'Connection lost or not possible.' ) );
    };
} );
