
/**
 * @file functions to compute model/view/projection matrices
 *
 * @copyright The Board of Trustees of the Leland Stanford Junior University
 * @version 2022/03/31

 */

/**
 * MVPmat
 *
 * @class MVPmat
 * @classdesc Class for holding and computing model/view/projection matrices.
 *
 * @param  {DisplayParameters} dispParams    display parameters
 */
var MVPmat = function ( dispParams ) {

	// Alias for accessing this from a closure
	var _this = this;


	// A model matrix
	this.modelMat = new THREE.Matrix4();

	// A view matrix
	this.viewMat = new THREE.Matrix4();

	// A projection matrix
	this.projectionMat = new THREE.Matrix4();


	var topViewMat = new THREE.Matrix4().set(
		1, 0, 0, 0,
		0, 0, - 1, 0,
		0, 1, 0, - 1500,
		0, 0, 0, 1 );

	/* Functions */

	// A function to compute a model matrix based on the current state
	//
	// INPUT
	// state: state of StateController
	function computeModelTransform( state ) {
		var translationMatrix = new THREE.Matrix4().makeTranslation( state.modelTranslation.x, 
			state.modelTranslation.y, state.modelTranslation.z );
		var rotationXMatrix = new THREE.Matrix4();
		var rotationYMatrix = new THREE.Matrix4();
		rotationXMatrix.makeRotationX( state.modelRotation.x * ( Math.PI / 180 ) );
		rotationYMatrix.makeRotationY( state.modelRotation.y * ( Math.PI / 180 ) );
		var rotationMatrices = new THREE.Matrix4().multiplyMatrices( rotationXMatrix, rotationYMatrix );
		var matrix = new THREE.Matrix4().multiplyMatrices( translationMatrix, rotationMatrices );
		return matrix;
		/* TODO (2.1.1.3) Matrix Update / (2.1.2) Model Rotation  */
	}

	// A function to compute a view matrix based on the current state
	//
	// NOTE
	// Do not use lookAt().
	//
	// INPUT
	// state: state of StateController
	function computeViewTransform( state ) {

		/* TODO (2.2.3) Implement View Transform */

		//var center = new THREE.Vector3( state.viewerTarget.x, state.viewerTarget.y, state.viewerTarget.z );
		
		//var eye = new THREE.Vector3( state.viewerPosition.x, state.viewerPosition.y, state.viewerPosition.z );

		//z_c.divideScalar( Math.sqrt( z_c.x * z_c.x + z_c.y * z_c.y + z_c.z * z_c.z ) );	

		//x_c.divideScalar( Math.sqrt( x_c.x * x_c.x + x_c.y * x_c.y + x_c.z * x_c.z ) );

		
		/*var center = state.viewerTarget;
		var eye = state.viewerPosition;
		var up = new THREE.Vector3( 0, 1, 0 );

		var z_c_temp = new THREE.Vector3().subVectors( eye, center );
		//console.log('z_c_temp:' z_c_temp);
		var z_c = z_c_temp.normalize();
		//console.log('z_c:' z_c);

		var x_c_temp = new THREE.Vector3().crossVectors( up, z_c );
		var x_c = x_c_temp.normalize();

		var y_c = new THREE.Vector3().crossVectors( z_c, x_c );

		console console.log();

		var rotationMatrix = new THREE.Matrix4().set(
			x_c.x, x_c.y, x_c.z, 0,
			y_c.x, y_c.y, y_c.z, 0,
			z_c.x, z_c.y, z_c.z, 0,
			0, 0, 0, 1 );

		var translationMatrix = THREE.Matrix4().set(
			1, 0, 0, -eye.x,
			0, 1, 0, -eye.y,
			0, 0, 1, -eye.z,
			0, 0, 0, 1 );
		*/

		var eye = state.viewerPosition;
		var center = state.viewerTarget;
		var zc_temp = new THREE.Vector3().subVectors(eye,center);

		var zc = zc_temp.normalize();


		var up = new THREE.Vector3(0,1,0);

		var xc_temp = new THREE.Vector3().crossVectors(up,zc)

		var xc = xc_temp.normalize();

		var yc = new THREE.Vector3().crossVectors(zc,xc);

		var R_matrix = new THREE.Matrix4().set(
			xc.x, xc.y, xc.z, 0,
			yc.x, yc.y, yc.z, 0,
			zc.x, zc.y, zc.z, 0,
			0, 0, 0, 1);


		var T_matrix = new THREE.Matrix4().set(
			1, 0, 0, -eye.x,
			0, 1, 0, -eye.y,
			0, 0, 1, -eye.z,
			0, 0, 0, 1);

		return new THREE.Matrix4().multiplyMatrices(R_matrix,T_matrix);
		
		
		//return new THREE.Matrix4().multiplyMatrices( rotationMatrix, translationMatrix );
		
		/*
		return new THREE.Matrix4().set(
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, -800,
			0, 0, 0, 1 );
		*/
	}	

	// A function to compute a perspective projection matrix based on the
	// current state
	//
	// NOTE
	// Do not use makePerspective().
	//
	// INPUT
	// Notations for the input is the same as in the class.
	function computePerspectiveTransform(
		left, right, top, bottom, clipNear, clipFar ) {

		/* TODO (2.3.1) Implement Perspective Projection */

		return new THREE.Matrix4().set(
			6.7, 0, 0, 0,
			0, 6.5, 0, 0,
			0, 0, - 1.0, - 2.0,
			0, 0, - 1.0, 0 );

	}

	// A function to compute a orthographic projection matrix based on the
	// current state
	//
	// NOTE
	// Do not use makeOrthographic().
	//
	// INPUT
	// Notations for the input is the same as in the class.
	function computeOrthographicTransform(
		left, right, top, bottom, clipNear, clipFar ) {

		/* TODO (2.3.2) Implement Orthographic Projection */

		return new THREE.Matrix4();

	}

	// Update the model/view/projection matrices
	// This function is called in every frame (animate() function in render.js).
	function update( state ) {

		// Compute model matrix
		this.modelMat.copy( computeModelTransform( state ) );

		// Use the hard-coded view and projection matrices for top view
		if ( state.topView ) {

			this.viewMat.copy( topViewMat );

			var right = ( dispParams.canvasWidth * dispParams.pixelPitch / 2 )
				* ( state.clipNear / dispParams.distanceScreenViewer );

			var left = - right;

			var top = ( dispParams.canvasHeight * dispParams.pixelPitch / 2 )
				* ( state.clipNear / dispParams.distanceScreenViewer );

			var bottom = - top;

			this.projectionMat.makePerspective( left, right, top, bottom, 1, 10000 );

		} else {

			// Compute view matrix
			this.viewMat.copy( computeViewTransform( state ) );

			// Compute projection matrix
			if ( state.perspectiveMat ) {

				var right = ( dispParams.canvasWidth * dispParams.pixelPitch / 2 )
				* ( state.clipNear / dispParams.distanceScreenViewer );

				var left = - right;

				var top = ( dispParams.canvasHeight * dispParams.pixelPitch / 2 )
				* ( state.clipNear / dispParams.distanceScreenViewer );

				var bottom = - top;

				this.projectionMat.copy( computePerspectiveTransform(
					left, right, top, bottom, state.clipNear, state.clipFar ) );

			} else {

				var right = dispParams.canvasWidth * dispParams.pixelPitch / 2;

				var left = - right;

				var top = dispParams.canvasHeight * dispParams.pixelPitch / 2;

				var bottom = - top;

				this.projectionMat.copy( computeOrthographicTransform(
					left, right, top, bottom, state.clipNear, state.clipFar ) );

			}

		}

	}



	/* Expose as public functions */

	this.computeModelTransform = computeModelTransform;

	this.computeViewTransform = computeViewTransform;

	this.computePerspectiveTransform = computePerspectiveTransform;

	this.computeOrthographicTransform = computeOrthographicTransform;

	this.update = update;

};
