// import {deleteCategory} from "./category.js";

//get clicked category_id, category_names
function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results == null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var category_id = getParameterByName("category_id");
var category_name = getParameterByName("category_name");
var category_color = getParameterByName("category_color");
console.log(category_id);
console.log(category_name);
console.log(category_color);

//get category_name
get_category_name();
//get todo
get_todo();

function get_category_name() {
  console.log(category_name);
  document.querySelector("header").innerHTML = `
          <h1 class="screen-header__title" id="category_title" contentEditable="true" style="color:${category_color}">${category_name}</h1>
          <span><i class="fas fa-trash-alt" id="category_delete_btn"></i></span>
        `;
}

//get todo -> GET
function get_todo() {
  var url = "/todo/" + category_id;
  console.log(category_id);
  fetch(url, { category_id: category_id })
    .then(function (type) {
      return type.json();
    })
    .then(function (result) {
      var result = result.result;
      console.log(result);

      // get content

      for (var i = 0; i < result.length; i++) {
        var todo_id = result[i].id;
        var content = result[i].content;
        var status = result[i].status;

        var task = `<div class='task' contentEditable='true' id=${todo_id} onfocus='todo_initial_content($(this).text())' onblur='todo_edited_content($(this).text())'></div>`;
        
        //delete
        var del = $("<i class='fas fa-trash-alt'></i>").click(function () {
          var p = $(this).parent();
          p.fadeOut(function () {
            p.remove();
          });

          //delete db
          var todo_id = $(this).parent().attr("id");
          console.log(todo_id);
          url = "/todo/" + category_id;

          fetch(url, {
            method: "DELETE",
            body: JSON.stringify({
              todo_id: todo_id,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then(function (type) {
              return type.json();
            })
            .then(function (result) {
              console.log(result);
            });
        });

        //check

        var check = $("<i class='fas fa-check'></i>").click(function () {
          var p = $(this).parent();

          p.fadeOut(function () {
            if (p.parent().hasClass("notcomp")) {
              $(".comp").append(p);
              p.fadeIn();
            } else if (p.parent().hasClass("comp")) {
              $(".notcomp").append(p);
              p.fadeIn();
            }
          });

          if (p.parent().hasClass("notcomp")) {
            var status = 1;
          } else if (p.parent().hasClass("comp")) {
            var status = 0;
          }

          var todo_id = $(this).parent().attr("id");
          console.log(status);
          console.log(todo_id);

          //update task status
          var url = "/todo/" + category_id;
          console.log(url);
          fetch(url, {
            method: "PUT",
            body: JSON.stringify({
              todo_id: todo_id,
              status: status,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then(function (type) {
              return type.json();
            })
            .then(function (result) {
              console.log(result);
            });
        });

        //calendar

        var id = 1;
        var isClicked = true;

        var cal = "<span style='display:none;'><input style='margin-left: 10px;' type='text' id='from_"+id+"'><span> ~ </span><input type='text' id='to_"+id+"'></span>";

        var calendar = $(`<span id='cal_${id}'><i class='far fa-calendar-alt'></i></span>`).click(function(){

          var arr = $(this).attr("id").split("_");
          var p = $("#from_"+arr[1]).parent();
          p.toggle();

          var style = p.attr("style");

          if(style.toString().includes('none')) {
            $("#from_"+arr[1]).val("");
            $("#to_"+arr[1]).val("");
          }

        });

        //star
        var star = $(`<span id='star_${id}'><i class='far fa-star'></i></span>`).click(function(){
          var p = $(this).parent();

          if(isClicked) {
            $(this).children(".fa-star").removeClass("far fa-star").addClass("fas fa-star");
            p.css('background', '#371F54');
            isClicked = false;
            console.log(isClicked);
            var important = 0;
            console.log(important);

          } else {
            $(this).children(".fa-star").removeClass("fas fa-star").addClass("far fa-star");
            p.css('background', '#81589f9d');
            isClicked = true;
            console.log(isClicked);
            var important = 1;
            console.log(important);
          }

          var todo_id = p.attr("id");
          console.log(p);
          console.log(important);
          console.log(todo_id);

          //update task status
          var url = "/todo/" + category_id;
          console.log(url);
          fetch(url, {
            method: "PUT",
            body: JSON.stringify({
              todo_id: todo_id,
              important: important,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then(function (type) {
              return type.json();
            })
            .then(function (result) {
              console.log(result);
            });
        });

        // del,check,star,cal,calendar

        if (status === false) {
          var task = $(task).text(content);
          console.log(task[0]);
          task.append(del,check,star,cal,calendar);
          console.log(task[0]);
          $(".notcomp").append(task);

        } else {
          var task = $(task).text(content);
          task.append(del,check,star,cal,calendar);
          console.log(task);
          $(".comp").append(task);
        }

        fn_init(id);
        id++;
      }
    });
}

// edit_category_title -> PUT
$("#category_title")
  // When you click on item, record into data("initialText") content of this item.
  .focus(function () {
    $(this).data("initialText", $(this).html());
    console.log($("#category_title").html());
  })
  // When you leave an item...
  .blur(function () {
    // ...if content is different...
    if ($(this).data("initialText") !== $(this).html()) {
      // ... do something.
      console.log("New data when content change.");
      console.log($(this).html());

      var category_title = $(this).html();
      console.log(category_title);
      console.log(category_id);
      var url = "/todo/";

      fetch(url, {
        method: "PUT",
        body: JSON.stringify({
          category_id: category_id,
          name: category_title
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(function (type) {
          return type.json();
        })
        .then(function (result) {
          console.log(result);
          $("#personal_todo").load(window.location.href + "#personal_todo");
        });
    }
  });

var id = 1;
var isClicked = true;

// enter 키 -> task 추가 -> POST
$(".txtb").on("keyup", function (e) {
  //13  means enter button
  if (e.keyCode == 13 && $(".txtb").val() != "") {
    console.log(id);
    var new_task_content = $(".txtb").val();
    console.log(new_task_content);
    
    var url = "/todo/" + category_id;
    console.log(url);
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        content: new_task_content,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (type) {
        return type.json();
      })
      .then(function (result) {
        console.log(result);
        console.log(result.result['todo_id']);
        var todo_id = result.result['todo_id'];

        var task = `<div class='task' contentEditable='true' id=${todo_id} onfocus='todo_initial_content($(this).text())' onblur='todo_edited_content($(this).text())'></div>`;
        var task = $(task).text(new_task_content);
        console.log(task);

        //delete 
        var del = $("<i class='fas fa-trash-alt'></i>").click(function () {
          var p = $(this).parent();
          p.fadeOut(function () {
            p.remove();
          });

          //delete db
          var todo_id = $(this).parent().attr("id");
          console.log(todo_id);
          url = "/todo/" + category_id;

          fetch(url, {
            method: "DELETE",
            body: JSON.stringify({
              todo_id: todo_id,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then(function (type) {
              return type.json();
            })
            .then(function (result) {
              console.log(result);
            });
        });

        //check
        var check = $("<i class='fas fa-check'></i>").click(function () {
          var p = $(this).parent();

          p.fadeOut(function () {
            if (p.parent().hasClass("notcomp")) {
              $(".comp").append(p);
              p.fadeIn();
            } else if (p.parent().hasClass("comp")) {
              $(".notcomp").append(p);
              p.fadeIn();
            }
          });

          if (p.parent().hasClass("notcomp")) {
            var status = 1;
          } else if (p.parent().hasClass("comp")) {
            var status = 0;
          }

          var todo_id = $(this).parent().attr("id");
          console.log(status);
          console.log(todo_id);

          //update task status
          var url = "/todo/" + category_id;
          console.log(url);
          fetch(url, {
            method: "PUT",
            body: JSON.stringify({
              todo_id: todo_id,
              status: status,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then(function (type) {
              return type.json();
            })
            .then(function (result) {
              console.log(result);
            });
        });
        
        var id = 1;
        var isClicked = true;

        //calendar
        console.log(id);
        var cal = "<span style='display:none;'><input style='margin-left: 10px;' type='text' id='from_"+id+"'><span> ~ </span><input type='text' id='to_"+id+"'></span>";

        var calendar = $(`<span id='cal_${id}'><i class='far fa-calendar-alt'></i></span>`).click(function(){

          var arr = $(this).attr("id").split("_");
          var p = $("#from_"+arr[1]).parent();
          p.toggle();

          var style = p.attr("style");

          if(style.toString().includes('none')) {
            $("#from_"+arr[1]).val("");
            $("#to_"+arr[1]).val("");
          }
        });

        //star
        var star = $(`<span id='star_${id}'><i class='far fa-star'></i></span>`).click(function(){
          var p = $(this).parent();

          if(isClicked) {
            $(this).children(".fa-star").removeClass("far fa-star").addClass("fas fa-star");
            p.css('background', '#371F54');
            isClicked = false;
            console.log(isClicked);
            var important = 0;
            console.log(important);

          } else {
            $(this).children(".fa-star").removeClass("fas fa-star").addClass("far fa-star");
            p.css('background', '#81589f9d');
            isClicked = true;
            console.log(isClicked);
            var important = 1;
            console.log(important);
          }

          var todo_id = p.attr("id");
          console.log(p);
          console.log(important);
          console.log(todo_id);

          //update task status
          var url = "/todo/" + category_id;
          console.log(url);
          fetch(url, {
            method: "PUT",
            body: JSON.stringify({
              todo_id: todo_id,
              important: important,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then(function (type) {
              return type.json();
            })
            .then(function (result) {
              console.log(result);
            });
        });

        // del, check append
        task.append(del,check,star,cal,calendar);

        // append to notcomplete task
        $(".notcomp").append(task);
        //to clear the input
        $(".txtb").val("");

        fn_init(id);

        id++;

      });    
  }
});


//edit_todo_content
//todo_initial_content
function todo_initial_content(value) {
  initial_content = value.replace(/~/g, '');
  console.log(initial_content);
}

//todo_edited_content
function todo_edited_content(value) {
  var edited_content = value.replace(/~/g, ''); 
  console.log(edited_content);
  console.log(initial_content);

    if (edited_content !== initial_content) {
      console.log("New data when content change.");
      var todo_id = $(this).attr("id");
      console.log(todo_id);

      var url = "/todo/" + category_id;

      fetch(url, {
        method: "PUT",
        body: JSON.stringify({
          todo_id: todo_id,
          content: edited_content
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(function (type) {
          return type.json();
        })
        .then(function (result) {
          console.log(result);
        });
    }
}

function fn_init(id) {
  var rangeDate = 31; // set limit day
  var setSdate, setEdate;
  $("#from_"+id).datepicker({
      dateFormat: 'yy-mm-dd',
      minDate: 0,
      onSelect: function(selectDate){
          var stxt = selectDate.split("-");
              stxt[1] = stxt[1] - 1;
          var sdate = new Date(stxt[0], stxt[1], stxt[2]);
          var edate = new Date(stxt[0], stxt[1], stxt[2]);
              edate.setDate(sdate.getDate() + rangeDate);
          $('#to_'+id).datepicker('option', {
              minDate: selectDate,
              beforeShow : function () {
                  $("#to_"+id).datepicker( "option", "maxDate", edate );
                  setSdate = selectDate;
                  //console.log(setSdate)
          }});
          //to 설정
      }
      //from 선택되었을 때
  });
  $("#to_"+id).datepicker({
      dateFormat: 'yy-mm-dd',
      onSelect : function(selectDate){
          setEdate = selectDate;
          //console.log(setEdate)
      }
  });
}


// check 선언
// click -> update task status -> PUT
var check = $("<i class='fas fa-check'></i>").click(function () {
  var p = $(this).parent();
  p.fadeOut(function () {
    if (p.parent().hasClass("notcomp")) {
      $(".comp").append(p);
      p.fadeIn();
    } else if (p.parent().hasClass("comp")) {
      $(".notcomp").append(p);
      p.fadeIn();
    }
  });

  if (p.parent().hasClass("notcomp")) {
    var status = 1;
  } else if (p.parent().hasClass("comp")) {
    var status = 0;
  }

  var todo_id = $(this).parent().attr("id");
  console.log(status);
  console.log(todo_id);

  //update task status
  var url = "/todo/" + category_id;
  console.log(url);
  fetch(url, {
    method: "PUT",
    body: JSON.stringify({
      todo_id: todo_id,
      status: status,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (type) {
      return type.json();
    })
    .then(function (result) {
      console.log(result);
    });
});


// del 선언
// click -> delete task -> DELETE
var del = $("<i class='fas fa-trash-alt'></i>").click(function () {
  var p = $(this).parent();
  p.fadeOut(function () {
    p.remove();
  });

  //delete db
  var todo_id = $(this).parent().attr("id");
  console.log(todo_id);
  url = "/todo/" + category_id;

  fetch(url, {
    method: "DELETE",
    body: JSON.stringify({
      todo_id: todo_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (type) {
      return type.json();
    })
    .then(function (result) {
      console.log(result);
    });
});

// star 선언
var star = $(`<span id='star_${id}'><i class='far fa-star'></i></span>`).click(function(){
  var p = $(this).parent();

  if(isClicked) {
    $(this).children(".fa-star").removeClass("far fa-star").addClass("fas fa-star");
    p.css('background', '#371F54');
    isClicked = false;
    console.log(isClicked);
    var important = 0;
    console.log(important);

  } else {
    $(this).children(".fa-star").removeClass("fas fa-star").addClass("far fa-star");
    p.css('background', '#81589f9d');
    isClicked = true;
    console.log(isClicked);
    var important = 1;
    console.log(important);
  }

  var todo_id = p.attr("id");
  console.log(p);
  console.log(important);
  console.log(todo_id);

  //update task status
  var url = "/todo/" + category_id;
  console.log(url);
  fetch(url, {
    method: "PUT",
    body: JSON.stringify({
      todo_id: todo_id,
      important: important,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (type) {
      return type.json();
    })
    .then(function (result) {
      console.log(result);
    });
});