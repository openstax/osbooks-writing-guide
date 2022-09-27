function Util() {

  this.showSettingsPanel = ko.observable(false);
  this.showTextPanel = ko.observable(false);
  this.curTheme = ko.observable();
  this.themes = ko.observableArray();

  this.selectThemeHandler = this.selectThemeHandler.bind(this);
  this.loadXML("./data/setting.xml",this.settingXmlLoaded.bind(this));

  this.curTheme.subscribe(function(){
    console.log("theme changed")
    var sheet = document.createElement('style')
    sheet.innerHTML = ":root{--background:"+this.curTheme().background+";--color:"+this.curTheme().color+";--selectioncolor:"+this.curTheme().selectioncolor+"}";
    document.head.appendChild(sheet);
  },this);
}
Util.prototype.settingXmlLoaded = function (xml) {
  this.themes(this.xml2json(xml).dataset.themes.theme);
  this.curTheme(this.themes()[0]);
}
Util.prototype.showSettingsPanelHandler = function () {
  this.showSettingsPanel(true);
  this.showTextPanel(false);
}
Util.prototype.closeSettingsPanelHandler = function () {
  this.showSettingsPanel(false);
}
Util.prototype.showTextHandler = function () {
  this.showTextPanel(true);
  this.showSettingsPanel(false);
}
Util.prototype.closeTextPanelHandler = function () {
  this.showTextPanel(false);
}
Util.prototype.selectThemeHandler = function ($data) {
  this.curTheme($data);
}

Util.prototype.loadXML = function (xmlName, _callBack) {
  var request = $.ajax({ url: xmlName, type: "GET", dataType: "xml" });
  request.done(function (msg) {
    _callBack(msg);
  });
  request.fail(function (jqXHR, textStatus) {
    alert("Request failed: " + textStatus);
  });
};
Util.prototype.loadCrossDomainXML = function (url, _callBack, format) {
  var ref = this;
  if (format === undefined) format = "xml";
  if ($.browser.name == "msie" && parseInt($.browser.version) < 10) {
    simpleAJAXLib = {
      fetchJSON: function () {
        var root = "https://query.yahooapis.com/v1/public/yql?q=";
        var yql = 'select * from xml where url="' + url + '"';
        var proxy_url =
          root +
          encodeURIComponent(yql) +
          "&format=json&diagnostics=false&callback=simpleAJAXLib.display";
        document
          .getElementsByTagName("body")[0]
          .appendChild(this.jsTag(proxy_url));
      },
      jsTag: function (url) {
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", url);
        return script;
      },
      display: function (results) {
        if (format == "xml") {
          _callBack(ref.json2xml(results.query.results));
        } else {
          _callBack(results.query.results);
        }
      },
    };
    simpleAJAXLib.fetchJSON();
  } else {
    var root = "https://query.yahooapis.com/v1/public/yql?q=";
    var yql = 'select * from xml where url="' + url + '"';
    var proxy_url =
      root + encodeURIComponent(yql) + "&format=json&diagnostics=false";
    $.getJSON(proxy_url, function (results) {
      if (format == "xml") {
        _callBack(ref.json2xml(results.query.results));
      } else {
        _callBack(results.query.results);
      }
    }).error(function (jqXHR, textStatus, errorThrown) {
      alert(errorThrown);
    });
  }
};
Util.prototype.getXMLHTTP = function () {
  var xmlhttp = false;
  try {
    xmlhttp = new XMLHttpRequest();
  } catch (e) {
    try {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (e) {
      try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e1) {
        xmlhttp = false;
      }
    }
  }
  return xmlhttp;
};
Util.prototype.initTooltip = function (elem) {
  $(elem).find("a[rel='tooltip']").mTooltip({ width: 350, height: 70 });
};
Util.prototype.isAbsolutePath = function (url) {
  var filter = /^(?:\/|[a-z]+:\/\/)/;
  if (filter.test(url)) {
    return true;
  } else {
    return false;
  }
};
Util.prototype.trace = function (msg) {
  console.log(msg)
};
Util.prototype.json2xml = function (o, tab) {
  var toXml = function (v, name, ind) {
      var xml = "";
      if (v instanceof Array) {
        for (var i = 0, n = v.length; i < n; i++)
          xml += ind + toXml(v[i], name, ind + "	") + "\n";
      } else if (typeof v == "object") {
        var hasChild = false;
        xml += ind + "<" + name;
        for (var m in v) {
          if (m.charAt(0) == "@")
            xml += " " + m.substr(1) + '="' + v[m].toString() + '"';
          else hasChild = true;
        }
        xml += hasChild ? ">" : "/>";
        if (hasChild) {
          for (var m in v) {
            if (m == "#text") xml += v[m];
            else if (m == "#cdata") xml += "<![CDATA[" + v[m] + "]]>";
            else if (m.charAt(0) != "@") xml += toXml(v[m], m, ind + "	");
          }
          xml +=
            (xml.charAt(xml.length - 1) == "\n" ? ind : "") + "</" + name + ">";
        }
      } else {
        xml += ind + "<" + name + ">" + v.toString() + "</" + name + ">";
      }
      return xml;
    },
    xml = "";
  for (var m in o) xml += toXml(o[m], m, "");
  return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
};
Util.prototype.xml2json = function(xml) {
  try {
    var obj = {};
    if (xml.children.length > 0) {
      for (var i = 0; i < xml.children.length; i++) {
        var item = xml.children.item(i);
        var nodeName = item.nodeName;

        if (typeof (obj[nodeName]) == "undefined") {
          obj[nodeName] = this.xml2json(item);
        } else {
          if (typeof (obj[nodeName].push) == "undefined") {
            var old = obj[nodeName];

            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(this.xml2json(item));
        }
      }
    } else {
      obj = xml.textContent;
    }
    return obj;
  } catch (e) {
      console.log(e.message);
  }
}
Util.prototype.shuffleArray = function(array){
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
Util.prototype.generateRandomArray = function(total){
  var array = [];
  for(var i = 1; i <= total; i++){
    array.push(i);
  }
  return this.shuffleArray(array);
}
Util.prototype.isIOSMobileDevice = function () {
  if (
    navigator.userAgent.match(/iPad/i) != null ||
    navigator.userAgent.match(/iPhone/i) != null ||
    navigator.userAgent.match(/iPod/i) != null
  )
    return true;
  else return false;
};