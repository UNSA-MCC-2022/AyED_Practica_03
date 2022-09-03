 function Octree(parent, origin, halfwidth, halfheight, halfdepth) {
	this.origin = origin;
	this.halfwidth = halfwidth;
	this.halfheight = halfheight;
	this.halfdepth = halfdepth;

	this.depth = parent === null ? 0 : parent.depth + 1;

	this.entities = new Array();	

	this.parent_node = parent;
	this.children_nodes = new Array();

	this._all_entities = new Array();
	this._to_update = parent === null ? new Array() : parent._to_update;
	this._leaves = new Array();
	this._leaves.push(this);

	this._need_leaves_update = false;
	this._need_all_entities_update = false;

	var _this = this;

	this.onEntityPoseChanged = function(entity) {
		if(_this._to_update.indexOf(entity) === -1)
			_this._to_update.push(entity);
	}

	// grafico visual/depuración
	var geo = new THREE.CubeGeometry( halfwidth*2, halfheight*2, halfdepth*2 );
	
	this.mesh = new THREE.Mesh( geo, new THREE.MeshBasicMaterial( { color: 0x0, opacity: 1, wireframe: true } ) );
	this.mesh.position = origin.clone();

	if(parent !== null)
	{
		this.mesh.position.sub(parent.origin);
		parent.mesh.add(this.mesh);
	}
	//
}

Octree.prototype.constructor = Octree;

Octree.prototype.entities_per_node = 1;
Octree.prototype.max_depth = 5;

Octree.prototype.add = function(entity) {

	var _this = this;
	function addToThis() {
		var iter = _this;
		while(iter !== null)
		{
			iter._need_all_entities_update = true;
			iter = iter.parent_node;
		}
		_this.entities.push(entity);
		_this.mesh.visible = true;
	}

	if(!this.intersects(entity))
		return;

	if(this.depth >= this.max_depth)
	{
		addToThis();
	}
	else if(this.children_nodes.length == 0)
	{
		if(this.entities.length < this.entities_per_node)
		{
			addToThis();
		}	
		else
		{	
			this.subdivide();

			if( this.entities.length !== 0 ) 
			{
				var entities_tmp = this.entities.slice();
				this.entities.length = 0;
				while(entities_tmp.length > 0)
				{
					var ent = entities_tmp.pop();
					this.remove(ent);
					this.add(ent);
				}
			}

			this.add(entity);
		}
			
	}
	else
	{
		// verificar si el obb se cruza (intersects) con varios hijos
		var child_id = -1;
		var multiple_intersect = false;
		for(var i = 0; i < this.children_nodes.length; i++)
		{
			if(this.children_nodes[i].intersects(entity))
			{
				if(child_id != -1)
				{
					multiple_intersect = true;
					break;
				}
				child_id = i;
			}
		}

		if(multiple_intersect)
		{
			addToThis();
		}
		else
			this.children_nodes[child_id].add(entity);
	}
};

Octree.prototype.remove = function(entity) {
	for(var i = 0; i < this.entities.length; i++ )
	{
		if(this.entities[i] === entity)
		{
			this.entities.splice(i, 1);
			break;
		}		
	}

	var iter = this;
	while(iter !== null)
	{
		iter._need_all_entities_update = true;
		iter = iter.parent_node;
	}
};

Octree.prototype.empty = function(){
	if(this.entities.length > 0)
		return false;

	for(var i = 0; i < this.children_nodes.length; i++)
	{
		if(!this.children_nodes[i].empty())
			return false;
	}
	return true;
};

Octree.prototype.intersects = function(entity) {
	return this.contains(entity.position);
};

Octree.prototype.contains = function(point) {
	var diff = new THREE.Vector3();
	diff.subVectors( point, this.origin );

	return Math.abs(diff.x) <= this.halfwidth && Math.abs(diff.y) <= this.halfheight && Math.abs(diff.z) <= this.halfdepth;
};

Octree.prototype.subdivide = function() {

	/*       _____________
		   /  4   /  5   /|        y
		  /_____ /______/ |        |
	     /      /      /| |        |___ x
		/_____ / _____/ |/|       / 
		|   0  |  1   | |7|      /
		|_____ |_____ |/|/       z
		|   2  |  3   | /
		|_____ |_____ |/ 
	*/

	if(this.depth >= this.max_depth)
		return;

	this.needLeavesUpdate();

	var qwidth = this.halfwidth / 2;
	var qheight = this.halfheight / 2;
	var qdepth = this.halfdepth / 2;

	this.children_nodes[0] = new Octree( this, new THREE.Vector3( this.origin.x - qwidth, 
													  this.origin.y + qheight, 
													  this.origin.z + qdepth ),
								   qwidth, qheight, qdepth);

	this.children_nodes[1] = new Octree( this, new THREE.Vector3( this.origin.x + qwidth, 
													  this.origin.y + qheight, 
													  this.origin.z + qdepth ),
								   qwidth, qheight, qdepth);

	this.children_nodes[2] = new Octree( this, new THREE.Vector3( this.origin.x - qwidth, 
													  this.origin.y - qheight, 
													  this.origin.z + qdepth ),
								   qwidth, qheight, qdepth);

	this.children_nodes[3] = new Octree( this, new THREE.Vector3( this.origin.x + qwidth, 
													  this.origin.y - qheight, 
													  this.origin.z + qdepth ),
								   qwidth, qheight, qdepth);

	this.children_nodes[4] = new Octree( this, new THREE.Vector3( this.origin.x - qwidth, 
													  this.origin.y + qheight, 
													  this.origin.z - qdepth ),
								   qwidth, qheight, qdepth);

	this.children_nodes[5] = new Octree( this, new THREE.Vector3( this.origin.x + qwidth, 
													  this.origin.y + qheight, 
													  this.origin.z - qdepth ),
								   qwidth, qheight, qdepth);

	this.children_nodes[6] = new Octree( this, new THREE.Vector3( this.origin.x - qwidth, 
													  this.origin.y - qheight, 
													  this.origin.z - qdepth ),
								   qwidth, qheight, qdepth);

	this.children_nodes[7] = new Octree( this, new THREE.Vector3( this.origin.x + qwidth, 
													  this.origin.y - qheight, 
													  this.origin.z - qdepth ),
								   qwidth, qheight, qdepth);
};

