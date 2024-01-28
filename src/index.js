import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import {loginRouter} from "./routes/microsoft.js";
import {usersRouter} from "./routes/users.js";
import {rolesRouter} from "./routes/roles.js";
import {modulesRouter} from "./routes/modules.js";
import {assignments_modulesRouter} from "./routes/assignments_modules.js";
import {eventsRouter} from "./routes/events.js";
import {assignments_eventsRouter} from "./routes/assignments_events.js";
import {classroomRouter} from "./routes/classroom.js";
import {assignments_classRouter} from "./routes/assignments_class.js";
import {class_scoreRouter} from "./routes/class_score.js";
import {auditingRouter} from "./routes/auditing.js";
import "./middlewares/microsoft.js";
import {authorize} from "./middlewares/verifyAccess.js";
import {swaggerDocs as V1SwaggerDocs} from "./routes/swagger.js";
import {router} from "./routes/login.routes.js";
import {getmRouter} from "./routes/getmodules.routes.js";
const port = process.env.PORT || 3000;
import {getmRouterMovil} from "./routes/getmodules.routesmovil.js";
import {setModuleRouter} from "./routes/setmodules.routes.js";
import {setModuleRouterWeb} from "./routes/setmodulesweb.routes.js";
import {config} from 'dotenv';
import {permisions_modulesRouter} from "./routes/permissions_modules.routes.js";
import {getModulesRol_Router} from "./routes/getModulesByRol.routes.js";
import {get_assignments_classRouter} from "./routes/classroombyuser.routes.js";
import {router_logout} from "./routes/logout.routes.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

config()

const secretkey = process.env.SECRET_KEY

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

app.use(
  session({
    secret: secretkey,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false, // Cambiar a true si estás usando HTTPS
      maxAge: 24 * 60 * 60 * 1000, // Tiempo de vida de la sesión en milisegundos
    },
  })
);

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())

app.use('/src/images/', express.static('src/images'));
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", loginRouter);

//swagger
V1SwaggerDocs(app, port);

app.use("/utnbackend/v2/logout", router_logout);
app.use("/utnbackend/v2/getClassRoomByUser", get_assignments_classRouter);
app.use("/utnbackend/v2/getModulesByRol", getModulesRol_Router);
app.use("/utnbackend/v2/setIconWeb", setModuleRouterWeb);
app.use("/utnbackend/v2/setIconMovil", setModuleRouter);
app.use("/utnbackend/v2/getModulesMovil", getmRouterMovil);
app.use("/utnbackend/v2/getModules", getmRouter);
app.use("/utnbackend/v2/login", router);
app.use("/utnbackend/v2/permissions_modules", permisions_modulesRouter)
app.use(
  "/utnbackend/v2/users",
  // authorize(["Administrador"], ["Usuarios"]),
  usersRouter
);
app.use(
  "/utnbackend/v2/roles",
  //authorize(["Administrador"], ["Roles"]),
  rolesRouter
);
app.use(
  "/utnbackend/v2/modules",
  //authorize(["Administrador"], ["Modulos"]),
  modulesRouter
);
app.use(
  "/utnbackend/v2/assignments_modules",
  // authorize(["Administrador"], ["Asignacion de Modulos"]),
  assignments_modulesRouter
);
app.use(
  "/utnbackend/v2/events",
  //authorize(
  //  ["Administrador", "Estudiante", "Profesor", "Secretaria"],
  //  ["Eventos"]
  //),
  eventsRouter
);
app.use(
  "/utnbackend/v2/assignments_events",
  // authorize(
  //   ["Administrador", "Estudiante", "Profesor"],
  //   ["Asignacion de Eventos"]
  // ),
  assignments_eventsRouter
);
app.use(
  "/utnbackend/v2/classroom",
  // authorize(["Administrador", "Estudiante", "Profesor"], ["Clases"]),
  classroomRouter
);
app.use(
  "/utnbackend/v2/assignments_class",
  // authorize(
  //   ["Administrador", "Estudiante", "Profesor"],
  //   ["Asignacion de Clases"]
  // ),
  assignments_classRouter
);
app.use(
  "/utnbackend/v2/class_score",
  // authorize(
  //   ["Administrador", "Estudiante", "Profesor", "Secretaria"],
  //   ["Notas"]
  // ),
  class_scoreRouter
);
app.use(
  "/utnbackend/v2/auditing",
  // authorize(["Administrador"], ["Auditoria"]),
  auditingRouter
);
//app.use('/utnbackend/v1/assignments_modules', authorize(['Administrador'], ['Assignments_Modules']), assignments_modulesRouter);
//Hola mundo en el servidor de bienvenida
app.get("/", (req, res) => {
  const dominio = req.get('host');
  const enlace = `http://${dominio}/utnbackend/v2/docs`;
  res.send(`Go to APIs at the following link: <a href="${enlace}">${enlace}</a>`);
});

app.listen(port, () => {
  console.log(`Escuchando en el puerto: http://localhost:${port}`);
});
