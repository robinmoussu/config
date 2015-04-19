
/**
 * Mailvelope - secure email with OpenPGP encryption for Webmail
 * Copyright (C) 2012  Thomas Oberndörfer
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License version 3
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* jshint strict: false */

var mvelo = mvelo || {};
// chrome extension
mvelo.crx = typeof chrome !== 'undefined';
// firefox addon
mvelo.ffa = mvelo.ffa || typeof self !== 'undefined' && self.port || !mvelo.crx;
// for fixfox, mvelo.extension is exposed from a content script

mvelo.getFirefoxVersion = function() {
  return parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("Firefox/") + 8, navigator.userAgent.length));
};

mvelo.extension = mvelo.extension || mvelo.crx && chrome.runtime;
// extension.connect shim for Firefox
if (mvelo.ffa && mvelo.extension) {
  mvelo.extension.connect = function(obj) {
    mvelo.extension._connect(obj);
    obj.events = {};
    var port = {
      postMessage: mvelo.extension.port.postMessage,
      disconnect: mvelo.extension.port.disconnect.bind(null, obj),
      onMessage: {
        addListener: mvelo.extension.port.addListener.bind(null, obj)
      }
    };
    // page unload triggers port disconnect
    window.addEventListener('unload', port.disconnect);
    return port;
  };
}

mvelo.appendTpl = function($element, path) {
  if (mvelo.ffa && !/^resource/.test(document.location.protocol)) {
    return new Promise(function(resolve, reject) {
      mvelo.data.load(path, function(result) {
        $element.append($.parseHTML(result));
        resolve($element);
      });
    });
  } else {
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      req.open('GET', path);
      req.responseType = 'text';
      req.onload = function() {
        if (req.status == 200) {
          $element.append($.parseHTML(req.response));
          resolve($element);
        } else {
          reject(new Error(req.statusText));
        }
      };
      req.onerror = function() {
        reject(new Error("Network Error"));
      };
      req.send();
    });
  }
};

// for fixfox, mvelo.l10n is exposed from a content script
mvelo.l10n = mvelo.l10n || mvelo.crx && {
  getMessages: function(ids, callback) {
    var result = {};
    ids.forEach(function(id) {
      result[id] = chrome.i18n.getMessage(id);
    });
    callback(result);
  },
  localizeHTML: function(l10n) {
    $('[data-l10n-id]').each(function() {
      var jqElement = $(this);
      var id = jqElement.data('l10n-id');
      var text = l10n ? l10n[id] : chrome.i18n.getMessage(id);
      jqElement.text(text);
    });
  }
};
// min height for large frame
mvelo.LARGE_FRAME = 600;
// frame constants
mvelo.FRAME_STATUS = 'stat';
// frame status
mvelo.FRAME_ATTACHED = 'att';
mvelo.FRAME_DETACHED = 'det';
// key for reference to frame object
mvelo.FRAME_OBJ = 'fra';
// marker for dynamically created iframes
mvelo.DYN_IFRAME = 'dyn';
mvelo.IFRAME_OBJ = 'obj';
// armor header type
mvelo.PGP_MESSAGE = 'msg';
mvelo.PGP_SIGNATURE = 'sig';
mvelo.PGP_PUBLIC_KEY = 'pub';
mvelo.PGP_PRIVATE_KEY = 'priv';
// editor mode
mvelo.EDITOR_WEBMAIL = 'webmail';
mvelo.EDITOR_EXTERNAL = 'external';
mvelo.EDITOR_BOTH = 'both';
// display decrypted message
mvelo.DISPLAY_INLINE = 'inline';
mvelo.DISPLAY_POPUP = 'popup';
// editor type
mvelo.PLAIN_TEXT = 'plain';
mvelo.RICH_TEXT = 'rich';

mvelo.util = {};

mvelo.util.sortAndDeDup = function(unordered, compFn) {
  var result = [];
  var prev = -1;
  unordered.sort(compFn).forEach(function(item) {
    var equal = (compFn !== undefined && prev !== undefined) ? compFn(prev, item) === 0 : prev === item;
    if (!equal) {
      result.push(item);
      prev = item;
    }
  });
  return result;
};

// random hash generator
mvelo.util.getHash = function() {
  var result = '';
  var buf = new Uint16Array(6);
  if (typeof window !== 'undefined') {
    window.crypto.getRandomValues(buf);
  } else {
    mvelo.util.getDOMWindow().crypto.getRandomValues(buf);
  }
  for (var i = 0; i < buf.length; i++) {
    result += buf[i].toString(16);
  }
  return result;
};

mvelo.util.encodeHTML = function(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\//g, "&#x2F;");
};

mvelo.util.decodeQuotedPrint = function(armored) {
  return armored
    .replace(/=3D=3D\s*$/m, "==")
    .replace(/=3D\s*$/m, "=")
    .replace(/=3D(\S{4})\s*$/m, "=$1");
};

mvelo.util.getExtensionClass = function(fileExt) {
  var extClass = "";
  if (fileExt !== undefined) {
    extClass = "ext-color-" + fileExt;
  }
  return extClass;
};

mvelo.util.extractFileNameWithoutExt = function(fileName) {
  var indexOfDot = fileName.lastIndexOf(".");
  if (indexOfDot > 0) { // case: regular
    return fileName.substring(0, indexOfDot);
  } else if (indexOfDot === 0) { // case ".txt"
    return "";
  } else {
    return fileName;
  }
};

mvelo.util.extractFileExtension = function(fileName) {
  var lastindexDot = fileName.lastIndexOf(".");
  if (lastindexDot < 0) { // no extension
    return "";
  } else {
    return fileName.substring(lastindexDot + 1, fileName.length).toLowerCase().trim();
  }
};

