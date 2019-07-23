sap.ui.getCore().attachInit(function () {
	"use strict";

    sap.ui.require([
		"sap/ui/core/mvc/XMLView"
	], function (XMLView) {
		XMLView.create({viewName: "Table.view.App"}).then(function (oView) {
			oView.placeAt("content");
		});
	});

});