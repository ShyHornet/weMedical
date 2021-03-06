init()
//初始化store.js
    function init() {
        if (!store.enabled) {
            alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.')
            return
        }
        // ... and so on ...
    }
//短信验证码发送&倒计时
var wait=60;
function textCountDown(){
  if (wait == 60){
    sendTextVCode();
  }
if (wait == 0){
  $.removeCookie('vcode',{path:'/'});
 $("#vcode").removeAttr("disabled");
  $("#vcode").html("点击获取");
  wait = 60;
}else {
  if ($("#phone_num").val() == '') {
    return;

  }
   $("#vcode").attr("disabled",true);
   $("#vcode").html("重新发送("+ wait + ")");
  wait--;
  console.log(wait);
  setTimeout(function(){
    textCountDown()
  },1000);
}

}
//发送短信验证码
function sendTextVCode(){
  var code = '';
  var phone_num = '';
  $.cookie('vcode',Math.floor(Math.random() * (999999 - 111111) + 111111),{expires:7,path:'/'});
  var vcode = $.cookie('vcode');
  console.log(vcode);
  phone_num = $("#phone").val();
  if (phone_num == ''){      //判断手机号是否填写
  //    $("#phone_num").parent(".form-group").addClass("has-error");
  // $("#phone_num").parent(".form-group").removeClass("has-error");
     return;
}

      //  $("#phone_num").parent(".form-group").removeClass("has-error", 2000, "easeOut");

  var base_url = "http://apis.baidu.com/kingtto_media/106sms/106sms";
  //基础url
  var header = {"apikey":"08174a006a0fcb9c4b00a704a0253a2d"};
  //设置http-get请求头部
   var content = "【微信挂号平台】感谢您注册微信挂号平台，请在一分钟内输入您的验证码！验证码: "+ vcode;
  var data = {
    "mobile":phone_num,
    "tag":2,
    "content":content,
    }
    //配置数据


$.ajax({
  type: "GET",
   url:base_url,
   data:data,
   beforeSend: function(XMLHttpRequest) {
         XMLHttpRequest.setRequestHeader("apikey","08174a006a0fcb9c4b00a704a0253a2d");
       },
   success:function(data){
     var json = $.parseJSON(data);
     if (json.returnstatus=="Success") {
       //验证码已发送提示
       $("body").showbanner({
          title : "验证短信已经发送",
          handle : false,
          content : "请输入短信验证码!"
          });

     }else{
      //验证码发送失败
      $("body").showbanner({
         title : "验证短信发送失败",
         handle : false,
         content : "抱歉，我们发生了系统错误!请重试!"
         });

     }
   }

})



}
//验证短信验证码是否正确
function veriCode(code){
  $("#vcodeAlert").hide();
  if (code == ''){
     $("#vcodeAlert").removeClass("alert-success").addClass("alert-danger").html("验证码不能为空").show();
      return;
  }

  var vcode = $.cookie('vcode');
    if (code == vcode ) {//验证成功
      //将页面中隐藏的短信验证成功的标志置为1
      $("#vcode_status").val("1");

      $("#vcodeAlert").addClass("alert-success").html("短信验证成功").show();
    }else{
    $("#vcodeAlert").addClass("alert-danger").html("短信验证码错误").show();

    }



}
///
///预约挂号模块
///

