/// <reference path="../Scripts/jspack-vsdoc.js" />

var AbstractionLayer = MindFusion.AbstractionLayer;
var AnchorPattern = MindFusion.Diagramming.AnchorPattern;
var AnchorPoint = MindFusion.Diagramming.AnchorPoint;
var DiagramNode = MindFusion.Diagramming.DiagramNode;
var DiagramLink = MindFusion.Diagramming.DiagramLink;
var ContainerNode = MindFusion.Diagramming.ContainerNode;
var ShapeNode = MindFusion.Diagramming.ShapeNode;
var MarkStyle = MindFusion.Diagramming.MarkStyle;
var Style = MindFusion.Diagramming.Style;
var Theme = MindFusion.Diagramming.Theme;
var FontStyle = MindFusion.Drawing.FontStyle;
var Font = MindFusion.Drawing.Font;
var Alignment = MindFusion.Diagramming.Alignment;
var Behavior = MindFusion.Diagramming.Behavior;
var HandlesStyle = MindFusion.Diagramming.HandlesStyle;
var ChangeItemCommand = MindFusion.Diagramming.ChangeItemCommand;
var Events = MindFusion.Diagramming.Events;
var Diagram = MindFusion.Diagramming.Diagram;
var Overview = MindFusion.Diagramming.Overview;
var NodeListView = MindFusion.Diagramming.NodeListView;
var Rect = MindFusion.Drawing.Rect;
var Shape = MindFusion.Diagramming.Shape;
var DashStyle = MindFusion.Drawing.DashStyle;
var Point = MindFusion.Drawing.Point;


var diagram, nodeList;
var backgroundColor, linkDashStyle, baseShape, headShape, headBrush;

$(document).ready(function ()
{	
     backgroundColor = "#f2ebcf";
	 linkDashStyle = DashStyle.Solid; 
	 baseShape = null;
	 headShape = "Triangle";
	 headBrush = "#7F7F7F";

	// create a Diagram component that wraps the "diagram" canvas
	diagram = AbstractionLayer.createControl(Diagram, null, null, null, $("#diagram")[0]);
	diagram.setAllowInplaceEdit(true);
	diagram.setRouteLinks(true);
	diagram.setShowGrid(true);
	diagram.setUndoEnabled(true);
	diagram.setRoundedLinks(true);
	diagram.setBounds(new Rect(0, 0, 2000,2000));
	
	var theme = new Theme();
	var shapeNodeStyle = new Style();
	shapeNodeStyle.setBrush({ type: 'SolidBrush', color: '#f2ebcf' });
	shapeNodeStyle.setStroke("#7F7F7F");
	shapeNodeStyle.setTextColor("#585A5C");
	shapeNodeStyle.setFontName("Verdana");
	shapeNodeStyle.setFontSize(3);
	theme.styles["std:ShapeNode"] = shapeNodeStyle;
	var linkStyle = new Style();
	linkStyle.setStroke("#7F7F7F");
	linkStyle.setStrokeThickness(1.0);
	linkStyle.setTextColor("#585A5C");
	linkStyle.setFontName("Verdana");
	linkStyle.setFontSize(3);
	theme.styles["std:DiagramLink"] = linkStyle;
	diagram.setTheme(theme);	

	diagram.addEventListener(Events.nodeCreated, onNodeCreated);
	diagram.addEventListener(Events.linkCreated, onLinkCreated);

	
	// create an NodeListView component that wraps the "nodeList" canvas
	nodeList = AbstractionLayer.createControl(NodeListView, null, null, null, $('#nodeList')[0]);	
    
	 var node = new ShapeNode();	
	 node.setTransparent(true);
	 node.setText("Text");
	 node.setFont(new Font("Verdana", 12));
	 nodeList.addNode(node, "Text");
	 
	 node = new ShapeNode();
	 node.setShape('Decision');
	 node.setBrush({ type: 'SolidBrush', color: '#f2ebcf' });
	 nodeList.addNode(node, "Decision");
	 
	 node = new ShapeNode();
	 node.setShape('RoundRect');
	 node.setBrush({ type: 'SolidBrush', color: '#f2ebcf' });
	 nodeList.addNode(node, "Rounded Rect");
	 
	 node = new ShapeNode();
	 node.setShape('Circle');
	 node.setBrush({ type: 'SolidBrush', color: '#f2ebcf' });
	 nodeList.addNode(node, "Circle");
  	 
	 
	 node = new ContainerNode();
	 node.setCaptionBackBrush({ type: 'SolidBrush', color: '#f2ebcf' });
	 node.setBrush({ type: 'SolidBrush', color: '#ffffff' });
	 node.setRotationAngle (-90);
	 nodeList.addNode(node, "Container");	
		
	for (var shapeId in Shape.shapes)
	{
		// cycle through all shapes, add those that start with 'bpmn'
		var shape = Shape.shapes[shapeId];
		
		if (shapeId.startsWith("Bpmn"))
		{
		   var node = new MindFusion.Diagramming.ShapeNode(diagram);
		   node.setShape(shapeId);
		   node.setBrush({ type: 'SolidBrush', color: '#f2ebcf' });
		   nodeList.addNode(node, shapeId.substring(4));
		}
	}	
		
	nodeList.addEventListener(Events.nodeSelected, onShapeSelected);

	onLoaded();
});

