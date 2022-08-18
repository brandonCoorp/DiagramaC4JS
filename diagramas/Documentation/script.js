
var ieVer = getIEVersion();

var vbLang;
var csLang;
var javaLang;
var jsLang;
var cppLang;
var xamlLang;
var languageCount;

var inheritedMembers;
var protectedMembers;

var sectionStates = new Array();
var sectionStatesInitialized = false;
var allCollapsed = false;


//
// Determines the IE version. Returns 0 if not IE.
//
function getIEVersion()
{
	var verNum = 0;
	if (navigator.appName == "Microsoft Internet Explorer")
	{
		var sVer = window.navigator.userAgent;
		var msie = sVer.indexOf("MSIE ");
		if (msie > 0)
		{
			// Browser is Microsoft Internet Explorer; return version number
			verNum = parseFloat(sVer.substring(msie + 5, sVer.indexOf(";", msie)));
		}
	}

	return verNum;
}

if (ieVer >= 5)
{
	var advanced = true;
}

window.onload = OnLoad;
window.onunload = OnUnload;
window.onresize = OnResize;

document.write("<style media='screen'>body {visibility: hidden; }</style>");


// This is required for user data support in *.chm
if (!top)
{
	var top = document.location.toString();
	if (top.indexOf("mk:@MSITStore") == 0)
		document.location.replace("ms-its:" + top.substring(14, top.length));
}

function OnLoad()
{
	LoadLanguages();
	LoadMembersOptions();
	LoadSections();

	SetupCheckboxes();
	DisplayLanguages();
	if (inheritedMembers == "off")
		DisplayInheritedMembers();
	if (protectedMembers == "off")
		DisplayProtectedMembers();
	ChangeMembersOptionsFilterLabel();
	UpdateSections();

	if (document.getElementById('languageSpan') != null)
		new Dropdown('languageFilterToolTip', 'languageSpan');

	if (document.getElementById('membersOptionsFilterToolTip') != null)
		new Dropdown('membersOptionsFilterToolTip', 'membersOptionsSpan');

	if (document.getElementById('entriesOptionsFilterToolTip') != null)
		new Dropdown('entriesOptionsFilterToolTip', 'entriesOptionsSpan');

	if (advanced)
		ResizeBan();

	document.body.style.visibility = "visible";
}

function OnResize()
{
    if (advanced)
        ResizeBan();
}

function OnUnload()
{
	SaveLanguages();
	SaveMembersOptions();
	SaveSections();
}

function ResizeBan()
{
	if (document.body.clientWidth == 0)
		return;

	var oBanner = document.all.item("nsbanner");
	var oFooter = document.all.item("nsfooter");
	var oText = document.all.item("nstext");
	
	if (oText == null) return;

	if (oBanner != null)
	{
		document.body.scroll = "no"

 		oBanner.style.width = document.body.clientWidth;
 		oFooter.style.width = document.body.clientWidth;

		oText.style.width = document.body.clientWidth;
		oText.style.top = 0;

		var height = document.body.clientHeight - (oBanner.offsetHeight) - (oFooter.offsetHeight);
		if (height < 0)
			height = 0;

   		oText.style.height = height;

		// Padding inflate the div in IE10, adjust the div size with how much it got inflated
   		oText.style.width = Math.max(0, document.body.clientWidth - (oText.offsetWidth - document.body.clientWidth));

   		var newHeight = height - (oText.offsetHeight - height);
   		if (newHeight < 0 || !newHeight)
   			newHeight = 0;
		oText.style.height = newHeight;
	}
}

function CopyCode_CheckKey(e, copyCodeSpan)
{
	if (e.keyCode == 13)
		CopyCode(copyCodeSpan);
}

function CopyCode(span)
{
	if (window.clipboardData == null)
		return;

	var table = GetParentTable(span);
	var trElements = table.getElementsByTagName("tr");
	if (trElements.length < 2)
		return;

	window.clipboardData.setData("Text", trElements[1].innerText);
}

