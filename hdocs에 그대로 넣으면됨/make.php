<?php

$title= $_GET[title];
$num= $_GET[num];

$conn = mysqli_connect("127.0.0.1", "root", "sksmssksms", "davinchi_code");
$query = "INSERT INTO davinchi_code.waiting_room(room_name,max_num) VALUES ('$title',$num)";
$result = mysqli_query($conn,$query);


echo"
<script language='JavaScript'>
alert( '방 생성이 완료 되었습니다.' );
</script>
";
if($result){
    echo"<script>location.href='room.php?roomname=$title&name=new';</script>";
}
else{
    echo"실2패";
}






?>