function buildDocPanle(docInfoArray,pageNum,tumbImgUrl,date,week){
  var name = docInfoArray['name'];
  var title = docInfoArray['title'];
  var department = docInfoArray['department'];
  var specialism = docInfoArray['specialism'];
  var doctor_id = docInfoArray['doctor_id'];
  var orders = docInfoArray['Order'];
  var remain_orders = docInfoArray['orders_per_day'];
  orders.forEach(function(element, index, array){
       if (element['date']==date) {
         remain_orders--;
       }

  })
  var weekStr=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
  //var intro = array['intro'];
  //var register_remains = array['register_remains'];
  var cost = docInfoArray['cost'];
var period = docInfoArray['period']==0?"8:30~12:00":"14:30~18:00";
  var panel_top = "<div class=\"panel_top\">"+
                  "<span class=\"p_l\">"+name+"</span>"+
                  "<span class=\"p_r\">"+title+"</span>"+
                  "</div>";
  var panel_middle_s1 = "<div class=\"panel_middle\"><div class=\"hd\">"+
                         "<img src=\""+tumbImgUrl+"\" alt=\"\" /></div>"+
                         "<div class=\"bd\">"+
                         "<p><b>科室: </b>"+department+"</p>"+
                         "<p><b>专长: </b>"+specialism+"</p>"+
                         "<p><btn class=\"show_intro btn btn-xs btn-primary btn-embossed\" data-toggle=\"collapse\" data-target=\"#panle-collapse-"+pageNum+"\">"+
                         "查看简介</btn><span class=\"btn btn-xs btn-success btn-embossed\" style=\"margin-left:25px;\">剩余号源:"+remain_orders+"</span></p></div></div>";
  var panel_middle_s2 = "<div class=\"collapse intro\" id=\"panle-collapse-"+pageNum+"\" data-id=\""+doctor_id+"\">"+
                           "<div class=\"panel_middle_section\"></div></div>";
  var panel_bottom = "<div class=\"panel_bottom\">"+
                      "<p >"+
                      "<span class=\"p_l\">挂号费用:"+cost+"￥</span>"+
                      "<span class=\"p_r\"><button class=\"btn btn-xs btn-success btn-embossed\"  id=\"order_btn"+doctor_id+"\" data-toggle=\"modal\" data-target=\"#order_confirm\" data-id=\""+doctor_id+"\" data-date=\""+date+"\" data-name=\""+name+"\" data-title=\""+title+"\" data-dept=\""+department+"\" data data-cost=\""+cost+" ￥\" data-period=\""+period+"\" data-week=\""+weekStr[week]+"\">立即预约</button></span></p></div></div></div>";
    var str = "<div class=\"panel\" >"+panel_top+panel_middle_s1+panel_middle_s2+panel_bottom+"</div>";
    return str;


}
function showIntroPanle(contentToFill,showIntroLink){
  if (contentToFill.html().trim()==""){
      contentToFill.html("");
    contentToFill.html("<span style=\"margin-left:90%;\"  class=\"fui-cross-circle panle-collapse-close\"  aria-hidden=\"false\"></span><br><a>简介</a>");
    var id   = showIntroLink.attr("data-id");
    console.log(id);
    var docIntro = "docIntro"+id+"";
    //如果存在本地缓存
    if (store.get("docIntro"+id+"")) {
        var intro = $.parseJSON(store.get("docIntro"+id+""));
        contentToFill.append("<p>"+intro['intro']+"</p>");
        contentToFill.append("<a>医生出诊时间:</a><p>"+convertPeriod(intro['period'])+"</p>");
        contentToFill.append("<p>"+convertWorkDay(intro['work_days'])+"出诊。"+"</p>");
    }else{
      //不存在本地缓存就去服务器抓取
    $.getJSON("Patient-Appointment-getIntro",{id:id},function(json){
     if (json[0]) {
         contentToFill.append("<p>"+json[0]['intro']+"</p>");
         contentToFill.append("<a>医生出诊时间:</a><p>"+convertPeriod(json[0]['period'])+"</p>");
         contentToFill.append("<p>"+convertWorkDay(json[0]['work_days'])+"出诊。"+"</p>");
         store.set(docIntro, JSON.stringify(json[0]));
       }else {
         return;
       }

    });

   $(".panle-collapse-close").click(function(){
     //用于关闭预约面板的中间页
        $(this).parent(".panel_middle_section").parent(".collapse").collapse('hide');
    });

    }
    if (localStorage.length >=100) {
      //缓存条数多于100条清除
      store.clear();

    }
  }
}
function convertPeriod(period){
  var period_convert = "";
  if(period=="0"){
    period_convert = "8:30~12:00";
  }else{
     period_convert = "14:30~18:00";

  }
  return period_convert;
}
function convertWorkDay(work_days){
  var work_days_trans = "每星期";
  for (var i = 0; i < work_days.length; i++) {

      switch (work_days[i]) {
        case '1':work_days_trans+="一、";
        break;
        case '2':work_days_trans+="二、";
        break;
        case '3':work_days_trans+="三、";
        break;
        case '4':work_days_trans+="四、";
        break;
        case '5':work_days_trans+="五、 ";
          break;
        default:break;

        }
      }
      return  work_days_trans.substring(0,work_days_trans.length-1);
  }
  //我的预约模块