function GetParentTable(element)
{
	if (element.tagName == "TABLE")
		return element;

	return GetParentTable(element.parentNode);
}

function ChangeCopyCodeIcon(span, hover)
{
	var imageItem = span.childNodes[0];

	if (hover)
		imageItem.src = copyCodeHoverImage.src;
	else
		imageItem.src = copyCodeImage.src;
}

function ExpandCollapse_CheckKey(e, sectionTitleSpan)
{
	if (e.keyCode == 13)
		ExpandCollapse(sectionTitleSpan);
}

function ExpandCollapse(span)
{
	var expandImage = document.getElementById("expandImage");
	var collapseImage = document.getElementById("collapseImage");
	var imageItem = span.childNodes[0];

	if (ItemCollapsed(span.id + "Section"))
	{
		imageItem.src = collapseImage.src;
		imageItem.alt = collapseImage.alt;

		ExpandSection(document.getElementById(span.id + "Section"));
	}
	else
	{
		imageItem.src = expandImage.src;
		imageItem.alt = expandImage.alt;

		CollapseSection(document.getElementById(span.id + "Section"));
	}

	allCollapsed = true;
	var expandableElements = document.getElementsByName("toggleSwitch");
	var i;
	for (i = 0; i < expandableElements.length; i++)
	{
		if (!ItemCollapsed(expandableElements[i].parentNode.id + "Section"))
		{
			allCollapsed = false;
			break;
		}
	}

	SetCollapseAll();
}

function ExpandCollapseAll(imageItem)
{
	var expandImage = document.getElementById("expandImage");
	var collapseImage = document.getElementById("collapseImage");
	var expandableElements = document.getElementsByName("toggleSwitch");
	var i;
	var collapseAllImage = document.getElementById('collapseAllImage');

	if (imageItem.src == expandAllImage.src)
	{
		imageItem.src = collapseAllImage.src;
		imageItem.alt = collapseAllImage.alt;

		for (i = 0; i < expandableElements.length; ++i)
		{
			expandableElements[i].src = collapseImage.src;
			expandableElements[i].alt = collapseImage.alt;

			ExpandSection(document.getElementById(expandableElements[i].parentNode.id + "Section"));
		}

		SetToggleAllLabel(false);

		allCollapsed = false;
	}
	else
	{
		imageItem.src = expandAllImage.src;
		imageItem.alt = expandAllImage.alt;

		for (i = 0; i < expandableElements.length; ++i)
		{
			expandableElements[i].src = expandImage.src;
			expandableElements[i].alt = expandImage.alt;

			CollapseSection(document.getElementById(expandableElements[i].parentNode.id + "Section"));
		}

		SetToggleAllLabel(true);

		allCollapsed = true;
	}
}

function SetCollapseAll()
{
	var imageElement = document.getElementById("toggleAllImage");
	if (imageElement == null)
		return;

	var expandAllImage = document.getElementById("expandAllImage");
	var collapseAllImage = document.getElementById('collapseAllImage');

	if (allCollapsed)
	{
		imageElement.src = expandAllImage.src;
		imageElement.alt = expandAllImage.alt;
	}
	else
	{
		imageElement.src = collapseAllImage.src;
		imageElement.alt = collapseAllImage.alt;
	}

	SetToggleAllLabel(allCollapsed);
}

function UpdateSections()
{
	var expandImage = document.getElementById("expandImage");
	var collapseImage = document.getElementById("collapseImage");
	var expandableElements = document.getElementsByName("toggleSwitch");
	var i;

	for (i = 0; i < expandableElements.length; ++i)
	{
		var sectionId = expandableElements[i].parentNode.id + "Section";

		if (ItemCollapsed(sectionId) || allCollapsed)
		{
			expandableElements[i].src = expandImage.src;
			expandableElements[i].alt = expandImage.alt;

			CollapseSection(document.getElementById(sectionId));
		}
		else
		{
			expandableElements[i].src = collapseImage.src;
			expandableElements[i].alt = collapseImage.alt;

			ExpandSection(document.getElementById(sectionId));
		}
	}

	SetCollapseAll();
}