mvelo.util.showSecurityBackground = function() {
  mvelo.extension.sendMessage({event: "get-security-background"}, function(background) {
    var bgndColor = background.color; //"#f5f5f5";
    var color = background.iconColor; //"#e9e9e9;";
    var scale = background.scaling; //1.5;
    var rotationDeg = background.angle; //45;
    var width =  background.width * scale; //40;
    var height = background.height * scale; //20;

    var secBgndIcon = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" id="secBgnd" version="1.1" width="' + width + 'px" height="' + height + 'px" viewBox="0 0 27 27"><path transform="rotate(' + rotationDeg + ' 14 14)" style="fill: ' + color + ';" d="m 13.963649,25.901754 c -4.6900005,0 -8.5000005,-3.78 -8.5000005,-8.44 0,-1.64 0.47,-3.17 1.29,-4.47 V 9.0417546 c 0,-3.9399992 3.23,-7.1499992 7.2000005,-7.1499992 3.97,0 7.2,3.21 7.2,7.1499992 v 3.9499994 c 0.82,1.3 1.3,2.83 1.3,4.48 0,4.65 -3.8,8.43 -8.49,8.43 z m -1.35,-7.99 v 3.33 h 0 c 0,0.02 0,0.03 0,0.05 0,0.74 0.61,1.34 1.35,1.34 0.75,0 1.35,-0.6 1.35,-1.34 0,-0.02 0,-0.03 0,-0.05 h 0 v -3.33 c 0.63,-0.43 1.04,-1.15 1.04,-1.97 0,-1.32 -1.07,-2.38 -2.4,-2.38 -1.32,0 -2.4,1.07 -2.4,2.38 0.01,0.82 0.43,1.54 1.06,1.97 z m 6.29,-8.8699994 c 0,-2.7099992 -2.22,-4.9099992 -4.95,-4.9099992 -2.73,0 -4.9500005,2.2 -4.9500005,4.9099992 V 10.611754 C 10.393649,9.6217544 12.103649,9.0317546 13.953649,9.0317546 c 1.85,0 3.55,0.5899998 4.94,1.5799994 l 0.01,-1.5699994 z" /></svg>';

    bgndColor = "transparent";
    color = "#888888";
    rotationDeg = 0;
    width =  "100%";
    height = "100%";

    var lockIcon = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" id="secBgnd" version="1.1" width="' + width + 'px" height="' + height + 'px" viewBox="0 0 27 27"><path transform="rotate(' + rotationDeg + ' 14 14)" style="fill: ' + color + ';" d="m 13.963649,25.901754 c -4.6900005,0 -8.5000005,-3.78 -8.5000005,-8.44 0,-1.64 0.47,-3.17 1.29,-4.47 V 9.0417546 c 0,-3.9399992 3.23,-7.1499992 7.2000005,-7.1499992 3.97,0 7.2,3.21 7.2,7.1499992 v 3.9499994 c 0.82,1.3 1.3,2.83 1.3,4.48 0,4.65 -3.8,8.43 -8.49,8.43 z m -1.35,-7.99 v 3.33 h 0 c 0,0.02 0,0.03 0,0.05 0,0.74 0.61,1.34 1.35,1.34 0.75,0 1.35,-0.6 1.35,-1.34 0,-0.02 0,-0.03 0,-0.05 h 0 v -3.33 c 0.63,-0.43 1.04,-1.15 1.04,-1.97 0,-1.32 -1.07,-2.38 -2.4,-2.38 -1.32,0 -2.4,1.07 -2.4,2.38 0.01,0.82 0.43,1.54 1.06,1.97 z m 6.29,-8.8699994 c 0,-2.7099992 -2.22,-4.9099992 -4.95,-4.9099992 -2.73,0 -4.9500005,2.2 -4.9500005,4.9099992 V 10.611754 C 10.393649,9.6217544 12.103649,9.0317546 13.953649,9.0317546 c 1.85,0 3.55,0.5899998 4.94,1.5799994 l 0.01,-1.5699994 z" /></svg>';

    //var secText  = "Mailvelope";
    //var opacity = "0.9";
    //var secBgndText = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="250" height="60" id="svg2"><g transform="translate(0,-992.36218)" id="layer1"><text x="17.531542" y="1033.6388" id="text2985" xml:space="preserve" style="font-size:40px;font-style:normal;font-weight:normal;line-height:125%;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;font-family:Sans" ><tspan x="17.531542" y="1033.6388" id="tspan2987"  style="fill:' + color + ';fill-rule:evenodd;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:Courgette;" fill-opacity="' + opacity + '">' + secText + '</tspan></text></g></svg>';

    var secureStyle = ".secureBackground { background-color: " + bgndColor + "; background-image: url(data:image/svg+xml;base64," + btoa(secBgndIcon) + "); }";
    var mmodalStyle = ""; //".modal-body { background-color: " + bgndColor + "; background-image: url(data:image/svg+xml;base64," + btoa(secBgndIcon) + "); }";
    var lockButton = ".lockBtnIcon { width: 30px !important; height: 30px; margin-right: -44px; background-size: 100% auto; background-repeat: no-repeat;background-image: url(data:image/svg+xml;base64," + btoa(lockIcon) + "); }";

    $('head').append($("<style>").text(secureStyle + mmodalStyle + lockButton));
  });

  if (typeof exports !== 'undefined') {
    exports.mvelo = mvelo;
  }

};

/**
 * Mailvelope - secure email with OpenPGP encryption for Webmail
 * Copyright (C) 2012  Thomas Oberndörfer
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License version 3
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

var mvelo = mvelo || {};

mvelo.main = {};

mvelo.main.interval = 2500; // ms
mvelo.main.intervalID = 0;
mvelo.main.regex = /END\sPGP/;
mvelo.main.minEditHeight = 84;
mvelo.main.contextTarget = null;
mvelo.main.prefs = null;
mvelo.main.name = 'mainCS-' + mvelo.util.getHash();
mvelo.main.port = null;

mvelo.main.connect = function() {
  if (document.mveloControl) {
    return;
  }
  mvelo.main.port = mvelo.extension.connect({name: mvelo.main.name});
  mvelo.main.addMessageListener();
  mvelo.main.port.postMessage({event: 'get-prefs', sender: mvelo.main.name});
  //mvelo.main.initContextMenu();
  document.mveloControl = true;
};

$(document).ready(mvelo.main.connect);

mvelo.main.init = function(prefs, watchList) {
  mvelo.main.prefs = prefs;
  mvelo.main.watchList = watchList;
  mvelo.domAPI.init();
  if (mvelo.main.prefs.main_active && !mvelo.domAPI.active) {
    mvelo.main.on();
  } else {
    mvelo.main.off();
  }
};

mvelo.main.on = function() {
  //console.log('inside cs: ', document.location.host);
  if (mvelo.main.intervalID === 0) {
    mvelo.main.scanLoop();
    mvelo.main.intervalID = window.setInterval(mvelo.main.scanLoop, mvelo.main.interval);
  }
};

mvelo.main.off = function() {
  if (mvelo.main.intervalID !== 0) {
    window.clearInterval(mvelo.main.intervalID);
    mvelo.main.intervalID = 0;
  }
};

mvelo.main.scanLoop = function() {
  // find armored PGP text
  var pgpTag = mvelo.main.findPGPTag(mvelo.main.regex);
  if (pgpTag.length !== 0) {
    mvelo.main.attachExtractFrame(pgpTag);
  }
  // find editable content
  var editable = mvelo.main.findEditable();
  if (editable.length !== 0) {
    mvelo.main.attachEncryptFrame(editable);
  }
};

/**
 * find text nodes in DOM that match certain pattern
 * @param {Regex} regex
 * @return $([nodes])
 */
mvelo.main.findPGPTag = function(regex) {
  var treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: function(node) {
      if (node.parentNode.tagName !== 'SCRIPT' && mvelo.main.regex.test(node.textContent)) {
        return NodeFilter.FILTER_ACCEPT;
      } else {
        return NodeFilter.FILTER_REJECT;
      }
    }
  }, false);

  var nodeList = [];

  while (treeWalker.nextNode()) {
    nodeList.push(treeWalker.currentNode);
  }

  // filter out hidden elements
  nodeList = $(nodeList).filter(function() {
    var element = $(this);
    // visibility check does not work on text nodes
    return element.parent().is(':visible') &&
      // no elements within editable elements
      element.parents('[contenteditable], textarea').length === 0 &&
      this.ownerDocument.designMode !== 'on';
  });

  return nodeList;
};

