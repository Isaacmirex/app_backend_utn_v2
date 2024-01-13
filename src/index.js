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

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

app.use(
  session({
    secret: "$serverbackutn",
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false, // Cambiar a true si estás usando HTTPS
      maxAge: 24 * 60 * 60 * 1000, // Tiempo de vida de la sesión en milisegundos
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", loginRouter);

//Hola mundo en el servidor de bienvenida
app.get("/", (req, res) => {
  res.send(`Hola mundo es una API de Login`);
});

//swagger
V1SwaggerDocs(app, port);

app.use("/utnbackend/v2/getModulesMovil", getmRouterMovil);
app.use("/utnbackend/v2/getModules", getmRouter);
app.use("/utnbackend/v2/login", router);
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

app.listen(port, () => {
  console.log(`Escuchando en el puerto: http://localhost:${port}`);
});
