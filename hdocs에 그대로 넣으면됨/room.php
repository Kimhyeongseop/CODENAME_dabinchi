<?php
session_start();
$conn = mysqli_connect("127.0.0.1", "root", "sksmssksms", "davinchi_code");
$room_name = $_GET[roomname];
$user_name= $_SESSION[id];
$_SESSION[room]=$room_name;
$_master= $_GET[master];


//user의 방 참여상태를 바꾸는 과정 => q2,q3
$query2 = "select name from davinchi_code.user where id = '$user_name'";
$result2 = mysqli_query($conn,$query2);
$data2= mysqli_fetch_array($result2);


$query3 = "UPDATE  davinchi_code.user
set waiting_room_room_name='$room_name'
WHERE name='$data2[name]'";
$result3 = mysqli_query($conn,$query3);
if($result3){
    echo"success";
}
else{
    echo"fail";
}


$query = "select name from davinchi_code.user where waiting_room_room_name = '$room_name'";
$result = mysqli_query($conn,$query);
while($data=mysqli_fetch_array($result)) {
    echo "<td> $data[name]</td>";
}

echo"
<a href = 'http://192.249.19.252:3080?name=$user_name&room=$room_name'>empas</a>";
echo"<script>location.href='http://192.249.19.252:3080?name=$data2[name]&room=$room_name&master=$_master';</script>";
?>