var mainChartnew = function () {
  var size = { width: 450, height: 300 };
  var filename = "Instance_data.csv"; //projection
  var attr = ["x", "y"]; //X and Y attributes to use

  var canvasnew = d3
    .select("#canvasnew")
    .append("svg")
    .attr("width", size.width)
    .attr("height", size.height)
    .append("g");

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

  var x;
  var mouseover = function (d) {
    if (d.instance <= 150) {
      //Tooltip.style("opacity", 1);
      x = d.mixnew.split(",");
      for (var i = 0; i < x.length; i++) {
        //console.log(x[i], document.getElementById(x[i]));
        document.getElementById(x[i]).style.stroke = "red";
        document.getElementById(x[i]).style['stroke-width']=2.5;
      }
    }
  };

  var mouseleave = function (d) {
    if (d.instance <= 150) {
      //Tooltip.style("opacity", 0);
      for (var i = 0; i < x.length; i++) {
        document.getElementById(x[i]).style.stroke = "None";
      }
    }
  };

  function drawgrid(canvasnew, grid, size = { width: 5, height: 5 }) {
    var color_scale = d3
      .scaleOrdinal()
      .range(["#3385ff", "#ff8c1a", "#99cc00", "white"]);

    //bind data
    canvasnew
      .selectAll("g")
      .data(grid)
      .join(
        (enter) => {
          enter
            .append("circle")
            .attr("r", 11)

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
            .style("stroke-width", 2)
            //.attr("style", "outline: thin solid red;")
            .on("mouseover", mouseover)
            .on("mouseleave", mouseleave);

          enter
            .append("text")
            .attr("class", "label")
            .attr("id", function (d) {
              return d.instance;
            })
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
            })
            .on("mouseover", mouseover)
            //.on("mousemove", mousemove)
            .on("mouseleave", mouseleave);
        },
        (update) => {},
        (exit) => {}
      );

    //enter
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
        mix: d.Mix,
        mixnew: d.Mixnew,
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
