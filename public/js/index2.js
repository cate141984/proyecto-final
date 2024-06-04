// Obtiene el usuario actualmente autenticado del almacenamiento local o establece false si no hay usuario autenticado
const user = JSON.parse(localStorage.getItem('user')) || false

// Selecciona el botón de cierre de sesión por su ID
const logout = document.querySelector('#logout')

// Selecciona el botón de inicio de sesión por su ID
const btnLogin = document.querySelector('#btnInicioSesion')

// Selecciona el botón de inicio de sesión por su ID
const btnCompra = document.querySelectorAll('.btncompra')

// Selecciona el botón de caro de sesión por su ID
const btnCarro = document.querySelector('#carShopping')

// Selecciona el botón de caro de cambio de clave
const btnUpdateUser = document.querySelector('#updateUserBtn')

// Redirige al usuario a la página de inicio de sesión si no hay usuario autenticado
if (!user) {
    logout.style.display = 'none';
    btnCarro.style.display = 'none'; 
    btnUpdateUser.style.display = 'none'; 
    btnLogin.style.display = 'block';
} else {
    actalizaNumeroProductosCarro();
    logout.style.display = 'block';
    btnCarro.style.display = 'block';
    btnUpdateUser.style.display = 'block';
    btnLogin.style.display = 'none';
}

// Agrega un event listener para el evento 'click' al botón de cierre de sesión
logout.addEventListener('click', () => {
    Swal.fire({
        icon: 'info',
        title: 'Cerrar Sesión',
        text: '¿Estás seguro de que quieres cerrar sesión?',
        showCancelButton: true,
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false
    }).then((result) => {
        // Este método then se encadena a la promesa devuelta por Swal.fire().
        // Espera a que el usuario interactúe con el diálogo y luego ejecuta una función de devolución de llamada.
        // 'result' contiene el resultado de la interacción del usuario con el diálogo.
    
        // Verifica si el usuario confirmó la acción en el diálogo de SweetAlert2.
        if (result.isConfirmed) {
            // Elimina la información de inicio de sesión del almacenamiento local.
            localStorage.removeItem('user');
//            localStorage.removeItem('carroCompra');
            localStorage.removeItem('id');
            localStorage.removeItem('fullName');

            Swal.fire({
                icon: 'success',
                title: 'Sesión cerrada',
                text: 'Tu sesión ha sido cerrada correctamente.',
                confirmButtonText: 'OK',
                allowOutsideClick: false
            }).then(() => {
                // Muestra un diálogo de SweetAlert2 informando al usuario que la sesión se ha cerrado correctamente.
                // 'then()' espera a que el usuario cierre este diálogo.
                // Redirige al usuario a la página de inicio de sesión.
                window.location.pathname = '/';
            });
        }
    });
    
});

function crearTablaCarro() {
    const listaProductos = JSON.parse(localStorage.getItem('carroCompra')) || [];

    const formateadorPesos = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' });

    // Construye el HTML para la lista de productos
    let htmlContent = '<table class="table">';
    let totalPagar = 0;
    let totalProductos = 0;
    htmlContent += '<tr>';
    htmlContent += '<th>Producto</th>';
    htmlContent += '<th>Cantidad</th>';
    htmlContent += '<th>Total</th>';
    htmlContent += '<th colspan="2"></th>';
    htmlContent += '</tr>';
    listaProductos.forEach(producto => {
        let tmpTotal = producto.total * producto.cantidad;
        htmlContent += '<tr>';
        htmlContent += `<td>${producto.nombre}</td>`;
        htmlContent += `<td>${producto.cantidad}</td>`;
        htmlContent += `<td>${formateadorPesos.format(tmpTotal)}</td>`;
        htmlContent += `<td><button data-mdb-ripple-init class="btn btn-primary btn-block mb-4 quitaProducto" style="background-color:  #fdcae1;" id=""><span><i class="fas fa-minus quitaProducto"></i></span></button></td>`;
        htmlContent += `<td><button data-mdb-ripple-init class="btn btn-primary btn-block mb-4 agregaProducto" style="background-color:  #fdcae1;" id=""><span><i class="fas fa-plus agregaProducto"></i></span></button></td>`;
        htmlContent += '</tr>';
        totalPagar += tmpTotal;
        totalProductos += producto.cantidad;
    });
    htmlContent += '<tr>';
    htmlContent += `<td>Total carrito</td>`;
    htmlContent += `<td>${totalProductos}</td>`;
    htmlContent += `<td>${formateadorPesos.format(totalPagar)}</td>`;
    htmlContent += '<td colspan="2"></td>';
    htmlContent += '</tr>';
    htmlContent += '</table>';
    return htmlContent
}

