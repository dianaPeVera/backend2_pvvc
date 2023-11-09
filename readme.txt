/*
    Este comando inicializa un proyecto Node.js y crea un archivo package.json con valores predeterminados o configurados
    por defecto (-y es una opción para aceptar automáticamente todas las configuraciones predeterminadas). El package.json
    es utilizado para gestionar las dependencias y configuraciones del proyecto.
*/
npm init -y
/*
    El paquete dotenv se utiliza para cargar variables de entorno desde un archivo .env en la aplicación Node.js. Esto es útil
    para almacenar información sensible como claves de API o configuraciones de base de datos fuera del código fuente y mantener
    la seguridad.
*/
npm install dotenv
/*
    Express es un framework web para Node.js que simplifica la creación de aplicaciones web. Al instalarlo, puedes crear rutas, 
    manejar solicitudes HTTP y construir aplicaciones web de manera más eficiente. La opción --save solía ser necesaria para 
    agregar express como una dependencia en el archivo package.json, pero en las versiones más recientes de npm, no es necesario.
*/
npm install express --save
/*
    El paquete cors (Cross-Origin Resource Sharing) se utiliza para permitir o restringir las solicitudes HTTP entre diferentes
    dominios o rutas en una aplicación web. Esto es importante cuando tu aplicación debe comunicarse con recursos en otros servidores
    o dominios.
*/
npm install cors
/*
    Multer es una biblioteca para Node.js que se utiliza para manejar la carga de archivos en aplicaciones web. Es comúnmente utilizado
    cuando necesitas permitir que los usuarios suban archivos a tu aplicación, como imágenes o documentos.
*/
npm install multer --save   
/*
    El paquete mongodb es el controlador oficial de MongoDB para Node.js. Permite a tu aplicación interactuar con una base de datos MongoDB. 
    La versión 4.1.0 es específica de la biblioteca MongoDB que estás utilizando. La opción --save ya no es necesaria en las versiones más 
    recientes de npm.
*/ 
npm install mongodb@4.1.0 --save
/*
    Este comando verifica y corrige las vulnerabilidades de seguridad conocidas en las dependencias de tu proyecto. Comprobar y solucionar 
    las vulnerabilidades es una práctica importante para mantener tu aplicación segura.
*/
npm audit fix
/*
 jsonwebtoken para manejar la generación y verificación de tokens. Instálalo con:
*/
npm install jsonwebtoken
