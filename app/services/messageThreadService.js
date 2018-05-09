
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

  static addMessageById(object_id, message){

    return MessageThreadsModel.addMessageById(object_id, message)

  }

  static createMessageThread(usersIdsArray, initialMessage){

    let messageThreadModel = new MessageThreadsModel();

    return messageThreadModel.createMessageThread(usersIdsArray, initialMessage);

  }

}

module.exports = MessagesThreadService;