function ExpandCollapseAll_CheckKey(imageItem)
{
	if (window.event.keyCode == 13)
		ExpandCollapseAll(imageItem);
}

function ExpandSection(section)
{
	try
	{
		section.style.display = "";
		sectionStates[section.id] = "e";
	}
	catch (e)
	{
	}
}

function CollapseSection(section)
{
	try
	{
		section.style.display = "none";
		sectionStates[section.id] = "c";
	}
	catch (e)
	{
	}
}

function SetToggleAllLabel(collapseAll)
{
	var collapseAllLabel = document.getElementById("collapseAllLabel");
	if (collapseAllLabel == null)
		return;

	var expandAllLabel = document.getElementById("expandAllLabel");
	if (expandAllLabel == null)
		return;

	expandAllLabel.style.display = "none";
	collapseAllLabel.style.display = "none";

	if (collapseAll)
		expandAllLabel.style.display = "inline";
	else
		collapseAllLabel.style.display = "inline";
}

function ItemCollapsed(sectionId)
{
	return sectionStates[sectionId] == "c";
}

function SaveSections()
{
	try
	{
		var states = "";

		for (var sectionId in sectionStates)
			states += sectionId + ":" + sectionStates[sectionId] + ";";

		Save("SectionStates", states.substring(0, states.length - 1));
	}
	catch (e)
	{
		// TODO:
	}

	Save("AllCollapsed", allCollapsed);
}

function LoadSections()
{
	// SectionStates has the format:
	//
	//     firstSectionId:state;secondSectionId:state;thirdSectionId:state; ... ;lastSectionId:state
	//
	// where state is either "e" (expanded) or "c" (collapsed)

	var value = Load("AllCollapsed");
	if (typeof value == 'string')
	    allCollapsed = value == "true";
	else if (typeof value == 'boolean')
	    allCollapsed = value == true;

	if (allCollapsed == null)
		allCollapsed = false;

	var states = Load("SectionStates");
	if (states == null || states == "")
		return;

	var start = 0;
	var end;
	var section;
	var state;

	while (start < states.length)
	{
		end = states.indexOf(":", start);

		section = states.substring(start, end);

		start = end + 1;
		end = states.indexOf(";", start);
		if (end == -1) end = states.length;

		state = states.substring(start, end);

		sectionStates[section] = state;

		start = end + 1;
	}
}

function SetupCheckboxes()
{
	var checkbox;

	languageCount = 0;

	checkbox = document.getElementById("vbLangCheckbox");
	if (checkbox != null)
	{
		if (vbLang == "on")
			checkbox.checked = true;
		else
			checkbox.checked = false;

		languageCount++;
	}

	checkbox = document.getElementById("csCheckbox");
	if (checkbox != null)
	{
		if (csLang == "on")
			checkbox.checked = true;
		else
			checkbox.checked = false;

		languageCount++;
	}

	checkbox = document.getElementById("javaCheckbox");
	if (checkbox != null)
	{
		if (javaLang == "on")
			checkbox.checked = true;
		else
			checkbox.checked = false;

		languageCount++;
	}

	checkbox = document.getElementById("jsCheckbox");
	if (checkbox != null)
	{
		if (jsLang == "on")
			checkbox.checked = true;
		else
			checkbox.checked = false;

		languageCount++;
	}

	checkbox = document.getElementById("cppCheckbox");
	if (checkbox != null)
	{
		if (cppLang == "on")
			checkbox.checked = true;
		else
			checkbox.checked = false;

		languageCount++;
	}

	checkbox = document.getElementById("xamlCheckbox");
	if (checkbox != null)
	{
		if (xamlLang == "on")
			checkbox.checked = true;
		else
			checkbox.checked = false;

		languageCount++;
	}

	checkbox = document.getElementById("inheritedCheckbox");
	if (checkbox != null)
	{
		if (inheritedMembers == "on")
			checkbox.checked = true;
		else
			checkbox.checked = false;
	}

	checkbox = document.getElementById("protectedCheckbox");
	if (checkbox != null)
	{
		if (protectedMembers == "on")
			checkbox.checked = true;
		else
			checkbox.checked = false;
	}
}

