var mainChartnew = function () {
  var size = { width: 2200, height: 1300 };
  var filename = "Wine_rule_data.csv"; //projection
  var attr = ["x", "y"]; //X and Y attributes to use

  var canvasnew = d3
    .select("#canvasnew")
    .append("svg")
    .attr("width", size.width)
    .attr("height", size.height)
    // .call(
    //   d3.zoom().on("zoom", function () {
    //     canvasnew.attr("transform", d3.event.transform);
    //   })
    // )
    .append("g");

  /* .attr(
      "transform",
      "translate(" + size.width / 12 + "," + size.height / 8 + ")"
    ); */

  var Tooltip = d3
    .select("#cn")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

  d3.csv(filename, type).then(function (data) {
    data = normalize(data, attr);
    var gridsize = gridaspectratio(data, 1); //1.8
    var grid = grid_rec(data, gridsize);
    drawgrid(canvasnew, grid, { width: 23, height: 23 });
  });

  var mousemove = function (d) {
    if (d.rule <= 293) {
      Tooltip.style("opacity", 1);
      // d3.select(this).style("stroke", "black").style("opacity", 1);
    }
  };
  var mouseover = function (d) {
    Tooltip;
    if (d.rule <= 293) {
      Tooltip.html(
        "Rule number : " +
          d.rule +
          "</br>" +
          "Rule coverage is: " +
          d.coverage * 100 +
          "%" +
          "</br>" +
          "Predicted class is: " +
          d.color_new +
          "</br>" +
          "Probability Class_three: " +
          d.class0 +
          "</br>" +
          "Probability Class_four: " +
          d.class1 +
          "</br>" +
          "Probability Class_five: " +
          d.class2 +
          "</br>" +
          "Probability Class_six: " +
          d.class3 +
          "</br>" +
          "Probability Class_seven: " +
          d.class4 +
          "</br>" +
          "Probability Class_eight: " +
          d.class5
      )
        .style("right", d3.mouse(this)[0] - 100 + "px")
        .style("top", d3.mouse(this)[1] - 70 + "px");
    }
  };
  var mouseleave = function (d) {
    if (d.rule <= 293) {
      Tooltip.style("opacity", 0);
      // d3.select(this).style("stroke", "none").style("opacity", 1);
    }
  };

  function drawgrid(canvasnew, grid, size = { width: 5, height: 5 }) {
    canvasnew
      .selectAll("g")
      .data(grid)
      .join(
        (enter) => {
          var data = grid;

          // set the color scale
          var color = d3
            .scaleOrdinal()
            .domain(data)
            .range([
              "#1f77b3",
              "#e277c1",
              "#ff7e0e",
              "#bcbc21",
              "#8c564b",
              "#9367bc",
            ]);

          var pie = d3.pie().value(function (d) {
            return d.value;
          });

          enter
            .append("g")
            .attr("class", "forest")
            .attr("id", function (d) {
              return "R" + d.rule;
            })
            .style("opacity", function (d) {
              // if(d.coverage>=0.70 && d.coverage<=1){
              //   return 1
              // }
              // else if(d.coverage>=0.50 && d.coverage<0.70){
              //   return 0.8}
              // else if(d.coverage>=0.30 && d.coverage<0.50){
              //   return 0.6
              // }
              // else{
              //   return 0.4
              // }

              if (d.coverage >= 0.3 && d.coverage < 0.5) {
                return 1;
              } else return 0.8;
              // return 1;
            })

            /*
            .style("stroke", function (d) {
              if (d.rule <=27) {
                return "black";
              }
            })*/
            // .style("stroke-width", 1.2)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .attr("transform", function (d) {
              return (
                "translate(" +
                (size.width * d.j + 20) +
                "," +
                (size.height * d.i + 12) +
                ")"
              );
            })

            .selectAll("whatever")
            .data(function (d) {
              return pie(d3.entries(d.pieval.split(",")));
            })

            //the above data is the Pie values which are used by the pie slices

            .enter()
            .append("path")
            .data(function (d) {
              let mymap = d.pieval.split(",").map((e, i) => {
                return { key: i, value: e, size: d.coverage };
              });

              return pie(mymap);
            })
            .attr(
              "d",
              d3
                .arc()
                .innerRadius(0)
                .outerRadius(function (d) {
                  if (d.data.size >= 0.3) return 12;
                  else if (d.data.size >= 0.15 && d.data.size < 30) return 9;
                  else return 6;
                })
            )
            .attr("fill", function (d) {
              return color(d.data.key);
            });
        },
        (update) => {},
        (exit) => {}
      );

    //.attr("style", "outline: thin solid red;")
  }

  function grid_rec(data, gridsize) {
    var grid = data.map(function (d, i) {
      return {
        id: i + 1,
        x: d.x,
        y: d.y,
        i: 0,
        j: 0,
        // color: d.Pred_class,
        color_new: d.class,
        rule: d.Rule,
        pieval: d.Pie,
        coverage: d.coverage,
        certainty: d.certainty,
        coverage_new: d.coverage_new,
        class0: d.Class0,
        class1: d.Class1,
        class2: d.Class2,
        class3: d.Class3,
        class4: d.Class4,
        class5: d.Class5,
      };
    });

    return grid_rec_aux(grid, gridsize, { i: 0, j: 0 }).sort(function (a, b) {
      return a.id - b.id;
    });
  }

  function grid_rec_aux(grid, size, corner) {
    if (grid.length > 0) {
      if (grid.length === 1) {
        grid[0].i = corner.i;
        grid[0].j = corner.j;
        return grid;
      } else {
        if (size.r > size.s) {
          var [grid0, grid1] = split_grid(
            grid,
            Math.ceil(size.r / 2) * size.s,
            "y"
          );

          grid_rec_aux(
            grid0,
            { r: Math.ceil(size.r / 2), s: size.s },
            { i: corner.i, j: corner.j }
          );

          grid_rec_aux(
            grid1,
            { r: size.r - Math.ceil(size.r / 2), s: size.s },
            { i: corner.i + Math.ceil(size.r / 2), j: corner.j }
          );

          return grid0.concat(grid1);
        } else {
          var [grid0, grid1] = split_grid(
            grid,
            Math.ceil(size.s / 2) * size.r,
            "x"
          );

          grid_rec_aux(
            grid0,
            { r: size.r, s: Math.ceil(size.s / 2) },
            { i: corner.i, j: corner.j }
          );

          grid_rec_aux(
            grid1,
            { r: size.r, s: size.s - Math.ceil(size.s / 2) },
            { i: corner.i, j: corner.j + Math.ceil(size.s / 2) }
          );

          return grid0.concat(grid1);
        }
      }
    }
  }

  function split_grid(grid, cutpoint, direction) {
    grid.sort(function (a, b) {
      return a[direction] - b[direction];
    });

    var grid0 = grid.slice(0, cutpoint).map(function (d) {
      return d;
    });
    var grid1 = grid.slice(cutpoint).map(function (d) {
      return d;
    });

    return [grid0, grid1];
  }

  function gridaspectratio(data, aspectratio) {
    var columns = Math.floor(Math.sqrt(data.length * aspectratio));
    var lines = Math.ceil(data.length / columns);
    return { r: lines, s: columns };
  }

  function type(d) {
    attr.forEach(function (value) {
      d[value] = +d[value];
    });
    return d;
  }

  function normalize(data, attributes) {
    attributes.forEach(function (value) {
      var scale = d3
        .scaleLinear()
        .range([0, 1])
        .domain(
          d3.extent(data, (d) => {
            return d[value];
          })
        );
      data.forEach(function (d) {
        d[value] = scale(d[value]);
      });
    });
    return data;
  }
};
