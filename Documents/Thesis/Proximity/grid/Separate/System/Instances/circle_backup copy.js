var mainChart = function () {
  var size = { width: 2050, height: 1000 };
  var filename = "ScatterProj_new2_act.csv"; //projection
  var attr = ["x", "y"]; //X and Y attributes to use

  var canvas = d3
    .select("#grid")
    .append("svg")
    .attr("width", size.width)
    .attr("height", size.height)
    .append("g");
  /* .attr(
      "transform",
      "translate(" + size.width / 12 + "," + size.height / 8 + ")"
    ); */

  var Tooltip = d3
    .select("#grid")
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
    drawgrid(canvas, grid, { width: 22, height: 22 });
  });

  var mouseover = function (d) {
    if (d.instance <= 150) {
      Tooltip.style("opacity", 1);
      // d3.select(this).style("stroke", "black").style("opacity", 1);
    }
  };
  var mousemove = function (d) {
    Tooltip;
    if (d.instance <= 150) {
      Tooltip.html("The Instance number is: " + d.instance)
        .style("right", d3.mouse(this)[0] + 90 + "px")
        .style("top", d3.mouse(this)[1] + 200 + "px");
    }
  };
  var mouseleave = function (d) {
    if (d.instance <= 150) {
      Tooltip.style("opacity", 0);
      // d3.select(this).style("stroke", "none").style("opacity", 1);
    }
  };

  function drawgrid(canvas, grid, size = { width: 5, height: 5 }) {
    for (i = 0; i <= 149; i++) {
      arr = grid[i].pieval.split(",");
    }

    canvas
      .selectAll("g")
      .data(grid)
      .join(
        (enter) => {
          var data = arr;

          // set the color scale
          var color = d3
            .scaleOrdinal()
            .domain(data)
            .range(["#3385ff", "#ff8c1a", "#99cc00"]);

          var pie = d3.pie().value(function (d) {
            return d.value;
          });

          enter
            .append("g")
            .style("stroke", function (d) {
              if (d.mapping == "NonMatch") {
                return "red";
              }
            })
            .style("stroke-width", 1.5)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .attr("transform", function (d) {
              return (
                "translate(" +
                (size.width * d.j + 12) +
                "," +
                (size.height * d.i + 12) +
                ")"
              );
            })

            .selectAll("whatever")
            .data(function (d) {
              return pie(d3.entries(d.pieval.split(",")));
            })
            .enter()
            .append("path")
            .attr("d", d3.arc().innerRadius(0).outerRadius(11))
            .attr("fill", function (d) {
              return color(d.data.key);
            })
            .style("opacity", 1);
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
        color: d.Pred_class,
        color_new: d.class,
        instance: d.Instance,
        mapping: d.Matches,
        pieval: d.Pie,
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
