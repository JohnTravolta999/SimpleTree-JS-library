## "Simple Tree" is a library to create an hierarchical tree using svg
*Short video of usage* https://drive.google.com/file/d/1mpVtnx56nueAdasNLQOliJ824IzuDJfE/view

***It is not finished yet. The next step will be expanding `createNode` function (which is hardcoded now intentionally) to create nodes (elements) with different settings (rect, circle etc.)***  

### All the code you need (which you've seen in the video), using this library, is:
```
/*** HTML (index.html) ***/
<svg></svg>
<div id="controls">
	<button class="button create-new-element">Create new element</button>
	<button class="button connect-elements">Connect elements</button>
</div>

/*** JavaScript (custom.js) ***/
let ST = new simpleTree();
document.querySelector('button.create-new-element').addEventListener('click', ST.createNode);
document.querySelector('button.connect-elements').addEventListener('click', ST.createConnection);

dragOptions = {
	horizontal : true, // if the param will be false, nodes will not be drugged on X axis
	vertical : true // if the param will be false, nodes will not be drugged only on Y axis
}
ST.drag(dragOptions);
```

***The library itself is in the file simpleTree.js***

### After you build the tree you can export some data, here it is how to do it:

#### You can get "Nodes to connections" info by using `ST.nodesToConnections`. The structure of it:
```
nodeID_1: Array [ connectionID_1_1, connectionID_1_2 ],
nodeID_2: Array [ connectionID_2_1, connectionID_2_2 ]
```

#### You can get "Nodes to nodes" info by using `ST.nodesToNodes`. The structure of it:
```
nodeID_1: Array [ connectedNodeID_1_1, connectedNodeID_1_2 ],
nodeID_2: Array [ connectedNodeID_2_1, connectedNodeID_2_2 ]
```

#### You can get info about "Connections" by `ST.connections`. The structure:
```
connectionID:
  {
    fromNodeID: nodeID,
    toNodeID: nodeID,
    x1: (int),
    x2: (int),
    y1: (int),
    y2: (int)
 }
```