function SetLanguage(key)
{
	var i = 0;
	if (vbLang == "on")
		i++;
	if (csLang == "on")
		i++;
	if (javaLang == "on")
		i++;
	if (jsLang == "on")
		i++;
	if (cppLang == "on")
		i++;
	if (xamlLang == "on")
		i++;

	if (key.id == "vbLangCheckbox")
	{
		if (vbLang == "on")
		{
			if (i == 1)
			{
				key.checked = true;
				return;
			}

			vbLang = "off";
		}
		else
		{
			vbLang = "on";
		}
	}
	if (key.id == "csCheckbox")
	{
		if (csLang == "on")
		{
			if (i == 1)
			{
				key.checked = true;
				return;
			}

			csLang = "off";
		}
		else
		{
			csLang = "on";
		}
	}
	if (key.id == "javaCheckbox")
	{
		if (javaLang == "on")
		{
			if (i == 1)
			{
				key.checked = true;
				return;
			}

			javaLang = "off";
		}
		else
		{
			javaLang = "on";
		}
	}
	if (key.id == "jsCheckbox")
	{
		if (jsLang == "on")
		{
			if (i == 1)
			{
				key.checked = true;
				return;
			}

			jsLang = "off";
		}
		else
		{
			jsLang = "on";
		}
	}
	if (key.id == "cppCheckbox")
	{
		if (cppLang == "on")
		{
			if (i == 1)
			{
				key.checked = true;
				return;
			}

			cppLang = "off";
		}
		else
		{
			cppLang = "on";
		}
	}
	if (key.id == "xamlCheckbox")
	{
		if (xamlLang == "on")
		{
			if (i == 1)
			{
				key.checked = true;
				return;
			}

			xamlLang = "off";
		}
		else
		{
			xamlLang = "on";
		}
	}

	DisplayLanguages();
}

function DisplayLanguages()
{
	var tableElements = document.getElementsByTagName("table");

	var i;
	for (i = 0; i < tableElements.length; ++i)
	{
		if (tableElements[i].getAttribute("codeLanguage") == "VisualBasic")
		{
			if (vbLang == "on")
				tableElements[i].style.display = "";
			else
				tableElements[i].style.display = "none";
		}
		if (tableElements[i].getAttribute("codeLanguage") == "CSharp")
		{
			if (csLang == "on")
				tableElements[i].style.display = "";
			else
				tableElements[i].style.display = "none";
		}
		if (tableElements[i].getAttribute("codeLanguage") == "Java")
		{
			if (javaLang == "on")
				tableElements[i].style.display = "";
			else
				tableElements[i].style.display = "none";
		}
		if (tableElements[i].getAttribute("codeLanguage") == "JavaScript")
		{
			if (jsLang == "on")
				tableElements[i].style.display = "";
			else
				tableElements[i].style.display = "none";
		}
		if (tableElements[i].getAttribute("codeLanguage") == "CPP")
		{
			if (cppLang == "on")
				tableElements[i].style.display = "";
			else
				tableElements[i].style.display = "none";
		}
		if (tableElements[i].getAttribute("codeLanguage") == "Xaml")
		{
			if (xamlLang == "on")
				tableElements[i].style.display = "";
			else
				tableElements[i].style.display = "none";
		}
	}

	ChangeLanguageFilterLabel();
}

