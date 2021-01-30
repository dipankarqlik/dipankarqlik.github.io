var parallelC = function (param) {
  //dictonary for color retrievel
  var dic = { 1: "blue", 2: "orange", 3: "green" };

  Plotly.d3.csv("Instance_data.csv", function (err, rows) {
    var lis;
    
    //list of data to add
    function test(rows, key, past) {
      lis = [];
      $(past).each(function (i, val) {
        lis.push(
          rows.map(function (row) {
            return row[key];
          })[val - 1]
        );
      });
      return lis;
    }
    console.log(test(rows, "SepalWidthCm",param))
    //check unique classed
    var uniqu = [...new Set(test(rows, "class_new", param))];
    var colorscale_fix;

    //add value to colorscale_fix based on classes and number of classes
    if (uniqu.length == 2) {
      if (JSON.stringify(uniqu.sort()) === JSON.stringify(["1", "2"])) {
        colorscale_fix = [
          [0, "blue"],
          [1, "orange"],
        ];
      } else if (JSON.stringify(uniqu.sort()) === JSON.stringify(["2", "3"])) {
        colorscale_fix = [
          [0, "orange"],
          [1, "green"],
        ];
      } else if (JSON.stringify(uniqu.sort()) === JSON.stringify(["1", "3"])) {
        colorscale_fix = [
          [0, "blue"],
          [1, "green"],
        ];
      }
    } else if (uniqu.length == 3) {
      colorscale_fix = [
        [0, "blue"],
        [0.5, "orange"],
        [1, "green"],
      ];
    } 
    
    else if (uniqu.length == 1) {
      colorscale_fix = dic[uniqu[0]];
    }

    function unpack(rows, key) {
      return rows.map(function (row) {
        return row[key];
      });
    }

    var data;
    // if selected
    if (param != "quit") {
      // if parameter has 1 value or points selected from same class
      if (param.length == 1 || uniqu.length == 1) {
        data = [
          {
            type: "parcoords",
            pad: [80, 80, 80, 80],

            line: {
              color: colorscale_fix, 
            },

            dimensions: [
              {
                range: [2, 4.5],
                label: "SepalWidthCm",
                values: test(rows, "SepalWidthCm", param),
              },
              {
                //constraintrange: [5, 6],
                range: [4, 8],
                label: "SepalLengthCm",
                values: test(rows, "SepalLengthCm", param), 
              },
              {
                label: "PetalWidthCm",
                range: [0, 2.5],
                values: test(rows, "PetalWidthCm", param), 
              },
              {
                label: "PetalLengthCm",
                range: [1, 7],
                values: test(rows, "PetalLengthCm", param), 
              },
            ],
          },
        ];
      }
      // if different class points are selected with 2 or 3 unique classes
      else {
        data = [
          {
            type: "parcoords",
            pad: [80, 80, 80, 80],
            line: {
              color: test(rows, "class_new", param),
              colorscale: colorscale_fix,
            },

            dimensions: [
              {
                range: [2, 4.5],
                label: "SepalWidthCm",
                values: test(rows, "SepalWidthCm", param),
              },
              {
                //constraintrange: [5, 6],
                range: [4, 8],
                label: "SepalLengthCm",
                values: test(rows, "SepalLengthCm", param), 
              },
              {
                label: "PetalWidthCm",
                range: [0, 2.5],
                values: test(rows, "PetalWidthCm", param), 
              },
              {
                label: "PetalLengthCm",
                range: [1, 7],
                values: test(rows, "PetalLengthCm", param), 
              },
            ],
          },
        ];
      }
    }
    // if quit
    else {
      data = [
        {
          type: "parcoords",
          pad: [80, 80, 80, 80],
          line: {
            color: unpack(rows, "class_new"),
            colorscale: [
              [0, "blue"],
              [0.5, "orange"],
              [1, "green"],
            ],
          },

          dimensions: [
            {
              range: [2, 4.5],
              label: "SepalWidthCm",
              values: unpack(rows, "SepalWidthCm"),
            },
            {
             // constraintrange: [5, 6],
              range: [4, 8],
              label: "SepalLengthCm",
              values: unpack(rows, "SepalLengthCm"),
            },
            {
              label: "PetalWidthCm",
              range: [0, 2.5],
              values: unpack(rows, "PetalWidthCm"),
            },
            {
              label: "PetalLengthCm",
              range: [1, 7],
              values: unpack(rows, "PetalLengthCm"),
            },
          ],
        },
      ];
    }
    var layout = {
      width: 800,
      height: 500,
    };

    Plotly.newPlot("table-location", data, layout);
  });
};
