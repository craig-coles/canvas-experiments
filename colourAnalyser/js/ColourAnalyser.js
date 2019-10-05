function ColourAnalyser(options){
	
	var props = {};

	function init(){
	
		props['dropBox'] = document.getElementById(options.el);	
		var resetEl = document.getElementById(options.resetEl);
		
		resetEl.addEventListener('click',reset,false);
		props['dropBox'].addEventListener('dragenter',dragOver,false);
		props['dropBox'].addEventListener('dragleave',dragOut,false);
		props['dropBox'].addEventListener('dragover',noObs,false);
		props['dropBox'].addEventListener('drop',fileDrop,false);
		props['dropBox']['text'] = props['dropBox'].innerHTML;
		positionDropElement();
		window.onresize = positionDropElement;
		
	
	}
	
	function reset(e){
		e.stopPropagation();
		e.preventDefault();
		props.dropBox.innerHTML = props.dropBox.text;
		props.legendDiv.innerHTML = "";
		positionDropElement();
		
	
	}
	
	function noObs(e){
		e.stopPropagation();
		e.preventDefault();
	}
	
	function dragOver(e){
		props['dropBox'].className = "over";
	}
	
	function dragOut(e){
		e.stopPropagation();
		e.preventDefault();
		
		props['dropBox'].className = "";
	}
	
	function positionDropElement(){
		
		props['dropBox'].style.marginTop = (window.innerHeight / 2) - (props['dropBox'].offsetHeight / 2) + "px";
	
	}
	
	function fileDrop(e){
		e.stopPropagation();
		e.preventDefault();
		props['dropBox'].className = "";
		var files = e.dataTransfer.files;
		if(files.length > 0){
			fileTransfer(files);
		}
	
	
	}
	
	function fileTransfer(files){
		var fileReader = new FileReader();
		fileReader.onprogress = fileTransferProgress;
		fileReader.onloadend = fileTransferDone;
		fileReader.readAsDataURL(files[0]);
	
	}
	
	function fileTransferProgress(e){
		
	}
	
	function fileTransferDone(e){
		var img = new Image();
		img.src = e.target.result;
		img.addEventListener('load',function(){
			createCanvas(img);
		},false);
		
	
	}
	
	function createCanvas(img){
		props['canvas'] = document.createElement('canvas');
		
		var ratio = img.width / options.scaleWidth;
		
		props['canvas'].width = options.scaleWidth;
		props['canvas'].height = img.height / ratio;
		props['dropBox'].innerHTML = "";
		props['context'] = props['canvas'].getContext('2d');
		props['dropBox'].appendChild(props['canvas']);
		positionDropElement();
		props['img'] = img;
		renderImage();
	}
	
	function renderImage() {
		props['context'].drawImage(props['img'],0,0,props['canvas'].width,props['canvas'].height);
		getImageColourData();
	}
	
	function getImageColourData(){
	
		var colors = new Array();
				
		var imgd = props['context'].getImageData(0,0,640,481);
		
		for(var x = 0; x < imgd.width;x++){
			for(y = 0; y < imgd.height;y++){
				var offset = (y * imgd.width + x) * 4;
  				var r = imgd.data[offset];
  				var g = imgd.data[offset + 1];
  				var b = imgd.data[offset + 2];
  				var color = r+","+g+","+b+"";
  				colors.push(color);
			}
		}
		
		
		var buckets = new Array();
		
		for(var i = 0; i < colors.length;i++){
			buckets[colors[i]] ? buckets[colors[i]]++ : buckets[colors[i]] = 1;
		}
		
		var tuples = [];
		for (var x in buckets) tuples.push([x, buckets[x]]);	
		tuples.sort(function(a, b) {
	    	a = a[1];
	    	b = b[1];

			return a < b ? -1 : (a > b ? 1 : 0);
		});
		
		for (var i = 0; i < tuples.length; i++) {
		    var key = tuples[i][0];
		    var value = tuples[i][1];
		}
		
		props['colours'] = tuples;
		generateColourLegend();
		
	
	}
	
	function rgbToHex(R,G,B) { 
		return toHex(R)+toHex(G)+toHex(B); 
	}
	
	function toHex(n) {
		n = parseInt(n,10);
		if (isNaN(n)) return "00";
		n = Math.max(0,Math.min(n,255));
		return "0123456789ABCDEF".charAt((n-n%16)/16)+ "0123456789ABCDEF".charAt(n%16);
	}

	
	
	function generateColourLegend(){
		props['legendDiv'] = document.getElementById(options.colorEl);
		var body = document.getElementsByTagName('body');
		body[0].appendChild(props['legendDiv']);
		
		for(var i = 0; i < 20;i++){
			var block = document.createElement('p');
			block.innerHTML = "<span style='display:block;float:left;width:20px;height:20px;'></span> " + props.colours[i][0];
			props['legendDiv'].appendChild(block);
			var styleIt = block.getElementsByTagName('span');
			
			var colourValues = props['colours'][i][0].split(',');
			var hexValue = rgbToHex(colourValues[0],colourValues[1],colourValues[2]);
			
			styleIt[0].style.backgroundColor = "#"+hexValue;
			var className = drawDomElement(hexValue);
		
		}
		//instantiate animate here
		AnimateSquares({els:className});		
	}
	
	function drawDomElement(color){
	
		var colorBox = document.createElement('div');
		colorBox.style.width = 50+"px";
		colorBox.style.height = 50+"px";
		colorBox.style.position = "absolute";
		colorBox.style.backgroundColor = "#"+color;
		colorBox.style.top = 0+"px";
		var elStyle = colorBox.style.width;
		var elNum = parseInt(elStyle);
		var startPos = (window.innerWidth / 2) - (elNum / 2);
		colorBox.style.left = startPos + "px";
		colorBox.style.opacity = 0;
		colorBox.className = "color-box";
		var bodyEl = document.getElementsByTagName('body');
		bodyEl[0].appendChild(colorBox);
		return colorBox.className;
	}

	init();





}