function plot(type, labels, yourData, averageData, id) {
	var yourBackgroundColor = "rgba(255,99,132,0.2)";
	var yourPrimaryColor = "rgba(255,99,132,1)";

	var averageBackgroundColor = "rgba(179,181,198,0.2)";
	var averagePrimaryColor = "rgba(179,181,198,1)";


	if(type == "radar") {
		var data = {
		    labels: labels,
		    datasets: [
		    	{
		            label: "Your Writing",
		            backgroundColor: yourBackgroundColor,
		            borderColor: yourPrimaryColor,
		            pointBackgroundColor: yourPrimaryColor,
		            pointBorderColor: "#fff",
		            pointHoverBackgroundColor: "#fff",
		            pointHoverBorderColor: yourPrimaryColor,
		            data: yourData
		        },
		        {
		            label: "Average Native Speaker Writing",
		            backgroundColor: averageBackgroundColor,
		            borderColor: averagePrimaryColor,
		            pointBackgroundColor: averagePrimaryColor,
		            pointBorderColor: "#fff",
		            pointHoverBackgroundColor: "#fff",
		            pointHoverBorderColor: averagePrimaryColor,
		            data: averageData
		        }
		    ]
		};

		var opts = {
			maintainAspectRatio: false,
			scale: {
				pointLabels: {
					fontSize: 12
				}
			}
		};

	} else if(type == "bar") {
		var data = {
		    labels: labels,
		    datasets: [
		        {
		            label: "Your Writing",
		            backgroundColor: yourBackgroundColor,
		            borderColor: yourPrimaryColor,
		            borderWidth: 1,
		            data: yourData
		        },
		        {
		            label: "Average Native Speaker Writing",
		            backgroundColor: averageBackgroundColor,
		            borderColor: averagePrimaryColor,
		            borderWidth: 1,
		            data: averageData
		        }
		    ]
		};

		var opts = {
			maintainAspectRatio: false,
			scales: {
				xAxes: [{
					ticks: {
						fontSize: 10
					}
				}]
			}
		};
	}

	var ctx = document.getElementById(id);

	var myRadarChart = new Chart(ctx, {
		type: type,
		data: data,
		options: opts,
	});
}
