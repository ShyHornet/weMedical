<?php
namespace Admin\Controller;
use Think\Controller;
use Think\Model;
class IndexController extends Controller {
  public function getOrders($order){
    $orders = M('order');
  $list = array();
  if ($order=="asc"){
      $orderStr = array('order_id'=>'asc');
  }else{
    $orderStr = array('order_id'=>'desc');
  }
  //$fields = array('doctor_id','name','title','department','specialism','order_cost' =>'cost','orders_per_day','treatment_period' =>'period','work_days','intro');
   $list= $orders->order($orderStr)->select();

   if (count($list)==0) {
     echo null;
     return;
   }
  echo json_encode($list);
  }
  public function delOrder($id){
    $order = M('Order');
  foreach ($id as $key => $value) {
    $order->where('order_id='.$value)->delete();

  }
  echo json_encode(array("status"=>"success"));
}
  public function getFeedbacks($order){
    $feedback = M('Feedback');
  $list = array();
  if ($order=="asc"){
      $orderStr = array('feedback_id'=>'asc');
  }else{
    $orderStr = array('feedback_id'=>'desc');
  }
  //$fields = array('doctor_id','name','title','department','specialism','order_cost' =>'cost','orders_per_day','treatment_period' =>'period','work_days','intro');
   $list= $feedback->order($orderStr)->select();

   if (count($list)==0) {
     echo null;
     return;
   }
  echo json_encode($list);
  }
  public function delFeedbacks($id){
    $feedback = M('feedback');
  foreach ($id as $key => $value) {
    $feedback->where('feedback_id='.$value)->delete();

  }
  echo json_encode(array("status"=>"success"));
  }
  public function getPatients($order){
    $pat = M('Patient');
  $list = array();
  if ($order=="asc"){
      $orderStr = array('patient_id'=>'asc');
  }else{
    $orderStr = array('patient_id'=>'desc');
  }
  //$fields = array('doctor_id','name','title','department','specialism','order_cost' =>'cost','orders_per_day','treatment_period' =>'period','work_days','intro');
   $list= $pat->order($orderStr)->select();

   if (count($list)==0) {
     echo null;
     return;
   }
  echo json_encode($list);
  }
  public function getHelpInfo(){
    $helpInfos = array();
    for ($i=0; $i <=4; $i++) {
      $helpInfos[] = file_get_contents(T('Public/helpInfo'.$i));
    }
    echo json_encode($helpInfos);
  }
  public function updateHelpInfo($data){
    foreach ($data as $key => $value) {

      file_put_contents('./Application/Admin/View/Public/helpInfo'.$key.'.html',$value);

    }
    echo 0;
  }
  public function getHospitalImg(){
    $content = file_get_contents('./Application/Admin/View/Public/hospitalImg.json');
    echo $content;
  }
    public function updateHospitalImg($data){

        if (!file_put_contents('./Application/Admin/View/Public/hospitalImg.json',json_encode($data))){
          echo 1;
        }else {
          echo 0;
        }

    }
  public function updateHospitalIntro($content){

    if (!file_put_contents(T('Public/hospitalIntro'), $_POST['content'])){
      echo 1;
    }else {
      echo 0;
    }

    // file_put_contents(WEB_PUBLIC_URL.'/hospitalIntro.html',$content);
  }
  public function getHospitalIntro(){
    $content = file_get_contents(T('Public/hospitalIntro'));
  echo $content;

    // file_put_contents(WEB_PUBLIC_URL.'/hospitalIntro.html',$content);
  }
  public function getNotices($order){
    $notice = M('Notice');
  $list = array();
  if ($order=="asc"){
      $orderStr = array('order','notice_id'=>'asc');
  }else{
    $orderStr = array('order','notice_id'=>'desc');
  }
  //$fields = array('doctor_id','name','title','department','specialism','order_cost' =>'cost','orders_per_day','treatment_period' =>'period','work_days','intro');
   $list= $notice->order('notice_id')->select();

   if (count($list)==0) {
     echo null;
     return;
   }
  echo json_encode($list);
  }
  public function addNotice(){
    $not = M("Notice");
    if ($not->create()) {

        if ($not->add()) {
              $this->success("发布成功!");

        } else {
              $this->error("发布失败!");

        }
    } else {
        exit($this->error($not->getError()));
    }


  }
  public function delNotice($id){
    $not = M('Notice');
  foreach ($id as $key => $value) {
    $not->where('notice_id='.$value)->delete();

  }
  echo json_encode(array("status"=>"success"));
}
    public function getAllDocs($order){
      $doc =new \Doctor\Model\DoctorModel("Doctor");
      // echo $week;
      $orderStr = array();
      if ($order=="asc"){
          $orderStr = array('order','doctor_id'=>'asc');
      }else{
        $orderStr = array('order','doctor_id'=>'desc');
      }
      //$fields = array('doctor_id','name','title','department','specialism','order_cost' =>'cost','orders_per_day','treatment_period' =>'period','work_days','intro');
       $list= $doc->order('doctor_id')->select();

       if (count($list)==0) {
         echo null;
         return;
       }
      echo json_encode($list);
    }
    public function updateDoc(){
      $dptSets =array(
      	"心血管内科","呼吸内科", "神经内科", "肾病内科", "消化内科","血液病内科","内分泌内科","普通外科","肝胆外科","胃肠外科","痔漏外科","心脏外科","骨头外科","神经外科","泌尿外科","整形外科","烧伤外科","妇科","产科","辅助生殖","儿科","眼科","口腔科","耳鼻喉科","皮肤科",
      	"中西医结合科","传染科"
      	);
      	$titles =array("副主治医师","主治医师","副主任医师","主任医师");
        //数据转换
        if (isset($_POST['title'])) {

              $_POST['title'] = $titles[$_POST['title']];
        }
        if (isset($_POST['department'])) {

            $_POST['department'] =   $dptSets[$_POST['department']];
        }

      $doc = M("Doctor");
      if($doc->create($_POST,Model::MODEL_UPDATE)){
            $doc->save(); // 写入数据到数据库
            // 如果主键是自动增长型 成功后返回值就是最新插入的值
            //返回更新成功和更新医生信息的医生id
            echo json_encode(array('status'=>'success'));

        }else{
           echo json_encode(array('status'=>'failed'));
        }



    }
    public function addDoc(){
      $dptSets =array(
        "心血管内科","呼吸内科", "神经内科", "肾病内科", "消化内科","血液病内科","内分泌内科","普通外科","肝胆外科","胃肠外科","痔漏外科","心脏外科","骨头外科","神经外科","泌尿外科","整形外科","烧伤外科","妇科","产科","辅助生殖","儿科","眼科","口腔科","耳鼻喉科","皮肤科",
        "中西医结合科","传染科"
        );
        $titles =array("副主治医师","主治医师","副主任医师","主任医师");
      $doc = M("Doctor");
      if ($doc->create()) {

          if ($doc->add()) {
                $this->success("注册成功!");

          } else {
                $this->error("注册失败!");

          }
      } else {
          exit($this->error($Patient->getError()));
      }


    }
    public function delDoc($id){
        $doc = M('Doctor');
        $orders = M("Order");
      foreach ($id as $key => $value) {
        $orders->where('doctor_id='.$value)->delete();
        $doc->delete($value);

      }
      echo json_encode(array("status"=>"success"));
    //  $doc->delete($id);
      //连带删除其预约单

      //$orders->where('doctor_id='.$id)->delete();
    }
    //七牛上传凭证
    public function uptoken(){
      Vendor('Qiniu.Auth');
        Vendor('Qiniu.Config');
        Vendor('Qiniu.functions');
        Vendor('Qiniu.Http.Client');
        Vendor('Qiniu.Http.Request');
        Vendor('Qiniu.Http.Response');
        Vendor('Qiniu.Storage.BucketManager');
        Vendor('Qiniu.Storage.UploadManager');
    header('Access-Control-Allow-Origin:*');
      $bucket = 'wemedical';
      $accessKey = 'aAul9IYjjVq6TWfsOLzuwY72bssajGYhGsK-WUVT';
      $secretKey = 'BwB5L-W2VKFo_HnWPM6CsrsSO_WvxUK8QD6WwHWI';
      $auth = new  \Qiniu\Auth($accessKey, $secretKey);
      $policy = array(
         "saveKey"=>'$(x:fname)',
    // 'returnUrl' => 'http://localhost/wemedical-admin/',
    'returnBody' => '{"fname":$(x:fname), "key": $(key), "hash": $(etag), "w": $(imageInfo.width), "h": $(imageInfo.height)}'
     );
      $upToken = $auth->uploadToken($bucket,null,3600,$policy);
    //$upToken = $auth->uploadToken($bucket);
        echo  json_encode(array('uptoken'=>$upToken));
    }
    //七牛删除图片
    public function delImg($key){
      Vendor('Qiniu.Auth');
        Vendor('Qiniu.Config');
        Vendor('Qiniu.functions');
        Vendor('Qiniu.Http.Client');
        Vendor('Qiniu.Http.Request');
        Vendor('Qiniu.Http.Error');
        Vendor('Qiniu.Http.Response');
        Vendor('Qiniu.Storage.BucketManager');
        Vendor('Qiniu.Storage.UploadManager');
        header('Content-Type:   application/x-www-form-urlencoded');
      $bucket = 'wemedical';
      $accessKey = 'aAul9IYjjVq6TWfsOLzuwY72bssajGYhGsK-WUVT';
      $secretKey = 'BwB5L-W2VKFo_HnWPM6CsrsSO_WvxUK8QD6WwHWI';
      $auth = new  \Qiniu\Auth($accessKey, $secretKey);
      $BucketManage = new \Qiniu\Storage\BucketManager($auth);
      echo $BucketManage->delete('wemedical',$key);
    //$upToken = $auth->uploadToken($bucket);
    }
}
