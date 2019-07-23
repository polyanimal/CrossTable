sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	 "sap/ui/model/json/JSONModel",
	 "sap/ui/model/resource/ResourceModel",
	 "sap/m/Button"
], function (Controller, MessageToast, JSONModel, ResourceModel, Button) {
	"use strict";
	
	var testArray = [];
	
	function findProp(xs, key, value) {
		return xs.filter(function (x){
			return x[key] === value;
		});
	}
	
	function valueMap(xs, key){
		return xs.map(function(x){
			return x[key];
		});
	}
	
	function unique(xs) {
		var seen = {};
		return xs.filter(function(x) {
			return seen.hasOwnProperty(x) ? false : (seen[x] = true);
		});
	}
	
	var groupBy = function(xs, key) {
		return xs.reduce(function(rv, x) {
			(rv[x[key]] = rv[x[key]] || []).push(x);
			return rv;
		}, {});
	};
	
	function initTable(mController){
		var oRowSelect = new sap.m.Select("oRowSelect", {width : "10%"});
		var oColSelect = new sap.m.Select("oColSelect", {width : "10%"});
		var oCrossSelect = new sap.m.Select("oCrossSelect", {width : "10%"});
		
		var oModel = new sap.ui.model.json.JSONModel();
		var oTable = new sap.ui.table.Table("tab6", {selectionMode : sap.ui.table.SelectionMode.None});
		
		var keysSet = Object.keys(testArray[0]);
		for(var f = 0; f < keysSet.length; f++){
			oRowSelect.addItem(new sap.ui.core.Item({text : keysSet[(f + 1) % keysSet.length]}));	
			oColSelect.addItem(new sap.ui.core.Item({text : keysSet[f]}));	
			oCrossSelect.addItem(new sap.ui.core.Item({text : keysSet[(f + 3) % keysSet.length]}));	
		}
		
		oModel.setData({
	        array : testArray,
	    	oRowSelect : oRowSelect,
	    	oColSelect : oColSelect,
	    	oCrossSelect : oCrossSelect,
			table: oTable	
		});
		
		oTable.setModel(oModel);
			
		mController.getView().byId("Main").addContent(oRowSelect);
		mController.getView().byId("Main").addContent(oColSelect);
		mController.getView().byId("Main").addContent(oCrossSelect);
		mController.getView().byId("Main").addContent(oTable);
		
		mController.getView().setModel(oModel);
	} 
	
	function bindData(oModel){
		//var testArray = oModel.getProperty("/array");
		var oTable = oModel.getProperty("/table");
		
		var oRowSelect = oModel.getProperty("/oRowSelect");
		var oColSelect = oModel.getProperty("/oColSelect");
		var oCrossSelect = oModel.getProperty("/oCrossSelect");
		
		var oRowPivot = oRowSelect.getSelectedItem().getText();
		var oColPivot = oColSelect.getSelectedItem().getText();
		var oProperty = oCrossSelect.getSelectedItem().getText();
		
		var rowPropertySet = unique(valueMap(testArray, oRowPivot));
		var columnPropertySet = unique(valueMap(testArray, oColPivot));
		
		if(!isNaN(columnPropertySet[0]))
		    columnPropertySet.sort(function(a, b){return a-b;});
		
		if(!isNaN(rowPropertySet[0]))
		    rowPropertySet.sort(function(a, b){return a-b;});
		
		var group = Object.values(groupBy(testArray, oColPivot));

		var aRowData = [];
		var aColumnData = [];
		
		aColumnData.push({columnId : "t"});
		for(var i = 0; i < columnPropertySet.length; i++){
		    var obj = {columnId : "t" + String(columnPropertySet[i])};
		    aColumnData.push(obj);
		}
		
		for(i = 0; i < rowPropertySet.length; i++){
			var b = {};
			b["t"]= rowPropertySet[i];
			for(var j = 0; j < columnPropertySet.length; j++){
				var ys = findProp(group[j], oRowPivot, rowPropertySet[i]);				
				var key = "t" + columnPropertySet[j];				
				b[key] = (ys.length > 0) ? unique(valueMap(ys, oProperty)) : "---";					
			}
		    aRowData.push(b);
		}
		

		if(!isNaN(testArray[0][oProperty])){
			var sigma = [];
			var sb = {};
			sb["t"] = "Σ";
			for(j = 0; j < columnPropertySet.length; j++){
				sigma[j] = 0;
				key = "t" + columnPropertySet[j];
				for(i = 0; i < rowPropertySet.length; i++){
					
					sigma[j] += (!isNaN(aRowData[i][key][0])) ?
						parseInt(aRowData[i][key].reduce(function(r,v){return r + v;}), 10) 
						: 0;
				}
			
				sb[key] = "Σ:" + String(sigma[j]);
			}
			aRowData.push(sb);
		}
		
		oModel.setProperty("/columns", aColumnData);
		oModel.setProperty("/rows", aRowData);

		oTable.setModel(oModel);
		
		oTable.bindColumns("/columns", function(index, context) {
		    	var sColumnId = context.getObject().columnId;
		        return new sap.ui.table.Column({
		            label: sColumnId.substring(1), 
		            template: sColumnId
		        });
		    });
		oTable.bindRows("/rows");
	}
	
	return Controller.extend("Table.controller.App", {
		onInit : function(){
			testArray = [{
				Warehouse: "001A",
				Item: "Quantum Prism",
				Vendor: "Macrohard Corp.",
				Quantity: 10
			},
			{
				Warehouse: "001A",
				Item: "Liquid Crystal",
				Vendor: "RockSolid Industries",
				Quantity: 20
			},
			{
				Warehouse: "001A",
				Item: "Synthetic Heart",
				Vendor: "Kronos Heaven",
				Quantity: 50
			},
			{
				Warehouse: "001A",
				Item: "Hardware JSON Parser",
				Vendor: "Parsec Microelectronics",
				Quantity: 21
			},
			{
				Warehouse: "001B",
				Item: "Quantum Prism",
				Vendor: "Macrohard Corp.",
				Quantity: 228
			},
			{
				Warehouse: "001B",
				Item: "Liquid Crystal",
				Vendor: "RockSolid Industries",
				Quantity: 1337
			},
			{
				Warehouse: "001B",
				Item: "Synthetic Heart",
				Vendor: "Kronos Heaven",
				Quantity: 420
			},
			{
				Warehouse: "001B",
				Item: "Hardware JSON Parser",
				Vendor: "Parsec Microelectronics",
				Quantity: 7134
			},
			{
				Warehouse: "001C",
				Item: "Quantum Prism",
				Vendor: "Macrohard Corp.",
				Quantity: 8903
			},
			{
				Warehouse: "001C",
				Item: "Quantum Prism",
				Vendor: "Macrohard Corp.",
				Quantity: 21
			},
			{
				Warehouse: "001C",
				Item: "Liquid Crystal",
				Vendor: "RockSolid Industries",
				Quantity: 555
			},
			{
				Warehouse: "001C",
				Item: "Synthetic Heart",
				Vendor: "Kronos Heaven",
				Quantity: 3232
			},
			{
				Warehouse: "001C",
				Item: "Hardware JSON Parser",
				Vendor: "Parsec Microelectronics",
				Quantity: 777
			}
			,{
				Warehouse: "001C",
				Item: "Hardware JSON Parser",
				Vendor: "Parsec Microelectronics",
				Quantity: 778
			}
			];
		
			initTable(this);
		},	
		
		onAfterRendering : function(){
			var oModel = this.getView().getModel();
			bindData(oModel);
		},
		
		onPress : function(){
			var oModel = this.getView().getModel();
			bindData(oModel);
		}
	});
});//

			

			