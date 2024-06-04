$(document).ready(function() {

      // Asigna un evento de envío al formulario con id 'loginForm'
      $('#loginForm').submit(function(event) {
        event.preventDefault(); // Previene el comportamiento por defecto del formulario
        // Obtiene los valores de los campos de entrada
        let username = $('#username').val();
        let password = $('#password').val();

        // Realiza una solicitud POST al servidor con los datos de inicio de sesión
        $.post('/login', {username: username, password: password}, function(response) {
            // Verifica si el usuario existe en la respuesta del servidor
            if (response.exists) {
                // Redirige a la página de inicio
                localStorage.setItem('user', JSON.stringify(username));
                localStorage.setItem('id', JSON.stringify(response.id));
                localStorage.setItem('fullName', JSON.stringify(response.fullName));
                window.location.href = '/home';
            } else {
                // Muestra un mensaje de error utilizando la librería Swal
                Swal.fire('Usuario no encontrado', 'El usuario no existe.', 'error');
            }
        });
    });

    $('#registerForm').on('submit', function(event) {
        event.preventDefault();

        var name = $('#name').val();
        var username = $('#username').val();
        var password = $('#password').val();
        var confirmPassword = $('#confirmPassword').val();

        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas no coinciden'
            });
            return;
        }

        $.ajax({
            url: '/register',
            method: 'POST',
            data: {
                name: name,
                username: username,
                password: password
            },
            success: function(response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    text: response.message
                }).then(() => {
                    window.location.href = '/login';
                });
            },
            error: function(error) {
                let errorMessage = error.responseJSON.message || 'Error al registrar el usuario';
                if (error.responseJSON.message === 'El nombre de usuario ya existe') {
                    errorMessage = 'El nombre de usuario ya está en uso';
                }
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage
                });
            }
        });
    });
});
