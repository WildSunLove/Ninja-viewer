// Generated by CoffeeScript 1.6.1
(function() {

  $(document).ready(function() {
    var Network, myNetwork;
    Network = function() {
      var allData, charge, curLinksData, curNodesData, force, forceTick, height, hideDetails, lineScale, link, linkedByIndex, linksG, mapNodes, neighboring, network, node, nodeColors, nodeCounts, nodesG, setupData, showDetails, strokeFor, tooltip, update, updateLinks, updateNodes, width;
      width = 960;
      height = 800;
      allData = [];
      curLinksData = [];
      curNodesData = [];
      linkedByIndex = {};
      nodesG = null;
      linksG = null;
      node = null;
      link = null;
      force = d3.layout.force();
      nodeColors = d3.scale.category10();
      lineScale = d3.scale.linear().domain([0, 100]).range([0.8, 10]);
      tooltip = Tooltip("vis-tooltip", 230);
      charge = function(node) {
        return -Math.pow(node.radius, 2.0) / 2;
      };
      network = function(selection, data) {
        var vis;
        allData = setupData(data);
        vis = d3.select(selection).append("svg").attr("width", width).attr("height", height);
        linksG = vis.append("g").attr("id", "links");
        nodesG = vis.append("g").attr("id", "nodes");
        force.size([width, height]);
        force.on("tick", forceTick).charge(-20).linkDistance(30);
        return update();
      };
      update = function() {
        curNodesData = allData.nodes;
        curLinksData = allData.links;
        force.nodes(curNodesData);
        updateNodes();
        force.links(curLinksData);
        updateLinks();
        return force.start();
      };
      network.updateData = function(newData) {
        allData = setupData(newData);
        link.remove();
        node.remove();
        return update();
      };
      setupData = function(data) {
        var nodesMap;
        data.nodes.forEach(function(n) {
          var randomnumber;
          n.x = randomnumber = Math.floor(Math.random() * width);
          n.y = randomnumber = Math.floor(Math.random() * height);
          return n.radius = 5;
        });
        nodesMap = mapNodes(data.nodes);
        data.links.forEach(function(l) {
          l.source = nodesMap.get(l.source);
          l.target = nodesMap.get(l.target);
          return linkedByIndex["" + l.source.id + "," + l.target.id] = 1;
        });
        return data;
      };
      mapNodes = function(nodes) {
        var nodesMap;
        nodesMap = d3.map();
        nodes.forEach(function(n) {
          return nodesMap.set(n.id, n);
        });
        return nodesMap;
      };
      nodeCounts = function(nodes, attr) {
        var counts;
        counts = {};
        nodes.forEach(function(d) {
          var _name, _ref;
          if ((_ref = counts[_name = d[attr]]) == null) {
            counts[_name] = 0;
          }
          return counts[d[attr]] += 1;
        });
        return counts;
      };
      neighboring = function(a, b) {
        return linkedByIndex[a.id + "," + b.id] || linkedByIndex[b.id + "," + a.id];
      };
      updateNodes = function() {
        node = nodesG.selectAll("circle.node").data(curNodesData, function(d) {
          return d.id;
        });
        node.enter().append("circle").attr("class", "node").attr("cx", function(d) {
          return d.x;
        }).attr("cy", function(d) {
          return d.y;
        }).attr("r", function(d) {
          return d.radius;
        }).style("fill", function(d) {
          return nodeColors(d.id);
        }).style("stroke", function(d) {
          return strokeFor(d);
        }).style("stroke-width", 1.0);
        node.on("mouseover", showDetails).on("mouseout", hideDetails);
        node.call(force.drag);
        return node.exit().remove();
      };
      updateLinks = function() {
        link = linksG.selectAll("line.link").data(curLinksData, function(d) {
          return "" + d.source.id + "_" + d.target.id;
        });
        link.enter().append("line").attr("class", "link").attr("stroke", "#BBB").attr("stroke-opacity", 0.9).style("stroke-width", function(d) {
          return lineScale(d.weight);
        }).attr("x1", function(d) {
          return d.source.x;
        }).attr("y1", function(d) {
          return d.source.y;
        }).attr("x2", function(d) {
          return d.target.x;
        }).attr("y2", function(d) {
          return d.target.y;
        });
        return link.exit().remove();
      };
      forceTick = function(e) {
        node.attr("cx", function(d) {
          return d.x;
        }).attr("cy", function(d) {
          return d.y;
        });
        return link.attr("x1", function(d) {
          return d.source.x;
        }).attr("y1", function(d) {
          return d.source.y;
        }).attr("x2", function(d) {
          return d.target.x;
        }).attr("y2", function(d) {
          return d.target.y;
        });
      };
      strokeFor = function(d) {
        return d3.rgb(nodeColors(d.id)).darker().toString();
      };
      showDetails = function(d, i) {
        var content;
        content = '<p class="main">' + d.label + '</span></p>';
        tooltip.showTooltip(content, d3.event);
        if (link) {
          link.attr("stroke", function(l) {
            if (l.source === d || l.target === d) {
              return "#555";
            } else {
              return "#BBB";
            }
          }).attr("stroke-opacity", function(l) {
            if (l.source === d || l.target === d) {
              return 1.0;
            } else {
              return 0.5;
            }
          });
        }
        node.style("stroke", function(n) {
          if (n.searched || neighboring(d, n)) {
            return "#555";
          } else {
            return strokeFor(n);
          }
        }).style("stroke-width", function(n) {
          if (n.searched || neighboring(d, n)) {
            return 2.0;
          } else {
            return 1.0;
          }
        });
        return d3.select(this).style("stroke", "black").style("stroke-width", 2.0);
      };
      hideDetails = function(d, i) {
        tooltip.hideTooltip();
        node.style("stroke", function(n) {
          if (!n.searched) {
            return strokeFor(n);
          } else {
            return "#555";
          }
        }).style("stroke-width", function(n) {
          if (!n.searched) {
            return 1.0;
          } else {
            return 2.0;
          }
        });
        if (link) {
          return link.attr("stroke", "#BBB").attr("stroke-opacity", 0.8);
        }
      };
      return network;
    };
    if (repo) {
      myNetwork = Network();
      $("#date").on("change", function(d) {
        var date;
        date = $("#date").html();
        return d3.json("data/" + repo + "/" + repo + "_" + date + ".json", function(json) {
          return myNetwork.updateData(json);
        });
      });
      return d3.json("data/" + repo + "/" + repo + "_" + dates[di] + ".json", function(json) {
        $("#date").html(dates[di]);
        return myNetwork("#vis", json);
      });
    }
  });

}).call(this);
