/*
 * Assignment: BasicGraph
 * Name: TODO
 * Date: TODO
 *
 * IMPORTANT: READ ALL INSTRUCTIONS BEFORE BEGINNING THIS ASSIGNMENT
 *
 * Complete your implementation of the BasicGraph class, which represents a set of Vertexes
 * along with the Edges connecting them (this will require implementing Vertex and Edge classes
 * as well). To aid with your implementation, we have included the prototypes of all the functions
 * you need to define in order to properly create and use a BasicGraph. Feel free to define any
 * other helper functions that will make your life easier :)
 *
 */


/*
 * Constructor for a Vertex object. Properties of a Vertex include:
 *
 * double cost			The cost to reach this vertex; initially 0.
 * Array<Edge> edges	A set of pointers to all outbound edges from this vertex.
 * string name			The name of this vertex in the graph.
 * Vertex previous		A pointer to a previous vertex; initially NULL.
 * bool visited			Whether or not this vertex has currently been visited; initially false.
 *
 *
 * You should also include resetData() and toString() functions. See this link for their
 * documentation: http://stanford.edu/~stepp/cppdoc/Vertex-class.html
 */
 function Vertex(name){
	// TODO: Implement the properties and functions described above.
	this.cost = 0;
	this.edges = [];
	this.neighbors = [];
	this.name = name;
	this.previous = null;
	this.visited = false;
	this.resetData = function(){
		this.visited = false;
		this.cost = 0;
		this.previous = null;
	}
	this.toString = function(){
		var neighbors = "{"
		for (edge in this.edges){
			if(this.edges[edge].start!=this){
				if(neighbors.length>1){
					neighbors = neighbors+", ";
				}
				neighbors = neighbors+this.edges[edge].start.name;
			}
			if(this.edges[edge].end!=this){
				if(neighbors.length>1){
					neighbors = neighbors+", ";
				}
				neighbors = neighbors+this.edges[edge].end.name;
			}
		}
		neighbors = neighbors+"}";
		var string = "Edge{name="+this.name+", cost="+this.cost+", visited="+this.visited+", previous="+this.previous+", neighbors="+neighbors+"}"
		return string;
	}
}


/*
 * Constructor for an Edge object. Properties of an Edge include:
 *
 * double cost		The cost or weight of this edge.
 * Vertex end		A pointer to the finishing vertex touching this edge.
 * Vertex start		A pointer to the starting vertex touching this edge.
 * bool visited		Whether or not this edge has currently been visited; initially false.
 *
 *
 * You should also include resetData() and toString() functions. See this link for their
 * documentation: http://stanford.edu/~stepp/cppdoc/Edge-class.html
 */
 function Edge(start, end, cost) {
	// TODO: Implement the properties and functions described above.
	this.cost = cost;
	this.end = end;
	this.start = start;
	this.visited = true;	
	this.resetData = function(){
		this.visited = false;
	}
	this.toString = function(){
		return "Edge{start="+this.start.name+", finish="+this.end.name+", cost="+this.cost+"}";
	}
}

