var tables = function (param) {
    var values = [
        ['Instance', 'Office', 'Merchandise', 'Legal', '<b>TOTAL</b>'],
        [param]]
    var data = [{
        type: 'table',
        header: {
          values: [["<b>EXPENSES</b>"], ["<b>Q1</b>"],
                       ["<b>Q2</b>"], ["<b>Q3</b>"], ["<b>Q4</b>"]],
          align: "center",
          line: {width: 1, color: 'black'},
          fill: {color: "grey"},
          font: {family: "Arial", size: 12, color: "white"}
        },
        cells: {
          values: values,
          align: "center",
          line: {color: "black", width: 1},
          font: {family: "Arial", size: 11, color: ["black"]}
        }
      }]
      
      Plotly.newPlot('newtab', data);
}