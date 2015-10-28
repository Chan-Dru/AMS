angular.module('starter.services', [])

.factory('LoginFactory',function(){
  var faculty = [{
    id:1,
    name:"chan",
    password:"pass",
    subject:["CS402","CS305"],
  },{
    id:2,
    name:"sid",
    password:"sid",
    subject:["EC305","CS405"],
  }];
  var subjectList=[];
  return {
        loginUser: function(name, pw) {
          subjectList=[];
          for(var i =0;i<faculty.length;i++){
            if((faculty[i].name == name) && (faculty[i].password == pw) ){
              subjectList = faculty[i].subject;
              return true;
            }
          }
          return false;
        },
        getList: function(){
          return subjectList;
        }
    }
})

.factory('LocalDb',function(){
  var subjectAttd = [{
    name:"CS402",
    attendance:[{
      id:"1",
      year:"2015",
      month:"10",
      date:"21",
      time:"21:10:33",
      student:[true,false,true,false],
    }],
    strength:[2,4],
  },{
    name:"CS305",
    attendance:[{
      id:"2",
      year:"2015",
      month:"10",
      date:"21",
      time:"21:10:34",
      student:[true,false,true,false],
    }],
    strength:[2,4],
  },{
    name:"CS405",
    attendance:[{
      id:"3",
      year:"2015",
      month:"10",
      date:"21",
      time:"21:10:35",
      student:[true,false,true,false],
    }],
    strength:[2,4],
  },{
    name:"EC305",
    attendance:[{
      id:"4",
      year:"2015",
      month:"10",
      date:"21",
      time:"21:10:36",
      student:[true,false,true,false],
    }],
    strength:[2,4],
  }];
  return{
    set : function(student,subject){
     var k;
      for(var i=0;i<subjectAttd.length;i++){
        if(subject == subjectAttd[i].name){
          k = subjectAttd[i].attendance.length;
          var date = new Date();
          var id = date.toUTCString();;
          var year = date.getFullYear();
          var month = date.getMonth()+1;
          var day = date.getDate();
          var mytime = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
          subjectAttd[i].attendance.push({id:id,year:year,month:month,date:day,time:mytime,student:[]})
         for(var j=0;j<student.length;j++)
           subjectAttd[i].attendance[k].student.push(student[j].active);
        }
      }

    },
    all : function(){
      return subjectAttd;
    },
    getStudent : function(id,subject){
      for(var i=0;i<subjectAttd.length;i++){
        if(subject == subjectAttd[i].name){
         for(var j=0;j<subjectAttd[i].attendance.length;j++)
           if(subjectAttd[i].attendance[j].id==id)
              return subjectAttd[i].attendance[j].student;
        }
      }
    },
    update: function(student,subject,id){
      for(var i=0;i<subjectAttd.length;i++){
        if(subject == subjectAttd[i].name){
          for(var j = 0; j<subjectAttd[i].attendance.length;j++){
            if(subjectAttd[i].attendance[j].id == id){
              for(var k=0;k<student.length;k++)
                 subjectAttd[i].attendance[j].student[k]=student[k].active;
            }     
          }
        }
      }
    }   
  }
})
.factory('Student',function(){
  var student = [{
    batch:"3",
    dept:"CS",
    list:[{
      id:1,
      name:"chan",
      active:true,
    },{
      id:2,
      name:"sid",
      active:true,
    },{
      id:3,
      name:"harish",
      active:true,
    },{
      id:4,
      name:"ajay",
      active:true,
    }],
    total:4,
  },{
    batch:"4",
    dept:"CS",
    list:[{
      id:1,
      name:"him",
      active:true,
    },{
      id:2,
      name:"sand",
      active:true,
    },{
      id:3,
      name:"han",
      active:true,
    },{
      id:4,
      name:"anu",
      active:true,
    }],
    total:4,
  }];
  var subjectTitle;
  var currentSubject="";
  return{
    getList : function(subject){
      subjectTitle = subject;
      var batch =subject.charAt(2);
      var dept = subject.substring(0,2);
      for(var i=0; i<student.length;i++){
        if((student[i].batch==batch) && (student[i].dept == dept)){
          return student[i].list;
        }
      }
     // return student[1].list;
    },
    setSubject : function(subject){
      currentSubject = subject;
    },
    getSubject: function(){
      return currentSubject;
    }

  };
  })

.factory('Chats', function() {
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      console.log(chatId);
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
