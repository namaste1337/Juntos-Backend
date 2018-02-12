// Projects Schema Validation
// Definiition for request validations

module.exports = {
  POST:{
    title: "Project"
    description: "A project created by a user"
    type: "object",
    properties: {
      name: {
        description: "Name of the project"
        type: "string",
      },
      description: {
        description: "Description of the project"
        type: "string",
      },
      start_date: {
        description: "Start date of the project"
        type: "string",
      },
      end_date: {
        description: "End date of the project"
        type: "string",
      },
      current_status: {
        description: "Current status of the project"
        type: "string",
      },
      type: {
        description: "Type of the project"
        type: "string",
      },
      food_provided: {
        description: "Food availability for the project"
        type: "string",
      },
      images: {
        description: "Food availability for the project"
        type: "array",
      },
      location: {
        description: "Location for the project"
        type: "object"
      },
    },
    required: ["name", "description", "start_date", "end_date", "current_status", "type", "food_provided", "images", "images"]
  },
  GET:{

  },
  PUT:{

  },
  DELETE:{

  }
}