var parallelC = function (param) {
    //dictonary for color retrievel
    var dic = { 1: "#3385ff", 2: "#ff8c1a" };
  
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
                  range: [0, 6],
                  label: "Account_Balance",
                  values: test(rows, "Account_Balance", param),
                },
                {
                  //constraintrange: [5, 6],
                  range: [0,80],
                  label: "Duration_of_Credit",
                  values: test(rows, "Duration_of_Credit", param),
                },
                {
                  label: "Payment_Status_of_Previous_Credit",
                  range: [0,6],
                  values: test(rows, "Payment_Status_of_Previous_Credit", param),
                },
                {
                  label: "Credit_Amount",
                  range: [200, 18500],
                  values: test(rows, "Credit_Amount", param),
                },
                {
                  label: "Value_Savings",
                  range: [0, 6],
                  values: test(rows, "Value_Savings", param),
                },
                {
                  label: "Length_emp",
                  range: [0, 6],
                  values: test(rows, "Length_emp", param),
                },
                {
                  label: "Installment",
                  range: [0, 6],
                  values: test(rows, "Installment", param),
                },
                {
                  label: "Duration_current_add",
                  range: [0, 6],
                  values: test(rows, "Duration_current_add", param),
                },
                {
                  label: "Age",
                  range: [15, 80],
                  values: test(rows, "Age", param),
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
                    range: [0, 6],
                    label: "Account_Balance",
                    values: test(rows, "Account_Balance", param),
                  },
                  {
                    //constraintrange: [5, 6],
                    range: [0,80],
                    label: "Duration_of_Credit",
                    values: test(rows, "Duration_of_Credit", param),
                  },
                  {
                    label: "Payment_Status_of_Previous_Credit",
                    range: [0,6],
                    values: test(rows, "Payment_Status_of_Previous_Credit", param),
                  },
                  {
                    label: "Credit_Amount",
                    range: [200, 18500],
                    values: test(rows, "Credit_Amount", param),
                  },
                  {
                    label: "Value_Savings",
                    range: [0, 6],
                    values: test(rows, "Value_Savings", param),
                  },
                  {
                    label: "Length_emp",
                    range: [0, 6],
                    values: test(rows, "Length_emp", param),
                  },
                  {
                    label: "Installment",
                    range: [0, 6],
                    values: test(rows, "Installment", param),
                  },
                  {
                    label: "Duration_current_add",
                    range: [0, 6],
                    values: test(rows, "Duration_current_add", param),
                  },
                  {
                    label: "Age",
                    range: [15, 80],
                    values: test(rows, "Age", param),
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
                range: [0,6],
                label: "Account_Balance",
                values: unpack(rows, "Account_Balance"),
              },
              {
                //constraintrange: [5, 6],
                range: [0,80],
                label: "Duration_of_Credit",
                values: unpack(rows, "Duration_of_Credit"),
              },
              {
                label: "Payment_Status_of_Previous_Credit",
                range: [0,6],
                values: unpack(rows, "Payment_Status_of_Previous_Credit"),
              },
              {
                label: "Credit_Amount",
                range: [200, 18500],
                values: unpack(rows, "Credit_Amount"),
              },
              {
                label: "Value_Savings",
                range: [0, 6],
                values: unpack(rows, "Value_Savings"),
              },
              {
                label: "Length_emp",
                range: [0, 6],
                values: unpack(rows, "Length_emp"),
              },
              {
                label: "Installment",
                range: [0, 6],
                values: unpack(rows, "Installment"),
              },
              {
                label: "Duration_current_add",
                range: [0, 6],
                values: unpack(rows, "Duration_current_add"),
              },
              {
                label: "Age",
                range: [15, 80],
                values: unpack(rows, "Age"),
              },
              
            ],
          },
        ];
      }
      var layout = {
        width: 1200,
        height: 500,
      };
  
      Plotly.newPlot("table-location", data, layout);
    });
  };
  