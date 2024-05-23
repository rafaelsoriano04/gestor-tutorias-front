import './css/Register.css';
import logoUsuario from '../assets/logoUsuario.png'
import { useState } from 'react';
const Register = () => {
    const [usuario, setUsuario] = useState({
        nombre_usuario: "",
        contrasenia: "",
        cargo: "",
        persona: {
            identificacion: "",
            nombre: "",
            apellido: "",
            telefono: "",
            email: ""
        }
    });

    // Función para manejar el cambio en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario({
            ...Usuario,
            [name]: value
        });
    };

    // Le usas axios para la api ya, ahi guiate en el login

    /*
         const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí puedes enviar formData a tu API
        console.log(formData);
  
        // Ejemplo de cómo hacer una petición POST a una API
        fetch('https://your-api-endpoint.com/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            // Manejar la respuesta de la API
            console.log('Success:', data);
        })
        .catch((error) => {
            // Manejar los errores
            console.error('Error:', error);
        });
    };
    */

    return (
        <div className='formulario'>
            <img className="logo" src={logoUsuario} alt="LogoUsuario" />
            <p className='titulo'>Crea un usuario</p>
            <p>Es rápido y fácil</p>
            <form action="#">
                <div className='cajaTexto'>
                    <input
                        type="text"
                        className="ingreso"
                        placeholder='Nombre'
                        name="nombre"
                        value={usuario.nombre}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        className="ingreso"
                        placeholder='Apellido'
                        name="apellido"
                        value={usuario.apellido}
                        onChange={handleChange}
                    />
                </div>
                <input
                    type="text"
                    className="email"
                    placeholder='Correo Electronico'
                    name="correoElectronico"
                    value={usuario.correoElectronico}
                    onChange={handleChange}
                />
                <div className='cajaTexto'>
                    <input
                        type="text"
                        className="ingreso"
                        placeholder='Usuario'
                        name="usuario"
                        value={usuario.usuario}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        className="ingreso"
                        placeholder='Cédula'
                        name="cedula"
                        value={usuario.cedula}
                        onChange={handleChange}
                    />
                </div>
                <input
                    type="text"
                    className="contraseña"
                    placeholder='Contraseña'
                    name="contraseña"
                    value={usuario.contrasenia}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    className="contraseña"
                    placeholder='Repita Contraseña'
                    name="repitaContraseña"
                    value={usuario.repitaContrasenia}
                    onChange={handleChange}
                />

                <input
                    type="submit"
                    value="Registrate"
                    className='botonRegistrate'
                />
            </form>
        </div>
    );
};

export default Register;