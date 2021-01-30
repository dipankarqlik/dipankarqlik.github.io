var mainChart = function () {
  var size = { width: 2050, height: 1000 };
  var filename = "Instance_data.csv"; //projection
  var attr = ["x", "y"]; //X and Y attributes to use

  var canvas = d3
    .select("#grid")
    .append("svg")
    .attr("width", size.width)
    .attr("height", size.height)
    .append("g");
  //.attr("transform", "translate(" + size.width / 2 + "," + size.height/4 + ")");

  var nwidth = 450;
  nheight = 450;
  nmargin = 40;

  d3.csv(filename, type).then(function (data) {
    data = normalize(data, attr);
    var gridsize = gridaspectratio(data, 1); //1.8
    var grid = grid_rec(data, gridsize);
    drawgrid(canvas, grid, { width: 23, height: 23 });
  });

  function drawgrid(canvas, grid, size = { width: 5, height: 5 }) {
    canvas
      .selectAll("g")
      .data(grid)
      .join(
        (enter) => {
          //var data = grid;

          var color_scale = d3
            .scaleOrdinal()
            //.range(["orange", "green", "purple", "white"]);
            .range(["#3385ff", "#ff8c1a", "#99cc00", "white"]);

          enter.enter().append("circle").attr("r", 11);

          enter
            .attr("cx", function (d) {
              return size.width * d.j + 11;
            })
            .attr("cy", function (d) {
              return size.height * d.i + 12;
            })

            .style("fill", function (d) {
              return color_scale(d.color);
            })

            .style("stroke", function (d) {
              if (d.mapping == "NonMatch") {
                return color_scale(d.color_new);
                //return "red";
              }
            })
            .style("stroke-width", 3);

          enter.enter().append("text");
          enter
            .attr("class", "label")
            .attr("font-size", 9.5)
            .attr("x", function (d) {
              return size.width * d.j + 4;
            })
            .attr("y", function (d) {
              return size.height * d.i + 7;
            })
            .attr("dy", ".8em")
            .text(function (d) {
              if (d.instance <= 150) {
                return d.instance;
              }
            });
        },
        (update) => {},
        (exit) => {}
      );
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
          d3.extent(data, function (d) {
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
