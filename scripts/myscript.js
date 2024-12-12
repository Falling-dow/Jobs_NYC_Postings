// Wait for the DOM content to fully load before executing
document.addEventListener("DOMContentLoaded", function () {
    // Set up margins and chart dimensions
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    let width = document.getElementById("plot").clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Tooltip for displaying data on hover
    const tooltip = d3.select("#tooltip");

    // Create an SVG canvas inside the 'plot' div
    const svg = d3.select("#plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Select dropdown elements for filtering
    const facetSelectors = {
        "merged_job_category": document.getElementById("category_merged_job_category"),
        "Career_Level": document.getElementById("category_Career_Level"),
        "any_programming_required": document.getElementById("category_any_programming_required"),
        "Residency_Requirement": document.getElementById("category_Residency_Requirement"),
        "Title_Classification": document.getElementById("category_Title_Classification"),
    };

    const yearSelect = document.getElementById("year-select"); // Dropdown to select the year
    const yAxisSelect = document.getElementById("y-axis-select"); // Dropdown to select the Y-axis variable

    // Load the JSON dataset
    d3.json("data_cleaned.json").then(data => {
        // Data preprocessing: Ensure all fields are properly formatted
        data.forEach(d => {
            d.Posting_Month = new Date(d.Posting_Month); // Convert Posting_Month to Date object
            d.any_programming_required = d.any_programming_required ? "true" : "false"; // Convert boolean to string
            d.merged_job_category = d.merged_job_category || "N/A"; // Default to N/A if missing
            d.Career_Level = d.Career_Level || "N/A";
            d.Residency_Requirement = d.Residency_Requirement || "N/A";
            d.Title_Classification = d.Title_Classification || "N/A";
        });

        // Populate dropdown menus and set up event listeners
        populateYearOptions();
        populateFacetSelectors(data);
        setupEventListeners();

        // Main chart rendering function
       function renderChart() {
    width = document.getElementById("plot").clientWidth - margin.left - margin.right;

    const selectedYear = yearSelect.value; // Selected year
    const selectedYVar = yAxisSelect.value; // Selected Y-axis variable

    // Filter data for the selected year
    let filteredData = data.filter(d => d.Posting_Month.getFullYear().toString() === selectedYear);

    // Apply additional filtering for facets
    Object.keys(facetSelectors).forEach(key => {
        const value = facetSelectors[key].value;
        if (value !== "N/A") {
            filteredData = filteredData.filter(d => d[key] === value);
        }
    });

    // Get all unique months present in the filtered data
    const uniqueMonths = new Set(filteredData.map(d => d3.timeMonth(d.Posting_Month).getTime()));

    // Group data by month and calculate job_count and median_salary
    const groupedData = d3.rollups(
        filteredData,
        v => ({
            job_count: v.length,
            median_salary: d3.mean(v, d => d.salary_median),
        }),
        d => d3.timeMonth(d.Posting_Month)
    );

    // Convert grouped data into chart data, excluding months not in the original data
    const chartData = groupedData.map(([month, metrics]) => {
        if (uniqueMonths.has(month.getTime())) { // Only include months with data
            return {
                date: month,
                job_count: metrics.job_count || 0,
                median_salary: Math.round(metrics.median_salary || 0)
            };
        }
    }).filter(d => d); // Remove undefined values for missing months

    // Sort the data by date
    chartData.sort((a, b) => a.date - b.date);

    drawChart(chartData, selectedYVar);
}

        // Populate dropdown menus for filtering based on unique values
        function populateFacetSelectors(data) {
            Object.keys(facetSelectors).forEach(key => {
                // Extract unique values for the specific facet
                const uniqueValues = [...new Set(data.map(d => d[key]).filter(d => d && d !== "N/A"))].sort();
                const selector = facetSelectors[key];
                selector.innerHTML = ""; // Clear the dropdown
                selector.appendChild(new Option("N/A", "N/A")); // Add default "N/A" option
                uniqueValues.forEach(value => {
                    selector.appendChild(new Option(value, value)); // Add options dynamically
                });
            });
        }

        // Populate the year dropdown with hardcoded years
        function populateYearOptions() {
            [2023, 2024].forEach(year => {
                const option = document.createElement("option");
                option.value = year;
                option.textContent = year;
                yearSelect.appendChild(option);
            });
            yearSelect.value = "2023";
        }

        // Draw the chart based on filtered and aggregated data
        function drawChart(data, yVar) {
            svg.selectAll("*").remove(); // Clear previous chart elements

            // Define X and Y scales
            const xScale = d3.scaleTime()
                .domain([new Date(yearSelect.value, 0, 1), new Date(yearSelect.value, 11, 31)])
                .range([0, width]);

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(data, d => d[yVar])]).nice()
                .range([height, 0]);

            // Add X-axis
            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b")));

            // Add Y-axis
            svg.append("g").call(d3.axisLeft(yScale));

            // Draw the line chart
            const line = d3.line()
                .x(d => xScale(d.date))
                .y(d => yScale(d[yVar]))
                .curve(d3.curveMonotoneX);

            svg.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 2)
                .attr("d", line);

            // Add data points (circles) with tooltips
            svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", d => xScale(d.date))
                .attr("cy", d => yScale(d[yVar]))
                .attr("r", 4)
                .attr("fill", "red")
                .on("mouseover", (event, d) => {
                    tooltip.style("opacity", 1)
                        .html(`
                            <strong>Date:</strong> ${d3.timeFormat("%B %Y")(d.date)}<br>
                            <strong>${yVar === "job_count" ? "Job Count" : "Median Salary"}:</strong> ${d[yVar]}
                        `)
                        .style("left", `${event.pageX + 10}px`)
                        .style("top", `${event.pageY - 20}px`);
                })
                .on("mouseout", () => {
                    tooltip.style("opacity", 0);
                });
        }

        // Set up event listeners for dropdown changes
        function setupEventListeners() {
            yearSelect.addEventListener("change", renderChart);
            yAxisSelect.addEventListener("change", renderChart);
            Object.values(facetSelectors).forEach(select => {
                select.addEventListener("change", renderChart);
            });
            renderChart();
        }
    });
});
