let ST = new simpleTree();
document.querySelector('button.create-new-element').addEventListener('click', ST.createNode);
document.querySelector('button.connect-elements').addEventListener('click', ST.createConnection);

dragOptions = {
	horizontal : true, // if the param will be false, nodes will not be drugged only on X axis
	vertical : true // if the param will be false, nodes will not be drugged only on Y axis
}
ST.drag(dragOptions);
