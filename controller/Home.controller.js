sap.ui.define([
        'complaint/controller/BaseController',
		'jquery.sap.global',
		'sap/ui/core/mvc/Controller',
		'sap/m/MessageToast',		
		'sap/ui/core/Fragment',		
		'sap/ui/model/Filter',
		'sap/ui/model/json/JSONModel',
		'sap/m/MessageBox',		
		'sap/m/Dialog',
		'sap/m/TextArea',
		'sap/m/Button',
		'sap/m/Text',		
	], function(BaseController, jQuery, Controller, MessageToast, Fragment, Filter, JSONModel, MessageBox, Dialog, TextArea, Button, Text) {
	"use strict";
	
	return BaseController.extend("complaint.controller.Home", {
		
		getSplitAppObj : function() {
			var result = this.byId("HomeSplitApp");
			if (!result) {
				jQuery.sap.log.info("SplitApp object can't be found");
			}
			return result;
		},		
		
		onInit: function(){								 				
			this.getSplitAppObj().setHomeIcon({
				'phone':'phone-icon.png',
				'tablet':'tablet-icon.png',
				'icon':'desktop.ico'
			});								
			this.getSplitAppObj().setMode(sap.m.SplitAppMode.ShowHideMode);										
			
			var oRouter = this.getRouter();
			oRouter.getRoute("appHome").attachMatched(this._onRouteMatched, this);			
		},	
		onBeforeRendering: function() {			
			this.getView().byId("master").setBusy(true);
			this.getView().byId("detail").setBusy(true);	
		},
		onAfterRendering: function(){							
		},	
		
		_onRouteMatched : function (oEvent) {			
			this.runningOnPhone = sap.ui.Device.system.phone;
			this.getSplitAppObj().setMode(sap.m.SplitAppMode.ShowHideMode);					  			
			
			this.getView().setModel(sap.ui.getCore().getModel());
			
			this.ComplId = jQuery.sap.getUriParameters().get("complid");						
									
			if( this.runningOnPhone ){
				this.getView().byId("detail").setVisible(false);			
			}
		},
		
		hideBusyIndicator : function() {
			sap.ui.core.BusyIndicator.hide();
		},
		
		showBusyIndicator : function (iDuration, iDelay) {
			sap.ui.core.BusyIndicator.show(iDelay);
 
			if (iDuration && iDuration > 0) {
				if (this._sTimeoutId) {
					jQuery.sap.clearDelayedCall(this._sTimeoutId);
					this._sTimeoutId = null;
				}
 
				this._sTimeoutId = jQuery.sap.delayedCall(iDuration, this, function() {
					this.hideBusyIndicator();
				});
			}
		},
		
		onListUpdateFinished: function(oEvent){															
			
			var itemCount = this.getView().byId("ComplaintList").getItems().length;			
			this.getView().byId("master").setTitle("Complaints (" + itemCount + ")");						
			
			if( this.ComplId != null ){											
				// add filter for search
				var aFilters = [];
				
				var filter = new Filter("ComplId", sap.ui.model.FilterOperator.Contains, this.ComplId);
				aFilters.push(filter);
				
				// update list binding
				var list = this.getView().byId("ComplaintList");
				var binding = list.getBinding("items");
				binding.filter(aFilters,"Application");
				this.ComplId = null;				
			}				
			
			if( this.runningOnPhone == false ){ //do not auto select first item when in phone mode
				 var firstItem = this.getView().byId("ComplaintList").getItems()[0];   
		         this.getView().byId("ComplaintList").setSelectedItem(firstItem,true);
		         
		         var sComplId = "";
		         //var sItemNo = "";
		         
		         if( firstItem != undefined ){
		        	 sComplId = firstItem.getBindingContext().getProperty("ComplId");
		        	 //sItemNo = firstItem.getBindingContext().getProperty("ItemNo");
		         }
		          
		       //bind model to page
		         this.getView().byId("detail").bindElement({
					 path : "/ComplaintDetailSet(ComplId='" + sComplId + "',ItemNo='0000000001')"
				});									 				 				
				 
		         var oBinding = this.getView().byId("TableProduct").getBinding("items");
		         var oFilter;
		         oFilter = new sap.ui.model.Filter("ComplId", sap.ui.model.FilterOperator.EQ,sComplId);
		         oBinding.filter([oFilter]);
		         
				 this.getSplitAppObj().toDetail(this.createId("detail"));	
			}		
			this.getView().byId("master").setBusy(false);
			this.getView().byId("detail").setBusy(false);
		},		
		
		onListItemPress : function(oEvent) {
			//get binding property: Product Id
			var sComplId = oEvent.getSource().getBindingContext().getProperty("ComplId");
			//var sItemNo = oEvent.getSource().getBindingContext().getProperty("ItemNo");						
						
			//bind model to page
			this.getView().byId("detail").bindElement({
				path : "/ComplaintDetailSet(ComplId='" + sComplId + "',ItemNo='0000000001')"
			});					
						
            if( this.runningOnPhone == true ){
            	this.getView().byId("detail").setVisible(true);	
            	this.getView().byId(this.createId("detail")).setShowNavButton(true);
            }
            
            var oBinding = this.getView().byId("TableProduct").getBinding("items");
	        var oFilter;
	        oFilter = new sap.ui.model.Filter("ComplId", sap.ui.model.FilterOperator.EQ,sComplId);
	        oBinding.filter([oFilter]);
            
			this.getSplitAppObj().toDetail(this.createId("detail"));
		},		
				
		onSearch : function (oEvt) {
			 
			// add filter for search
			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("ComplSubject", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}
 
			// update list binding
			var list = this.getView().byId("InquiryList");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},
		
		formatterDate: function(v){			
			jQuery.sap.require("sap.ui.core.format.DateFormat");  
		    var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "dd.MM.YYYY"});
		    if( oDateFormat.format(new Date(v)) != "01.01.1970" ){
		    	return oDateFormat.format(new Date(v));
		    }
		    return "";
		},		
		
		onPressDetailBack : function() {
			this.getSplitAppObj().backDetail();			
		}, 
		
		onPressMasterBack : function(oEvent) {
						
			this.getSplitAppObj().backMaster();
		},		
															
	}); 
 
});