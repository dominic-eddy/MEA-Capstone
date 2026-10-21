provider "aws" {
  region = "us-east-1"
}

resource "aws_dynamodb_table" "team_tracker" {
  name         = "Team_Tracker"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "person_id"

  attribute {
    name = "person_id"
    type = "S"
  }

  tags = {
    Name = "TeamTrackerTable"
  }
}