function actalizaNumeroProductosCarro() {
    let carroCompra = JSON.parse(localStorage.getItem('carroCompra')) || [];
    let contadorProductos = document.querySelector('#contadorProductos');
    let totalCantidad = 0;
    // Recorremos la lista de productos y sumamos las cantidades
    for (let i = 0; i < carroCompra.length; i++) {
        totalCantidad += carroCompra[i].cantidad;
    }
    contadorProductos.innerHTML = totalCantidad;
}


btnCarro.addEventListener('click', () => {
    Swal.fire({
        icon: 'info',
        title: 'Tus productos',
        html: crearTablaCarro(),
        showCancelButton: true,
        confirmButtonText: 'Ir a pagar',
        cancelButtonText: 'Seguir comprando',
        allowOutsideClick: false,
        width: '50%',
    }).then((result) => {
        // Este método then se encadena a la promesa devuelta por Swal.fire().
        // Espera a que el usuario interactúe con el diálogo y luego ejecuta una función de devolución de llamada.
        // 'result' contiene el resultado de la interacción del usuario con el diálogo.
    
         // Verifica si el usuario confirmó la acción en el diálogo de SweetAlert2.
        if (result.isConfirmed) {
            // Elimina la información de inicio de sesión del almacenamiento local.
            //localStorage.removeItem('login_success');
    
            Swal.fire({
                icon: '!Gracias por tu compra.!',
                title: `Tus productos llegaran en los tiempos estimados `,
                text: `Tu factura llegara al correo suministrado`,
                confirmButtonText: 'OK',
                allowOutsideClick: false
            }).then(() => {
                // Muestra un diálogo de SweetAlert2 informando al usuario que la sesión se ha cerrado correctamente.
                // 'then()' espera a que el usuario cierre este diálogo.
    
                // Redirige al usuario a la página de inicio de sesión.
                window.location.pathname = '/';
            });
        } 
    });
});


function agregarAlCarrito(producto, valor) {
    if (!user) {
        // Si el usuario no está autenticado, redirige a la página de inicio de sesión
        Swal.fire({
            icon: 'info',
            title: 'Iniciar Sesión',
            text: 'Debes iniciar sesión para acceder a esta página.',
            confirmButtonText: 'Ir a Iniciar Sesión',
            showCancelButton: false,
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.pathname = 'login';
            }
        });
    } else {
        // Si el usuario está autenticado
        let carroCompra = JSON.parse(localStorage.getItem('carroCompra')) || [];

        if (!Array.isArray(carroCompra)) {
            // Si los datos del carrito de compras no son un array válido, inicialízalo como un array vacío
            carroCompra = [];
        }

        const exist = carroCompra.find(item => item.nombre === producto);

        if (exist) {
            // Si el producto ya existe en el carrito, incrementa la cantidad
            exist.cantidad += 1;
            exist.total = valor;
        } else {
            // Si el producto no existe en el carrito, agrégalo con una cantidad inicial de 1
            carroCompra.push({ 'nombre': producto, "cantidad": 1, "total":  valor });
        }
        // Actualiza el carrito de compras en el almacenamiento local
        localStorage.setItem('carroCompra', JSON.stringify(carroCompra));

        actalizaNumeroProductosCarro()

        // Muestra un mensaje de éxito al usuario
        Swal.fire({
            icon: 'success',
            title: 'Producto añadido al carrito',
            text: `Has añadido "${producto}" al carrito de compras.`,
            confirmButtonText: 'Aceptar'
        });
    }
}

