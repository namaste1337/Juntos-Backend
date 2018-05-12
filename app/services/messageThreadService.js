// This file will 


/////////////////////////
// Models
///////////////////////// 

const MessageThreadsModel     = require("./../models/messageThreads");


class MessagesThreadService {

  static getMessagesById(id, page, limit){

    return MessageThreadsModel.getMessageThreadPageById(id, page, limit);

  }

  static getAllMessageThreads(usersIdsArray, isUniqueSet){

    let query = {};

    // Check for the usersIdsArray parameter
    if(usersIdsArray != null || usersIdsArray != undefined){

      if(isUniqueSet){
        query = {users: {$size: usersIdsArray.length, $all: usersIdsArray}}
      }else{
        query = { users: { $all: usersIdsArray }};
      }
    }

    // Return all threads
    return MessageThreadsModel.find(query);
  }

  static addMessageById(object_id, message){

    return MessageThreadsModel.addMessageById(object_id, message)

  }

  static createMessageThread(usersIdsArray, initialMessage, room){

    let messageThreadModel = new MessageThreadsModel();

    return messageThreadModel.createMessageThread(usersIdsArray, initialMessage, room);

  }

}

module.exports = MessagesThreadService;