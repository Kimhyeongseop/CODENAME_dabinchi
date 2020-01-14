<?php
$username = $_POST["username"];
$userid = $_POST["userid"];
$password = $_POST["password"];

$email = $_POST["email"];

$dateString = date("Y-m-d", time());
$conn = mysqli_connect("127.0.0.1", "root", "sksmssksms", "davinchi_code");

$query= "INSERT INTO davinchi_code.user(id,name,password,win,lose,leader,waiting_room_room_name) VALUES ('$userid', '$username', '$password', 0,0,'no','미접속')";
$result = mysqli_query($conn,$query);
if($result){
    include '회원가입 완료.html';
}
else{
    echo "실패";
}
?>