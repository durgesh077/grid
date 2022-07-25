function closeBody(){
	document.getElementsByTagName("title")[0].innerHTML="Please install Metamask"
	let html=`
		<pre id='suggestion'
		style="
		backgroud-color:tomato;
		border:2px solid cyan;
		width:fit-content;
		margin:auto;
		margin-top:5em;
		padding:3em;
		">
		<em
		style="
		font-size:2em;
		backgroud-color:red;
		color:white;
		"
		>Seems You don't have <span style="backgroud-color:purple;color:red;"> Metamask </span> .</em>
			<p style="
				color:white;
				font-family:helvetica;
			">If you are using Chrome please click <a 
			style="color:cyan"
			href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en" > here </a> to download metamask extention and configure you account </p>
				<p style="
				color:white;
				font-family:helvetica;
			">If you are using firefox please click <a 
			style="color:cyan"
			href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/" > here </a> to download metamask extention and configure you account </p>
			<strong style="
			color:yellow;
			">
				For any other browser please refer manual to download metamask.
			</strong>
			<i
			style="color:orange"
			>*View this video to get insight how to install metamask</i>
			<iframe width="560" height="315" src="https://www.youtube.com/embed/Af_lQ1zUnoM" title="YouTube video player" frameborder="5px" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
		</pre>
	`
	document.body.innerHTML=html
	document.body.style.backgroudColor="lightgreen"
}
try{
	ethereum;
}catch(err){
		closeBody();
}