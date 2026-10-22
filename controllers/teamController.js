import database from "../services/database.js";
import {
  ScanCommand,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import team_trackerSchema from "../models/team_tracker.js";

async function getAllPerson(req, res, next) {
  try {
    const params = {
      TableName:"Team_Tracker",
    };
    const command = new ScanCommand(params);
    const result = await database.send(command);
    res.status(200).json(result.Items);
  } catch (err) {
    next(err);
  }
}

async function createPerson(req, res, next) {
  try {
    const uuid = uuidv4();
    req.body.person_id = uuid;
    const { error, value } = team_trackerSchema.validate(req.body);

    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { person_id, person_name, days_in_office, team_name } = value;
    console.log(person_id+"this is person_id") 
    const params = {
      TableName:"Team_Tracker",
      Item: {
        id:person_id,
        person_name,
        days_in_office,
        team_name,
      },
    };

    const command = new PutCommand(params);

    await database.send(command);

    res
      .status(201)
      .json({ message: "Successfully created person", data: params.Item });
  } catch (error) {
    next(error);
  }
}

async function getPersonById(req, res, next) {
  const person_id = req.params.id;
  try {
    const params = {
      TableName:"Team_Tracker",
      Key: { id: person_id },
    };
    const command = new GetCommand(params);
    const result = await database.send(command);
    if (!result.Item) {
      return res.status(404).json({ message: "No person found" });
    }
    res.status(200).json(result.Item);
  } catch (err) {
    next(err);
  }
}

async function updatePersonById(req, res, next) {
  try {
    const person_id = req.params.id;
    req.body.person_id = person_id;
    const { error, value } = team_trackerSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const {person_name, days_in_office, team_name } = value;

    // Get the movie from DynamoDB
    const getParams = {
      TableName: "Team_Tracker",
      Key: { id: person_id },
    };

    const getCommand = new GetCommand(getParams);

    const result = await database.send(getCommand);

    const Team = result.Item;

    if (!Team) {
      return res.status(404).json({ message: "No person found" });
    }

    // Update the team in DynamoDB
    const updateParams = {
      TableName: "Team_Tracker",
      Key: { id: person_id },
      UpdateExpression:
        "set #person_name = :person_name, #days_in_office = :days_in_office, #team_name = :team_name" ,
      ExpressionAttributeNames: {
        "#person_name": "person_name",
        "#days_in_office": "days_in_office",
        "#team_name": "team_name",
      },
      ExpressionAttributeValues: {
        ":person_name": person_name,
        ":days_in_office": days_in_office,
        ":team_name": team_name,
      },
      ReturnValues: "ALL_NEW",
    };
    const updateCommand = new UpdateCommand(updateParams);
    const updatedTeam = await database.send(updateCommand);

    res.status(200).json(updatedTeam.Attributes);
  } catch (err) {
    next(err);
  }
}

async function deletePersonById(req, res, next) {
  const person_id = req.params.id;
  try {
    const params = {
      TableName: "Team_Tracker",
      Key: { id: person_id },
    };
    const command = new DeleteCommand(params);
    await database.send(command);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export default {
  getAllPerson,
  createPerson,
  getPersonById,
  updatePersonById,
  deletePersonById,
};
