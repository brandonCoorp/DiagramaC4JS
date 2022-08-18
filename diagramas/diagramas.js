var AbstractionLayer = MindFusion.AbstractionLayer;
var AnchorPattern = MindFusion.Diagramming.AnchorPattern;
var AnchorPoint = MindFusion.Diagramming.AnchorPoint;
var DiagramNode = MindFusion.Diagramming.DiagramNode;
var DiagramLink = MindFusion.Diagramming.DiagramLink;
var ContainerNode = MindFusion.Diagramming.ContainerNode;
var ShapeNode = MindFusion.Diagramming.ShapeNode;
var Style = MindFusion.Diagramming.Style;
var Theme = MindFusion.Diagramming.Theme;
var FontStyle = MindFusion.Drawing.FontStyle;
var Font = MindFusion.Drawing.Font;
var Alignment = MindFusion.Diagramming.Alignment;
var MandlesStyle = MindFusion.Diagramming.MandlesStyle;
var Events = MindFusion.Diagramming.Events;
var Diagram = MindFusion.Diagramming.Diagram;
var NodeListView = MindFusion.Diagramming.NodeListView;
var Rect = MindFusion.Drawing.Rect;
var Shape = MindFusion.Diagramming.Shape;
var DashStyle = MindFusion.Drawing.DashStyle;
var Point = MindFusion.Drawing.Point;

var diagram, NodeListView

$(document).ready(function(){

diagram = AbstractionLayer.createControl(Diagram,null,null,null,$("#diagrama")[0]);
diagram.setAllowInplaceEdit(true);
diagram.setRouteLinks(true);
diagram.setShowGrid(true);
diagram.setRoundedLinks(true);
diagram.setBounds(new Rect(0,0,2000,2000));

nodeList = AbstractionLayer.createControl(NodeListView,null,null,null,$("#nodelist")[0]);
});