//sets the default node shape of the diagram to the selected one
function onShapeSelected(sender, e)
{
	var selectedNode = e.getNode();
	if (selectedNode)
		diagram.setDefaultShape(selectedNode.getShape());
}

//create the BPMN diagram
function onLoaded()
{
	
	var colorBkgr = document.querySelector("#colorBkgr");
	colorBkgr.value = backgroundColor;
	colorBkgr.addEventListener("input", updateBackground, false);
	colorBkgr.addEventListener("change", updateBackground, false);  

	// Create a sample diagram
	
	var clientLane = diagram.getFactory().createContainerNode(new Rect(145, -130, 20, 300));
	clientLane.setRotationAngle(270);  
	clientLane.setText("Client");
	clientLane.setCaptionBackBrush({ type: 'SolidBrush', color: '#f2ebcf' });
	
	var invoicingLane = diagram.getFactory().createContainerNode(new Rect(85, -25, 140, 300));
	invoicingLane.setRotationAngle(270);  
	invoicingLane.setText("Invoicing");
	invoicingLane.setCaptionBackBrush({ type: 'SolidBrush', color: '#f2ebcf' });

		
	var ellipse = diagram.getFactory().createShapeNode(new Rect(20, 110, 12, 12	));
	ellipse.setShape('Ellipse');
	ellipse.setBrush({ type: 'SolidBrush', color: '#a3c686' });
	invoicingLane.add(ellipse);
	
	var appText = diagram.getFactory().createShapeNode(new Rect(16, 115, 20, 20	));
	appText.setTransparent(true);
	appText.setText("Application");
	invoicingLane.add(appText);
	
	var decision = diagram.getFactory().createShapeNode(new Rect(50, 110, 12, 12	));
	decision.setShape('Decision');
	decision.setBrush({ type: 'SolidBrush', color: '#f5ded0' });
	invoicingLane.add(decision);
	
	var corrCheck = diagram.getFactory().createShapeNode(new Rect(80, 109, 26, 14	));
	corrCheck.setShape('RoundRect');
	corrCheck.setText("Checking for Corrections");
	corrCheck.setBrush({ type: 'SolidBrush', color: '#a1d0d8' });
	invoicingLane.add(corrCheck);
	
	var database = diagram.getFactory().createShapeNode(new Rect(84, 131, 18, 20	));
	database.setShape('Database');
	database.setText("\n\n\nBill for Goods");
	database.setBrush({ type: 'SolidBrush', color: '#e9ca91' });
	invoicingLane.add(database);
	
	var decision1 = diagram.getFactory().createShapeNode(new Rect(125, 110, 12, 12	));
	decision1.setShape('Decision');
	decision1.setBrush({ type: 'SolidBrush', color: '#f5ded0' });
	invoicingLane.add(decision1);
	
	var textNode = diagram.getFactory().createShapeNode(new Rect(133, 109, 40, 14	));
	textNode.setTransparent(true);
	textNode.setText("Application correct?");	
	invoicingLane.add(textNode);
	
	var requestData = diagram.getFactory().createShapeNode(new Rect(118, 82, 26, 14	));
	requestData.setShape('RoundRect');
	requestData.setText("Request Specified Data");
	requestData.setBrush({ type: 'SolidBrush', color: '#a1d0d8' });
	invoicingLane.add(requestData);
	
	var bpmnStartMessage = diagram.getFactory().createShapeNode(new Rect(164, 83, 12, 12	));
	bpmnStartMessage.setShape('BpmnStartMessage');
	bpmnStartMessage.setBrush({ type: 'SolidBrush', color: '#ffcc80' });
	invoicingLane.add(bpmnStartMessage);
	
	textNode = diagram.getFactory().createShapeNode(new Rect(157, 90, 24, 14	));
	textNode.setTransparent(true);
	textNode.setText("Email client");	
	invoicingLane.add(textNode);
	
	var bpmnInclusive = diagram.getFactory().createShapeNode(new Rect(196, 83, 12, 12	));
	bpmnInclusive.setShape('BpmnInclusive');
	bpmnInclusive.setBrush({ type: 'SolidBrush', color: '#f5ded0' });
	invoicingLane.add(bpmnInclusive);
	
	var bpmnEndMessage1 = diagram.getFactory().createShapeNode(new Rect(196, 58, 12, 12	));
	bpmnEndMessage1.setShape('BpmnEndMessage');
	bpmnEndMessage1.setBrush({ type: 'SolidBrush', color: '#ffcc80' });
	invoicingLane.add(bpmnEndMessage1);
	
	var bpmnEndMessage = diagram.getFactory().createShapeNode(new Rect(225, 83, 12, 12	));
	bpmnEndMessage.setShape('BpmnEndMessage');
	bpmnEndMessage.setBrush({ type: 'SolidBrush', color: '#ffcc80' });
	invoicingLane.add(bpmnEndMessage);
	
	var bpmnEndCancel = diagram.getFactory().createShapeNode(new Rect(254, 83, 12, 12	));
	bpmnEndCancel.setShape('BpmnEndCancel');
	bpmnEndCancel.setBrush({ type: 'SolidBrush', color: '#ea684f' });
	invoicingLane.add(bpmnEndCancel);
	
	textNode = diagram.getFactory().createShapeNode(new Rect(248, 90, 24, 14	));
	textNode.setTransparent(true);
	textNode.setText("Client Refusal");	
	invoicingLane.add(textNode);
	
	var bpmnIntermTimer = diagram.getFactory().createShapeNode(new Rect(225, 108, 12, 12	));
	bpmnIntermTimer.setShape('BpmnIntermediateTimer');
	bpmnIntermTimer.setBrush({ type: 'SolidBrush', color: '#ffcc80' });
	invoicingLane.add(bpmnIntermTimer);
	
	textNode = diagram.getFactory().createShapeNode(new Rect(220, 115, 24, 14	));
	textNode.setTransparent(true);
	textNode.setText("2 Days");	
	invoicingLane.add(textNode);
	
	var bpmnTerminate = diagram.getFactory().createShapeNode(new Rect(254, 108, 12, 12	));
	bpmnTerminate.setShape('BpmnEndTerminate');
	bpmnTerminate.setBrush({ type: 'SolidBrush', color: '#ea684f' });
	invoicingLane.add(bpmnTerminate);
	
	textNode = diagram.getFactory().createShapeNode(new Rect(249, 115, 24, 14	));
	textNode.setTransparent(true);
	textNode.setText("No Answer");	
	invoicingLane.add(textNode);
	
	var newApp = diagram.getFactory().createShapeNode(new Rect(118, 137, 26, 14	));
	newApp.setShape('RoundRect');
	newApp.setText("Form a New Application for Shipment");
	newApp.setBrush({ type: 'SolidBrush', color: '#a1d0d8' });
	invoicingLane.add(newApp);
	
	var pkgGoods = diagram.getFactory().createShapeNode(new Rect(158, 137, 26, 14	));
	pkgGoods.setShape('RoundRect');
	pkgGoods.setText("Prepare Package");
	pkgGoods.setBrush({ type: 'SolidBrush', color: '#a1d0d8' });
	invoicingLane.add(pkgGoods);
	
	var bpmnEndMessage2 = diagram.getFactory().createShapeNode(new Rect(165, 168, 12, 12));
	bpmnEndMessage2.setShape('BpmnEndMessage');
	bpmnEndMessage2.setBrush({ type: 'SolidBrush', color: '#ea684f' });
	invoicingLane.add(bpmnEndMessage2);
	
	textNode = diagram.getFactory().createShapeNode(new Rect(163, 176, 18, 12));
	textNode.setTransparent(true);
	textNode.setText("Invoice");	
	invoicingLane.add(textNode);
	

	
	var link = diagram.getFactory().createDiagramLink(ellipse, decision);	
	link.setHeadShape("Triangle");
	link.setHeadShapeSize(3.0);
	link.setHeadBrush({ type: 'SolidBrush', color: '#7F7F7F' });
	
	link = diagram.getFactory().createDiagramLink(decision, corrCheck);
	link.setHeadShape("Triangle");
	link.setHeadShapeSize(3.0);
	link.setHeadBrush({ type: 'SolidBrush', color: '#7F7F7F' });
	
	link = diagram.getFactory().createDiagramLink(corrCheck, database);
	link.setHeadShape("Triangle");
	link.setHeadShapeSize(3.0);
	link.setHeadBrush({ type: 'SolidBrush', color: '#7F7F7F' });
	
	link = diagram.getFactory().createDiagramLink(corrCheck, decision1);
	link.setHeadShape("Triangle");
	link.setHeadShapeSize(3.0);
	link.setHeadBrush({ type: 'SolidBrush', color: '#7F7F7F' });
	
	link = diagram.getFactory().createDiagramLink(decision1, requestData);
	link.setHeadShape("Triangle");
	link.setHeadShapeSize(3.0);
	link.setText("No");
	link.setTextAlignment(MindFusion.Diagramming.Alignment.Near);
	link.setHeadBrush({ type: 'SolidBrush', color: '#7F7F7F' });
	
	link = diagram.getFactory().createDiagramLink(decision1, newApp);
	link.setHeadShape("Triangle");
	link.setHeadShapeSize(3.0);
	link.setText("Yes");
	link.setTextAlignment(MindFusion.Diagramming.Alignment.Near);
	link.setHeadBrush({ type: 'SolidBrush', color: '#7F7F7F' });
	
	link = diagram.getFactory().createDiagramLink(requestData, bpmnStartMessage);
	link.setHeadShape("Triangle");
	link.setBaseShape("Circle");
	link.setHeadShapeSize(3.0);
	link.setBaseShapeSize(3.0);
	link.setStrokeDashStyle(DashStyle.Dash);	
	link.setHeadBrush({ type: 'SolidBrush', color: '#FFFFFF' });
	
	link = diagram.getFactory().createDiagramLink(requestData, clientLane);
	link.setHeadShape("Triangle");
	link.setBaseShape("Circle");
	link.setHeadShapeSize(3.0);
	link.setBaseShapeSize(3.0);
	link.setText("Request From Client");
	link.setStrokeDashStyle(DashStyle.Dash);
	link.setHeadBrush({ type: 'SolidBrush', color: '#FFFFFF' });
	
	link = diagram.getFactory().createDiagramLink(bpmnEndMessage1, clientLane);
	link.setHeadShape("Triangle");
	link.setBaseShape("Circle");
	link.setHeadShapeSize(3.0);
	link.setBaseShapeSize(3.0);
	link.setText("Cargo Description");
	link.setStrokeDashStyle(DashStyle.Dash);
	link.setHeadBrush({ type: 'SolidBrush', color: '#FFFFFF' });
	
	link = diagram.getFactory().createDiagramLink(bpmnEndMessage1, clientLane);
	link.setHeadShape("Triangle");
	link.setBaseShape("Circle");
	link.setHeadShapeSize(3.0);
	link.setBaseShapeSize(3.0);
	link.setText("Refusal");
	link.setStrokeDashStyle(DashStyle.Dash);
	link.setStartPoint(new Point(202, 58));
	link.setEndPoint(new Point(202, 30));
	link.setTextAlignment(MindFusion.Diagramming.Alignment.Near);
	link.setHeadBrush({ type: 'SolidBrush', color: '#FFFFFF' });
	
	link = diagram.getFactory().createDiagramLink(bpmnStartMessage, bpmnInclusive);
	link.setHeadShape("Triangle");
	link.setHeadShapeSize(3.0);
	link.setHeadBrush({ type: 'SolidBrush', color: '#7F7F7F' });
	
	link = diagram.getFactory().createDiagramLink(bpmnInclusive, bpmnEndMessage);
	link.setHeadShape("Triangle");
	link.setHeadShapeSize(3.0);
	link.setHeadBrush({ type: 'SolidBrush', color: '#7F7F7F' });
	
	link = diagram.getFactory().createDiagramLink(bpmnInclusive, bpmnEndMessage1);
	link.setHeadShape("Triangle");
	link.setHeadShapeSize(3.0);
	link.setHeadBrush({ type: 'SolidBrush', color: '#7F7F7F' });
	
	link = diagram.getFactory().createDiagramLink(bpmnEndMessage, bpmnEndCancel);
	link.setHeadShape("Triangle");
	link.setHeadShapeSize(3.0);
	link.setHeadBrush({ type: 'SolidBrush', color: '#7F7F7F' });
	
	link = diagram.getFactory().createDiagramLink(bpmnInclusive, bpmnIntermTimer);
	link.setHeadShape("Triangle");
	link.setHeadShapeSize(3.0);
	link.setStartPoint(new Point(202, 95));
	link.setEndPoint(new Point(225, 114));
	link.setHeadBrush({ type: 'SolidBrush', color: '#7F7F7F' });
	
	link = diagram.getFactory().createDiagramLink(bpmnIntermTimer, bpmnTerminate);
	link.setHeadShape("Triangle");
	link.setHeadShapeSize(3.0);
	link.setHeadBrush({ type: 'SolidBrush', color: '#7F7F7F' });
	
	link = diagram.getFactory().createDiagramLink(newApp, pkgGoods);
	link.setHeadShape("Triangle");
	link.setHeadShapeSize(3.0);
	link.setHeadBrush({ type: 'SolidBrush', color: '#7F7F7F' });
	
	link = diagram.getFactory().createDiagramLink(pkgGoods, bpmnEndMessage2);
	link.setHeadShape("Triangle");
	link.setBaseShape("Circle");
	link.setHeadShapeSize(3.0);
	link.setBaseShapeSize(3.0);
	link.setStrokeDashStyle(DashStyle.Dash);
	link.setHeadBrush({ type: 'SolidBrush', color: '#FFFFFF' });
	
	link = diagram.getFactory().createDiagramLink(pkgGoods, clientLane);
	link.setHeadShape("Triangle");
	link.setBaseShape("Circle");
	link.setHeadShapeSize(3.0);
	link.setBaseShapeSize(3.0);
	link.setText("Invoice for Payment");
	link.setStrokeDashStyle(DashStyle.Dash);
	link.setStartPoint(new Point(184, 144));
	link.setEndPoint(new Point(280, 30));
	link.setHeadBrush({ type: 'SolidBrush', color: '#FFFFFF' });
	
	link = diagram.getFactory().createDiagramLink(decision, bpmnEndMessage1);
	link.setHeadShape("Triangle");
	link.setHeadShapeSize(3.0);
	link.setStartPoint(new Point(56, 110));
	link.setEndPoint(new Point(196, 64));
	link.setHeadBrush({ type: 'SolidBrush', color: '#7F7F7F' });
	
	diagram.routeAllLinks();
	
	
}

