var mainChart = function () {
  var size = { width: 3550, height: 2000 };
  var filename = "Wine_instance.csv"; //projection
  var attr = ["x", "y"]; //X and Y attributes to use

  var canvas = d3
    .select("#canvas")
    .append("svg")
    .attr("width", size.width)
    .attr("height", size.height)
    .append("g");
  //.attr("transform", "translate(" + size.width / 2 + "," + size.height/4 + ")");

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
    drawgrid(canvas, grid, { width: 13, height: 13 });
  });

  var x;
  var mouseover = function (d) {
    if (d.instance <= 1599) {
      Tooltip.style("opacity", 1);
      Tooltip.html("Ins number : " + d.instance+ "</br>" + "Fixed acidity: " + d.fa + "</br>" + "Volatile acidity:"
      + d.va + "</br>" + "Citric acid: "+ d.ca + "</br>" + "Residual sugar: "+ d.rs + "</br>" + "Chlorides: "+ d.cl
      + "</br>" + "Free sulphur dioxide: "+ d.fsd+ "</br>" + "Total sulphur dioxide: "+ d.tsd + "</br>" + "Density: "+ d.density
      + "</br>" + "pH: "+ d.ph + "</br>" + "Sulphates: "+ d.sul + "</br>" + "Alcohol: "+ d.alc+ "</br>" + "Predicted Class is: " + d.color)
        .style("right", d3.mouse(this)[0] + 10 + "px")
        .style("top", d3.mouse(this)[1] + 100 + "px");
    }
  };

  var mouseleave = function (d) {
    if (d.instance <= 1599) {
      Tooltip.style("opacity", 0);
    }
  };

  function drawgrid(canvas, grid, size = { width: 5, height: 5 }) {
    var color_scale = d3
      .scaleOrdinal()
      //.range(["orange", "green", "purple", "white"]);
      .domain(["5", "6", "7", "dummy"])
      .range(["#bcbc21", "#8c564b", "#9367bc", "white"]);

    var color_scale_new = d3
      .scaleOrdinal()
      //.range(["orange", "green", "purple", "white"]);
      .domain(["5", "6", "7", "4", "8", "3", "dummy"])
      .range([
        "#bcbc21",
        "#8c564b",
        "#9367bc",
        "#ff7e0e",
        "#e277c1",
        "#1f77b3",
        "white",
      ]);

    //bind data
    var images = canvas.selectAll("g").data(grid);

    //enter
    testnew = images
      .enter()
      .append("circle")
      //.attr("width", size.width - 1)
      //.attr("height", size.height - 1)
      .attr("r", 6)

      //update
      .attr("cx", function (d) {
        return size.width * d.j + 11;
      })
      .attr("cy", function (d) {
        return size.height * d.i + 12;
      })

      .style("fill", function (d) {
        return color_scale_new(d.color_new);
      })

      .style("stroke", function (d) {
        if (d.mapping == "Non") {
          return color_scale(d.color);
        }
      })
      .style("stroke-width", 1)

      .on("click", function (d) {
        if (d.instance <= 1599) {
          var cols = document.getElementsByClassName("forest");
          for (i = 0; i < cols.length; i++) {
            cols[i].style.stroke = "none";
            cols[i].style["stroke-width"] = 0;
          }
          x = d.mixnew.split(",");
          for (var i = 0; i < x.length; i++) {
            document.getElementById(x[i]).style.stroke = "Red";
            document.getElementById(x[i]).style["stroke-width"] = 2;
          }
        } 
        
        else {
          var cols = document.getElementsByClassName("forest");
          for (i = 0; i < cols.length; i++) {
            cols[i].style.stroke = "none";
            cols[i].style["stroke-width"] = 0;
          }
        }
      })

      .on("mouseover", mouseover)
      //.on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    //.attr("style", "outline: thin solid red;")

    /*
    images
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("font-size", 4)
      .attr("x", function (d) {
        return size.width * d.j + 8;
      })
      .attr("y", function (d) {
        return size.height * d.i + 10;
      })
      .attr("font-weight", "bold")
      .attr("dy", ".8em")
      .text(function (d) {
        if (d.instance <= 1599) {
          return d.instance;
        }
      })
      .on("click", function (d) {
        if (d.instance <= 1599) {
          var cols = document.getElementsByClassName("forest");
          for (i = 0; i < cols.length; i++) {
            cols[i].style.stroke = "none";
            cols[i].style["stroke-width"] = 0;
          }
          x = d.mixnew.split(",");
          for (var i = 0; i < x.length; i++) {
            document.getElementById(x[i]).style.stroke = "Red";
            document.getElementById(x[i]).style["stroke-width"] = 2;
          }
        } else {
          var cols = document.getElementsByClassName("forest");
          for (i = 0; i < cols.length; i++) {
            cols[i].style.stroke = "none";
            cols[i].style["stroke-width"] = 0;
          }
        }
      })
      .on("mouseover", mouseover)
      //.on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
      */


     var lasso_start = function() {
      lasso.items()
          .attr("r", 6) // reset size
          .classed("not_possible",true)
          .classed("selected",false);
  };

  var lasso_draw = function() {
  
      // Style the possible dots
      lasso.possibleItems()
          .classed("not_possible",false)
          .classed("possible",true);

      // Style the not possible dot
      lasso.notPossibleItems()
          .classed("not_possible",true)
          .classed("possible",false);
  };

  var lasso_end = function() {
      // Reset the color of all dots
      lasso.items()
          .classed("not_possible",false)
          .classed("possible",false);

      // Style the selected dots
      lasso.selectedItems()
          .classed("selected",true)
          .attr("r", 6)
          .style("stroke", function(d){
            if(d.instance<=1599){
              return "red"
            }
          })

      // Reset the style of the not selected dots
      lasso.notSelectedItems()
          .attr("r", 6)
          .style("opacity", 0.8)
          .style("stroke", function(d){
            if(d.instance<=1599){
              return "None"
            }
          })

  };
  
  var lasso = d3.lasso()
      .closePathSelect(true)
      .closePathDistance(100)
      .items(testnew)
      .targetArea(canvas)
      .on("start",lasso_start)
      .on("draw",lasso_draw)
      .on("end",lasso_end);
  
  canvas.call(lasso);
  }

  function grid_rec(data, gridsize) {
    var grid = data.map(function (d, i) {
      return {
        id: i + 1,
        x: d.x,
        y: d.y,
        i: 0,
        j: 0,
        color: d.class_pred,
        color_new: d.class_orig,
        instance: d.Instance,
        mapping: d.Matches,
        mixnew: d.Mixnew,
        fa: d.fixed_acidity,
        va: d.volatile_acidity,
        ca: d.citric_acid,
        rs: d.residual_sugar,
        cl: d.chlorides,
        fsd: d.free_sulfur_dioxide,
        tsd: d.total_sulfur_dioxide,
        density: d.density,
        ph: d.pH,
        sul: d.sulphates,
        alc: d.alcohol
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
