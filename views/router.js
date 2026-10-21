import express from "express";
import teamController from "../controllers/teamController.js";

const Router = express.Router();

Router.route("/Team-Tracker")
  .get(teamController.getAllPerson)
  .post(teamController.createPerson);

Router.route("/Team-Tracker/:id") // <-- this defines an endpoint with a "placeholder" for the id
  .get(teamController.getPersonById)
  .put(teamController.updatePersonById)
  .delete(teamController.deletePersonById);

export default Router;