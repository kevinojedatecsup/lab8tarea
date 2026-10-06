// esta funcion es para saludar cuando haces click al boton
function saludar() {
    const mensaje = ' Hola desde el script uwu';

    const saludoElement = document.getElementById('saludo');
    saludoElement.textContent = mensaje;
}

const botonSaludo = document.getElementById('boton-saludo');
botonSaludo.addEventListener('click', saludar);