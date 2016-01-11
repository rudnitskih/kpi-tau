$( document ).ready(function() {
	var $chart = $('.chart'),
		$form = $('form'),
		$data = $('.data'),
		discretsSrting = '',
		adc = {
			frequency: 1,
			capacity: 3,
			min: 0,
			max: 10,
		},
		func = {
			points: 1000,
			time: 10,
			amplitude: 0.2,
		},
		values;
	initValues = function() {
		var data = $form.serializeArray();
		for (i in data) {
			if (adc[data[i].name] || adc[data[i].name] === 0){
				adc[data[i].name] = parseFloat(data[i].value);
			}
			if (func[data[i].name]){
				func[data[i].name] = parseFloat(data[i].value);
			}
		}
	};
	toBin = function( num, radix ) {
		var out = "", bit = 1;
		while( num >= bit ) {
			out = ( num & bit ? 1 : 0 ) + out;
			bit <<= 1;
		}
		return out || "0";
	}
	initPlot = function(adc, func) {
		var counter = 0,
			x = 0,
			xNext = 0,
			biNamber,
			step = func.time/func.points,
			A = func.amplitude,
			discretsValues = [],
			levels = Math.pow(2,adc.capacity),
			rangeAdc = (adc.max-adc.min)/levels,
			values = {
				plot: [],
				discrets: [],
			};
		discretsSrting = 0;
		for(var i = 0; i < func.points; i++){
			x = step*i;
			values.plot[i] = [];
			values.plot[i].push(x);
			values.plot[i].push((A*x*x));
		}
		for (var i = 0; i < levels; i++){
			discretsValues.push(rangeAdc*i);
		}
		while (counter < func.time*adc.frequency){
		
			x = counter/adc.frequency;
			xNext = (counter+1)/adc.frequency;
			values.discrets[counter*2] = [];
			values.discrets[counter*2+1] = [];
			plotVal = A*x*x;
			currentLevel = 0;
			for (var i = 0; i < levels; i++) {
				if (discretsValues[levels-1] < plotVal){
					currentLevel = levels-1;
					break;
				}
				if ((discretsValues[i] <= plotVal) && (discretsValues[i+1] > plotVal)){
					if ((Math.abs(discretsValues[i] - plotVal)) < (Math.abs(discretsValues[i+1] - plotVal))){
						currentLevel = i;
					} else {
						currentLevel = i+1;
					}
					break;
				}
			}
			values.discrets[counter*2].push(x);
			values.discrets[counter*2].push(discretsValues[currentLevel]);
			values.discrets[counter*2+1].push(xNext);
			values.discrets[counter*2+1].push(discretsValues[currentLevel]);
			// console.log(values.discrets[counter*2]);

			biNamber = toBin(currentLevel, adc.capacity);
			discretsSrting += ' -> ' + biNamber
			counter++;
		};
		return values
	}
	drawPlot = function($container, values, functionName, adc, func){
		yInterval = (adc.max-adc.min)/(Math.pow(2,adc.capacity));
		xInterval = adc.frequency;
		console.log(values.discrets);
		$container.highcharts({
			title: {
				text: functionName,
			},
			tooltip: {
				enabled: true,
			},
			xAxis: {
				tickInterval: 1,
				gridLineWidth: 1,
				// tickPixelInterval: 1,
				title: {
					text: "X",
					style: {"fontWeight": "bold", "fontSize": "17px"}
				}
			},
			yAxis: {
				tickInterval: 1,
				title: {
					text: 'Y',
					rotation: 0,
					style: {"fontWeight": "bold", "fontSize": "17px"}
				}
			},
			legend: {
				enabled: false
			},
			series: [
			{
				lineWidth: 2,
				data: [[0,0], [1,0], [1,1], [2,1], [3,1], [3,0], [4,0], [5,0],[5,1],[6,1],[6,0],[7,0],[7,1], [8,1]]
			},
			]
		});
	}
	// 01100101  
	$('.controls__build').on("click", function(e){
		initValues();
		values = initPlot(adc, func);
		drawPlot($chart, values, "A*x^2", adc, func);
		console.log($data, discretsSrting);
		$data.text(discretsSrting);
	});
});