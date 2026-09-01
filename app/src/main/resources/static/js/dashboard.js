(function () {

    // Shared chart look & feel so every graph matches the
    // dashboard's yellow / green / brown theme.
    function baseOptions(axisLabelX, axisLabelY) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "#0E4A28",
                    padding: 10,
                    cornerRadius: 8
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    title: {
                        display: true,
                        text: axisLabelX,
                        color: "#666",
                        font: { size: 11 }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: "#f0f0f0" },
                    title: {
                        display: true,
                        text: axisLabelY,
                        color: "#666",
                        font: { size: 11 }
                    }
                }
            }
        };
    }

    function barChart(canvasId, labels, data, color, axisLabelX) {
        const el = document.getElementById(canvasId);
        if (!el || typeof Chart === "undefined") return;

        new Chart(el, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: color,
                    borderRadius: 6,
                    maxBarThickness: 46
                }]
            },
            options: baseOptions(axisLabelX, "Stock")
        });
    }

    document.addEventListener("DOMContentLoaded", function () {

        // Stock Overview — by door model
        barChart(
            "stockOverviewChart",
            ["Teak", "Oak", "Rosewood", "Pine", "Maple"],
            [48, 36, 24, 18, 12],
            "#0E4A28",
            "Door Models"
        );

        // Stock Distribution — by dimension
        barChart(
            "stockDistributionChart",
            ["7 x 3", "6.5 x 3", "8 x 4", "6 x 2.5"],
            [72, 58, 34, 22],
            "#F5CB50",
            "Dimensions (ft)"
        );

        // Stock by Grade
        barChart(
            "stockByGradeChart",
            ["Grade A", "Grade B", "Grade C"],
            [76, 64, 46],
            "#B26C45",
            "Grades"
        );
    });

}());