// conteo de la máxima intersección de hijos.
Octree.prototype.countChildrenIntersections = function(max, entity) {
	var children_idx = new Array();
	for(var j = 0; j < this.children_nodes.length; j++)
	{
		if(this.children_nodes[j].intersects(entity))
			children_idx.push(j);
		if(children_idx.length === max)
			break;
	}
	return children_idx;
}

Octree.prototype.needLeavesUpdate = function() {
	var iter = this;
	while(iter !== null)
	{
		iter._need_leaves_update = true;
		iter = iter.parent_node;
	}
}

// actualiza la referencia de las entidades hijas 
Octree.prototype.updateChildrenEntities = function() {
	if(this._need_all_entities_update)
	{
		this._all_entities.length = 0;
		for(var i = 0; i < this.children_nodes.length; i++)
		{
			this.children_nodes[i].updateChildrenEntities();
			this._all_entities = this._all_entities.concat(this.children_nodes[i]._all_entities);
		}

		for(var i = 0; i < this.entities.length; i++)
		{
			this._all_entities.push([this.entities[i], this]);
		}
	}
}

// actualiza los hojas (leaves) de referencia
Octree.prototype.updateLeaves = function() {
	if(this._need_leaves_update)
	{
		this._leaves.length = 0;
		for(var i = 0; i < this.children_nodes.length; i++)
		{
			
			this.children_nodes[i].updateLeaves();
			this._leaves = this._leaves.concat(this.children_nodes[i]._leaves);
		}

		if(this.children_nodes.length === 0)
			this._leaves.push(this);

		this._need_leaves_update = false;
	}
}

Octree.prototype.update = function() {

	var _this = this;
	_this.updateChildrenEntities();
	var entities_tmp = this._all_entities.slice();
	entities_tmp.forEach( function(element) {
		var entity = element[0];
		
		for(var i = 0; i < _this._to_update.length; i++)
		{
			if( entity === _this._to_update[i] )
			{
				var octree;
				var intersections;

                // comprueba si hay intersección múltiple con hijos
                // si es así, haga lo mismo recursivamente con los padres hasta que podamos ajustarlo por completo
                // en un nodo y agregarlo a este nodo
				octree = element[1];
				while(octree !== null)
				{
					intersections = octree.countChildrenIntersections(2, entity);
					
					if(intersections.length === 1)
					{
						// no realice ninguna operación si no se requiere ninguna actualización
						if(element[1] === octree.children_nodes[intersections[0]])
							break;
						element[1].remove(entity);
						octree.children_nodes[intersections[0]].add(entity);
						break;
					}
					else if(octree.parent_node === null && intersections.length > 0) 
					{
						element[1].remove(entity);
						octree.add(entity);
						break;
					}
					else
						octree = octree.parent_node;
				}
				_this._to_update.splice(i,1);
				break;
			}
		}
	});

	// actualiza todas las matrices _all_entities
	_this.updateChildrenEntities();
 
	_this.updateLeaves();

	function pruneUp(node) {
		if(node._all_entities.length <= 1)
		{			
            // remueve a los hijos de la matriz(leaves) y separe su malla de los padres
			(function removeChildrenNodes(node) {
				for(var i = 0; i < node.children_nodes.length; i++)
				{
					removeChildrenNodes(node.children_nodes[i]);
					var idx = _this._leaves.indexOf(node.children_nodes[i]);
					if( idx !== -1 )
						_this._leaves.splice(idx, 1);
					node.mesh.remove(node.children_nodes[i].mesh);
				}
			})(node);

			node.needLeavesUpdate();
			node.children_nodes.length = 0;

			if(node._all_entities.length === 1 && (node._all_entities[0])[1] !== node)
			{
				// if the entity was in a one of the child, put it in current node
                //si la entidad esta en uno de los hijos, colocarlo en el nodo actual
				node._all_entities[0][1] = node;	// actualizará esta referencia para el nodo de los padres también
				node.add(node._all_entities[0][0]);
			}
			if(node.parent_node !== null)
			{
				pruneUp(node.parent_node);
			}	
		}
	}

	this._leaves.forEach( function(node){
		pruneUp(node);
	});	
};
