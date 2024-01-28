import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Información sobre nuestra API
const opcionesSwagger = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'UTN Backend',
            version: "3.0.0",
            description: 'API UTN Backend',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }],
    },
    // Lista de archivos que contienen las rutas de la API
    apis: ['src/routes/users.js', 'src/routes/modules.js', 'src/routes/roles.js', 'src/routes/assignments_modules.js',
        'src/routes/events.js', 'src/routes/assignments_events.js', 'src/routes/classroom.js',
        'src/routes/assignments_class.js', 'src/routes/class_score.js', 'src/routes/auditing.js', 'src/routes/login.routes.js', 'src/routes/getmodules.routes.js', 'src/routes/getmodules.routesmovil.js', 'src/routes/setmodules.routes.js', 'src/routes/setmodulesweb.routes.js', 'src/routes/permissions_modules.routes.js', 'src/routes/getModulesByRol.routes.js', 'src/routes/classroombyuser.routes.js', 'src/routes/logout.routes.js', 'database.js'],
};

// Generar la especificación de Swagger
const swaggerSpecs = swaggerJSDoc(opcionesSwagger);

// Configurar y exponer la documentación Swagger
const swaggerDocs = (app, puerto) => {
    // Habilitar el botón "Authorize"
    const customCss = `
        .authorize .btn {
            background-color: #5bc0de;
        }
    `;

    app.use('/utnbackend/v2/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
        explorer: true,
        customCss,
    }));

    // Ruta para obtener el archivo JSON de la especificación Swagger
    app.get('/utnbackend/v2/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpecs);
    });

    console.log(`La documentación Swagger está disponible en http://localhost:${puerto}/utnbackend/v2/docs`);
};

export {swaggerDocs};
