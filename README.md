**It is a library called "Simple Tree" to create an hierarchical tree using svg**
Short video of usage https://drive.google.com/file/d/1JJxbXdElmZlpX_YR9Kt18qrrwzJ3Lv-Y/view

***It is not finished yet. The next step will be expanding `createNode` function to create nodes (elements) by different settings***

All the code you need, using this library (which is not finished yet) is:

<svg style="background: rgb(240,240,240)" height="600" width="1500"></svg>		
<button class="create-new-element" style="display: block;">Create new element</button>
<button class="connect-elements" style="display: block;">Connect elements</button>

<script>
  var ST = new simpleTree();
  document.querySelector('button.create-new-element').addEventListener('click', ST.createNode);
  document.querySelector('button.connect-elements').addEventListener('click', ST.createConnection);
  dragOptions = {
    horizontal : true, // if the param will be false, nodes will not be drugged on X coordinate
    vertical : true // if the param will be false, nodes will not be drugged only on Y coordinate
  }
  ST.drag(dragOptions);
</script>

    You can get "Nodes to connections" info by using ST.nodesToConnections The structure of it:

nodeID_1: Array [ connectionID_1_1, connectionID_1_2 ],
nodeID_2: Array [ connectionID_2_1, connectionID_2_2 ]

    You can get "Nodes to nodes" info by using ST.nodesToNodes The structure of it:

nodeID_1: Array [ connectedNodeID_1_1, connectedNodeID_1_2 ],
nodeID_2: Array [ connectedNodeID_2_1, connectedNodeID_2_2 ]

    You can get info about "Connections" by ST.connections The structure:

connectionID:
  {
    fromNodeID: nodeID,
    toNodeID: nodeID,
    x1: (int),
    x2: (int),
    y1: (int),
    y2: (int)
 }
