var mainChartnew = function () {
  var size = { width: 3550, height: 1000 };
  var filename = "Instance_projections_new_model.csv"; //projection
  var attr = ["x", "y"]; //X and Y attributes to use

  var canvasnew = d3
    .select("#canvasnew")
    .append("svg")
    .attr("width", size.width)
    .attr("height", size.height)
    .append("g");

  var table = d3
      .select("#table-location")
      .append("table")
      .attr("class", "table table-condensed table-striped")
      .attr("height", "500")
      .style("overflow", "auto"),
    thead = table.append("thead"),
    tbody = table.append("tbody");

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
    drawgrid(canvasnew, grid, { width: 16, height: 16 });
  });

  var x;
  var mousemove = function (d) {
    if (d.instance <= 569) {
      Tooltip.style("opacity", 1);
      // d3.select(this).style("stroke", "black").style("opacity", 1);
    }
  };
  var mouseover = function (d) {
    Tooltip;
    if (d.instance <= 569) {
      Tooltip.html(
        "Instance no: " + d.instance + "</br>" + "Predicted class: " + d.color
      )
        .style("opacity", "1")
        .style("right", d3.mouse(this)[0] + 80 + "px")
        .style("top", d3.mouse(this)[1] + 100 + "px");
    }
  };
  var mouseleave = function (d) {
    if (d.instance <= 569) {
      Tooltip.style("opacity", 0);
      // d3.select(this).style("stroke", "none").style("opacity", 1);
    }
  };

  function drawgrid(canvasnew, grid, size = { width: 5, height: 5 }) {
    var color_scale = d3.scaleOrdinal().range(["#ff8c1a", "#3385ff", "white"]);

    //bind data

    canvasnew
      .selectAll("g")
      .data(grid)
      .join(
        (enter) => {
          enter
            .append("circle")
            .attr("r", 6)
            .attr("cx", function (d) {
              return size.width * d.j + 11;
            })
            .attr("cy", function (d) {
              return size.height * d.i + 12;
            })

            .style("fill", function (d) {
              return color_scale(d.color_new);
            })

            .style("stroke", function (d) {
              if (d.mapping == "NonMatch") {
                return color_scale(d.color);
                //return "red";
              }
            })
            .style("stroke-width", 2)

            .style("opacity", function (d) {
              if (d.stress < 0.2) {
                return 1;
              } else {
                return 0.6;
              }
            })
            //.attr("style", "outline: thin solid red;")
            .attr("class", function (d) {
              if (d.instance <= 569) {
                return "filter";
              }
            })

            .on("mouseover", mouseover)
            .on("mousmove", mousemove)
            .on("mouseleave", mouseleave)

            .on("click", function (d) {
              if (d.instance <= 569) {
                var lis = [];
                if (d3.select(this).style("stroke") == "black") {
                  //this is for onclicking 2nd time at same point
                  if (d.mapping == "NonMatch") {
                    //if the point already has a NonMatch, maintain that same stroke
                    d3.select(this).style("stroke", function (d) {
                      return color_scale(d.color);
                    });
                  } else {
                    //else set that stroke to none since it was initially like that
                    d3.select(this).style("stroke", "None");
                  }
                  var test = document.getElementsByClassName("filter");
                  console.log("second");
                  var cols = document.getElementsByClassName("forest");
                  for (var i = 0; i < test.length; i++) {
                    if (test[i].style.stroke == "black") {
                      lis.push(i + 1);
                    }
                  }
                } else {
                  //this is for first time clicking on any instance
                  d3.select(this).style("stroke", "black");
                  var test = document.getElementsByClassName("filter");
                  console.log("first");
                  for (var i = 0; i < test.length; i++) {
                    if (test[i].style.stroke == "black") {
                      lis.push(i + 1);
                      console.log(lis);
                    }
                  }

                  // tns = String("#" + d.instance);
                  //Make rules RED in Forest View:
                  x = d.mixnew.split(",");
                  for (var i = 0; i < x.length; i++) {
                    //console.log(document.getElementById(x[i]).style)

                    document.getElementById(x[i]).style.stroke = "Red";
                    document.getElementById(x[i]).style["stroke-width"] = 2.5;
                  }
                }

                if (lis.length == 0) {
                  parallelC("quit");
                } else {
                  parallelC(lis);
                }
              } else {
                console.log("last");
                parallelC("quit");

                // console.log(d);

                d3.selectAll("circle")
                  .data(grid)
                  .style("stroke", function (d) {
                    if (d.mapping == "NonMatch") {
                      return color_scale(d.color);
                    } else {
                      return "None";
                    }
                  });

                var cols = document.getElementsByClassName("forest");
                for (i = 0; i < cols.length; i++) {
                  cols[i].style.stroke = "none";
                  cols[i].style["stroke-width"] = 0;
                }
              }
            });

          // enter
          //   .append("text")
          //   .attr("class", "label")
          //   .attr("id", function (d) {
          //     return d.instance;
          //   })
          //   .attr("font-size", 9)
          //   .attr("x", function (d) {
          //     return size.width * d.j + 4;
          //   })
          //   .attr("y", function (d) {
          //     return size.height * d.i + 7;
          //   })
          //   .attr("dy", ".8em")
          //   .text(function (d) {
          //     if (d.instance <= 150) {
          //       return d.instance;
          //     }
          //   })
          //   .on("mouseover", mouseover)
          //   .on("mousmove", mousemove)
          //   .on("mouseleave", mouseleave)

          //   .on("click", function (d) {
          //     if (d.instance <= 150) {
          //       var cols = document.getElementsByClassName("forest");
          //       for (i = 0; i < cols.length; i++) {
          //         cols[i].style.stroke = "none";
          //         cols[i].style["stroke-width"] = 0;
          //       }
          //       x = d.mixnew.split(",");
          //       for (var i = 0; i < x.length; i++) {
          //         document.getElementById(x[i]).style.stroke = "Red";
          //         document.getElementById(x[i]).style["stroke-width"] = 2.5;
          //       }
          //     } else {
          //       var cols = document.getElementsByClassName("forest");
          //       for (i = 0; i < cols.length; i++) {
          //         cols[i].style.stroke = "none";
          //         cols[i].style["stroke-width"] = 0;
          //       }
          //     }
          //   });

          //Code to click on misclassified button:
          // var buttonn = document.getElementById("mybutton");
          // buttonn.onclick = function () {
          //   d3.selectAll("circle")
          //     .data(grid)
          //     .style("stroke", function (d) {
          //       if (d.mapping == "NonMatch") {
          //         return "red";
          //         //return "red";
          //       }
          //     });
          // };

          canvasnew
            .append("circle")
            .attr("cx", 700)
            .attr("cy", 40)
            .attr("r", 6)
            .style("fill", "#ff8c1a");
          canvasnew
            .append("circle")
            .attr("cx", 700)
            .attr("cy", 60)
            .attr("r", 6)
            .style("fill", "#3385ff");
          canvasnew
            .append("text")
            .attr("x", 720)
            .attr("y", 60)
            .text("Class 1: Malignant")
            .style("font-size", "13px")
            .attr("alignment-baseline", "middle");
          canvasnew
            .append("text")
            .attr("x", 720)
            .attr("y", 40)
            .text("Class 0: Benign")
            .style("font-size", "13px")
            .attr("alignment-baseline", "middle");
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
        mixnew: d.Mix,
        stress: d.Stress,
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