//assign the selected color to the newly created node
function onNodeCreated(sender, args)
{
	var node = args.getNode();
	node.setBrush({ type: 'SolidBrush', color: backgroundColor });
	
	
	if( node instanceof ContainerNode )
	{
		node.setCaptionBackBrush({ type: 'SolidBrush', color: backgroundColor });
	    node.setBrush({ type: 'SolidBrush', color: '#ffffff' });
	}		
	
	
}

//create links with the selected style values
function onLinkCreated(sender, args)
{
	var link = args.getLink();
	link.setStrokeDashStyle (linkDashStyle);
	link.setHeadShape(headShape);
	link.setBaseShape(baseShape);
	link.setHeadShapeSize(3.0);
	link.setBaseShapeSize(3.0);
	link.setHeadBrush({ type: 'SolidBrush', color: headBrush });
	link.setBaseBrush({ type: 'SolidBrush', color: '#FFFFFF' });
	link.setTextAlignment(MindFusion.Diagramming.Alignment.Near);
}



function onSequence()
{
	var btnSrc = document.getElementById("sequence").src; 	
	linkDashStyle = DashStyle.Solid;
	headShape = "Triangle";
	baseShape = null;
	headBrush = "#7F7F7F";
	document.getElementById("sequence").src = "sequenceOn.png";
	document.getElementById("message").src = "messageOff.png";
	document.getElementById("association").src = "associationOff.png";
}

function onMessage()
{
	var btnSrc = document.getElementById("message").src; 
	linkDashStyle = DashStyle.Dash;
	headShape = "Triangle";
	baseShape = "Circle";
	headBrush = "white";
	document.getElementById("message").src = "messageOn.png";
	document.getElementById("sequence").src = "sequenceOff.png";
	document.getElementById("association").src = "associationOff.png";
		
}

function onAssociation()
{
	var btnSrc = document.getElementById("association").src; 
	linkDashStyle = DashStyle.Dash;
	headShape = null;
	baseShape = null;
	document.getElementById("association").src = "associationOn.png";
	document.getElementById("sequence").src = "sequenceOff.png";
	document.getElementById("message").src = "messageOff.png";
		
}

function updateBackground(event) {
   backgroundColor = event.target.value;
   var selectedItem = diagram.selection.items[0];
		if(selectedItem)
			selectedItem.setBrush({ type: 'SolidBrush', color: backgroundColor });  
}

function clearItems()
{
	diagram.clearAll();
}

function save()
{
	localStorage.setItem('bpmn', diagram.toJson());
}

function load()
{
	var bpmn = localStorage.getItem('bpmn');
	if(bpmn)
		diagram.fromJson(bpmn);
}