mvelo.main.findEditable = function() {
  // find textareas and elements with contenteditable attribute, filter out <body>
  var editable = $('[contenteditable], textarea').filter(':visible').not('body');
  var iframes = $('iframe').filter(':visible');
  // find dynamically created iframes where src is not set
  var dynFrames = iframes.filter(function() {
    var src = $(this).attr('src');
    return src === undefined ||
           src === '' ||
           /^javascript.*/.test(src) ||
           /^about.*/.test(src);
  });
  // find editable elements inside dynamic iframe (content script is not injected here)
  dynFrames.each(function() {
    var content = $(this).contents();
    // set event handler for contextmenu
    content.find('body')//.off("contextmenu").on("contextmenu", mvelo.main.onContextMenu)
    // mark body as 'inside iframe'
                        .data(mvelo.DYN_IFRAME, true)
    // add iframe element
                        .data(mvelo.IFRAME_OBJ, $(this));
    // document of iframe in design mode or contenteditable set on the body
    if (content.attr('designMode') === 'on' || content.find('body[contenteditable]').length !== 0) {
      // add iframe to editable elements
      editable = editable.add($(this));
    } else {
      // editable elements inside iframe
      var editblElem = content.find('[contenteditable], textarea').filter(':visible');
      editable = editable.add(editblElem);
    }
  });
  // find iframes from same origin with a contenteditable body (content script is injected, but encrypt frame needs to be attached to outer iframe)
  var anchor = $('<a/>');
  var editableBody = iframes.not(dynFrames).filter(function() {
    var frame = $(this);
    // only for iframes from same host
    if (anchor.attr('href', frame.attr('src')).prop('hostname') === document.location.hostname) {
      try {
        var content = frame.contents();
        if (content.attr('designMode') === 'on' || content.find('body[contenteditable]').length !== 0) {
          // set event handler for contextmenu
          //content.find('body').off("contextmenu").on("contextmenu", mvelo.main.onContextMenu);
          // mark body as 'inside iframe'
          content.find('body').data(mvelo.IFRAME_OBJ, frame);
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    }
  });
  editable = editable.add(editableBody);
  // filter out elements below a certain height limit
  editable = editable.filter(function() {
    return $(this).height() > mvelo.main.minEditHeight;
  });
  return editable;
};

mvelo.main.getMessageType = function(armored) {
  if (/END\sPGP\sMESSAGE/.test(armored)) {
    return mvelo.PGP_MESSAGE;
  } else if (/END\sPGP\sSIGNATURE/.test(armored)) {
    return mvelo.PGP_SIGNATURE;
  } else if (/END\sPGP\sPUBLIC\sKEY\sBLOCK/.test(armored)) {
    return mvelo.PGP_PUBLIC_KEY;
  } else if (/END\sPGP\sPRIVATE\sKEY\sBLOCK/.test(armored)) {
    return mvelo.PGP_PRIVATE_KEY;
  }
};

mvelo.main.attachExtractFrame = function(element) {
  // check status of PGP tags
  var newObj = element.filter(function() {
    return !mvelo.ExtractFrame.isAttached($(this).parent());
  });
  // create new decrypt frames for new discovered PGP tags
  newObj.each(function(index, element) {
    // parent element of text node
    var pgpEnd = $(element).parent();
    switch (mvelo.main.getMessageType(pgpEnd.text())) {
      case mvelo.PGP_MESSAGE:
        var dFrame = new mvelo.DecryptFrame(mvelo.main.prefs);
        dFrame.attachTo(pgpEnd);
        break;
      case mvelo.PGP_SIGNATURE:
        var vFrame = new mvelo.VerifyFrame(mvelo.main.prefs);
        vFrame.attachTo(pgpEnd);
        break;
      case mvelo.PGP_PUBLIC_KEY:
        var imFrame = new mvelo.ImportFrame(mvelo.main.prefs);
        imFrame.attachTo(pgpEnd);
        break;
    }
  });
};

/**
 * attach encrypt frame to element
 * @param  {$} element
 * @param  {boolean} expanded state of frame
 */
mvelo.main.attachEncryptFrame = function(element, expanded) {
  // check status of elements
  var newObj = element.filter(function() {
    if (expanded) {
      // filter out only attached frames
      if (element.data(mvelo.FRAME_STATUS) === mvelo.FRAME_ATTACHED) {
        // trigger expand state of attached frames
        element.data(mvelo.FRAME_OBJ).showEncryptDialog();
        return false;
      } else {
        return true;
      }
    } else {
      // filter out attached and detached frames
      return !mvelo.EncryptFrame.isAttached($(this));
    }
  });
  // create new encrypt frames for new discovered editable fields
  newObj.each(function(index, element) {
    var eFrame = new mvelo.EncryptFrame(mvelo.main.prefs);
    eFrame.attachTo($(element), {expanded: expanded});
  });
};

mvelo.main.addMessageListener = function() {
  mvelo.main.port.onMessage.addListener(
    function(request) {
      //console.log('contentscript: %s onRequest: %o', document.location.toString(), request);
      if (request.event === undefined) {
        return;
      }
      switch (request.event) {
        case 'on':
          mvelo.main.on();
          break;
        case 'off':
          mvelo.main.off();
          break;
        case 'destroy':
          mvelo.main.off();
          mvelo.main.port.disconnect();
          break;
        case 'context-encrypt':
          if (mvelo.main.contextTarget !== null) {
            mvelo.main.attachEncryptFrame(mvelo.main.contextTarget, true);
            mvelo.main.contextTarget = null;
          }
          break;
        case 'set-prefs':
          mvelo.main.init(request.prefs, request.watchList);
          break;
        default:
          console.log('unknown event');
      }
    }
  );
};

mvelo.main.initContextMenu = function() {
  // set handler
  $("body").on("contextmenu", mvelo.main.onContextMenu);
};

mvelo.main.onContextMenu = function(e) {
  //console.log(e.target);
  var target = $(e.target);
  // find editable descendants or ascendants
  var element = target.find('[contenteditable], textarea');
  if (element.length === 0) {
    element = target.closest('[contenteditable], textarea');
  }
  if (element.length !== 0 && !element.is('body')) {
    if (element.height() > mvelo.main.minEditHeight) {
      mvelo.main.contextTarget = element;
    } else {
      mvelo.main.contextTarget = null;
    }
    return;
  }
  // inside dynamic iframe or iframes from same origin with a contenteditable body
  element = target.closest('body');
  // get outer iframe
  var iframeObj = element.data(mvelo.IFRAME_OBJ);
  if (iframeObj !== undefined) {
    // target set to outer iframe
    mvelo.main.contextTarget = iframeObj;
    return;
  }
  // no suitable element found
  mvelo.main.contextTarget = null;
};

/**
 * Mailvelope - secure email with OpenPGP encryption for Webmail
 * Copyright (C) 2013  Thomas Oberndörfer
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License version 3
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

var mvelo = mvelo || {};

mvelo.ExtractFrame = function(prefs) {
  if (!prefs) {
    throw {
      message: 'mvelo.ExtractFrame constructor: prefs not provided.'
    };
  }
  this.id = mvelo.util.getHash();
  // element with Armor Tail Line '-----END PGP...'
  this._pgpEnd = null;
  // element that contains complete ASCII Armored Message
  this._pgpElement = null;
  this._pgpElementAttr = {};
  this._eFrame = null;
  this._port = null;
  this._refreshPosIntervalID = null;
  this._pgpStartRegex = /BEGIN\sPGP/;
};

mvelo.ExtractFrame.prototype.attachTo = function(pgpEnd) {
  this._init(pgpEnd);
  this._renderFrame();
  this._establishConnection();
  this._registerEventListener();
};

mvelo.ExtractFrame.prototype._init = function(pgpEnd) {
  this._pgpEnd = pgpEnd;
  // find element with complete armored text and width > 0
  this._pgpElement = pgpEnd;
  while (!this._pgpStartRegex.test(this._pgpElement.text()) || this._pgpElement.width() <= 0) {
    this._pgpElement = this._pgpElement.parent();
  }
  // set status to attached
  this._pgpEnd.data(mvelo.FRAME_STATUS, mvelo.FRAME_ATTACHED);
  // store frame obj in pgpText tag
  this._pgpEnd.data(mvelo.FRAME_OBJ, this);

  this._pgpElementAttr.marginTop = parseInt(this._pgpElement.css('margin-top'), 10);
  this._pgpElementAttr.paddingTop = parseInt(this._pgpElement.css('padding-top'), 10);
};

mvelo.ExtractFrame.prototype._renderFrame = function() {
  this._eFrame = $('<div/>', {
    id: 'eFrame-' + this.id,
    'class': 'm-extract-frame m-cursor',
    html: '<a class="m-frame-close">×</a>'
  });

  this._setFrameDim();

  this._eFrame.insertAfter(this._pgpElement);
  if (this._pgpElement.height() > mvelo.LARGE_FRAME) {
    this._eFrame.addClass('m-large');
  }
  this._eFrame.fadeIn('slow');

  this._eFrame.on('click', this._clickHandler.bind(this));
  this._eFrame.find('.m-frame-close').on('click', this._closeFrame.bind(this));

  $(window).resize(this._setFrameDim.bind(this));
  this._refreshPosIntervalID = window.setInterval(this._setFrameDim.bind(this), 1000);
};

mvelo.ExtractFrame.prototype._clickHandler = function(callback) {
  this._eFrame.off('click');
  this._toggleIcon(callback);
  this._eFrame.removeClass('m-cursor');
  return false;
};

mvelo.ExtractFrame.prototype._closeFrame = function(finalClose) {
  this._eFrame.fadeOut(function() {
    window.clearInterval(this._refreshPosIntervalID);
    $(window).off('resize');
    this._eFrame.remove();
    if (finalClose === true) {
      this._port.disconnect();
      this._pgpEnd.data(mvelo.FRAME_STATUS, null);
    } else {
      this._pgpEnd.data(mvelo.FRAME_STATUS, mvelo.FRAME_DETACHED);
    }
    this._pgpEnd.data(mvelo.FRAME_OBJ, null);
  }.bind(this));
  return false;
};

mvelo.ExtractFrame.prototype._toggleIcon = function(callback) {
  this._eFrame.one('transitionend', callback);
  this._eFrame.toggleClass('m-open');
};

mvelo.ExtractFrame.prototype._setFrameDim = function() {
  var pgpElementPos = this._pgpElement.position();
  this._eFrame.width(this._pgpElement.width() - 2);
  this._eFrame.height(this._pgpEnd.position().top + this._pgpEnd.height() - pgpElementPos.top - 2);
  this._eFrame.css('top', pgpElementPos.top + this._pgpElementAttr.marginTop + this._pgpElementAttr.paddingTop);
};

mvelo.ExtractFrame.prototype._establishConnection = function() {
  this._port = mvelo.extension.connect({name: this._ctrlName});
  //console.log('Port connected: %o', this._port);
};

mvelo.ExtractFrame.prototype._htmlDecode = function(html) {
  return String(html)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#039;/g, "\'")
    .replace(/&#x2F;/g, "\/");
};

mvelo.ExtractFrame.prototype._getArmoredMessage = function() {
  var msg;
  if (this._pgpElement.is('pre')) {
    msg = this._pgpElement.clone();
    msg.find('br').replaceWith('\n');
    msg = msg.text();
  } else {
    msg = this._pgpElement.html();
    msg = msg.replace(/\n/g, ' '); // replace new line with space
    msg = msg.replace(/(<br>)/g, '\n'); // replace <br> with new line
    msg = msg.replace(/<\/(blockquote|div|dl|dt|dd|form|h1|h2|h3|h4|h5|h6|hr|ol|p|pre|table|tr|td|ul|li|section|header|footer)>/g, '\n'); // replace block closing tags </..> with new line
    msg = msg.replace(/<(.+?)>/g, ''); // remove tags
    msg = msg.replace(/&nbsp;/g, ' '); // replace non-breaking space with whitespace
    msg = this._htmlDecode(msg);
  }
  msg = msg.replace(/\n\s+/g, '\n'); // compress sequence of whitespace and new line characters to one new line
  msg = msg.match(this._typeRegex)[0];
  msg = msg.replace(/^(\s?>)+/gm, ''); // remove quotation
  msg = msg.replace(/^\s+/gm, ''); // remove leading whitespace
  msg = msg.replace(/:.*\n(?!.*:)/, '$&\n');  // insert new line after last armor header
  msg = msg.replace(/-----\n(?!.*:)/, '$&\n'); // insert new line if no header
  msg = mvelo.util.decodeQuotedPrint(msg);
  return msg;
};

mvelo.ExtractFrame.prototype._registerEventListener = function() {
  var that = this;
  this._port.onMessage.addListener(function(msg) {
    switch (msg.event) {
      case 'destroy':
        that._closeFrame(true);
        break;
    }
  });
};

mvelo.ExtractFrame.isAttached = function(pgpEnd) {
  var status = pgpEnd.data(mvelo.FRAME_STATUS);
  switch (status) {
    case mvelo.FRAME_ATTACHED:
    case mvelo.FRAME_DETACHED:
      return true;
    default:
      return false;
  }
};

/**
 * Mailvelope - secure email with OpenPGP encryption for Webmail
 * Copyright (C) 2012  Thomas Oberndörfer
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License version 3
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

var mvelo = mvelo || {};

mvelo.DecryptFrame = function(prefs) {
  mvelo.ExtractFrame.call(this, prefs);
  this._displayMode = prefs.security.display_decrypted;
  this._dDialog = null;
  // decrypt popup active
  this._dPopup = false;
  this._ctrlName = 'dFrame-' + this.id;
  this._typeRegex = /-----BEGIN PGP MESSAGE-----[\s\S]+?-----END PGP MESSAGE-----/;
};

mvelo.DecryptFrame.prototype = Object.create(mvelo.ExtractFrame.prototype);
mvelo.DecryptFrame.prototype.parent = mvelo.ExtractFrame.prototype;

mvelo.DecryptFrame.prototype._renderFrame = function() {
  this.parent._renderFrame.call(this);
  this._eFrame.addClass('m-decrypt');
};

mvelo.DecryptFrame.prototype._clickHandler = function() {
  this.parent._clickHandler.call(this);
  if (this._displayMode == mvelo.DISPLAY_INLINE) {
    this._inlineDialog();
  } else if (this._displayMode == mvelo.DISPLAY_POPUP) {
    this._popupDialog();
  }
  return false;
};

mvelo.DecryptFrame.prototype._inlineDialog = function() {
  this._dDialog = $('<iframe/>', {
    id: 'dDialog-' + this.id,
    'class': 'm-frame-dialog',
    frameBorder: 0,
    scrolling: 'no'
  });
  var url;
  if (mvelo.crx) {
    url = mvelo.extension.getURL('common/ui/inline/dialogs/decryptInline.html?id=' + this.id);
  } else if (mvelo.ffa) {
    url = 'about:blank?mvelo=decryptInline&id=' + this.id;
  }
  this._dDialog.attr('src', url);
  this._eFrame.append(this._dDialog);
  this._setFrameDim();
  this._dDialog.fadeIn();
};

mvelo.DecryptFrame.prototype._popupDialog = function() {
  this._port.postMessage({
    event: 'dframe-display-popup',
    sender: this._ctrlName
  });
  this._dPopup = true;
};

mvelo.DecryptFrame.prototype._removeDialog = function() {
  // check if dialog is active
  if (!this._dDialog && !this._dPopup) {
    return;
  }
  if (this._displayMode === mvelo.DISPLAY_INLINE) {
    this._dDialog.fadeOut();
    // removal triggers disconnect event
    this._dDialog.remove();
    this._dDialog = null;
  } else {
    this._dPopup = false;
  }
  this._eFrame.addClass('m-cursor');
  this._toggleIcon();
  this._eFrame.on('click', this._clickHandler.bind(this));
};

mvelo.DecryptFrame.prototype._registerEventListener = function() {
  this.parent._registerEventListener.call(this);
  var that = this;
  this._port.onMessage.addListener(function(msg) {
    //console.log('dFrame-%s event %s received', that.id, msg.event);
    switch (msg.event) {
      case 'remove-dialog':
      case 'dialog-cancel':
        that._removeDialog();
        break;
      case 'get-armored':
        that._port.postMessage({
          event: 'set-armored',
          data: that._getArmoredMessage(),
          sender: that._ctrlName
        });
        break;
    }
  });
};

/**
 * Mailvelope - secure email with OpenPGP encryption for Webmail
 * Copyright (C) 2012  Thomas Oberndörfer
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License version 3
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

var mvelo = mvelo || {};

mvelo.VerifyFrame = function(prefs) {
  mvelo.ExtractFrame.call(this, prefs);
  this._displayMode = prefs.security.display_decrypted;
  this._vDialog = null;
  // verify popup active
  this._vPopup = false;
  this._ctrlName = 'vFrame-' + this.id;
  this._typeRegex = /-----BEGIN PGP SIGNED MESSAGE-----[\s\S]+?-----END PGP SIGNATURE-----/;
  this._pgpStartRegex = /BEGIN\sPGP\sSIGNED/;
  this._sigHeight = 128;
};

mvelo.VerifyFrame.prototype = Object.create(mvelo.ExtractFrame.prototype);
mvelo.VerifyFrame.prototype.parent = mvelo.ExtractFrame.prototype;

mvelo.VerifyFrame.prototype._init = function(pgpEnd) {
  this.parent._init.call(this, pgpEnd);
  this._calcSignatureHeight();
};

mvelo.VerifyFrame.prototype._renderFrame = function() {
  this.parent._renderFrame.call(this);
  this._eFrame.addClass('m-verify');
  this._eFrame.removeClass('m-large');
};

mvelo.VerifyFrame.prototype._calcSignatureHeight = function() {
  var msg = this._getArmoredMessage();
  msg = msg.split('\n');
  for (var i = 0; i < msg.length; i++) {
    if (/-----BEGIN\sPGP\sSIGNATURE-----/.test(msg[i])) {
      var height = this._pgpEnd.position().top + this._pgpEnd.height() - this._pgpElement.position().top - 2;
      this._sigHeight = parseInt(height / msg.length * (msg.length - i), 10);
      break;
    }
  }
};

mvelo.VerifyFrame.prototype._clickHandler = function() {
  this.parent._clickHandler.call(this);
  if (this._displayMode == mvelo.DISPLAY_INLINE) {
    this._inlineDialog();
  } else if (this._displayMode == mvelo.DISPLAY_POPUP) {
    this._popupDialog();
  }
  return false;
};

mvelo.VerifyFrame.prototype._inlineDialog = function() {
  this._vDialog = $('<iframe/>', {
    id: 'vDialog-' + this.id,
    'class': 'm-frame-dialog',
    frameBorder: 0,
    scrolling: 'no'
  });
  var url;
  if (mvelo.crx) {
    url = mvelo.extension.getURL('common/ui/inline/dialogs/verifyInline.html?id=' + this.id);
  } else if (mvelo.ffa) {
    url = 'about:blank?mvelo=verifyInline&id=' + this.id;
  }
  this._vDialog.attr('src', url);
  this._eFrame.append(this._vDialog);
  this._setFrameDim();
  this._vDialog.fadeIn();
};

mvelo.VerifyFrame.prototype._popupDialog = function() {
  this._port.postMessage({
    event: 'vframe-display-popup',
    sender: this._ctrlName
  });
  this._vPopup = true;
};

mvelo.VerifyFrame.prototype._removeDialog = function() {
  // check if dialog is active
  if (!this._vDialog && !this._vPopup) {
    return;
  }
  if (this._displayMode === mvelo.DISPLAY_INLINE) {
    this._vDialog.fadeOut();
    // removal triggers disconnect event
    this._vDialog.remove();
    this._vDialog = null;
  } else {
    this._vPopup = false;
  }
  this._eFrame.addClass('m-cursor');
  this._eFrame.removeClass('m-open');
  this._eFrame.on('click', this._clickHandler.bind(this));
};

mvelo.VerifyFrame.prototype._getArmoredMessage = function() {
  var msg;
  // selection method does not work in Firefox if pre element without linebreaks with <br>
  if (this._pgpElement.is('pre') && !this._pgpElement.find('br').length) {
    msg = this._pgpElement.text();
  } else {
    var sel = document.defaultView.getSelection();
    sel.selectAllChildren(this._pgpElement.get(0));
    msg = sel.toString();
    sel.removeAllRanges();
  }
  return msg;
};

mvelo.VerifyFrame.prototype._setFrameDim = function() {
  var pgpElementPos = this._pgpElement.position();
  this._eFrame.width(this._pgpElement.width() - 2);
  var height = this._pgpEnd.position().top + this._pgpEnd.height() - pgpElementPos.top - 2;
  var top = pgpElementPos.top + this._pgpElementAttr.marginTop + this._pgpElementAttr.paddingTop;
  if (this._vDialog) {
    this._eFrame.height(height);
    this._eFrame.css('top', top);
  } else {
    this._eFrame.height(this._sigHeight);
    this._eFrame.css('top', top + height - this._sigHeight);
  }
},

mvelo.VerifyFrame.prototype._registerEventListener = function() {
  this.parent._registerEventListener.call(this);
  var that = this;
  this._port.onMessage.addListener(function(msg) {
    //console.log('dFrame-%s event %s received', that.id, msg.event);
    switch (msg.event) {
      case 'remove-dialog':
        that._removeDialog();
        break;
      case 'armored-message':
        that._port.postMessage({
          event: 'vframe-armored-message',
          data: that._getArmoredMessage(),
          sender: that._ctrlName
        });
        break;
    }
  });
};

/**
 * Mailvelope - secure email with OpenPGP encryption for Webmail
 * Copyright (C) 2013  Thomas Oberndörfer
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License version 3
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

var mvelo = mvelo || {};

mvelo.ImportFrame = function(prefs) {
  mvelo.ExtractFrame.call(this, prefs);
  this._ctrlName = 'imFrame-' + this.id;
  this._typeRegex = /-----BEGIN PGP PUBLIC KEY BLOCK-----[\s\S]+?-----END PGP PUBLIC KEY BLOCK-----/;
};

mvelo.ImportFrame.prototype = Object.create(mvelo.ExtractFrame.prototype);
mvelo.ImportFrame.prototype.parent = mvelo.ExtractFrame.prototype;

mvelo.ImportFrame.prototype._renderFrame = function() {
  this.parent._renderFrame.call(this);
  this._eFrame.addClass('m-import');
};

mvelo.ImportFrame.prototype._clickHandler = function() {
  var that = this;
  this.parent._clickHandler.call(this, function() {
    that._port.postMessage({
      event: 'imframe-armored-key',
      data: that._getArmoredMessage(),
      sender: that._ctrlName
    });
  });
  return false;
};

mvelo.ImportFrame.prototype._registerEventListener = function() {
  this.parent._registerEventListener.call(this);
  var that = this;
  this._port.onMessage.addListener(function(msg) {
    switch (msg.event) {
      case 'import-result':
        if (msg.resultType.error) {
          that._eFrame.addClass('m-error');
        } else if (msg.resultType.warning) {
          that._eFrame.addClass('m-warning');
        } else if (msg.resultType.success) {
          that._eFrame.addClass('m-ok');
        }
        break;
    }
  });
};

/**
 * Mailvelope - secure email with OpenPGP encryption for Webmail
 * Copyright (C) 2012  Thomas Oberndörfer
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License version 3
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

var mvelo = mvelo || {};

mvelo.EncryptFrame = function(prefs) {
  this.id = mvelo.util.getHash();
  this._editElement = null;
  this._eFrame = null;
  this._eDialog = null;
  this._port = null;
  this._isToolbar = false;
  this._refreshPosIntervalID = 0;
  this._emailTextElement = null;
  this._emailUndoText = null;
  this._editorMode = prefs.security.editor_mode;
  // type of external editor
  this._editorType = mvelo.PLAIN_TEXT; //prefs.general.editor_type;
  this._options = {expanded: false, closeBtn: true};
  this._keyCounter = 0;
};

mvelo.EncryptFrame.prototype.attachTo = function(element, options) {
  $.extend(this._options, options);
  this._init(element);
  this._renderFrame(this._options.expanded);
  this._establishConnection();
  this._registerEventListener();
  // set status to attached
  this._editElement.data(mvelo.FRAME_STATUS, mvelo.FRAME_ATTACHED);
  // store frame obj in element tag
  this._editElement.data(mvelo.FRAME_OBJ, this);
};

mvelo.EncryptFrame.prototype.getID = function() {
  return this.id;
};

mvelo.EncryptFrame.prototype._init = function(element) {
  this._editElement = element;
  this._emailTextElement = this._options.editor || (this._editElement.is('iframe') ? this._editElement.contents().find('body') : this._editElement);
  // inject style if we have a non-body editable element inside a dynamic iframe
  if (!this._editElement.is('body') && this._editElement.closest('body').data(mvelo.DYN_IFRAME)) {
    var html = this._editElement.closest('html');
    if (!html.data('M-STYLE')) {
      var style = $('<link/>', {
        rel: 'stylesheet',
        href: mvelo.extension.getURL('common/ui/inline/framestyles.css')
      });
      // add style
      html.find('head').append(style);
      // set marker
      html.data('M-STYLE', true);
    }
  }
};

mvelo.EncryptFrame.prototype._renderFrame = function(expanded) {
  var that = this;
  // create frame
  var toolbar = '';
  if (this._options.closeBtn) {
    toolbar = toolbar + '<a class="m-frame-close">×</a>';
  } else {
    toolbar = toolbar + '<span class="m-frame-fill-right"></span>';
  }
  /* jshint multistr: true */
  toolbar = toolbar + '\
            <button id="signBtn" class="m-btn m-encrypt-button" type="button"><i class="m-icon m-icon-sign"></i></button> \
            <button id="encryptBtn" class="m-btn m-encrypt-button" type="button"><i class="m-icon m-icon-encrypt"></i></button> \
            <button id="undoBtn" class="m-btn m-encrypt-button" type="button"><i class="m-icon m-icon-undo"></i></button> \
            <button id="editorBtn" class="m-btn m-encrypt-button" type="button"><i class="m-icon m-icon-editor"></i></button> \
            ';
  this._eFrame = $('<div/>', {
    id: 'eFrame-' + that.id,
    'class': 'm-encrypt-frame',
    html: toolbar
  });

  this._eFrame.insertAfter(this._editElement);
  $(window).on('resize', this._setFrameDim.bind(this));
  // to react on position changes of edit element, e.g. click on CC or BCC in GMail
  this._refreshPosIntervalID = window.setInterval(this._setFrameDim.bind(this), 1000);
  this._eFrame.find('.m-frame-close').on('click', this._closeFrame.bind(this));
  this._eFrame.find('#signBtn').on('click', this._onSignButton.bind(this));
  this._eFrame.find('#encryptBtn').on('click', this._onEncryptButton.bind(this));
  this._eFrame.find('#undoBtn').on('click', this._onUndoButton.bind(this));
  this._eFrame.find('#editorBtn').on('click', this._onEditorButton.bind(this));
  if (!expanded) {
    this._isToolbar = true;
    this._normalizeButtons();
    this._eFrame.fadeIn('slow');
  } else {
    this.showEncryptDialog();
  }
  if (this._editorMode === mvelo.EDITOR_EXTERNAL) {
    this._emailTextElement.on('keypress', function() {
      if (++that._keyCounter >= 13) {
        that._emailTextElement.off('keypress');
        that._eFrame.fadeOut('slow', function() {
          that._closeFrame();
        });
      }
    });
  }
};

mvelo.EncryptFrame.prototype._normalizeButtons = function() {
  //console.log('editor mode', this._editorMode);
  this._eFrame.find('.m-encrypt-button').hide();
  switch (this._editorMode) {
    case mvelo.EDITOR_WEBMAIL:
      this._eFrame.find('#encryptBtn').show();
      this._eFrame.find('#signBtn').show();
      break;
    case mvelo.EDITOR_EXTERNAL:
      this._eFrame.find('#editorBtn').show();
      break;
    case mvelo.EDITOR_BOTH:
      this._eFrame.find('#encryptBtn').show();
      this._eFrame.find('#editorBtn').show();
      break;
    default:
      throw 'Unknown editor mode';
  }
  if (this._emailUndoText) {
    this._eFrame.find('#undoBtn').show();
  }
  this._setFrameDim();
};

mvelo.EncryptFrame.prototype._onSignButton = function() {
  this.showSignDialog();
  return false;
};

mvelo.EncryptFrame.prototype._onEncryptButton = function() {
  this.showEncryptDialog();
  return false;
};

mvelo.EncryptFrame.prototype._onUndoButton = function() {
  this._resetEmailText();
  this._normalizeButtons();
  return false;
};

mvelo.EncryptFrame.prototype._onEditorButton = function() {
  this._emailTextElement.off('keypress');
  this._showMailEditor();
  return false;
};

mvelo.EncryptFrame.prototype.showSignDialog = function() {
  this._expandFrame(this._showDialog.bind(this, 'sign'));
};

mvelo.EncryptFrame.prototype.showEncryptDialog = function() {
  this._expandFrame(this._showDialog.bind(this, 'encrypt'));
};

mvelo.EncryptFrame.prototype._expandFrame = function(callback) {
  this._eFrame.hide();
  this._eFrame.find('.m-encrypt-button').hide();
  this._eFrame.addClass('m-encrypt-frame-expanded');
  this._eFrame.css('margin', this._editElement.css('margin'));
  this._isToolbar = false;
  this._setFrameDim();
  this._eFrame.fadeIn('slow', callback);
};

mvelo.EncryptFrame.prototype._closeFrame = function(finalClose) {
  this._eFrame.fadeOut(function() {
    window.clearInterval(this._refreshPosIntervalID);
    $(window).off('resize');
    this._eFrame.remove();
    if (finalClose === true) {
      this._port.disconnect();
      this._editElement.data(mvelo.FRAME_STATUS, null);
    } else {
      this._editElement.data(mvelo.FRAME_STATUS, mvelo.FRAME_DETACHED);
    }
    this._editElement.data(mvelo.FRAME_OBJ, null);
  }.bind(this));
  return false;
};

mvelo.EncryptFrame.prototype._setFrameDim = function() {
  var editElementPos = this._editElement.position();
  var editElementWidth = this._editElement.width();
  if (this._isToolbar) {
    var toolbarWidth = this._eFrame.width();
    this._eFrame.css('top', editElementPos.top + 3);
    this._eFrame.css('left', editElementPos.left + editElementWidth - toolbarWidth - 20);
  } else {
    this._eFrame.css('top', editElementPos.top + 2);
    this._eFrame.css('left', editElementPos.left + 2);
    this._eFrame.width(editElementWidth - 20);
    this._eFrame.height(this._editElement.height() - 4);
  }
};

mvelo.EncryptFrame.prototype._showDialog = function(type) {
  this._eDialog = $('<iframe/>', {
    id: 'eDialog-' + this.id,
    'class': 'm-frame-dialog',
    frameBorder: 0,
    scrolling: 'no'
  });
  var url, dialog;
  if (type === 'encrypt') {
    dialog = 'encryptDialog';
  } else if (type === 'sign') {
    dialog = 'signDialog';
  }
  if (mvelo.crx) {
    url = mvelo.extension.getURL('common/ui/inline/dialogs/' + dialog + '.html?id=' + this.id);
  } else if (mvelo.ffa) {
    url = 'about:blank?mvelo=' + dialog + '&id=' + this.id;
  }
  this._eDialog.attr('src', url);
  this._eFrame.append(this._eDialog);
  this._setFrameDim();
  this._eDialog.fadeIn();
};

mvelo.EncryptFrame.prototype._showMailEditor = function() {
  this._port.postMessage({
    event: 'eframe-display-editor',
    sender: 'eFrame-' + this.id,
    text: this._getEmailText(this._editorType == mvelo.PLAIN_TEXT ? 'text' : 'html')
  });
};

mvelo.EncryptFrame.prototype._establishConnection = function() {
  this._port = mvelo.extension.connect({name: 'eFrame-' + this.id});
};

mvelo.EncryptFrame.prototype._removeDialog = function() {
  if (!this._eDialog) {
    return;
  }
  this._eDialog.fadeOut();
  // removal triggers disconnect event
  this._eDialog.remove();
  this._eDialog = null;
  this._showToolbar();
};

mvelo.EncryptFrame.prototype._showToolbar = function() {
  this._eFrame.fadeOut(function() {
    this._eFrame.removeClass('m-encrypt-frame-expanded');
    this._eFrame.removeAttr('style');
    this._isToolbar = true;
    this._normalizeButtons();
    this._eFrame.fadeIn('slow');
  }.bind(this));
  return false;
};

mvelo.EncryptFrame.prototype._html2text = function(html) {
  html = $('<div/>').html(html);
  // replace anchors
  html = html.find('a').replaceWith(function() {
                                      return $(this).text() + ' (' + $(this).attr('href') + ')';
                                    })
                       .end()
                       .html();
  html = html.replace(/(<(br|ul|ol)>)/g, '\n'); // replace <br>,<ol>,<ul> with new line
  html = html.replace(/<\/(div|p|li)>/g, '\n'); // replace </div>, </p> or </li> tags with new line
  html = html.replace(/<li>/g, '- ');
  html = html.replace(/<(.+?)>/g, ''); // remove tags
  html = html.replace(/\n{3,}/g, '\n\n'); // compress new line
  return $('<div/>').html(html).text(); // decode
};

mvelo.EncryptFrame.prototype._getEmailText = function(type) {
  var text, html;
  if (this._emailTextElement.is('textarea')) {
    text = this._emailTextElement.val();
  } else { // html element
    if (type === 'text') {
      this._emailTextElement.focus();
      var element = this._emailTextElement.get(0);
      var sel = element.ownerDocument.defaultView.getSelection();
      sel.selectAllChildren(element);
      text = sel.toString();
      sel.removeAllRanges();
    } else {
      html = this._emailTextElement.html();
      html = html.replace(/\n/g, ''); // remove new lines
      text = html;
    }
  }
  return text;
};

/**
 * Save editor content for later undo
 */
mvelo.EncryptFrame.prototype._saveEmailText = function() {
  if (this._emailTextElement.is('textarea')) {
    this._emailUndoText = this._emailTextElement.val();
  } else {
    this._emailUndoText = this._emailTextElement.html();
  }
};

mvelo.EncryptFrame.prototype._getEmailRecipient = function() {
  var emails = [];
  var emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/g;
  $('span').filter(':visible').each(function() {
    var valid = $(this).text().match(emailRegex);
    if (valid !== null) {
      // second filtering: only direct text nodes of span elements
      var spanClone = $(this).clone();
      spanClone.children().remove();
      valid = spanClone.text().match(emailRegex);
      if (valid !== null) {
        emails = emails.concat(valid);
      }
    }
  });
  $('input, textarea').filter(':visible').each(function() {
    var valid = $(this).val().match(emailRegex);
    if (valid !== null) {
      emails = emails.concat(valid);
    }
  });
  //console.log('found emails', emails);
  return emails;
};

/**
 * Replace content of editor element (_emailTextElement)
 * @param {string} msg txt or html content
 */
mvelo.EncryptFrame.prototype._setMessage = function(msg, type) {
  if (this._emailTextElement.is('textarea')) {
    // decode HTML entities for type text due to previous HTML parsing
    msg = $('<div/>').html(msg).text(); // decode
    if (this._options.set_text) {
      this._options.set_text(msg);
    } else {
      this._emailTextElement.val(msg);
    }
  } else {
    // element is contenteditable or RTE
    if (type == 'text') {
      var wrapper = $('<div/>');
      wrapper.append($('<pre/>').html(msg));
      msg = wrapper.html();
    }
    if (this._options.set_text) {
      this._options.set_text(msg);
    } else {
      this._emailTextElement.html(msg);
    }
  }
};

mvelo.EncryptFrame.prototype._resetEmailText = function() {
  if (this._emailTextElement.is('textarea')) {
    this._emailTextElement.val(this._emailUndoText);
  } else {
    this._emailTextElement.html(this._emailUndoText);
  }
  this._emailUndoText = null;
};

mvelo.EncryptFrame.prototype._registerEventListener = function() {
  var that = this;
  this._port.onMessage.addListener(function(msg) {
    //console.log('eFrame-%s event %s received', that.id, msg.event);
    switch (msg.event) {
      case 'encrypt-dialog-cancel':
      case 'sign-dialog-cancel':
        that._removeDialog();
        break;
      case 'email-text':
        that._port.postMessage({
          event: 'eframe-email-text',
          data: that._getEmailText(msg.type),
          action: msg.action,
          sender: 'eFrame-' + that.id
        });
        break;
      case 'destroy':
        that._closeFrame(true);
        break;
      case 'recipient-proposal':
        that._port.postMessage({
          event: 'eframe-recipient-proposal',
          data: that._getEmailRecipient(),
          sender: 'eFrame-' + that.id
        });
        that._port.postMessage({
          event: 'eframe-textarea-element',
          isTextElement: that._emailTextElement.is('textarea'),
          sender: 'eFrame-' + that.id
        });
        break;
      case 'encrypted-message':
      case 'signed-message':
        that._saveEmailText();
        that._removeDialog();
        that._setMessage(msg.message, 'text');
        break;
      case 'set-editor-output':
        that._saveEmailText();
        that._normalizeButtons();
        that._setMessage(msg.text, 'text');
        break;
      default:
        console.log('unknown event', msg);
    }
  });
};

mvelo.EncryptFrame.isAttached = function(element) {
  var status = element.data(mvelo.FRAME_STATUS);
  switch (status) {
    case mvelo.FRAME_ATTACHED:
    case mvelo.FRAME_DETACHED:
      return true;
    default:
      return false;
  }
};

/**
 * Mailvelope - secure email with OpenPGP encryption for Webmail
 * Copyright (C) 2014  Thomas Oberndörfer
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License version 3
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

var mvelo = mvelo || {};

mvelo.DecryptContainer = function(selector) {
  this.selector = selector;
  this.id = mvelo.util.getHash();
  this.name = 'decryptCont-' + this.id;
  this.port = mvelo.extension.connect({name: this.name});
  this.registerEventListener();
  this.parent = null;
  this.container = null;
  this.armored = null;
  this.done = null;
};

mvelo.DecryptContainer.prototype.create = function(armored, done) {
  this.armored = armored;
  this.done = done;
  this.parent = document.querySelector(this.selector);
  this.container = document.createElement('iframe');
  var url;
  if (mvelo.crx) {
    url = mvelo.extension.getURL('common/ui/inline/dialogs/decryptInline.html?id=' + this.id);
  } else if (mvelo.ffa) {
    url = 'about:blank?mvelo=decryptInline&id=' + this.id;
  }
  this.container.setAttribute('src', url);
  this.container.setAttribute('frameBorder', 0);
  this.container.setAttribute('scrolling', 'no');
  this.container.style.width = '100%';
  this.container.style.height = '100%';
  this.parent.appendChild(this.container);
};

mvelo.DecryptContainer.prototype.registerEventListener = function() {
  var that = this;
  this.port.onMessage.addListener(function(msg) {
    switch (msg.event) {
      case 'destroy':
        that.parent.removeChild(this.container);
        that.port.disconnect();
        break;
      case 'error-message':
        that.done(msg.error);
        break;
      case 'get-armored':
        that.port.postMessage({
          event: 'set-armored',
          data: that.armored,
          sender: that.name
        });
        break;
      case 'decrypt-done':
        that.done();
        break;
      default:
        console.log('unknown event', msg);
    }
  });
};

/**
 * Mailvelope - secure email with OpenPGP encryption for Webmail
 * Copyright (C) 2014  Thomas Oberndörfer
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License version 3
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

var mvelo = mvelo || {};

mvelo.EditorContainer = function(selector) {
  this.selector = selector;
  this.id = mvelo.util.getHash();
  this.name = 'editorCont-' + this.id;
  this.port = mvelo.extension.connect({name: this.name});
  this.registerEventListener();
  this.parent = null;
  this.container = null;
  this.done = null;
  this.encryptCallback = null;
};

mvelo.EditorContainer.prototype.create = function(done) {
  this.done = done;
  this.parent = document.querySelector(this.selector);
  this.container = document.createElement('iframe');
  var url;
  if (mvelo.crx) {
    url = mvelo.extension.getURL('common/ui/editor/editor.html?id=' + this.id + '&embedded=true');
  } else if (mvelo.ffa) {
    url = 'about:blank?mvelo=editor&id=' + this.id + '&embedded=true';
  }
  this.container.setAttribute('src', url);
  this.container.setAttribute('frameBorder', 0);
  this.container.setAttribute('scrolling', 'no');
  this.container.style.width = '100%';
  this.container.style.height = '100%';
  this.container.addEventListener('load', this.done.bind(this, null, this.id));
  this.parent.appendChild(this.container);
};

mvelo.EditorContainer.prototype.encrypt = function(recipients, callback) {
  var error;
  if (this.encryptCallback) {
    error = new Error('Encyption already in progress.');
    error.code = 'ENCRYPT_IN_PROGRESS';
    throw error;
  }
  this.port.postMessage({
    event: 'editor-container-encrypt',
    sender: this.name,
    recipients: recipients
  });
  this.encryptCallback = callback;
};

mvelo.EditorContainer.prototype.registerEventListener = function() {
  var that = this;
  this.port.onMessage.addListener(function(msg) {
    switch (msg.event) {
      case 'destroy':
        that.parent.removeChild(this.container);
        that.port.disconnect();
        break;
      case 'error-message':
        that.encryptCallback(msg.error);
        that.encryptCallback = null;
        break;
      case 'encrypted-message':
        that.encryptCallback(null, msg.message);
        that.encryptCallback = null;
        break;
      default:
        console.log('unknown event', msg);
    }
  });
};

/**
 * Mailvelope - secure email with OpenPGP encryption for Webmail
 * Copyright (C) 2014  Thomas Oberndörfer
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License version 3
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

var mvelo = mvelo || {};

mvelo.domAPI = {};

mvelo.domAPI.active = false;

mvelo.domAPI.containers = new Map();

mvelo.domAPI.init = function() {
  this.active = mvelo.main.watchList.some(function(site) {
    return site.active && site.frames && site.frames.some(function(frame) {
      var hosts = mvelo.domAPI.matchPattern2RegEx(frame.frame);
      return frame.scan && frame.api && hosts.test(document.location.hostname);
    });
  });
  if (this.active) {
    window.addEventListener('message', mvelo.domAPI.eventListener);
    document.body.dataset.mailvelopeVersion = mvelo.main.prefs.version;
    if (!document.body.dataset.mailvelope) {
      $('<script/>', {
        src: mvelo.extension.getURL('common/client-API/mailvelope-client-api.js')
      }).appendTo($('head'));
    }
  }
};

mvelo.domAPI.matchPattern2RegEx = function(matchPattern) {
  return new RegExp(
    '^' + matchPattern.replace(/\./g, '\\.')
                      .replace(/\*\\\./, '(\\w+(-\\w+)*\\.)*') + '$'
  );
};

mvelo.domAPI.postMessage = function(eventName, id, data, error) {
  window.postMessage({
    event: eventName,
    mvelo_extension: true,
    id: id,
    data: data,
    error: error
  }, document.location.origin);
};

mvelo.domAPI.reply = function(id, error, data) {
  if (error) {
    error = { message: error.message || error, code: error.code || 'INTERNAL_ERROR' };
  }
  mvelo.domAPI.postMessage('callback-reply', id, data, error);
};

// default type: string
mvelo.domAPI.dataTypes = {
  recipients: 'array',
  options: 'object'
};

mvelo.domAPI.checkTypes = function(data) {
  if (data.id && typeof data.id !== 'string') {
    throw new Error('Type mismatch: data.id should be of type string.');
  }
  var parameters = Object.keys(data.data);
  for (var i = 0; i < parameters.length; i++) {
    var parameter = parameters[i];
    var dataType = mvelo.domAPI.dataTypes[parameter] || 'string';
    var value = data.data[parameter];
    if (value === undefined) {
      continue;
    }
    var wrong = false;
    switch (dataType) {
      case 'array':
        if (!Array.isArray(value)) {
          wrong = true;
        }
        break;
      default:
        if (typeof value !== dataType) {
          wrong = true;
        }
    }
    if (wrong) {
      throw new Error('Type mismatch: ' + parameter + ' should be of type ' + dataType + '.');
    }
  }
};

mvelo.domAPI.eventListener = function(event) {
  if (event.origin !== document.location.origin ||
      event.data.mvelo_extension ||
      !event.data.mvelo_client) {
    return;
  }
  //console.log('domAPI eventListener', event.data.event);
  try {
    mvelo.domAPI.checkTypes(event.data);
    var data = event.data.data;
    switch (event.data.event) {
      case 'get-keyring':
        mvelo.domAPI.getKeyring(data.identifier, mvelo.domAPI.reply.bind(null, event.data.id));
        break;
      case 'create-keyring':
        mvelo.domAPI.createKeyring(data.identifier, mvelo.domAPI.reply.bind(null, event.data.id));
        break;
      case 'display-container':
        mvelo.domAPI.displayContainer(data.selector, data.armored, data.identifier, data.options, mvelo.domAPI.reply.bind(null, event.data.id));
        break;
      case 'editor-container':
        mvelo.domAPI.editorContainer(data.selector, data.identifier, data.options, mvelo.domAPI.reply.bind(null, event.data.id));
        break;
      case 'settings-container':
        mvelo.domAPI.settingsContainer(data.selector, data.identifier, mvelo.domAPI.reply.bind(null, event.data.id));
        break;
      case 'editor-encrypt':
        mvelo.domAPI.editorEncrypt(data.editorId, data.recipients, mvelo.domAPI.reply.bind(null, event.data.id));
        break;
      case 'query-valid-key':
        mvelo.domAPI.validKeyForAddress(data.identifier, data.recipients, mvelo.domAPI.reply.bind(null, event.data.id));
        break;
      case 'export-own-pub-key':
        mvelo.domAPI.exportOwnPublicKey(data.identifier, data.emailAddr, mvelo.domAPI.reply.bind(null, event.data.id));
        break;
      case 'import-pub-key':
        mvelo.domAPI.importPublicKey(data.identifier, data.armored, mvelo.domAPI.reply.bind(null, event.data.id));
        break;
      default:
        console.log('unknown event', event.data.event);
    }
  } catch (err) {
    mvelo.domAPI.reply(event.data.id, err);
  }
};

mvelo.domAPI.getKeyring = function(identifier, callback) {
  mvelo.extension.sendMessage({
    event: 'get-keyring',
    identifier: identifier,
  }, function(result) {
    callback(result.error, result.data);
  });
};

mvelo.domAPI.createKeyring = function(identifier, callback) {
  // TODO
  callback();
};

mvelo.domAPI.displayContainer = function(selector, armored, identifier, options, callback) {
  var container, error;
  switch (mvelo.main.getMessageType(armored)) {
    case mvelo.PGP_MESSAGE:
      container = new mvelo.DecryptContainer(selector);
      break;
    case mvelo.PGP_SIGNATURE:
      error = new Error('PGP signatures not supported.');
      error.code = 'WRONG_ARMORED_TYPE';
      throw error;
    case mvelo.PGP_PUBLIC_KEY:
      error = new Error('PGP keys not supported.');
      error.code = 'WRONG_ARMORED_TYPE';
      throw error;
    default:
      error = new Error('No valid armored block found.');
      error.code = 'WRONG_ARMORED_TYPE';
      throw error;
  }
  container.create(armored, callback);
};

mvelo.domAPI.editorContainer = function(selector, identifier, options, callback) {
  var container = new mvelo.EditorContainer(selector);
  this.containers.set(container.id, container);
  container.create(callback);
};

mvelo.domAPI.settingsContainer = function(selector, identifier, callback) {
  // TODO
  callback();
};

mvelo.domAPI.editorEncrypt = function(editorId, recipients, callback) {
  this.containers.get(editorId).encrypt(recipients, callback);
};

mvelo.domAPI.validKeyForAddress = function(identifier, recipients, callback) {
  mvelo.extension.sendMessage({
    event: 'query-valid-key',
    identifier: identifier,
    recipients: recipients
  }, function(result) {
    callback(result.error, result.data);
  });
};

mvelo.domAPI.exportOwnPublicKey = function(identifier, emailAddr, callback) {
  mvelo.extension.sendMessage({
    event: 'export-own-pub-key',
    identifier: identifier,
    emailAddr: emailAddr
  }, function(result) {
    callback(result.error, result.data);
  });
};

mvelo.domAPI.importPublicKey = function(identifier, armored, callback) {
  // TODO
  callback();
};
//# sourceURL=cs-mailvelope.js