function sum (a) {
	return function(b){
		return a + b;
	}
}

$( document ).ready(function() {
	var $form = $('form'),
		$chart = $('.chart'),
		points = 1000,
		values,
		discretsSrting;
	initValue = function() {
		var data = $form.serializeArray(),
			obj = {};
		for (i in data) {
			if (data[i].name !== "function") {obj[data[i].name] = parseFloat(data[i].value)}
			else  obj["function"] = data[i].value
		}
		return obj
	};
	initPlot = function(param, points) {
		var step = param.time/points,
			A = param.amplitude,
			omega = param.frequency,
			phase = param.initialphase*Math.PI/180,
			discretTime = param.qvantization
			values = {
				plot: [],
				discrets: [],
			};
			counter = 0;
		// values['plot'] = [];
		// values['discrets'] = [];
		for(var i = 0; i < points; i++){
			var x = step*i;
			values.plot[i] = [];
			values.plot[i].push(x);
			if (param.function === "sin") {
				values.plot[i].push(A*Math.sin(omega*x+phase));
			}
			if (param.function === "cos") {
				values.plot[i].push(A*Math.cos(omega*x+phase));
			}
		}
		while (counter < param.time/discretTime){
			var x = discretTime*counter;
			values.discrets[counter] = [];
			values.discrets[counter].push(x);
			if (param.function === "sin") {
				values.discrets[counter].push(A*Math.sin(omega*x+phase));
			}
			if (param.function === "cos") {
				values.discrets[counter].push(A*Math.cos(omega*x+phase));
			}
			counter++;
		};
			return values
	}
	drawPlot = function($container, values, functionName, discrets){
		$container.highcharts({
			title: {
				text: functionName,
			},
			xAxis: {
				title: {
					text: "X",
					style: {"fontWeight": "bold", "fontSize": "17px"}
				}
			},
			yAxis: {
				title: {
					text: 'Y',
					rotation: 0,
					style: {"fontWeight": "bold", "fontSize": "17px"}
				}
			},
			legend: {
				enabled: false
			},
			plotOptions: {
				series: {
					pointWidth: 1
				}
			},
			series: [
			{
				type: 'column',
				lineWidth: 1,
				data: discrets
			},
			{
				lineWidth: 1,
				data: values
			},
			]
		});
	}

	$('.controls__build').on("click", function(e){
		var parametrs = initValue();
		values = initPlot(parametrs, points);
		drawPlot($chart, values.plot, parametrs.function);
	});
	$('.controls__qvant').on("click", function(e){
		var parametrs = initValue();
		values = initPlot(parametrs, points);
		drawPlot($chart, values.plot, parametrs.function, values.discrets);
	});
});