/*
 * Constructor for a BasicGraph object. Functions needed for a BasicGraph include:
 *
 * addEdge(v1, v2) 		Adds an edge to the graph.
 * addVertex(v) 		Adds a vertex to the graph.
 * clear() 				Removes all vertexes and edges from the graph.
 * clearEdges()			Removes all edges from the graph.
 * containsEdge(v1, v2) Returns whether the graph has an edge between the given two vertexes.
 * containsVertex(v)	Returns whether the graph has an edge between the given two vertexes.
 * getEdge(v1, v2)		Returns the edge between the given two vertexes.
 * getEdgeSet()			Returns the set of all edges in the graph.
 * getEdgeSet(v)		Returns the set of all edges that start at the specified vertex.
 * getNeighbors(v)		Returns the set of vertexes that are neighbors of the specified vertex, which can be indicated either as a pointer or by name.
 * getVertex(name) 		Looks up a vertex in the name table attached to the graph and returns that vertex.
 * getVertexSet() 		Returns the set of all vertexes in the graph.
 * isEmpty()			Returns true if the graph contains no vertexes or edges.
 * isNeighbor(v1, v2)	Returns true if the graph contains an edge from v1 to v2.
 * removeEdge(v1, v2)	Removes an edge from the graph, specified by the vertexes at its endpoints
 * removeVertex(name)	Removes a vertex from the graph, specified by its name
 * resetData() 			Clears any temporary internal data stored at each vertex and edge.
 * size()				Returns the number of vertexes in the graph.
 * toString() 			Converts the graph to a printable string representation.
 *
 *
 * IMPORTANT: See this link for their documentation --> http://stanford.edu/~stepp/cppdoc/BasicGraph-class.html
 */
 function BasicGraph() {
 	this.vertexes = [];
 	this.edges = [];
	// TODO: Implement the properties and functions described above.
	this.addVertex = function(v){
		this.vertexes.push(v);
	}
	this.addEdge = function(e){
		this.edges.push(e);
	}
	this.clear = function(){
		this.vertexes = [];
		this.edges = [];
	}
	this.clearEdges = function(){
		this.edges = [];
	}
	this.containsEdge = function(v1, v2){
		for (var edge in this.edges){
			if(this.edges[edge].start==v1||this.edges[edge].start==v2&&this.edges[edge].end==v1||this.edges[edge].end==v2){
				return true;
			}
		}
		return false;
	}
	this.containsVertex = function(v){
		for (var vertex in this.vertexes){
			if(this.vertexes[vertex]===v){
				return true;
			}
		}
		return false;
	}
	this.getEdge = function(v1, v2){
		for (var edge in this.edges){
			if((this.edges[edge].start==v1||this.edges[edge].start==v2)&&(this.edges[edge].end==v1||this.edges[edge].end==v2)){
				return this.edges[edge];
			}
		}
		return null;
	}
	this.getEdgeSet = function(){
		return this.edges;
	}
	this.getVertexEdges = function(v){
		e = [];
		for (edge in this.edges){
			if (this.edges[edge].start===v){
				e.push(this.edges[edge]);
			}
		}
		return e;
	}
	this.getNeighbors = function(v){
		n = [];
		for(var edge in this.edges){
			if(this.edges[edge].start===v){
				n.push(this.edges[edge].end);
			}
			if(this.edges[edge].end===v){
				n.push(this.edges[edge].start);
			}
		}
		return n;
	}
	this.getVertexSet = function(){
		return this.vertexes;
	}
	this.isEmpty = function(){
		if(this.vertexes.length==0&&this.edges.length==0){
			return true;
		}
		return false;
	}
	this.removeVertex = function(v){
		for (var vertex in this.vertexes){
			if (this.vertexes[vertex]==v){
				var index = this.vertexes.indexOf(this.vertexes[vertex]);
				this.vertexes.splice(index, 1);
			}
		}
	}
	//TODO Fix
	this.resetData = function(){
		for (var edge in this.edges){
			this.edges[edge].resetData();
		}
		for (var vertex in this.vertexes){
			this.vertexes[vertex].resetData();
		}
	}
	this.size = function(){
		return this.vertexes.length;
	}
	this.toString = function(){
		var string = "{";
		for (var vertex in this.vertexes){
			if(string.length>1){
				string = string+", ";
			}
			string = string+this.vertexes[vertex].name;
		}
		for (var edge in this.edges){
			string = string+", "+this.edges[edge].start.name+" -> "+this.edges[edge].end.name;
		}
		string = string + "}"
		return string;
	}
}

