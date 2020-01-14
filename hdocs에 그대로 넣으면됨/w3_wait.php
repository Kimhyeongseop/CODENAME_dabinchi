<?php

session_start();
$userid = $_POST["id"];
$_SESSION[id]=$userid;
$password = $_POST["password"];

$conn = mysqli_connect("127.0.0.1", "root", "sksmssksms", "davinchi_code");

$query = "select password from davinchi_code.user where id = '$userid'";
$result = mysqli_query($conn,$query);
$data = mysqli_fetch_array($result);
$admin_pass = $data["password"];


$query2 = "select name from davinchi_code.user where id = '$userid'";
$result2 = mysqli_query($conn,$query2);
$data2 = mysqli_fetch_array($result2);



echo"
<html ng-app=\"myApp\">

<head>
    <meta charset=\"utf-8\">
    <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css\" integrity=\"sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7\" crossorigin=\"anonymous\">

    <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css\" integrity=\"sha384-fLW2N01lMqjakBkx3l/M9EahuwpSfeNvV63J5ezn3uZzapT0u7EYsXMjQV+0En5r\" crossorigin=\"anonymous\">

    <title>User Page</title>
</head>


<body style=\"background-image: url(bg4.PNG); background-size: 2000px 1400px;\"  >

<div style=\" height:80px; background-color:#333333\">
    <img src =\"/img/w3_1_title.PNG\" width = \"160\" height = \"80\" align =\"left\"></div>
";

if ($password == $admin_pass) {
    echo "<center><br>";

    echo"
    <center>
    <table border='3' width='1000' bgcolor=\"white\">
    <tr  height='40' bgcolor='#6495ed'>
        <td width='300' align='center' colspan='2'><B><font size='5' face='HY목각파임B'>내정보</font></B></td>
        <td width='700' align='center' colspan='3'><B><font size='5' face='HY목각파임B'>방 생성</font></B></td>
    </tr>
    <tr align='center'>
        <td rowspan='3' width='120'><br><img src='chra.PNG' width = \"100\" height = \"100\"> <br>";

    echo $data2["name"];

    echo"
        유저님</td>
        ";
    echo"
        <form method='get' action='make.php'>
        <td rowspan='3'>정보</td>
        <td align='center'><font color='black' > 방제목: </font><input type='text' name='title' maxlength='40' width='200'></td></tr>
        <tr align='center'><td> <font color='black'  >인원: 2</font><input type='radio' value='2' name='num'><font color='black'> 3 </font><input type='radio' value='3' name='num'><font color='black'>4 </font><input type='radio' value='4' name='num'><font color='black'>5 </font><input type='radio' value='5' name='num'><font color='black'>6 </font><input type='radio' value='6' name='num'></td></tr>        
        <tr align='center' width='100'><td><button  type=\"submit\">생성</button></td></tr>
        
    </tr>
    </form>
    </table>
    <br><br>
    </center>";

    $query3= "select * from davinchi_code.waiting_room";
    $result3= mysqli_query($conn,$query3); // 방목록 db에서 하나씩 가져오는 query


    echo "<center>";
    echo"<table border='5' width=\"1000\" >";
    echo "<tr  height='40' bgcolor='#6495ed'>
        <td colspan=\"3\" align='center'><B><font size='5' face='HY목각파임B'>방목록</font></B></td>
        </tr>
        ";

    while($data3=mysqli_fetch_array($result3)){

        $query4= "select count(*) as num from davinchi_code.user where waiting_room_room_name= '$data3[room_name]' ";
        $result4= mysqli_query($conn,$query4); // 어떤방의 인원수 세기
        $data4=mysqli_fetch_array($result4);


        echo "<tr height='25' bgcolor='#f0f8ff'>";
        echo "<td>$data3[room_name]</td>";
        echo "<td width='100' align='middle'>인원:$data4[num] / $data3[max_num]</td>";
        echo "<form action='room.php'>";

        //echo "<td align='center'> <button class='btn btn-primary' type='submit'>참가</button> </td>";
        echo "<td width='70' align='middle'> <a href='/room.php?roomname=$data3[room_name]&name=$userid&master=1'>참가</a></td>";
        echo "</form>";
        echo "</tr>";
    }

    echo"</table>"; // 방목록 table


    echo "</center>";

}

else{
    echo "<script language='javascript'>alert('Check your ID or Password');history.go(-1);</script>";
}



?>