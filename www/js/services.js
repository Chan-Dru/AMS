angular.module('starter.services', [])

.service('LocalFactory',function($cordovaSQLite,$window,LocalDb){
  return{
    getarray: function(st){
      return st.split(",");
    },
    setstudentlist : function(student){
      var studentlist=[];
      for(var i=0;i<student.length;i++){
        studentlist.push({name:student[i],active:true});
      }
      return studentlist;
    },
    savelocal: function(studentattd,subjectname){
      var currentdate = new Date(); 
      var datetime = currentdate.getDate() + "/"
                      + (currentdate.getMonth()+1)  + "/" 
                      + currentdate.getFullYear() + " @ "  
                      + currentdate.getHours() + ":"  
                      + currentdate.getMinutes() + ":" 
                      + currentdate.getSeconds();
      //push date to the subject in push table
       console.log(datetime);
      // console.log(subjectname);
      var d = this.dateparse(datetime);
      var query4 = "SELECT * FROM "+subjectname;
      console.log(studentattd);
      $cordovaSQLite.execute(db,query4).then(function(res){
        console.log(res.rows.length);
        var count = res.rows.length;
        if( count == 0){
          var total = studentattd.length;
          var query2 = "INSERT INTO "+subjectname+" (rowid) VALUES (?)";
          //console.log(query2);
          var t=[];
          for(var n=1;n<total;n++){
            var query2 =query2+",(?)";
            t.push(n);
          }
          t.push(n);
         console.log(t);
          $cordovaSQLite.execute(db,query2,t);
          console.log("first time no students "+new Date());
        }

      //push date to the subject in push table
      var query = "INSERT INTO "+subjectname+"_push (dates,dateid) VALUES (?,?)";
      $cordovaSQLite.execute(db,query,[datetime,d]);
      LocalDb.insert(subjectname,datetime,d);
      //add datetime column in subject table
      var query = "ALTER TABLE "+subjectname+" ADD COLUMN "+d+" text";
      $cordovaSQLite.execute(db,query);
        console.log("create column "+new Date());
      //insert attendance in datetime column in subject table
     // console.log(studentattd.length);
      var query = "UPDATE "+subjectname+" SET "+d+" = (?) WHERE rowid = (?)";
      for(var i=1;i<=studentattd.length;i++){
        //console.log(studentattd[i-1].active);
        $cordovaSQLite.execute(db,query,[studentattd[i-1].active,i]);
        console.log("insert in date column "+new Date());
      }
      });
    },
    dateparse: function(date){
      return "d"+date.replace(/[^a-z0-9\s]/gi, '').replace(/ /g,'');
    }
  };
})

.service('InitialFactory',function($q,$cordovaSQLite,$window,$http){
  return{
    initial: function(uid){
      var deferred = $q.defer();
      var promise = deferred.promise;
      $http.get('http://localhost:2403/faculty/'+uid
        ).success(function(data){
          console.log(data.subject);
          var studentlist = [];
          $window.localStorage.setItem("faculty_subject",data.subject);
          for(var i=0;i<data.subject.length;i++){
            var query = "CREATE TABLE IF NOT EXISTS "+data.subject[i]+" (rollno text)";
            $cordovaSQLite.execute(db,query);
            var query1 = "CREATE TABLE IF NOT EXISTS "+data.subject[i]+"_push (dates text,dateid text)"
            $cordovaSQLite.execute(db,query1);
            //get student list in deptyear
            var sub = data.subject[i].substring(0,3);
            var subject = data.subject[i];
            //console.log(subject);
            var count;
             if($window.localStorage.getItem(sub) == null){ //check if student list already exists
                $http.get('http://localhost:2403/student',{params:{deptyear:sub}
              }).success(function(result){
                $window.localStorage.setItem(sub,result[0].list1);
                deferred.resolve("ok");
              }).error(function(err){
                console.log("error in student name list");
                deferred.reject("no");
              });
            }else{
              deferred.resolve("ok");
            }
          };              
        }).error(function(err){
              deferred.reject(false);        
          });
        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }
        return promise;
    } 
  }
})

