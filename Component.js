sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/core/routing/Router",
	"sap/ui/Device",
	"complaint/model/models",	
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("complaint.Component", {

		metadata: {
			manifest: "json"				
		},		
		
		init: function() {
			// call the base components init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			//this.setModel(models.createDeviceModel(), "device");			
		                       
			// set device model
			
	        var deviceModel = new sap.ui.model.json.JSONModel({
	            isTouch : sap.ui.Device.support.touch,
	            isNoTouch : !sap.ui.Device.support.touch,
	            isPhone : sap.ui.Device.system.phone,
	            isNoPhone : !sap.ui.Device.system.phone,
	            listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
	            listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive",
	            infoTextWeight : sap.ui.Device.system.phone ? 4 : 2	            		
	        });
	        deviceModel.setDefaultBindingMode("OneWay");
	        this.setModel(deviceModel, "device");	        		        
			
			//var sServiceUrl = "proxy/http/dsapui.app.co.id/sap/opu/odata/sap/ZAFE_SRV";
			//var sServiceUrl = "proxy/http/dsapui.app.co.id/sap/opu/odata/sap/ZINQUIRY_SRV";
			var sServiceUrl = this.getMetadata().getManifestEntry("sap.app").dataSources["mainService"].uri;
			sap.ui.getCore().AppContext.sUrl = sServiceUrl;
			
			//var sServiceUrl = "proxy/https/fioridev.app.co.id/sap/opu/odata/sap/ZINQUIRY_SRV";
			var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, false);
			oModel.setDefaultBindingMode("OneWay");
			oModel.setCountSupported(false);
			sap.ui.getCore().setModel(oModel);			 					
			
			// create the views based on the url/hash
            this.getRouter().initialize();
		}				
	});

});