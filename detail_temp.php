<!DOCTYPE html>
<html lang="ko">
<script src="index.js"></script>
<script src="/socket.io/socket.io.js"></script>

<head>
    <meta charset="UTF-8">
	<link type="text/css" rel="stylesheet" href="//code.jquery.com/ui/1.12.0/themes/base/jquery-ui.css">
	<link type="text/css" rel="stylesheet" href="/asset/stylesheets/colorpicker.css" />
	<style type="text/css">
	<!--
		* {margin:0px; padding:0px; font-size:12px; box-sizing:border-box; -webkit-box-sizing:border-box; -moz-box-sizing:border-box;}
		html, body {width:100%; height:100%;}
	-->
	</style>
	<script type="text/javascript" charset="UTF-8" src="https://code.jquery.com/jquery-1.12.4.js"></script>
	<script type="text/javascript" charset="UTF-8" src="https://code.jquery.com/ui/1.12.0/jquery-ui.js"></script>
	<script type="text/javascript" charset="UTF-8" src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.3/socket.io.js"></script>
	<script type="text/javascript" charset="UTF-8" src="/asset/javascripts/colorpicker.js"></script>
	<script type="text/javascript" charset="UTF-8" src="https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js"></script>
</head>
<body>


<style type="text/css">
<!--
canvas {cursor: crosshair;}
#color-picker {position:relative; width:36px; height:36px; background:url(/asset/images/select.png);}
#color-picker div {position:absolute; top:3px; left:3px; width:30px; height:30px; background:url(/asset/images/select.png) #000000 center;}
#stroke-size {width:36px;}
#stroke-size > span {width:100%; display:inline-block; text-align:right;}
#play-button > input[type=button] {width:50px; height:50px; color:#ffffff; font-weight:bold; background-color:#ff0000; border-radius:50%; -moz-border-radius:50%; -webkit-border-radius:50%; box-shadow:none; border-width:0px; cursor:pointer;}
#play-button > input[type=button]:hover {background-color:#0000ff;}
-->
</style>

<table style="width:1000px; margin:0 auto; border-collapse:collapse;">
	<colgroup>
		<col width="80%" />
		<col width="20%" />
	</colgroup>
	<tbody>
		<tr>
			<th id="room-title" style="height:30px; line-height:30px; background-color:#eeeeee; border:1px solid #cccccc;"></th>
			<th style="height:30px; line-height:30px; background-color:#eeeeee; border:1px solid #cccccc;">플레이어 (<span id="player-count">0</span>명)</th>
		</tr>
		<tr>
			<td rowspan="5" style="height:800px; border:1px solid #cccccc;">
				<div style="position:relative;">
					<div class="overlay-guest" style="display:none; position:absolute; top:0px; left:0px; z-index:999; width:100%; height:100%; background:rgba(255,255,255,0);"></div>
					<div id="answer" style="display:none; position:absolute; top:0px; left:50%; margin-left:-150px; width:300px; height:100px; line-height:100px; text-align:center; font-size:20px; font-weight:bold;"></div>
					<canvas id="draw-tool" width="800" height="800"></canvas>

					<div class="draw-utility" style="position:absolute; top:20px; left:20px;">
						<div id="stroke-size">
							<!--<span>1</span>-->
							<div></div>
						</div>
					</div>

					<div class="draw-utility" style="position:absolute; top:50px; left:20px;">
						<div id="color-picker">
							<div></div>
						</div>
					</div>

					<div class="draw-utility" style="position:absolute; top:100px; left:20px;">
						<span id="eraser", onclick="getEraser();" style="cursor:pointer;">ERASER</span>
					</div>

					<div class="draw-utility" style="position:absolute; top:130px; left:20px;">
						<span id="clear", onclick="getClear()" style="cursor:pointer;">CLEAR</span>
					</div>

					<div id="play-button" style="display:none; position:absolute; top:20px; right:20px;">
                        <input id="play" type="button" value="PLAY" onclick="playGame(3)"/>
					</div>
				</div>
			</td>
			<td style="height:170px; border:1px solid #cccccc; vertical-align:top;">
				<div id="player-list" style="width:100%; height:170px; overflow-y:scroll;"></div>
			</td>
		</tr>
		<tr>
			<th style="height:30px; line-height:30px; background-color:#eeeeee; border:1px solid #cccccc;">채팅</th>
		</tr>
		<tr>
            <td style="height:510px; border:1px solid #cccccc; vertical-align:top;">
                <div id="chatting-list" style="width:100%; height:510px; overflow-y:scroll;"></div>
            </td>
		</tr>
		<tr>
            <td style="height:30px; border:1px solid #cccccc; vertical-align:top;">
                <input type="text" id="message" style="width:100%; height:30px; line-height:30px; border-width:0px;"  />
            </td>
		</tr>
		<tr>
            <td style="height:30px; border:1px solid #cccccc; vertical-align:top;">
                <input type="button" id="message-button" value="보내기" onclick="sendMessage();" style="width:100%; height:30px; border-width:0px; cursor:pointer;" />
                <input type="button" id="message-none" value="출제자는 사용금지" style="display:none; width:100%; height:30px; border-width:0px; cursor:default; color:#999999;" />
            </td>
		</tr>
	</tbody>
</table>

<div id="countdown" style="display:none; position:absolute; top:0px; left:0px; width:100%; height:100%; z-index:999; background:rgba(0,0,0,0.3);">
	<div style="position:absolute; top:50%; left:50%; margin-left:-75px; margin-top:-75px; width:150px; height:133px; line-height:150px; color:#ff0000; font-size:150px; font-weight:bold; text-align:center;">3</div>
</div>

</body>
</html>