function Dijkstra(graph, source, end){
	source.cost = 0;
	source.previous = null;
	var queue = [];
	for (var vertex in graph.vertexes){
		if(graph.vertexes[vertex]!=source){
			graph.vertexes[vertex].cost=Infinity;
			graph.vertexes[vertex].previous=null;
		}
		queue.push(graph.vertexes[vertex]);
	}
	while (queue.length>0){
		var minDist = Infinity;
		var currentVertex;
		for (var vertex in queue){
			if(queue[vertex].cost<minDist){
				minDist = queue[vertex].cost;
				currentVertex = queue[vertex];
				var index = queue.indexOf(queue[vertex]);
			}
		}
		queue.splice(index,1);
		var allNeighbors = graph.getNeighbors(currentVertex);
		var neighbors = [];
		for (var neighbor in allNeighbors){
			if (queue.indexOf(allNeighbors[neighbor])!=-1){
				neighbors.push(allNeighbors[neighbor]);
			}
		}
		for (var neighbor in neighbors){
			var alt = currentVertex.cost+graph.getEdge(neighbors[neighbor], currentVertex).cost;
			if(alt < neighbors[neighbor].cost){
				neighbors[neighbor].cost = alt;
				neighbors[neighbor].previous = currentVertex;
			}
		}
	}
	function findPath (v, path, cost){
		while(v.previous){
			if(path.length>0){
				path = v.name+" -> "+ path;
			}else{
				path = v.name;
			}
			cost = cost+v.cost
			v = v.previous;
		}
		path = v.name+" -> "+path;
		return [path, cost];
	}
	return findPath(end, "", 0)
}

function parseGraph(){
	var graph = new BasicGraph();
	var vertArr = [];
	var edgeArr = [];
	for(var y = 1; y <= 19; y++){
		for(var x = 1; x <= 25; x++){
			var v = new Vertex(x + "," + y);
			var v1 = new Vertex((x+1) + "," + (y));
			//console.log(v.name + " , " + v1.name);
			var e = new Edge(v,v1,1);
			/*if(foregroundData[x][y]===3){
				v.visted = true;
			}else if(foregroundData[x+1][y]===3){
				v1.visted = true;
			}*/
			graph.addVertex(v);
			graph.addVertex(v1);
			graph.addEdge(e);
			vertArr.push(v);
			vertArr.push(v1);
			edgeArr.push(e);
		}
	}

	for(var y1 = 0; y1 < 18; y1++){
		for(var x1 = 0; x1 < 26; x1++){
			var vertex = vertArr[y1];
			var vertex1 = vertArr[y1+26];
			var e1 = new Edge(vertex,vertex1,1);
			graph.addEdge(e1);
			edgeArr.push(e1);
		}
	}

	var start = vertArr[0], end = (vertArr.length-1);
	result = Dijkstra(graph, start, end);
	console.log(result[0] + "," + result[1]);
	return result[0];
}

parseGraph();

var graph1 = new BasicGraph();

var v1 = new Vertex("Penguin Paradise");
var v2 = new Vertex("Toucan Tundra");
var v3 = new Vertex("Flamingo Forest");
var v4 = new Vertex("Hummingbird Hotsprings");
var v5 = new Vertex("Uncle Rico");
var v6 = new Vertex("Chris Fleming");

var e1 = new Edge(v1, v3, 20);
var e2 = new Edge(v1, v6, 420);
var e3 = new Edge(v3, v5, 15);
var e4 = new Edge(v3, v2, -4);
var e5 = new Edge(v2, v4, 5);
var e6 = new Edge(v5, v4, 4);
var e7 = new Edge(v5, v6, 50);

var vertArra = [v1, v2, v3, v4, v5, v6];
var edgeArra = [e1, e2, e3, e4, e5, e6, e7];

vertArra.forEach( function(v) { graph1.addVertex(v); });
edgeArra.forEach( function(e) { graph1.addEdge(e); });
result1 = Dijkstra(graph1,v1,v6);
var theDiv = document.getElementById("result");
var p = document.createElement("p");
p.appendChild(document.createTextNode("The shortest Path from "+v1.name+" to "+v6.name+" with a distance/cost of "+result1[1]+" is:"));
var content1 = document.createTextNode(result1[0]);
theDiv.appendChild(p);
theDiv.appendChild(content1);