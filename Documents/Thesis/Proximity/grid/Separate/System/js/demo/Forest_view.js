var mainChart = function () {
  var size = { width: 2050, height: 1000 };
  var filename = "Rule_data.csv"; //projection
  var attr = ["x", "y"]; //X and Y attributes to use

  var canvas = d3
    .select("#canvas")
    .append("svg")
    .attr("width", size.width)
    .attr("height", size.height)
    .append("g");

  var Tooltip = d3
    .select("#c")
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
    drawgrid(canvas, grid, { width: 30, height: 30 });
  });

  var mouseover = function (d) {
    if (d.rule <= 12) {
      Tooltip.style("opacity", 1);
      // d3.select(this).style("stroke", "black").style("opacity", 1);
    }
  };
  var mousemove = function (d) {
    Tooltip;
    if (d.rule <= 12) {
      Tooltip.html("The Rule number is: " + d.rule)
        .style("right", d3.mouse(this)[0] + 90 + "px")
        .style("top", d3.mouse(this)[1] + 200 + "px");
    }
  };
  var mouseleave = function (d) {
    if (d.rule <= 12) {
      Tooltip.style("opacity", 0);
      // d3.select(this).style("stroke", "none").style("opacity", 1);
    }
  };

  function drawgrid(canvas, grid, size = { width: 5, height: 5 }) {
    canvas
      .selectAll("g")
      .data(grid)
      .join(
        (enter) => {
          var data = grid;

          // set the color scale
          var color = d3
            .scaleOrdinal()
            .domain(data)
            // .range(["green","orange","blue"]);
            .range(["#99cc00", "#3385ff", "#ff8c1a"]);

          var pie = d3.pie().value(function (d) {
            return d.value;
          });

          enter
            .append("g")
            .attr("id", function (d) {
              return "R" + d.rule;
            })
            .style("opacity", function (d) {
              if (d.coverage > 0.7) {
                return 1;
              } else if (d.coverage < 0.5) {
                return 0.6;
              }
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
                (size.width * d.j + 150) +
                "," +
                (size.height * d.i + 80) +
                ")"
              );
            })

            .selectAll("whatever")
            .data(function (d) {
              return pie(d3.entries(d.pieval.split(",")));
            })

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
                  if (d.data.size >= 0.7) return 14;
                  else if (d.data.size >= 0.3 && d.data.size < 0.7) return 11;
                  else return 8;
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
        //color: d.Pred_class,
        color_new: d.class,
        rule: d.Rule,
        mapping: d.Match,
        pieval: d.Pie,
        coverage: d.coverage,
        certainty: d.certainty,
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