function ChangeLanguageFilterLabel()
{
	var i = 0;

	var labelElement = document.getElementById("showAllLabel");
	if (labelElement)
		labelElement.style.display = "none";

	labelElement = document.getElementById("multipleLabel");
	if (labelElement)
		labelElement.style.display = "none";

	labelElement = document.getElementById("noneLabel");
	if (labelElement)
		labelElement.style.display = "none";

	labelElement = document.getElementById("vbLabel");
	if (labelElement)
	{
		labelElement.style.display = "none";
		if (vbLang == "on")
			i++;
	}

	labelElement = document.getElementById("csLabel");
	if (labelElement)
	{
		labelElement.style.display = "none";
		if (csLang == "on")
			i++;
	}

	labelElement = document.getElementById("javaLabel");
	if (labelElement)
	{
		labelElement.style.display = "none";
		if (javaLang == "on")
			i++;
	}

	labelElement = document.getElementById("jsLabel");
	if (labelElement)
	{
		labelElement.style.display = "none";
		if (jsLang == "on")
			i++;
	}

	labelElement = document.getElementById("cppLabel");
	if (labelElement)
	{
		labelElement.style.display = "none";
		if (cppLang == "on")
			i++;
	}

	labelElement = document.getElementById("xamlLabel");
	if (labelElement)
	{
		labelElement.style.display = "none";
		if (xamlLang == "on")
			i++;
	}

	if (i == languageCount)
	{
		labelElement = document.getElementById("showAllLabel");
		if (labelElement)
			labelElement.style.display = "inline";
	}
	else if (i == 1)
	{
		if (vbLang == "on")
		{
			labelElement = document.getElementById("vbLabel");
			if (labelElement)
				labelElement.style.display = "inline";
		}
		if (csLang == "on")
		{
			labelElement = document.getElementById("csLabel");
			if (labelElement)
				labelElement.style.display = "inline";
		}
		if (javaLang == "on")
		{
			labelElement = document.getElementById("javaLabel");
			if (labelElement)
				labelElement.style.display = "inline";
		}
		if (jsLang == "on")
		{
			labelElement = document.getElementById("jsLabel");
			if (labelElement)
				labelElement.style.display = "inline";
		}
		if (cppLang == "on")
		{
			labelElement = document.getElementById("cppLabel");
			if (labelElement)
				labelElement.style.display = "inline";
		}
		if (xamlLang == "on")
		{
			labelElement = document.getElementById("xamlLabel");
			if (labelElement)
				labelElement.style.display = "inline";
		}
	}
	else if (i > 1)
	{
		labelElement = document.getElementById("multipleLabel");
		if (labelElement)
			labelElement.style.display = "inline";
	}
	else
	{
		labelElement = document.getElementById("noneLabel");
		if (labelElement)
			labelElement.style.display = "inline";
	}
}

function LoadLanguages()
{
	var value;
	value = Load("vbLang");
	if (value == null)
		vbLang = "on";
	else
		vbLang = value;

	value = Load("csLang");
	if (value == null)
		csLang = "on";
	else
		csLang = value;

	value = Load("javaLang");
	if (value == null)
		javaLang = "on";
	else
		javaLang = value;

	value = Load("jsLang");
	if (value == null)
		jsLang = "on";
	else
		jsLang = value;

	value = Load("cppLang");
	if (value == null)
		cppLang = "on";
	else
		cppLang = value;

	value = Load("xamlLang");
	if (value == null)
		xamlLang = "on";
	else
		xamlLang = value;
}

function SaveLanguages()
{
	Save("vbLang", vbLang);
	Save("csLang", csLang);
	Save("javaLang", javaLang);
	Save("jsLang", jsLang);
	Save("cppLang", cppLang);
	Save("xamlLang", xamlLang);
}

function SetMembersOptions(key)
{
	if (key.id == "inheritedCheckbox")
	{
		if (key.checked == true)
			inheritedMembers = "on";
		else
			inheritedMembers = "off";

		DisplayInheritedMembers();
	}

	if (key.id == "protectedCheckbox")
	{
		if (key.checked == true)
			protectedMembers = "on";
		else
			protectedMembers = "off";

		DisplayProtectedMembers();
	}

	ChangeMembersOptionsFilterLabel();
}

