var parallelC = function (param) {
  //dictonary for color retrievel
  var dic = { 1: "#3385ff", 2: "#ff8c1a" };

  Plotly.d3.csv("Instance_projections.csv", function (err, rows) {
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
        [0, "#3385ff"],
        [1, "#ff8c1a"],
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
                range: [6, 29],
                label: "radius_mean",
                values: test(rows, "radius_mean", param),
              },
              {
                //constraintrange: [5, 6],
                range: [9, 40],
                label: "texture_mean",
                values: test(rows, "texture_mean", param),
              },
              {
                label: "perimeter_mean",
                range: [42, 190],
                values: test(rows, "perimeter_mean", param),
              },
              {
                label: "area_mean",
                range: [140, 2550],
                values: test(rows, "area_mean", param),
              },
              {
                label: "smoothness_mean",
                range: [0.001, 0.2],
                values: test(rows, "smoothness_mean", param),
              },
              {
                label: "compactness_mean",
                range: [0.001, 1],
                values: test(rows, "compactness_mean", param),
              },
              {
                label: "concavity_mean",
                range: [0, 1],
                values: test(rows, "concavity_mean", param),
              },
              {
                label: "concave_points_mean",
                range: [0, 1],
                values: test(rows, "concave_points_mean", param),
              },
              {
                label: "symmetry_mean",
                range: [0, 1],
                values: test(rows, "symmetry_mean", param),
              },
              {
                label: "fractal_dimension_mean",
                range: [0, 1],
                values: test(rows, "fractal_dimension_mean", param),
              },
              {
                label: "radius_se",
                range: [0, 3],
                values: test(rows, "radius_se", param),
              },
              {
                label: "texture_se",
                range: [0, 5],
                values: test(rows, "texture_se", param),
              },
              {
                label: "perimeter_se",
                range: [0, 23],
                values: test(rows, "perimeter_se", param),
              },
              {
                label: "area_se",
                range: [5, 550],
                values: test(rows, "area_se", param),
              },
              {
                label: "smoothness_se",
                range: [0, 1],
                values: test(rows, "smoothness_se", param),
              },
              {
                label: "compactness_se",
                range: [0, 1],
                values: test(rows, "compactness_se", param),
              },
              {
                label: "concavity_se",
                range: [0, 1],
                values: test(rows, "concavity_se", param),
              },
              {
                label: "concave_points_se",
                range: [0, 1],
                values: test(rows, "concave_points_se", param),
              },
              {
                label: "symmetry_se",
                range: [0, 1],
                values: test(rows, "symmetry_se", param),
              },
              {
                label: "fractal_dimension_se",
                range: [0, 1],
                values: test(rows, "fractal_dimension_se", param),
              },
              {
                label: "radius_worst",
                range: [7, 40],
                values: test(rows, "radius_worst", param),
              },
              {
                label: "texture_worst",
                range: [11, 50],
                values: test(rows, "texture_worst", param),
              },
              {
                label: "perimeter_worst",
                range: [50, 255],
                values: test(rows, "perimeter_worst", param),
              },
              {
                label: "area_worst",
                range: [175, 4500],
                values: test(rows, "area_worst", param),
              },
              {
                label: "smoothness_worst",
                range: [0, 1],
                values: test(rows, "smoothness_worst", param),
              },
              {
                label: "compactness_worst",
                range: [0, 2],
                values: test(rows, "compactness_worst", param),
              },
              {
                label: "concavity_worst",
                range: [0, 2],
                values: test(rows, "concavity_worst", param),
              },
              {
                label: "concave_points_worst",
                range: [0, 1],
                values: test(rows, "concave_points_worst", param),
              },
              {
                label: "symmetry_worst",
                range: [0, 1],
                values: test(rows, "symmetry_worst", param),
              },
              {
                label: "fractal_dimension_worst",
                range: [0, 1],
                values: test(rows, "fractal_dimension_worst", param),
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
                range: [6, 29],
                label: "radius_mean",
                values: test(rows, "radius_mean", param),
              },
              {
                //constraintrange: [5, 6],
                range: [9, 40],
                label: "texture_mean",
                values: test(rows, "texture_mean", param),
              },
              {
                label: "perimeter_mean",
                range: [42, 190],
                values: test(rows, "perimeter_mean", param),
              },
              {
                label: "area_mean",
                range: [140, 2550],
                values: test(rows, "area_mean", param),
              },
              {
                label: "smoothness_mean",
                range: [0.001, 0.2],
                values: test(rows, "smoothness_mean", param),
              },
              {
                label: "compactness_mean",
                range: [0.001, 1],
                values: test(rows, "compactness_mean", param),
              },
              {
                label: "concavity_mean",
                range: [0, 1],
                values: test(rows, "concavity_mean", param),
              },
              {
                label: "concave_points_mean",
                range: [0, 1],
                values: test(rows, "concave_points_mean", param),
              },
              {
                label: "symmetry_mean",
                range: [0, 1],
                values: test(rows, "symmetry_mean", param),
              },
              {
                label: "fractal_dimension_mean",
                range: [0, 1],
                values: test(rows, "fractal_dimension_mean", param),
              },
              {
                label: "radius_se",
                range: [0, 3],
                values: test(rows, "radius_se", param),
              },
              {
                label: "texture_se",
                range: [0, 5],
                values: test(rows, "texture_se", param),
              },
              {
                label: "perimeter_se",
                range: [0, 23],
                values: test(rows, "perimeter_se", param),
              },
              {
                label: "area_se",
                range: [5, 550],
                values: test(rows, "area_se", param),
              },
              {
                label: "smoothness_se",
                range: [0, 1],
                values: test(rows, "smoothness_se", param),
              },
              {
                label: "compactness_se",
                range: [0, 1],
                values: test(rows, "compactness_se", param),
              },
              {
                label: "concavity_se",
                range: [0, 1],
                values: test(rows, "concavity_se", param),
              },
              {
                label: "concave_points_se",
                range: [0, 1],
                values: test(rows, "concave_points_se", param),
              },
              {
                label: "symmetry_se",
                range: [0, 1],
                values: test(rows, "symmetry_se", param),
              },
              {
                label: "fractal_dimension_se",
                range: [0, 1],
                values: test(rows, "fractal_dimension_se", param),
              },
              {
                label: "radius_worst",
                range: [7, 40],
                values: test(rows, "radius_worst", param),
              },
              {
                label: "texture_worst",
                range: [11, 50],
                values: test(rows, "texture_worst", param),
              },
              {
                label: "perimeter_worst",
                range: [50, 255],
                values: test(rows, "perimeter_worst", param),
              },
              {
                label: "area_worst",
                range: [175, 4500],
                values: test(rows, "area_worst", param),
              },
              {
                label: "smoothness_worst",
                range: [0, 1],
                values: test(rows, "smoothness_worst", param),
              },
              {
                label: "compactness_worst",
                range: [0, 2],
                values: test(rows, "compactness_worst", param),
              },
              {
                label: "concavity_worst",
                range: [0, 2],
                values: test(rows, "concavity_worst", param),
              },
              {
                label: "concave_points_worst",
                range: [0, 1],
                values: test(rows, "concave_points_worst", param),
              },
              {
                label: "symmetry_worst",
                range: [0, 1],
                values: test(rows, "symmetry_worst", param),
              },
              {
                label: "fractal_dimension_worst",
                range: [0, 1],
                values: test(rows, "fractal_dimension_worst", param),
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
              [0, "#3385ff"],
              [1, "#ff8c1a"],
            ],
          },

          dimensions: [
            {
              range: [6, 29],
              label: "radius_mean",
              values: unpack(rows, "radius_mean"),
            },
            {
              //constraintrange: [5, 6],
              range: [9, 40],
              label: "texture_mean",
              values: unpack(rows, "texture_mean"),
            },
            {
              label: "perimeter_mean",
              range: [42, 190],
              values: unpack(rows, "perimeter_mean"),
            },
            {
              label: "area_mean",
              range: [140, 2550],
              values: unpack(rows, "area_mean"),
            },
            {
              label: "smoothness_mean",
              range: [0.001, 0.2],
              values: unpack(rows, "smoothness_mean"),
            },
            {
              label: "compactness_mean",
              range: [0.001, 1],
              values: unpack(rows, "compactness_mean"),
            },
            {
              label: "concavity_mean",
              range: [0, 1],
              values: unpack(rows, "concavity_mean"),
            },
            {
              label: "concave_points_mean",
              range: [0, 1],
              values: unpack(rows, "concave_points_mean"),
            },
            {
              label: "symmetry_mean",
              range: [0, 1],
              values: unpack(rows, "symmetry_mean"),
            },
            {
              label: "fractal_dimension_mean",
              range: [0, 1],
              values: unpack(rows, "fractal_dimension_mean"),
            },
            {
              label: "radius_se",
              range: [0, 3],
              values: unpack(rows, "radius_se"),
            },
            {
              label: "texture_se",
              range: [0, 5],
              values: unpack(rows, "texture_se"),
            },
            {
              label: "perimeter_se",
              range: [0, 23],
              values: unpack(rows, "perimeter_se"),
            },
            {
              label: "area_se",
              range: [5, 550],
              values: unpack(rows, "area_se"),
            },
            {
              label: "smoothness_se",
              range: [0, 1],
              values: unpack(rows, "smoothness_se"),
            },
            {
              label: "compactness_se",
              range: [0, 1],
              values: unpack(rows, "compactness_se"),
            },
            {
              label: "concavity_se",
              range: [0, 1],
              values: unpack(rows, "concavity_se"),
            },
            {
              label: "concave_points_se",
              range: [0, 1],
              values: unpack(rows, "concave_points_se"),
            },
            {
              label: "symmetry_se",
              range: [0, 1],
              values: unpack(rows, "symmetry_se"),
            },
            {
              label: "fractal_dimension_se",
              range: [0, 1],
              values: unpack(rows, "fractal_dimension_se"),
            },
            {
              label: "radius_worst",
              range: [7, 40],
              values: unpack(rows, "radius_worst"),
            },
            {
              label: "texture_worst",
              range: [11, 50],
              values: unpack(rows, "texture_worst"),
            },
            {
              label: "perimeter_worst",
              range: [50, 255],
              values: unpack(rows, "perimeter_worst"),
            },
            {
              label: "area_worst",
              range: [175, 4500],
              values: unpack(rows, "area_worst"),
            },
            {
              label: "smoothness_worst",
              range: [0, 1],
              values: unpack(rows, "smoothness_worst"),
            },
            {
              label: "compactness_worst",
              range: [0, 2],
              values: unpack(rows, "compactness_worst"),
            },
            {
              label: "concavity_worst",
              range: [0, 2],
              values: unpack(rows, "concavity_worst"),
            },
            {
              label: "concave_points_worst",
              range: [0, 1],
              values: unpack(rows, "concave_points_worst"),
            },
            {
              label: "symmetry_worst",
              range: [0, 1],
              values: unpack(rows, "symmetry_worst"),
            },
            {
              label: "fractal_dimension_worst",
              range: [0, 1],
              values: unpack(rows, "fractal_dimension_worst"),
            },
          ],
        },
      ];
    }
    var layout = {
      width: 3000,
      height: 500,
    };

    Plotly.newPlot("table-location", data, layout);
  });
};