// Agrega un event listener para cada botón de compra
btnCompra.forEach(btn => {
    btn.addEventListener('click', () => {
        const producto = btn.getAttribute('data-producto');
        const valor = btn.getAttribute('data-valor');
        
        agregarAlCarrito(producto, valor);
    });
});

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('quitaProducto')) {
        // Identifica la fila de la tabla en la que se hizo clic
        const fila = event.target.closest('tr');
        const producto = fila.querySelector('td:first-child').innerText;
        // Actualiza la cantidad del producto en el carrito
        let carroCompra = JSON.parse(localStorage.getItem('carroCompra')) || [];
        const existIndex = carroCompra.findIndex(item => item.nombre === producto);

        if (existIndex !== -1) {
            carroCompra[existIndex].cantidad -= 1;
            // Verifica si la cantidad es menor que 1 y elimina el producto del carrito
            if (carroCompra[existIndex].cantidad < 1) {
                carroCompra.splice(existIndex, 1);
            }
            localStorage.setItem('carroCompra', JSON.stringify(carroCompra));
            // Vuelve a construir la tabla con los datos actualizados
            const htmlContent = crearTablaCarro();
            // Actualiza el contenido del diálogo de SweetAlert2 con la nueva tabla
            Swal.getContainer().querySelector('#swal2-html-container').innerHTML = htmlContent;
            // Actualiza el contador de productos
            actalizaNumeroProductosCarro();
        }
    } else if (event.target.classList.contains('agregaProducto')) {
        // Identifica la fila de la tabla en la que se hizo clic
        const fila = event.target.closest('tr');
        const producto = fila.querySelector('td:first-child').innerText;
        const valor = parseFloat(fila.querySelector('td:nth-child(3)').innerText); // Obtén el valor del producto
        
        // Actualiza la cantidad del producto en el carrito
        let carroCompra = JSON.parse(localStorage.getItem('carroCompra')) || [];
        const exist = carroCompra.find(item => item.nombre === producto);
        if (exist) {
            exist.cantidad += 1;
        }
        localStorage.setItem('carroCompra', JSON.stringify(carroCompra));
        // Vuelve a construir la tabla con los datos actualizados
        const listaProductos = carroCompra;
        let htmlContent = crearTablaCarro();
        // Actualiza el contenido del diálogo de SweetAlert2 con la nueva tabla
        Swal.getContainer().querySelector('#swal2-html-container').innerHTML = htmlContent;
        // Actualiza el contador de productos
        actalizaNumeroProductosCarro();
    }
});


btnUpdateUser.addEventListener('click', () => {
    let fullName = JSON.parse(localStorage.getItem('fullName')) || false
    let userId = JSON.parse(localStorage.getItem('id')) || false
    Swal.fire({
      title: `Actualizar Información de Usuario ${fullName}`,
      showCancelButton: true,
      html: `
        <input type="text" id="username" class="swal2-input" placeholder="Nombre completo">
        <input type="password" id="password" class="swal2-input" placeholder="Clave">
      `,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      preConfirm: () => {
        const username = Swal.getPopup().querySelector('#username').value;
        const password = Swal.getPopup().querySelector('#password').value;
        if (!username || !password) {
          Swal.showValidationMessage(`Por favor, ingresa tu Nombre completo y Clave`);
        }

        return { username: username, password: password };

      }
    }).then((result) => {
        if (result.isConfirmed) {
            // Mostrar un loader mientras se realiza la llamada AJAX
            Swal.fire({
            title: 'Actualizando...',
            text: 'Por favor espera',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
            });
  
            // Realizar la llamada AJAX con Axios
            axios.put('/updateUser', {
                username: result.value.username,
                password: result.value.password,
                id: userId
            })
            .then(response => {
                localStorage.setItem('fullName', JSON.stringify(result.value.username));
                // Mostrar un mensaje de éxito
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Información actualizada correctamente',
                    icon: 'success'
                    });
            })
            .catch(error => {
            // Mostrar un mensaje de error
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al actualizar la información',
                icon: 'error'
             });
            });
      } else if (result.isDenied) {
            


      }
    });
  });
