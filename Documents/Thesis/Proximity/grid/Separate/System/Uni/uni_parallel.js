var parallelC = function (param) {
  //dictonary for color retrievel
  var dic = { 1: "green", 2: "purple" };

  Plotly.d3.csv("Instance_proj.csv", function (err, rows) {
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
    


    //check unique classes
    var uniqu = [...new Set(test(rows, "class_new", param))];
    //console.log(uniqu);
    var colorscale_fix;

    //add value to colorscale_fix based on classes and number of classes: selection of points from instance view
    if (uniqu.length == 2) {
      colorscale_fix = [
        [0, "green"],
        [1, "purple"],
      ];
    } else if (uniqu.length == 1) {
      //console.log(dic[uniqu[0]]);
      colorscale_fix = dic[uniqu[0]];
    }

    function unpack(rows, key) {
      return rows.map(function (row) {
        return row[key];
      });
    }

    //console.log(test(rows, "radius_mean", 528))
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
                range: [200,800],
                label: "gre",
                values: test(rows, "gre", param),
              },
              {
                //constraintrange: [5, 6],
                range: [2.2, 4],
                label: "gpa",
                values: test(rows, "gpa", param),
              },
              {
                label: "rank",
                range: [1, 4],
                values: test(rows, "rank", param),
              },
             ,
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
                range: [200,800],
                label: "gre",
                values: test(rows, "gre", param),
              },
              {
                //constraintrange: [5, 6],
                range: [2.2,4],
                label: "gpa",
                values: test(rows, "gpa", param),
              },
              {
                label: "rank",
                range: [1,4],
                values: test(rows, "rank", param),
              },
              ,
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
              [0, "green"],
              [1, "purple"],
            ],
          },

          dimensions: [
            {
              range: [200,800],
              label: "gre",
              values: unpack(rows, "gre"),
            },
            {
              //constraintrange: [5, 6],
              range: [2.2, 4],
              label: "gpa",
              values: unpack(rows, "gpa"),
            },
            {
              label: "rank",
              range: [1,4],
              values: unpack(rows, "rank"),
            },
            
          ],
        },
      ];
    }
    var layout = {
      width: 1000,
      height: 500,
    };

    Plotly.newPlot("table-location", data, layout);
  });
};
