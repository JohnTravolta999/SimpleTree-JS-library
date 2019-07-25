function simpleTree(dragOptions) {

	const SVGURL = 'http://www.w3.org/2000/svg';
	const svg = document.getElementsByTagName('svg')[0];

	let draggingHorizontal = true;
	let draggingVertical = true;
	const draggingDefault = {
		horizontal : true,
		vertical : true
	}

	/* Connections start */
	let connection = true;
	let connectionCoordinatesStart;
	let connectionCoordinatesEnd;
	let connectionCoordinatesTemp = {};
	let moveConnectionsTemp = {};

	this.connections = {};
	this.nodesToConnections = {};
	this.nodesToNodes = {};
	/* Connections end */

	this.createConnection = function() {
		connection = true;
	}

	this.denyConnection = function() {
		connection = false;
	}

	function setConnectionCoordinates(g, type) {
		let gData = g.getBoundingClientRect();
		let coordinates = {
			gCenterX : gData.left + (gData.width / 2),
			gCenterY : gData.top + (gData.height / 2)
		}

		if(type === 'start') {
			connectionCoordinatesStart = coordinates;
			document.body.addEventListener("mousemove",  moveConnection);
		} else if(type === 'move') {
			connectionCoordinatesEnd = coordinates;
		}
	}

	function moveConnection(e) {
		let fromDataID = e.target.getAttribute('data-id')
		let toDataID = svg.getAttribute('data-id');

		let x1 = connectionCoordinatesStart.gCenterX;
		let y1 = connectionCoordinatesStart.gCenterY;
		let x2;
		let y2

		if(connection === true && toDataID !== fromDataID) { // If we finished path ON the another element
			let g = document.querySelector('g[data-id="' + fromDataID + '"]');
			setConnectionCoordinates(g, 'move');
			x2 = connectionCoordinatesEnd.gCenterX;
			y2 = connectionCoordinatesEnd.gCenterY;
		} else {
			x2 = e.clientX;
			y2 = e.clientY;
		}

		drawConnection(toDataID, x1, y1, x2, y2);

		connectionCoordinatesTemp.x1 = x1;
		connectionCoordinatesTemp.y1 = y1;
		connectionCoordinatesTemp.x2 = x2;
		connectionCoordinatesTemp.y2 = y2;
	}

	this.createNode = function(e) {
		e.stopPropagation();
		let dataID = getRandHash();
		let g = document.createElementNS(SVGURL, 'g');

		let x = y = 30 + Math.floor(Math.random() * 50);

		let rect = document.createElementNS(SVGURL, 'rect');
		rect.setAttribute('x', x);
		rect.setAttribute('y', y);
		rect.setAttribute('width', '100');
		rect.setAttribute('height', '100');
		rect.setAttribute('rx', '5');
		rect.setAttribute('data-id', dataID);

		let text = document.createElementNS(SVGURL, 'text');
		let textNode = document.createTextNode('Some Node');
		text.setAttribute('x', x + 5);
		text.setAttribute('y', y + 20);
		text.setAttribute('text', 'Some Node');
		text.setAttribute('data-id', dataID);
		text.appendChild(textNode);

		g.appendChild(rect);
		g.appendChild(text);
		g.setAttribute('x', x);
		g.setAttribute('y', y);
		g.setAttribute('init', true); // avoid twitching the first time we move
		g.setAttribute('data-id', dataID);
		svg.appendChild(g);
	}

	this.drag = function(dragging = draggingDefault) {
		draggingHorizontal = dragging.horizontal === false ? false : true;
		draggingVertical = dragging.vertical === false ? false : true;
		document.body.addEventListener('mousedown', start);
		document.body.addEventListener('mouseup', finish);
	}

	let start = (e) => {
		let dataID = e.target.getAttribute('data-id');
		if(dataID) {
			svg.setAttribute('data-id', dataID);

			let g = document.querySelector('g[data-id="' + dataID + '"]');
			if(connection === false) {							
				svg.setAttribute('clientX', e.clientX);
				svg.setAttribute('clientY', e.clientY);
				
				g.setAttribute('startX', g.getAttribute('x'));
				g.setAttribute('startY', g.getAttribute('y'));
				g.classList.add("active");

				// Block of code to get all existing connections and set x/y axis that have to be static while dragging a node
				if(this.nodesToConnections[dataID] && this.connections) {
					let staticX;
					let staticY;
					let init; // just switcher to define to/from in moveConnectionWithNode function
					this.nodesToConnections[dataID].forEach(function(connection, index) {
						if(this.connections[connection].fromNodeID == dataID) { // from dataID
							staticX = this.connections[connection].x2;
							staticY = this.connections[connection].y2;
							init = 2;
						} else { // to dataID
							staticX = this.connections[connection].x1;
							staticY = this.connections[connection].y1;
							init = 1;
						}
						moveConnectionsTemp[connection] = {
							init : init,
							staticX : staticX,
							staticY : staticY
						}
					}.bind(this));
				}

				document.body.addEventListener("mousemove",  move);
			} else {
				setConnectionCoordinates(g, 'start');
			}
		} else {
			this.denyConnection(); // If we clicked not on the node
		}
	}

	let moveConnectionWithNode = (g) => {

		let gData = g.getBoundingClientRect();
		let nodeCoordinates = {
			gCenterX : gData.left + (gData.width / 2),
			gCenterY : gData.top + (gData.height / 2)
		}

		for (let key in moveConnectionsTemp) {
			let x1, y1, x2, y2;

			if(moveConnectionsTemp[key].init == 1) {
				x1 = moveConnectionsTemp[key].staticX;
				y1 = moveConnectionsTemp[key].staticY;
				x2 = nodeCoordinates.gCenterX;
				y2 = nodeCoordinates.gCenterY;
			} else {
				x2 = moveConnectionsTemp[key].staticX;
				y2 = moveConnectionsTemp[key].staticY;
				x1 = nodeCoordinates.gCenterX;
				y1 = nodeCoordinates.gCenterY;
			}

			drawConnection(key, x1, y1, x2, y2);

			this.connections[key].x1 = x1;
			this.connections[key].y1 = y1;
			this.connections[key].x2 = x2;
			this.connections[key].y2 = y2;

		}
	}

	let drawConnection = (connectionDataID, x1, y1, x2, y2) => {
		let oldPath = document.querySelector('path[data-id="' + connectionDataID + '"]');
		if(oldPath) oldPath.remove();
		let path = document.createElementNS(SVGURL, 'path');
		let coordinates = 
			'M' + 
			x1 + 
			' ' + 
			y1 + 
			' L ' + 
			x2 + 
			' ' + 
			y2;

		path.setAttribute('d', coordinates);
		path.setAttribute('data-id', connectionDataID);

		let theFirstChild = svg.firstChild;
		// We do insertBefore instead of appendChild in order to make paths be hidden under the g elements
		svg.insertBefore(path, theFirstChild);
	}


	let move = (e) => {
		let startClientX = Number(svg.getAttribute('clientX'));
		let startClientY = Number(svg.getAttribute('clientY'));

		let dataID = svg.getAttribute('data-id');
		let g = document.querySelector('g[data-id="' + dataID + '"]');
		let startX = Number(g.getAttribute('startX'));
		let startY = Number(g.getAttribute('startY'));

		if(g.classList.contains("active")) {
			if(g.getAttribute('init') !== null) {
				startX = 0;
				startY = 0;
			}
			let x = startX + (e.clientX - startClientX);
			let y = startY + (e.clientY - startClientY);
			if(draggingHorizontal === false) x = 0;
			if(draggingVertical === false) y = 0;
			let translate = 'translate(' + x + ',' + y + ')';
			g.setAttribute('transform', translate);
			g.setAttribute('x', x);
			g.setAttribute('y', y);
		}

		if(moveConnectionsTemp) moveConnectionWithNode(g);
	}

	let finish = (e) => {
		document.body.removeEventListener("mousemove",  move);

		let dataID = e.target.getAttribute('data-id');

		if(dataID) {
			let g = document.querySelector('g[data-id="' + dataID + '"]');
			g.classList.remove("active");
			g.removeAttribute('init');

			if(connection === true) finishConnection(dataID);

		} else {
			this.denyConnection();
		}

		moveConnectionsTemp = {};
		
		svg.removeAttribute('data-id');
		svg.removeAttribute('clientX');
		svg.removeAttribute('clientY');
	}


	let finishConnection = (toDataID) => {
		let fromDataID = svg.getAttribute('data-id');
		let path = document.querySelector('path[data-id="' + fromDataID + '"]');
		let newPathID = getRandHash();
		if(path) {
			path.setAttribute('data-id', newPathID);
			path.setAttribute('data-firstNodeID', fromDataID);
			path.setAttribute('data-secondNodeID', toDataID);
		}

		if(toDataID === fromDataID) { // If we finished path NOT on the another element
			if(path) path.remove();
		} else {
			setConnectionsData(fromDataID, toDataID, newPathID);
		}
		document.body.removeEventListener("mousemove",  moveConnection);
		this.denyConnection();
	}

	let setConnectionsData = (fromDataID, toDataID, pathID) => {
		let gArr = [fromDataID, toDataID];

		this.connections[pathID] = {
			fromNodeID : fromDataID,
			toNodeID : toDataID,
			x1 : connectionCoordinatesTemp.x1,
			y1 : connectionCoordinatesTemp.y1,
			x2 : connectionCoordinatesTemp.x2,
			y2 : connectionCoordinatesTemp.y2
		};

		gArr.forEach(function(g, i) {
			let baseID = i === 0 ? fromDataID : toDataID;
			let connectedID = i === 0 ? toDataID : fromDataID;

			// We have such order (first pathIDs, then connections), because it can be that
			// we will have references from one node to another and vice versa several times

			/* #Structure
				nodeID_1: Array [ connectionID_1_1, connectionID_1_2 ],
				nodeID_2: Array [ connectionID_2_1, connectionID_2_2 ]
			*/
			if(this.nodesToConnections[baseID]) {
				this.nodesToConnections[baseID].push(pathID);
			} else {
				this.nodesToConnections[baseID] = [pathID];
			}

			/* #Structure
				nodeID_1: Array [ connectedNodeID_1_1, connectedNodeID_1_2 ],
				nodeID_2: Array [ connectedNodeID_2_1, connectedNodeID_2_2 ]
			*/
			if(this.nodesToNodes[baseID]) {
				if(this.nodesToNodes[baseID].includes(connectedID)) return; // it's like continue for common loop
				this.nodesToNodes[baseID].push(connectedID);
			} else {
				this.nodesToNodes[baseID] = [connectedID];
			}
		}.bind(this));

		connectionCoordinatesTemp = {};
		connectionCoordinatesStart = undefined;
		connectionCoordinatesEnd = undefined;
	}

	function getRandHash() {
		return Math.random().toString(16).substring(2);
	}

}