(function () {
    'use strict';
    if (window && window.addEventListener) {
        var cache = Object.create(null); // holds xhr objects to prevent multiple requests
        var checkUseElems,
            tid; // timeout id
        var debouncedCheck = function () {
            clearTimeout(tid);
            tid = setTimeout(checkUseElems, 100);
        };
        var unobserveChanges = function () {
            return;
        };
        var observeChanges = function () {
            var observer;
            window.addEventListener('resize', debouncedCheck, false);
            window.addEventListener('orientationchange', debouncedCheck, false);
            if (window.MutationObserver) {
                observer = new MutationObserver(debouncedCheck);
                observer.observe(document.documentElement, {
                    childList: true,
                    subtree: true,
                    attributes: true
                });
                unobserveChanges = function () {
                    try {
                        observer.disconnect();
                        window.removeEventListener('resize', debouncedCheck, false);
                        window.removeEventListener('orientationchange', debouncedCheck, false);
                    } catch (ignore) {}
                };
            } else {
                document.documentElement.addEventListener('DOMSubtreeModified', debouncedCheck, false);
                unobserveChanges = function () {
                    document.documentElement.removeEventListener('DOMSubtreeModified', debouncedCheck, false);
                    window.removeEventListener('resize', debouncedCheck, false);
                    window.removeEventListener('orientationchange', debouncedCheck, false);
                };
            }
        };
        var xlinkNS = 'http://www.w3.org/1999/xlink';
        checkUseElems = function () {
            var base,
                bcr,
                fallback = '', // optional fallback URL in case no base path to SVG file was given and no symbol definition was found.
                hash,
                i,
                Request,
                inProgressCount = 0,
                isHidden,
                url,
                uses,
                xhr;
            if (window.XMLHttpRequest) {
                Request = new XMLHttpRequest();
                if (Request.withCredentials !== undefined) {
                    Request = XMLHttpRequest;
                } else {
                    Request = XDomainRequest || undefined;
                }
            }
            if (Request === undefined) {
                return;
            }
            function observeIfDone() {
                // If done with making changes, start watching for chagnes in DOM again
                inProgressCount -= 1;
                if (inProgressCount === 0) { // if all xhrs were resolved
                    observeChanges(); // watch for changes to DOM
                }
            }
            function attrUpdateFunc(spec) {
                return function () {
                    if (cache[spec.base] !== true) {
                        spec.useEl.setAttributeNS(xlinkNS, 'xlink:href', '#' + spec.hash);
                    }
                };
            }
            function onloadFunc(xhr) {
                return function () {
                    var body = document.body;
                    var x = document.createElement('x');
                    var svg;
                    xhr.onload = null;
                    x.innerHTML = xhr.responseText;
                    svg = x.getElementsByTagName('svg')[0];
                    if (svg) {
                        svg.setAttribute('aria-hidden', 'true');
                        svg.style.position = 'absolute';
                        svg.style.width = 0;
                        svg.style.height = 0;
                        svg.style.overflow = 'hidden';
                        body.insertBefore(svg, body.firstChild);
                    }
                    observeIfDone();
                };
            }
            function onErrorTimeout(xhr) {
                return function () {
                    xhr.onerror = null;
                    xhr.ontimeout = null;
                    observeIfDone();
                };
            }
            unobserveChanges(); // stop watching for changes to DOM
            // find all use elements
            uses = document.getElementsByTagName('use');
            for (i = 0; i < uses.length; i += 1) {
                try {
                    bcr = uses[i].getBoundingClientRect();
                } catch (ignore) {
                    // failed to get bounding rectangle of the use element
                    bcr = false;
                }
                url = uses[i].getAttributeNS(xlinkNS, 'href').split('#');
                base = url[0];
                hash = url[1];
                isHidden = bcr && bcr.left === 0 && bcr.right === 0 && bcr.top === 0 && bcr.bottom === 0;
                if (bcr && bcr.width === 0 && bcr.height === 0 && !isHidden) {
                    // the use element is empty
                    // if there is a reference to an external SVG, try to fetch it
                    // use the optional fallback URL if there is no reference to an external SVG
                    if (fallback && !base.length && hash && !document.getElementById(hash)) {
                        base = fallback;
                    }
                    if (base.length) {
                        // schedule updating xlink:href
                        xhr = cache[base];
                        if (xhr !== true) {
                            // true signifies that prepending the SVG was not required
                            setTimeout(attrUpdateFunc({
                                useEl: uses[i],
                                base: base,
                                hash: hash
                            }), 0);
                        }
                        if (xhr === undefined) {
                            xhr = new Request();
                            cache[base] = xhr;
                            xhr.onload = onloadFunc(xhr);
                            xhr.onerror = onErrorTimeout(xhr);
                            xhr.ontimeout = onErrorTimeout(xhr);
                            xhr.open('GET', base);
                            xhr.send();
                            inProgressCount += 1;
                        }
                    }
                } else {
                    if (!isHidden) {
                        if (cache[base] === undefined) {
                            // remember this URL if the use element was not empty and no request was sent
                            cache[base] = true;
                        } else if (cache[base].onload) {
                            // if it turns out that prepending the SVG is not necessary,
                            // abort the in-progress xhr.
                            cache[base].abort();
                            cache[base].onload = undefined;
                            cache[base] = true;
                        }
                    }
                }
            }
            uses = '';
            inProgressCount += 1;
            observeIfDone();
        };
        // The load event fires when all resources have finished loading, which allows detecting whether SVG use elements are empty.
        window.addEventListener('load', function winLoad() {
            window.removeEventListener('load', winLoad, false); // to prevent memory leaks
            tid = setTimeout(checkUseElems, 0);
        }, false);
    }
}());
