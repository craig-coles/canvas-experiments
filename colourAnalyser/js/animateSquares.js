function AnimateSquares(options){
	var elements;
	var frame = 0;
	function init(){
		elements = document.getElementsByClassName(options.els);
		doAnimation();
	}
	
	function doAnimation(){
		if(frame < 50){
			updateElements();
			frame++;
			setTimeout(doAnimation,1000/30);
		}
	
	}
	
	function updateElements(){
		for(var i = 0; i < elements.length;i++){
			
			var el = elements[i];
			if(i % 2 == 0){
				var offset = 0.4;
			} else {
				var offset = -0.4;	
			}
			var currentPos = el.offsetLeft + (i * offset); 
			
			el.style.left = currentPos + "px";
			el.style.opacity = el.style.opacity+1;
			
				
		}
	
	
	}
	
	init();


}