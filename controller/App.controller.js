sap.ui.define([
	"complaint/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("complaint.controller.App", {

		onInit: function () {
						
		},
		onBeforeRendering: function() {
			this.getView().setBusy(true);			
		},
		onAfterRendering: function(){
			this.getView().setBusy(false);
		},

	});

});

