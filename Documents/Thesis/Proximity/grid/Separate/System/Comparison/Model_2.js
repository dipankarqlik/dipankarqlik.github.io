var mainChartnew = function () {
  var size = { width: 2050, height: 1000 };
  var filename = "final_rules_model2.csv"; //projection
  var attr = ["x", "y"]; //X and Y attributes to use

  var canvas = d3
    .select("#canvas")
    .append("svg")
    .attr("width", size.width)
    .attr("height", size.height)
    .append("g");
  /* .attr(
      "transform",
      "translate(" + size.width / 12 + "," + size.height / 8 + ")"
    ); */

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

     var mouseover = function (d) {
    if (d.rule <= 991) {
      Tooltip.style("opacity", 1);
      // d3.select(this).style("stroke", "black").style("opacity", 1);
    }
  };
  var mousemove = function (d) {
    Tooltip;
    if (d.rule <= 991) {
      Tooltip.html("The Rule number is: " + d.rule)
        .style("right", d3.mouse(this)[0] + 90 + "px")
        .style("top", d3.mouse(this)[1] + 200 + "px");
    }
  };
  var mouseleave = function (d) {
    if (d.rule <= 991) {
      Tooltip.style("opacity", 0);
      // d3.select(this).style("stroke", "none").style("opacity", 1);
    }
  };

    d3.csv(filename, type).then(function (data) {
    data = normalize(data, attr);
    var gridsize = gridaspectratio(data, 1); //1.8
    var grid = grid_rec(data, gridsize);
    drawgrid(canvas, grid, { width: 14, height: 14 });
  });


  function drawgrid(canvas, grid, size = { width: 5, height: 5 }) {
    var color_scale = d3.scaleOrdinal()
    .range(["#3385ff", "#ff8c1a","#99cc00", "white"]);

  //bind data
  canvas.selectAll("g").data(grid)
.join(
        (enter) => {
          enter
      .append("circle")
      //.attr("width", size.width - 1)
      //.attr("height", size.height - 1)
      .attr("r", function(d){
        if (d.coverage >= 0.7) return 7;
              else if (d.coverage >= 0.3 && d.coverage < 0.7) return 5;
                  else return 4;
      })

    //update
    
      .attr("cx", function (d) {
        return size.width * d.j + 11;
      })
      .attr("cy", function (d) {
        return size.height * d.i + 12;
      })

      .style("fill", function (d) {
        return color_scale(d.color);
      })

.on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

.style("opacity", function(d){
  if(d.coverage == 1){
    return 1
  }
  else if(d.coverage >=0.60 && d.coverage<1){
    return 0.8
  }
  else{
    return 0.5
  }
}) 

    /*  .style("stroke", function (d) {
        if (d.mapping == "NonMatch") {
          return color_scale(d.color_new);
        }
      }) */
      .style("stroke-width", 3);
    //.attr("style", "outline: thin solid red;")


    // images.enter().append("text");
    // images
    //   .attr("class", "label")
    //   .attr("font-size", 6)
    //   .attr("x", function (d) {
    //     return size.width * d.j + 4;
    //   })
    //   .attr("y", function (d) {
    //     return size.height * d.i + 7;
    //   })
    //   .attr("dy", ".8em")
    //   .text(function (d) {
    //     return d.rule
    //   });
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
        color: d.class,
        rule: d.Rules,
        coverage: d.coverage
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