function SetEntriesOptions(key)
{
	var entryId = key.id.substring(6); // exclude "entry_" checkbox prefix
	DisplayEntries(entryId, key.checked ? "on" : "off");
}

function DisplayInheritedMembers()
{
	var iMembers = document.getElementsByTagName("tr");
	var i;

	if (inheritedMembers == "off")
	{
		for (i = 0; i < iMembers.length; ++i)
		{
			if (iMembers[i].id == "i" || iMembers[i].id == "pi")
				iMembers[i].style.display = "none";
		}
	}
	else
	{
		for (i = 0; i < iMembers.length; ++i)
		{
			if (iMembers[i].id == "i" || iMembers[i].id == "pi")
				iMembers[i].style.display = "";
		}
	}
}

function DisplayProtectedMembers()
{
	var iMembers = document.getElementsByTagName("tr");
	var i;

	if (protectedMembers == "off")
	{
		for (i = 0; i < iMembers.length; ++i)
		{
			if (iMembers[i].id == "p" || iMembers[i].id == "pi")
				iMembers[i].style.display = "none";
		}
	}
	else
	{
		for (i = 0; i < iMembers.length; ++i)
		{
			if (iMembers[i].id == "p" || iMembers[i].id == "pi")
				iMembers[i].style.display = "";
		}
	}
}

function DisplayEntries(categoryId, show)
{
	var iEntries = document.getElementsByTagName("tr");
	var i;

	if (show == "off")
	{
		for (i = 0; i < iEntries.length; ++i)
		{
			if (iEntries[i].id == categoryId)
				iEntries[i].style.display = "none";
		}
	}
	else
	{
		for (i = 0; i < iEntries.length; ++i)
		{
			if (iEntries[i].id == categoryId)
				iEntries[i].style.display = "";
		}
	}
}

function ChangeMembersOptionsFilterLabel()
{
	var filtered = false;

	if (inheritedMembers == "off" || protectedMembers == "off")
		filtered = true;

	var labelElement;

	labelElement = document.getElementById("showAllMembersLabel");

	if (labelElement == null)
		return;

	labelElement.style.display = "none";

	labelElement = document.getElementById("filteredMembersLabel");
	labelElement.style.display = "none";

	if (filtered)
	{
		labelElement = document.getElementById("filteredMembersLabel");
		labelElement.style.display = "inline";
	}
	else
	{
		labelElement = document.getElementById("showAllMembersLabel");
		labelElement.style.display = "inline";
	}
}

function LoadMembersOptions()
{
	var value;
	value = Load("inheritedMembers");
	if (value == null)
		inheritedMembers = "on";
	else
		inheritedMembers = value;

	value = Load("protectedMembers");
	if (value == null)
		protectedMembers = "on";
	else
		protectedMembers = value;
}

function SaveMembersOptions()
{
	Save("inheritedMembers", inheritedMembers);
	Save("protectedMembers", protectedMembers);
}

function GetDataCache()
{
	try
	{
		if (window.external != null)
		{
			if (window.external.IsDesignTime)
				return window.external;
		}
	}
	catch (e)
	{
	}

	return document.getElementById("UserDataCache");
}

function Load(key)
{
	try 
	{
		var dataCache = GetDataCache();
		dataCache.load("Settings");
		return dataCache.getAttribute(key);
	}
	catch (e)
	{
		// Settings load failed probably due to a non-IE browser.
		// Try to obtain the settings from a parent frame
		if (window.parent != null)
		{
			if (window.parent.dataCache != null)
				return window.parent.dataCache[key];
		}

		return null;
	}
}

function Save(key, value)
{
	try
	{
		var dataCache = GetDataCache();
		dataCache.setAttribute(key, value);
		dataCache.save("Settings");
	}
	catch (e)
	{
		// Settings load failed probably due to a non-IE browser.
		// Try to save the settings to a parent frame
		if (window.parent != null)
		{
			if (window.parent.dataCache != null)
				window.parent.dataCache[key] = value;
		}
	}
}