.factory('LoginFactory',function($http,$q,$window){
  return {
      loginUser: function(name, pw) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var set = $window.localStorage.getItem("faculty_name")
        if(set == null){
          $http.post('http://localhost:2403/faculty/login',{
            username: name,
            password: pw
          }).success(function(data){
              console.log("new user");
              $window.localStorage.setItem("faculty_name",name);
              $window.localStorage.setItem("faculty_pass",pw);
              deferred.resolve(data.uid);
          }).error(function(err){
              deferred.reject(false);        
          });
        }else{
          var pass = $window.localStorage.getItem('faculty_pass');
          var user = $window.localStorage.getItem('faculty_name'); 
          if(user == name && pass == pw){
            console.log("already in");
            deferred.resolve(false);
          }else{
            $http.post('http://localhost:2403/faculty/login',{
              username: name,
              password: pw
            }).success(function(data){
                console.log("different user");
                $window.localStorage.setItem("faculty_name",name);
                $window.localStorage.setItem("faculty_pass",pw);
                deferred.resolve(data.uid);
            }).error(function(err){
                deferred.reject(false);        
            });
          }
        }
        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }
        return promise;
      }
    }
})

.factory('LocalDb',function($ionicPlatform,$cordovaSQLite,$window){
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
  var subjectAttd1 =[];
  var t =1;
  return{
    set1 : function(){
        console.log(t++);
        var sub = $window.localStorage.getItem("faculty_subject");
        var subject = sub.split(",");
        subject.forEach(function(element,index){
          subjectAttd1.push({name:element,attendance:[]});
          console.log(element);
          var query4 = "SELECT * FROM "+element+"_push";
            $cordovaSQLite.execute(db,query4).then(function(res){
              j=0;
              
              //t.forEach(function(ele,ind){
              while(j<res.rows.length){
                d = res.rows[j].dateid;
                subjectAttd1[index].attendance.push({dateid:d,dates:res.rows[j].dates,student:[]});
                console.log(res.rows[j].dateid);
                j++;
                console.log(subject[index]);
                
            //  });
              }
            });
        });
        // console.log(subjectAttd1);
        // var query2 = "SELECT * FROM CS402 where rowid = '1'";
        //         $cordovaSQLite.execute(db,query2).then(function(data){
        //             // k=0;
        //             // while(k<data.rows.length){
        //             //     console.log(element);
        //             //     console.log(data.rows.item(k)[d]);  
        //             //     k++;
        //             // }
        //             for (var prop in data.rows[0]) {
        //                   console.log(prop);
        //                   console.log(data.rows.item(0)[prop]);
        //               }
        //         });

    },
    set : function(student,subject){
     var k;
      for(var i=0;i<subjectAttd.length;i++){
        if(subject == subjectAttd[i].name){
          k = subjectAttd[i].attendance.length;
          var date = new Date();
          //var id = date.toUTCString();
          var year = date.getFullYear();
          var month = date.getMonth()+1;
          var day = date.getDate();
          var mytime = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
          subjectAttd[i].attendance.push({id:mytime,year:year,month:month,date:day,time:mytime,student:[]})
         for(var j=0;j<student.length;j++)
           subjectAttd[i].attendance[k].student.push(student[j].active);
        }
      }

    },
    insert : function(subject,datetime,d){
      var sub = $window.localStorage.getItem("faculty_subject");
      var query = "SELECT * FROM "+subject+"_push";
      for(var i=0;i<subjectAttd1.length;i++){
        if(subject == subjectAttd1[i].name){
          subjectAttd1[i].attendance.push({dates:datetime,dateid:d,student:[]});
        }
      }
      console.log(subjectAttd1);
      // $cordovaSQLite.execute(db,query).then(function(res){
      //     var l = res.rows.length - 1;
      //     console.log(res.rows);
      
      // });
    },
    all : function(){
      return subjectAttd1;
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
