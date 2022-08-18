
var dataCache = new Array();

//
// Expands or collapses the topic with the specified section id.
// 
function gec(doc, id, expo, callback)
{
	var cid = 'cid' + id;
	var imgElement = doc.getElementById('id' + id + "img");
	var icoElement = doc.getElementById('id' + id + "ico");

	var win = doc.parentWindow || doc.defaultView;
	var element = win.$(cid);

	var isSync = true;
	var wasHidden = !element || element.hasClassName('hidden');
	if (wasHidden) {
	  if (icoElement) icoElement.src = "bookopen.png";

	  if (imgElement) {
	    imgElement.src = 'minus.png';
	    if (!placeCid(id, doc)) {
	      isSync = false;
	      updateCursor(id, true);
	      new Ajax.Request('cid' + Math.floor(id/100) + '.html', {method: 'get', onComplete: function() {updateCursor(id, false)},
	       onSuccess: function(req) {
                ajaxReceived(req, id, doc);
                if (callback) callback()
	       }}
              );
            }
	  }
	} else if (!expo) {
	  element.addClassName('hidden');
          if (imgElement) imgElement.src = "plus.png";
	  if (icoElement) icoElement.src = "bookclosed.png";
	}
	if (isSync && callback) callback();
}

function ajaxReceived(req, id, doc) {
	var html = req.responseText;
	var win = doc.parentWindow || doc.defaultView;
	var ajaxCache = win.$('ajaxCache');
	ajaxCache.insert(html);
	placeCid(id, doc);
}

function placeCid(id, doc) {
	var win = doc.parentWindow || doc.defaultView;
	var elt = win.$('cid' + id);
	if (!elt) return false;
	elt.remove();
	win.$('id' + id).insert(elt);
	elt.removeClassName('hidden');
	return true;
}

function pathToId(id) {
 var res = [];
 while (id != -1 && typeof(id) != 'undefined') {
  res.push(id);
  id = parentIds[id];
 }
 return res;
}

function expandToTop(id) {
 //asynchonously expand nodes from top to id
 var path = pathToId(id);
 expandPath(path);
}

function expandPath(path) {
 if (path.length) {
  var id = path.pop();
  gec(document, id, true, function() {
   gsl($('id' + id));
   expandPath(path)}
  );
 }
}

waitingCount = 0;

function updateCursor(id, started) {
 waitingCount += started ? 1 : -1;
 var item = $('id' + id);
 if (waitingCount > 0)
  $(document.body).addClassName('in-progress');
 else
  $(document.body).removeClassName('in-progress');
 if (item)
   if (started) item.addClassName('in-progress');
   else item.removeClassName('in-progress');
}

//
// Gets the height of the specified window.
//
function ggwh(win, doc, adj)
{
	if (typeof(win.innerHeight) == 'number')
		return win.innerHeight - adj;

	if (doc.documentElement &&
		(doc.documentElement.clientWidth || doc.documentElement.clientHeight))
		return doc.documentElement.clientHeight;

	if (doc.body &&
		(doc.body.clientWidth || doc.body.clientHeight))
		return doc.body.clientHeight;

	return 0;
}

//
// Gets the y position of the specified window's scroller.
//
function ggwy(win, doc)
{
	if (typeof(win.pageYOffset) == 'number')
		return win.pageYOffset;

	if (doc.body && (doc.body.scrollLeft || doc.body.scrollTop))
		return doc.body.scrollTop;

	if (doc.documentElement && (doc.documentElement.scrollLeft || doc.documentElement.scrollTop))
		return doc.documentElement.scrollTop;

	return 0;
}

//
// Locates the currently selected topic in the TOC
//
function glt()
{
	var contentsFrame = window.parent.document.getElementById('contentsFrame');
	var contentsFrameDoc = contentsFrame.contentWindow.document;
	var topicFrame = contentsFrameDoc.getElementById('topicFrame');
	var topicFrameDoc = topicFrame.contentWindow.document;
	var metaTag = topicFrameDoc.getElementById('metaFileNameId');

	if (metaTag == null)
		return;

	//gltin("id" + metaTag.content, false, true);
	gltin(metaTag.content, false, true);
}

//
// Locates the topic with the specified id within the TOC.
//
function gltin(id, topScroll, select)
{
	var contentsFrame = window.parent.document.getElementById('contentsFrame');
	var contentsFrameDoc = contentsFrame.contentWindow.document;
	var tocFrame = contentsFrameDoc.getElementById('tocFrame');
	var tocFrameDoc = tocFrame.contentWindow.document;

	//gec(tocFrameDoc, id, true);
	if (!tocFrame.contentWindow.expandToTop || !tocFrame.contentWindow.parentIds || !tocFrame.contentWindow.document.getElementById('ajaxCache')) return;//race condition while loading frames
	tocFrame.contentWindow.expandToTop(id);
	var initial = tocFrameDoc.getElementById('id' + id);

	/*
	var x = initial;
	while (x != null)
	{
		if (x.id == "top")
			break;

		if (x.tagName == "DIV")
		{
			var id = x.id;

			if (id.indexOf("id") == 0)
			{
				x = x.parentNode;
				continue;
			}

			if (id.indexOf("cid") == 0)
				gec(tocFrameDoc, id, true);
		}

		x = x.parentNode;
	}
	*/

	var win = tocFrameDoc.parentWindow || tocFrameDoc.defaultView;

    if (initial != null)
    {
        if (topScroll)
        {
	        win.scrollTo(0, initial.offsetTop);
	    }
	    else
	    {
	        var winy = ggwy(win, tocFrameDoc);
	        var winh = ggwh(win, tocFrameDoc, 0);
	        if (initial.offsetTop < winy)
		        win.scrollTo(0, initial.offsetTop);
	        else if (initial.offsetTop > winy + winh - 40)
		        win.scrollTo(0, initial.offsetTop - winh + 40);
	    }
	}

	//if (select)
	//    gsl(initial);
}

//
// Selects the specified div in the table of contents.
//
function gsl(odiv)
{
/*
	var contentsFrame = window.parent.document.getElementById('contentsFrame');
	var contentsFrameDoc = contentsFrame.contentWindow.document;
	var tocFrame = contentsFrameDoc.getElementById('tocFrame');
	var tocFrameDoc = tocFrame.contentWindow.document;
*/
	if (typeof(selectedTopicId) != 'undefined')
	{
		var sid = "s" + selectedTopicId;//window.parent.selectedTopicId
		var prevTopic = $(sid);//tocFrameDoc.getElementById(sid);
		prevTopic.style.padding = '2px';
		prevTopic.style.border = '';
	}

	if (odiv) {
		var sodiv = $("s" + odiv.id);//tocFrameDoc.getElementById("s" + odiv.id);
		sodiv.style.padding = '1px';
		sodiv.style.border = '1px dotted #6699ff';
		selectedTopicId = odiv.id;
	}
}
