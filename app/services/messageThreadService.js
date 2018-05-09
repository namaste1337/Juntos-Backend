
/////////////////////////
// Models
///////////////////////// 

const MessageThreadsModel     = require("./../models/messageThreads");


class MessagesThreadService {

  static getMessagesById(id, page, limit){

    return MessageThreadsModel.getMessageThreadPageById(id, page, limit);

  }

  static getAllMessageThreads(userId){

    let query = {};

    // Check for the user_id parameter
    if(userId != null || userId != undefined){
      query = Object.assing(query, {
        users: userId 
      });
    }

    // Return all threads
    return MessageThreadsModel.find(query);
  }


}

module.exports = MessagesThreadService;