import joi from "joi";

const team_trackerSchema = joi.object({
  person_id: joi.string().required(),
  person_name: joi.string().required(),
  days_in_office: joi.number().required(),
  team_name: joi.string().required(),
});

export default team_trackerSchema;