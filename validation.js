const Joi = require('joi');

const createPersonSchema = Joi.object({       
  name: Joi.string().required(),              
  age: Joi.number().required(),                
  hobbies: Joi.array().items(Joi.string()).required() 
});
const updatePersonSchema = Joi.object({
    id: Joi.string().uuid().required(),          
    name: Joi.string().required(),              
    age: Joi.number().required(),                
    hobbies: Joi.array().items(Joi.string()).required() 
  });

module.exports = {
  createPersonSchema,
  updatePersonSchema
};