(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*! Esri-Leaflet - v0.0.1-beta.4 - 2014-03-09
*   Copyright (c) 2014 Environmental Systems Research Institute, Inc.
*   Apache License*/
L.esri={_callback:{}},L.esri.Support={CORS:!!(window.XMLHttpRequest&&"withCredentials"in new XMLHttpRequest)},L.esri.RequestHandlers={CORS:function(a,b,c,d){var e=new XMLHttpRequest;b.f="json",e.onreadystatechange=function(){var a;if(4===e.readyState){try{a=JSON.parse(e.responseText)}catch(b){a={error:"Could not parse response as JSON."}}d?c.call(d,a):c(a)}},e.open("GET",a+"?"+L.esri.Util.serialize(b),!0),e.send(null)},JSONP:function(a,b,c,d){var e="c"+(1e9*Math.random()).toString(36).replace(".","_");b.f="json",b.callback="L.esri._callback."+e;var f=L.DomUtil.create("script",null,document.body);f.type="text/javascript",f.src=a+"?"+L.esri.Util.serialize(b),f.id=e,L.esri._callback[e]=function(a){d?c.call(d,a):c(a),document.body.removeChild(f),delete L.esri._callback[e]}}},L.esri.get=L.esri.Support.CORS?L.esri.RequestHandlers.CORS:L.esri.RequestHandlers.JSONP,L.esri.Mixins={},L.esri.Mixins.featureGrid={_activeRequests:0,_initializeFeatureGrid:function(a){this._map=a,this._previousCells=[],this.center=this._map.getCenter(),this.origin=this._map.project(this.center),this._moveHandler=L.esri.Util.debounce(function(a){"zoomend"===a.type&&(this.origin=this._map.project(this.center),this._previousCells=[]),this._requestFeatures(a.target.getBounds())},this.options.debounce,this),a.on("zoomend resize move",this._moveHandler,this),this._requestFeatures(a.getBounds())},_destroyFeatureGrid:function(a){a.off("zoomend resize move",this._moveHandler,this)},_requestFeatures:function(a){var b=this._cellsWithin(a);b&&b.length>0&&this.fire("loading",{bounds:a});for(var c=0;c<b.length;c++)this._makeRequest(b[c],b,a)},_makeRequest:function(a,b,c){this._activeRequests++;var d={geometryType:"esriGeometryEnvelope",geometry:JSON.stringify(L.esri.Util.boundsToExtent(a.bounds)),outFields:this.options.fields.join(","),outSR:4326,inSR:4326,where:this.options.where};this.options.token&&(d.token=this.options.token),L.esri.get(this.url+"query",d,function(a){this._activeRequests--,this._activeRequests<=0&&this.fire("load",{bounds:c}),!a.error||499!==a.error.code&&498!==a.error.code?this._render(a):this._authenticating||(this._authenticating=!0,this.fire("authenticationrequired",{retry:L.Util.bind(function(a){this._authenticating=!1,this.options.token=a,this._previousCells=[],this._requestFeatures(this._map.getBounds())},this)}))},this)},_cellsWithin:function(a){var b=this._map.getSize(),c=this._map.project(this._map.getCenter());Math.min(this.options.cellSize/b.x,this.options.cellSize/b.y);for(var d=a.pad(.1),e=[],f=this._map.project(d.getNorthWest()),g=this._map.project(d.getSouthEast()),h=f.subtract(c).divideBy(this.options.cellSize),i=g.subtract(c).divideBy(this.options.cellSize),j=Math.round((this.origin.x-c.x)/this.options.cellSize),k=Math.round((this.origin.y-c.y)/this.options.cellSize),l=L.esri.Util.roundAwayFromZero(h.x)-j,m=L.esri.Util.roundAwayFromZero(i.x)-j,n=L.esri.Util.roundAwayFromZero(h.y)-k,o=L.esri.Util.roundAwayFromZero(i.y)-k,p=l;m>p;p++)for(var q=n;o>q;q++){var r="cell:"+p+":"+q,s=L.esri.Util.indexOf(this._previousCells,r)>=0;if(!s||!this.options.deduplicate){var t=this._cellExtent(p,q),u=t.getCenter(),v=u.distanceTo(t.getNorthWest()),w=u.distanceTo(this.center),x={row:p,col:q,id:r,center:u,bounds:t,distance:w,radius:v};e.push(x),this._previousCells.push(r)}}return e.sort(function(a,b){return a.distance-b.distance}),e},_cellExtent:function(a,b){var c=this._cellPoint(a,b),d=this._cellPoint(a+1,b+1),e=this._map.unproject(c),f=this._map.unproject(d);return L.latLngBounds(e,f)},_cellPoint:function(a,b){var c=this.origin.x+a*this.options.cellSize,d=this.origin.y+b*this.options.cellSize;return[c,d]}},L.esri.Mixins.identifiableLayer={identify:function(a,b,c){var d={sr:"4326",mapExtent:JSON.stringify(L.esri.Util.boundsToExtent(this._map.getBounds())),tolerance:5,geometryType:"esriGeometryPoint",imageDisplay:this._map._size.x+","+this._map._size.y+",96",geometry:JSON.stringify({x:a.lng,y:a.lat,spatialReference:{wkid:4326}})};this.options.layers&&(d.layers=this.options.layers);var e;"function"==typeof b&&"undefined"==typeof c?(c=b,e=d):"object"==typeof b&&(b.layerDefs&&(b.layerDefs=this.parseLayerDefs(b.layerDefs)),e=L.Util.extend(d,b)),L.esri.get(this.url+"/identify",e,c)},parseLayerDefs:function(a){return a instanceof Array?"":"object"==typeof a?JSON.stringify(a):a}},L.esri.Mixins.metadata={_getMetadata:function(){var a={};this.options.token&&(a.token=this.options.token),L.esri.get(this.url,a,function(a){if(!a.error||499!==a.error.code&&498!==a.error.code){var b=a.extent||a.initialExtent||a.fullExtent,c={metadata:a};b&&this._map&&(!this._map||102100!==b.spatialReference.wkid&&3857!==b.spatialReference.wkid?4326===b.spatialReference.wkid&&(c.bounds=L.esri.Util.extentToBounds(b)):c.bounds=L.esri.Util.mercatorExtentToBounds(b,this._map)),this.fire("metadata",c)}else this._authenticating||(this._authenticating=!0,this.fire("authenticationrequired",{retry:L.Util.bind(function(a){this.options.token=a,this._getMetadata(),this._update()},this)}))},this)}},function(L){function a(a){var b={};for(var c in a)a.hasOwnProperty(c)&&(b[c]=a[c]);return b}function b(a){var b,c=0,d=0,e=a.length,f=a[d];for(d;e-1>d;d++)b=a[d+1],c+=(b[0]-f[0])*(b[1]+f[1]),f=b;return c>=0}function c(a,b,c,d){var e=(d[0]-c[0])*(a[1]-c[1])-(d[1]-c[1])*(a[0]-c[0]),f=(b[0]-a[0])*(a[1]-c[1])-(b[1]-a[1])*(a[0]-c[0]),g=(d[1]-c[1])*(b[0]-a[0])-(d[0]-c[0])*(b[1]-a[1]);if(0!==g){var h=e/g,i=f/g;if(h>=0&&1>=h&&i>=0&&1>=i)return!0}return!1}function d(a,b){for(var d=0;d<a.length-1;d++)for(var e=0;e<b.length-1;e++)if(c(a[d],a[d+1],b[e],b[e+1]))return!0;return!1}function e(a,b){for(var c=!1,d=-1,e=a.length,f=e-1;++d<e;f=d)(a[d][1]<=b[1]&&b[1]<a[f][1]||a[f][1]<=b[1]&&b[1]<a[d][1])&&b[0]<(a[f][0]-a[d][0])*(b[1]-a[d][1])/(a[f][1]-a[d][1])+a[d][0]&&(c=!c);return c}function f(a,b){var c=d(a,b),f=e(a,b[0]);return!c&&f?!0:!1}function g(a){for(var c=[],d=[],e=0;e<a.length;e++){var g=a[e].slice(0);if(b(g)){var h=[g];c.push(h)}else d.push(g)}for(;d.length;){for(var i=d.pop(),j=!1,k=c.length-1;k>=0;k--){var l=c[k][0];if(f(l,i)){c[k].push(i),j=!0;break}}j||c.push([i.reverse()])}return 1===c.length?{type:"Polygon",coordinates:c[0]}:{type:"MultiPolygon",coordinates:c}}function h(a){for(var b=null,c=null,d=null,e=null,f=0;f<a.length;f++){var g=a[f],h=g[0],i=g[1];null===b?b=h:b>h&&(b=h),null===c?c=h:h>c&&(c=h),null===d?d=i:d>i&&(d=i),null===e?e=i:i>e&&(e=i)}return[b,d,c,e]}function i(a){for(var b=null,c=null,d=null,e=null,f=0;f<a.length;f++)for(var g=a[f],h=0;h<g.length;h++){var i=g[h],j=i[0],k=i[1];null===b?b=j:b>j&&(b=j),null===c?c=j:j>c&&(c=j),null===d?d=k:d>k&&(d=k),null===e?e=k:k>e&&(e=k)}return[b,d,c,e]}function j(a){for(var b=null,c=null,d=null,e=null,f=0;f<a.length;f++)for(var g=a[f],h=0;h<g.length;h++)for(var i=g[h],j=0;j<i.length;j++){var k=i[j],l=k[0],m=k[1];null===b?b=l:b>l&&(b=l),null===c?c=l:l>c&&(c=l),null===d?d=m:d>m&&(d=m),null===e?e=m:m>e&&(e=m)}return[b,d,c,e]}function k(a){var c=[],d=a.slice(0),e=d.shift().slice(0);b(e)||e.reverse(),c.push(e);for(var f=0;f<d.length;f++){var g=d[f].slice(0);b(g)&&g.reverse(),c.push(g)}return c}function l(a){for(var b=[],c=0;c<a.length;c++)for(var d=k(a[c]),e=d.length-1;e>=0;e--){var f=d[e].slice(0);b.push(f)}return b}L.esri.Util={debounce:function(a,b){var c=null;return function(){var d=this||d,e=arguments;clearTimeout(c),c=setTimeout(function(){a.apply(d,e)},b)}},roundAwayFromZero:function(a){return a>0?Math.ceil(a):Math.floor(a)},trim:function(a){return a.replace(/^\s\s*/,"").replace(/\s\s*$/,"")},cleanUrl:function(a){return a=L.esri.Util.trim(a),"/"!==a[a.length-1]&&(a+="/"),a},serialize:function(a){var b="";for(var c in a)if(a.hasOwnProperty(c)){var d=c,e=a[c];b+=encodeURIComponent(d),b+="=",b+=encodeURIComponent(e),b+="&"}return b.substring(0,b.length-1)},indexOf:function(a,b,c){if(c=c||0,a.indexOf)return a.indexOf(b,c);for(var d=c,e=a.length;e>d;d++)if(a[d]===b)return d;return-1},extentToBounds:function(a){var b=new L.LatLng(a.ymin,a.xmin),c=new L.LatLng(a.ymax,a.xmax);return new L.LatLngBounds(b,c)},mercatorExtentToBounds:function(a,b){var c=b.unproject(L.point([a.ymin,a.xmin])),d=b.unproject(L.point([a.ymax,a.xmax]));return new L.LatLngBounds(c,d)},boundsToExtent:function(a){return{xmin:a.getSouthWest().lng,ymin:a.getSouthWest().lat,xmax:a.getNorthEast().lng,ymax:a.getNorthEast().lat,spatialReference:{wkid:4326}}},boundsToEnvelope:function(a){var b=L.esri.Util.boundsToExtent(a);return{x:b.xmin,y:b.ymin,w:Math.abs(b.xmin-b.xmax),h:Math.abs(b.ymin-b.ymax)}},arcgisToGeojson:function(b,c){var d={};return c=c||{},c.idAttribute=c.idAttribute||void 0,b.x&&b.y&&(d.type="Point",d.coordinates=[b.x,b.y]),b.points&&(d.type="MultiPoint",d.coordinates=b.points.slice(0)),b.paths&&(1===b.paths.length?(d.type="LineString",d.coordinates=b.paths[0].slice(0)):(d.type="MultiLineString",d.coordinates=b.paths.slice(0))),b.rings&&(d=g(b.rings.slice(0))),(b.geometry||b.attributes)&&(d.type="Feature",d.geometry=b.geometry?L.esri.Util.arcgisToGeojson(b.geometry):null,d.properties=b.attributes?a(b.attributes):null,b.attributes&&(d.id=b.attributes[c.idAttribute]||b.attributes.OBJECTID||b.attributes.FID)),d},geojsonToArcGIS:function(a,b){var c,d=b&&b.idAttribute?b.idAttribute:"OBJECTID",e=b&&b.sr?{wkid:b.sr}:{wkid:4326},f={};switch(a.type){case"Point":f.x=a.coordinates[0],f.y=a.coordinates[1],f.spatialReference=e;break;case"MultiPoint":f.points=a.coordinates.slice(0),f.spatialReference=e;break;case"LineString":f.paths=[a.coordinates.slice(0)],f.spatialReference=e;break;case"MultiLineString":f.paths=a.coordinates.slice(0),f.spatialReference=e;break;case"Polygon":f.rings=k(a.coordinates.slice(0)),f.spatialReference=e;break;case"MultiPolygon":f.rings=l(a.coordinates.slice(0)),f.spatialReference=e;break;case"Feature":a.geometry&&(f.geometry=L.esri.Util.geojsonToArcGIS(a.geometry,b)),f.attributes=a.properties?L.esri.Util.clone(a.properties):{},f.attributes[d]=a.id;break;case"FeatureCollection":for(f=[],c=0;c<a.features.length;c++)f.push(L.esri.Util.geojsonToArcGIS(a.features[c],b));break;case"GeometryCollection":for(f=[],c=0;c<a.geometries.length;c++)f.push(L.esri.Util.geojsonToArcGIS(a.geometries[c],b))}return f},geojsonBounds:function(a){if(a.type)switch(a.type){case"Point":return[a.coordinates[0],a.coordinates[1],a.coordinates[0],a.coordinates[1]];case"MultiPoint":return h(a.coordinates);case"LineString":return h(a.coordinates);case"MultiLineString":return i(a.coordinates);case"Polygon":return i(a.coordinates);case"MultiPolygon":return j(a.coordinates);case"Feature":return a.geometry?L.esri.Util.geojsonBounds(a.geometry):null;default:throw new Error("Unknown type: "+a.type)}return null}}}(L),function(L){"use strict";function a(b,c){return this instanceof a?(this._maxEntries=Math.max(4,b||9),this._minEntries=Math.max(2,Math.ceil(.4*this._maxEntries)),c&&this._initFormat(c),this.clear(),void 0):new a(b,c)}a.prototype={all:function(){return this._all(this.data,[])},search:function(a){var b=this.data,c=[];if(!this._intersects(a,b.bbox))return c;for(var d,e,f,g,h=[];b;){for(d=0,e=b.children.length;e>d;d++)f=b.children[d],g=b.leaf?this.toBBox(f):f.bbox,this._intersects(a,g)&&(b.leaf?c.push(f):this._contains(a,g)?this._all(f,c):h.push(f));b=h.pop()}return c},load:function(a){if(!a||!a.length)return this;if(a.length<this._minEntries){for(var b=0,c=a.length;c>b;b++)this.insert(a[b]);return this}var d=this._build(a.slice(),0);if(this.data.children.length)if(this.data.height===d.height)this._splitRoot(this.data,d);else{if(this.data.height<d.height){var e=this.data;this.data=d,d=e}this._insert(d,this.data.height-d.height-1,!0)}else this.data=d;return this},insert:function(a){return a&&this._insert(a,this.data.height-1),this},clear:function(){return this.data={children:[],leaf:!0,bbox:this._empty(),height:1},this},remove:function(a){if(!a)return this;for(var b,c,d,e,f=this.data,g=this.toBBox(a),h=[],i=[];f||h.length;){if(f||(f=h.pop(),c=h[h.length-1],b=i.pop(),e=!0),f.leaf&&(d=f.children.indexOf(a),-1!==d))return f.children.splice(d,1),h.push(f),this._condense(h),this;e||f.leaf||!this._intersects(g,f.bbox)?c?(b++,f=c.children[b],e=!1):f=null:(h.push(f),i.push(b),b=0,c=f,f=f.children[0])}return this},toBBox:function(a){return a},compareMinX:function(a,b){return a[0]-b[0]},compareMinY:function(a,b){return a[1]-b[1]},toJSON:function(){return this.data},fromJSON:function(a){return this.data=a,this},_all:function(a,b){for(var c=[];a;)a.leaf?b.push.apply(b,a.children):c.push.apply(c,a.children),a=c.pop();return b},_build:function(a,b,c){var d,e=a.length,f=this._maxEntries;if(f>=e)return d={children:a,leaf:!0,height:1},this._calcBBox(d),d;b||(c=Math.ceil(Math.log(e)/Math.log(f)),f=Math.ceil(e/Math.pow(f,c-1)),a.sort(this.compareMinX)),d={children:[],height:c};var g,h,i,j,k,l=Math.ceil(e/f)*Math.ceil(Math.sqrt(f)),m=Math.ceil(e/f),n=1===b%2?this.compareMinX:this.compareMinY;for(g=0;e>g;g+=l)for(i=a.slice(g,g+l).sort(n),h=0,j=i.length;j>h;h+=m)k=this._build(i.slice(h,h+m),b+1,c-1),d.children.push(k);return this._calcBBox(d),d},_chooseSubtree:function(a,b,c,d){for(var e,f,g,h,i,j,k,l;;){if(d.push(b),b.leaf||d.length-1===c)break;for(k=l=1/0,e=0,f=b.children.length;f>e;e++)g=b.children[e],i=this._area(g.bbox),j=this._enlargedArea(a,g.bbox)-i,l>j?(l=j,k=k>i?i:k,h=g):j===l&&k>i&&(k=i,h=g);b=h}return b},_insert:function(a,b,c,d){var e,f=c?a.bbox:this.toBBox(a),g=[],h=this._chooseSubtree(f,d||this.data,b,g);h.children.push(a),this._extend(h.bbox,f);do e=!1,g[b].children.length>this._maxEntries&&(this._split(g,b),e=!0,b--);while(b>=0&&e);this._adjustParentBBoxes(f,g,b)},_split:function(a,b){var c=a[b],d=c.children.length,e=this._minEntries;this._chooseSplitAxis(c,e,d);var f={children:c.children.splice(this._chooseSplitIndex(c,e,d)),height:c.height};c.leaf&&(f.leaf=!0),this._calcBBox(c),this._calcBBox(f),b?a[b-1].children.push(f):this._splitRoot(c,f)},_splitRoot:function(a,b){this.data={},this.data.children=[a,b],this.data.height=a.height+1,this._calcBBox(this.data)},_chooseSplitIndex:function(a,b,c){var d,e,f,g,h,i,j,k;for(i=j=1/0,d=b;c-b>=d;d++)e=this._distBBox(a,0,d),f=this._distBBox(a,d,c),g=this._intersectionArea(e,f),h=this._area(e)+this._area(f),i>g?(i=g,k=d,j=j>h?h:j):g===i&&j>h&&(j=h,k=d);return k},_chooseSplitAxis:function(a,b,c){var d=a.leaf?this.compareMinX:this._compareNodeMinX,e=a.leaf?this.compareMinY:this._compareNodeMinY,f=this._allDistMargin(a,b,c,d),g=this._allDistMargin(a,b,c,e);g>f&&a.children.sort(d)},_allDistMargin:function(a,b,c,d){a.children.sort(d);var e,f,g=this._distBBox(a,0,b),h=this._distBBox(a,c-b,c),i=this._margin(g)+this._margin(h);for(e=b;c-b>e;e++)f=a.children[e],this._extend(g,a.leaf?this.toBBox(f):f.bbox),i+=this._margin(g);for(e=c-b-1;e>=0;e--)f=a.children[e],this._extend(h,a.leaf?this.toBBox(f):f.bbox),i+=this._margin(h);return i},_distBBox:function(a,b,c){for(var d,e=this._empty(),f=b;c>f;f++)d=a.children[f],this._extend(e,a.leaf?this.toBBox(d):d.bbox);return e},_calcBBox:function(a){a.bbox=this._empty();for(var b,c=0,d=a.children.length;d>c;c++)b=a.children[c],this._extend(a.bbox,a.leaf?this.toBBox(b):b.bbox)},_adjustParentBBoxes:function(a,b,c){for(var d=c;d>=0;d--)this._extend(b[d].bbox,a)},_condense:function(a){for(var b,c=a.length-1;c>=0;c--)0===a[c].children.length?c>0?(b=a[c-1].children,b.splice(b.indexOf(a[c]),1)):this.clear():this._calcBBox(a[c])},_contains:function(a,b){return a[0]<=b[0]&&a[1]<=b[1]&&b[2]<=a[2]&&b[3]<=a[3]},_intersects:function(a,b){return b[0]<=a[2]&&b[1]<=a[3]&&b[2]>=a[0]&&b[3]>=a[1]},_extend:function(a,b){return a[0]=Math.min(a[0],b[0]),a[1]=Math.min(a[1],b[1]),a[2]=Math.max(a[2],b[2]),a[3]=Math.max(a[3],b[3]),a},_area:function(a){return(a[2]-a[0])*(a[3]-a[1])},_margin:function(a){return a[2]-a[0]+(a[3]-a[1])},_enlargedArea:function(a,b){return(Math.max(b[2],a[2])-Math.min(b[0],a[0]))*(Math.max(b[3],a[3])-Math.min(b[1],a[1]))},_intersectionArea:function(a,b){var c=Math.max(a[0],b[0]),d=Math.max(a[1],b[1]),e=Math.min(a[2],b[2]),f=Math.min(a[3],b[3]);return Math.max(0,e-c)*Math.max(0,f-d)},_empty:function(){return[1/0,1/0,-1/0,-1/0]},_compareNodeMinX:function(a,b){return a.bbox[0]-b.bbox[0]},_compareNodeMinY:function(a,b){return a.bbox[1]-b.bbox[1]},_initFormat:function(a){var b=["return a"," - b",";"];this.compareMinX=new Function("a","b",b.join(a[0])),this.compareMinY=new Function("a","b",b.join(a[1])),this.toBBox=new Function("a","return [a"+a.join(", a")+"];")}},L.esri._rbush=a}(L),function(L){var a="https:"!==window.location.protocol?"http:":"https:",b="line-height:9px; text-overflow:ellipsis; white-space:nowrap;overflow:hidden; display:inline-block;",c="position:absolute; top:-38px; right:2px;",d="<img src='https://serverapi.arcgisonline.com/jsapi/arcgis/3.5/js/esri/images/map/logo-med.png' alt='Powered by Esri' class='esri-attribution-logo' style='"+c+"'>",e=function(a){return"<span class='esri-attributions' style='"+b+"'>"+a+"</span>"};L.esri.BasemapLayer=L.TileLayer.extend({statics:{TILES:{Streets:{urlTemplate:a+"//{s}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",attributionUrl:"https://static.arcgis.com/attribution/World_Street_Map",options:{minZoom:1,maxZoom:19,subdomains:["server","services"],attribution:e("Esri")+d}},Topographic:{urlTemplate:a+"//{s}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",attributionUrl:"https://static.arcgis.com/attribution/World_Topo_Map",options:{minZoom:1,maxZoom:19,subdomains:["server","services"],attribution:e("Esri")+d}},Oceans:{urlTemplate:a+"//server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}",attributionUrl:"https://static.arcgis.com/attribution/Ocean_Basemap",options:{minZoom:1,maxZoom:16,subdomains:["server","services"],attribution:e("Esri")+d}},NationalGeographic:{urlTemplate:"https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:16,subdomains:["server","services"],attribution:e("Esri")+d}},DarkGray:{urlTemplate:a+"//tiles{s}.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Dark_Gray_Base_Beta/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:10,subdomains:[1,2],attribution:e("Esri, DeLorme, HERE")+d}},DarkGrayLabels:{urlTemplate:a+"//tiles{s}.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Dark_Gray_Reference_Beta/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:10,subdomains:[1,2]}},Gray:{urlTemplate:a+"//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:16,subdomains:["server","services"],attribution:e("Esri, NAVTEQ, DeLorme")+d}},GrayLabels:{urlTemplate:a+"//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:16,subdomains:["server","services"]}},Imagery:{urlTemplate:a+"//{s}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:19,subdomains:["server","services"],attribution:e("Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community")+d}},ImageryLabels:{urlTemplate:a+"//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:19,subdomains:["server","services"]}},ImageryTransportation:{urlTemplate:a+"//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:19,subdomains:["server","services"]}},ShadedRelief:{urlTemplate:a+"//{s}.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:13,subdomains:["server","services"],attribution:e("ESRI, NAVTEQ, DeLorme")+d}},ShadedReliefLabels:{urlTemplate:a+"//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:12,subdomains:["server","services"]}},Terrain:{urlTemplate:a+"//{s}.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:13,subdomains:["server","services"],attribution:e("Esri, USGS, NOAA")+d}},TerrainLabels:{urlTemplate:a+"//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:13,subdomains:["server","services"]}}}},initialize:function(a,b){var c;if("object"==typeof a&&a.urlTemplate&&a.options)c=a;else{if("string"!=typeof a||!L.esri.BasemapLayer.TILES[a])throw new Error("L.esri.BasemapLayer: Invalid parameter. Use one of 'Streets', 'Topographic', 'Oceans', 'NationalGeographic', 'Gray', 'GrayLabels', 'DarkGray', 'DarkGrayLabels', 'Imagery', 'ImageryLabels', 'ImageryTransportation', 'ShadedRelief' or 'ShadedReliefLabels'");c=L.esri.BasemapLayer.TILES[a]}var d=L.Util.extend(c.options,b);if(L.TileLayer.prototype.initialize.call(this,c.urlTemplate,L.Util.setOptions(this,d)),c.attributionUrl){var e=c.attributionUrl;this._dynamicAttribution=!0,this._getAttributionData(e)}},_dynamicAttribution:!1,bounds:null,zoom:null,onAdd:function(a){return!a.attributionControl&&console?(console.warn("L.esri.BasemapLayer requires attribution. Please set attributionControl to true on your map"),void 0):(L.TileLayer.prototype.onAdd.call(this,a),this._dynamicAttribution&&(this.on("load",this._handleTileUpdates,this),this._map.on("viewreset zoomend dragend",this._handleTileUpdates,this)),this._map.on("resize",this._resizeAttribution,this),void 0)},onRemove:function(a){this._dynamicAttribution&&(this.off("load",this._handleTileUpdates,this),this._map.off("viewreset zoomend dragend",this._handleTileUpdates,this)),this._map.off("resize",this._resizeAttribution,this),L.TileLayer.prototype.onRemove.call(this,a)},_handleTileUpdates:function(a){var b,c;"load"===a.type&&(b=this._map.getBounds(),c=this._map.getZoom()),("viewreset"===a.type||"dragend"===a.type||"zoomend"===a.type)&&(b=a.target.getBounds(),c=a.target.getZoom()),this.attributionBoundingBoxes&&b&&c&&(b.equals(this.bounds)&&c===this.zoom||(this.bounds=b,this.zoom=c,this._updateMapAttribution()))},_resizeAttribution:function(){var a=this._map.getSize().x;this._getAttributionLogo().style.display=600>a?"none":"block",this._getAttributionSpan().style.maxWidth=.75*a+"px"},_getAttributionData:function(a){this.attributionBoundingBoxes=[],L.esri.RequestHandlers.JSONP(a,{},this._processAttributionData,this)},_processAttributionData:function(a){for(var b=0;b<a.contributors.length;b++)for(var c=a.contributors[b],d=0;d<c.coverageAreas.length;d++){var e=c.coverageAreas[d],f=new L.LatLng(e.bbox[0],e.bbox[1]),g=new L.LatLng(e.bbox[2],e.bbox[3]);this.attributionBoundingBoxes.push({attribution:c.attribution,score:e.score,bounds:new L.LatLngBounds(f,g),minZoom:e.zoomMin,maxZoom:e.zoomMax})}this.attributionBoundingBoxes.sort(function(a,b){return a.score<b.score?-1:a.score>b.score?1:0}),this.bounds&&this._updateMapAttribution()},_getAttributionSpan:function(){return this._map._container.querySelectorAll(".esri-attributions")[0]},_getAttributionLogo:function(){return this._map._container.querySelectorAll(".esri-attribution-logo")[0]},_updateMapAttribution:function(){for(var a="",b=0;b<this.attributionBoundingBoxes.length;b++){var c=this.attributionBoundingBoxes[b];if(this.bounds.intersects(c.bounds)&&this.zoom>=c.minZoom&&this.zoom<=c.maxZoom){var d=this.attributionBoundingBoxes[b].attribution;-1===a.indexOf(d)&&(a.length>0&&(a+=", "),a+=d)}}this._getAttributionSpan().innerHTML=a,this._resizeAttribution()}}),L.esri.basemapLayer=function(a,b){return new L.esri.BasemapLayer(a,b)}}(L),function(L){function a(a,b){var c=b?"block":"none";if(a._icon&&(a._icon.style.display=c),a._shadow&&(a._shadow.style.display=c),a._layers)for(var d in a._layers)a._layers.hasOwnProperty(d)&&(a._layers[d]._container.style.display=c)}L.esri.FeatureLayer=L.GeoJSON.extend({includes:L.esri.Mixins.featureGrid,options:{cellSize:512,debounce:100,deduplicate:!0,where:"1=1",fields:["*"]},initialize:function(a,b){this.index=L.esri._rbush(),this.url=L.esri.Util.cleanUrl(a),L.Util.setOptions(this,b),L.Util.setOptions(this,b),this._getMetadata(),L.GeoJSON.prototype.initialize.call(this,[],b)},onAdd:function(a){this._updateHandler=L.esri.Util.debounce(this._update,this.options.debounce),L.LayerGroup.prototype.onAdd.call(this,a),a.on("zoomend resize moveend",this._updateHandler,this),this._initializeFeatureGrid(a)},onRemove:function(a){a.off("zoomend resize moveend",this._updateHandler,this),L.LayerGroup.prototype.onRemove.call(this,a),this._destroyFeatureGrid(a)},getLayerId:function(a){return a.feature.id},getWhere:function(){return this.options.where},setWhere:function(a){return this.options.where=a,this.refresh(),this},getFields:function(){return this.options.fields},setFields:function(a){return this.options.fields=a,this.refresh(),this},refresh:function(){this.clearLayers(),this._loaded=[],this._previousCells=[],this._requestFeatures(this._map.getBounds())},_update:function(b){L.esri.Util.boundsToEnvelope(b.target.getBounds());for(var c=this.index.search(b.target.getBounds().toBBoxString().split(",")),d=[],e=0;e<c.length;e++)d.push(c[e][4]);this.eachLayer(L.Util.bind(function(b){var c=b.feature.id;a(b,L.esri.Util.indexOf(d,c)>=0)},this))},_setObjectIdField:function(a){if(a.objectIdFieldName)this._objectIdField=a.objectIdFieldName;else for(var b=0;b<=a.fields.length-1;b++)if("esriFieldTypeOID"===a.fields[b].type){this._objectIdField=a.fields[b].name;break}},_render:function(a){if(a.features&&a.features.length&&!a.error){this._objectIdField||this._setObjectIdField(a);for(var b=[],c=a.features.length-1;c>=0;c--){var d=a.features[c],e=d.attributes[this._objectIdField];if(!this._layers[e]){var f=L.esri.Util.arcgisToGeojson(d,{idAttribute:this._objectIdField}),g=L.esri.Util.geojsonBounds(f);g.push(f.id),b.push(g),this.addData(f)}}this.index.load(b)}}}),L.esri.FeatureLayer.include(L.esri.Mixins.metadata),L.esri.featureLayer=function(a,b){return new L.esri.FeatureLayer(a,b)}}(L),L.esri.TiledMapLayer=L.TileLayer.extend({includes:L.esri.Mixins.identifiableLayer,initialize:function(a,b){b=b||{},this.url=L.esri.Util.cleanUrl(a),this.tileUrl=L.esri.Util.cleanUrl(a)+"tile/{z}/{y}/{x}",this.tileUrl.match("://tiles.arcgis.com")&&(this.tileUrl=this.tileUrl.replace("://tiles.arcgis.com","://tiles{s}.arcgis.com"),b.subdomains=["1","2","3","4"]),L.Util.setOptions(this,b),this._getMetadata(),L.TileLayer.prototype.initialize.call(this,this.tileUrl,b)}}),L.esri.TiledMapLayer.include(L.esri.Mixins.metadata),L.esri.tiledMapLayer=function(a,b){return new L.esri.TiledMapLayer(a,b)},/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Sanborn Map Company, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
L.esri.DynamicMapLayer=L.Class.extend({includes:L.esri.Mixins.identifiableLayer,options:{opacity:1,position:"front"},_defaultLayerParams:{format:"png24",transparent:!0,f:"image",bboxSR:3875,imageSR:3875,layers:"",layerDefs:""},initialize:function(a,b){this.url=L.esri.Util.cleanUrl(a),this._layerParams=L.Util.extend({},this._defaultLayerParams);for(var c in b)b.hasOwnProperty(c)&&this._defaultLayerParams.hasOwnProperty(c)&&(this._layerParams[c]=b[c]);this._parseLayers(),this._parseLayerDefs(),L.Util.setOptions(this,b),this._getMetadata(),this._layerParams.transparent||(this.options.opacity=1)},onAdd:function(a){if(this._map=a,this._moveHandler=L.esri.Util.debounce(this._update,150,this),a.on("moveend",this._moveHandler,this),a.options.crs&&a.options.crs.code){var b=a.options.crs.code.split(":")[1];this._layerParams.bboxSR=b,this._layerParams.imageSR=b}this._update()},onRemove:function(a){this._currentImage&&this._map.removeLayer(this._currentImage),a.off("moveend",this._moveHandler,this)},addTo:function(a){return a.addLayer(this),this},setOpacity:function(a){this.options.opacity=a,this._currentImage.setOpacity(a)},bringToFront:function(){return this.options.position="front",this._currentImage.bringToFront(),this},bringToBack:function(){return this.options.position="back",this._currentImage.bringToBack(),this},_parseLayers:function(){if("undefined"==typeof this._layerParams.layers)return delete this._layerParams.layerOption,void 0;var a=this._layerParams.layerOption||null,b=this._layerParams.layers||null,c="show",d=["show","hide","include","exclude"];if(delete this._layerParams.layerOption,a)-1!==d.indexOf(a)&&(c=a),this._layerParams.layers=c+":"+b;else if(b instanceof Array)this._layerParams.layers=c+":"+b.join(",");else if("string"==typeof b){var e=b.match(":");e&&(b=b.split(e[0]),Number(b[1].split(",")[0])&&(-1!==d.indexOf(b[0])&&(c=b[0]),b=b[1])),this._layerParams.layers=c+":"+b}},_parseLayerDefs:function(){if("undefined"!=typeof this._layerParams.layerDefs){var a=this._layerParams.layerDefs,b=[];if(a instanceof Array)for(var c=a.length,d=0;c>d;d++)a[d]&&b.push(d+":"+a[d]);else{if("object"!=typeof a)return delete this._layerParams.layerDefs,void 0;for(var e in a)a.hasOwnProperty(e)&&b.push(e+":"+a[e])}this._layerParams.layerDefs=b.join(";")}},_getImageUrl:function(){var a=this._map.getBounds(),b=this._map.getSize(),c=this._map.options.crs.project(a._northEast),d=this._map.options.crs.project(a._southWest);this._layerParams.bbox=[d.x,d.y,c.x,c.y].join(","),this._layerParams.size=b.x+","+b.y,this.options.token&&(this._layerParams.token=this.options.token);var e=this.url+"export"+L.Util.getParamString(this._layerParams);return e},_update:function(){if(!(this._animatingZoom||this._map._panTransition&&this._map._panTransition._inProgress)){var a=this._map.getZoom();if(!(a>this.options.maxZoom||a<this.options.minZoom)){var b=this._map.getBounds();b._southWest.wrap(),b._northEast.wrap();var c=new L.ImageOverlay(this._getImageUrl(),b,{opacity:0}).addTo(this._map);c.on("load",function(a){var c=a.target,d=this._currentImage;c._bounds.equals(b)?(this._currentImage=c,"front"===this.options.position?this._currentImage.bringToFront():this._currentImage.bringToBack(),this._currentImage.setOpacity(this.options.opacity),d&&this._map.removeLayer(d)):this._map.removeLayer(c)},this),this.fire("loading",{bounds:b})}}}}),L.esri.DynamicMapLayer.include(L.Mixin.Events),L.esri.DynamicMapLayer.include(L.esri.Mixins.metadata),L.esri.dynamicMapLayer=function(a,b){return new L.esri.DynamicMapLayer(a,b)};
},{}],2:[function(require,module,exports){
/*
 Leaflet, a JavaScript library for mobile-friendly interactive maps. http://leafletjs.com
 (c) 2010-2013, Vladimir Agafonkin
 (c) 2010-2011, CloudMade
*/
!function(t,e,i){var n=t.L,o={};o.version="0.7.2","object"==typeof module&&"object"==typeof module.exports?module.exports=o:"function"==typeof define&&define.amd&&define(o),o.noConflict=function(){return t.L=n,this},t.L=o,o.Util={extend:function(t){var e,i,n,o,s=Array.prototype.slice.call(arguments,1);for(i=0,n=s.length;n>i;i++){o=s[i]||{};for(e in o)o.hasOwnProperty(e)&&(t[e]=o[e])}return t},bind:function(t,e){var i=arguments.length>2?Array.prototype.slice.call(arguments,2):null;return function(){return t.apply(e,i||arguments)}},stamp:function(){var t=0,e="_leaflet_id";return function(i){return i[e]=i[e]||++t,i[e]}}(),invokeEach:function(t,e,i){var n,o;if("object"==typeof t){o=Array.prototype.slice.call(arguments,3);for(n in t)e.apply(i,[n,t[n]].concat(o));return!0}return!1},limitExecByInterval:function(t,e,i){var n,o;return function s(){var a=arguments;return n?void(o=!0):(n=!0,setTimeout(function(){n=!1,o&&(s.apply(i,a),o=!1)},e),void t.apply(i,a))}},falseFn:function(){return!1},formatNum:function(t,e){var i=Math.pow(10,e||5);return Math.round(t*i)/i},trim:function(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")},splitWords:function(t){return o.Util.trim(t).split(/\s+/)},setOptions:function(t,e){return t.options=o.extend({},t.options,e),t.options},getParamString:function(t,e,i){var n=[];for(var o in t)n.push(encodeURIComponent(i?o.toUpperCase():o)+"="+encodeURIComponent(t[o]));return(e&&-1!==e.indexOf("?")?"&":"?")+n.join("&")},template:function(t,e){return t.replace(/\{ *([\w_]+) *\}/g,function(t,n){var o=e[n];if(o===i)throw new Error("No value provided for variable "+t);return"function"==typeof o&&(o=o(e)),o})},isArray:Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)},emptyImageUrl:"data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="},function(){function e(e){var i,n,o=["webkit","moz","o","ms"];for(i=0;i<o.length&&!n;i++)n=t[o[i]+e];return n}function i(e){var i=+new Date,o=Math.max(0,16-(i-n));return n=i+o,t.setTimeout(e,o)}var n=0,s=t.requestAnimationFrame||e("RequestAnimationFrame")||i,a=t.cancelAnimationFrame||e("CancelAnimationFrame")||e("CancelRequestAnimationFrame")||function(e){t.clearTimeout(e)};o.Util.requestAnimFrame=function(e,n,a,r){return e=o.bind(e,n),a&&s===i?void e():s.call(t,e,r)},o.Util.cancelAnimFrame=function(e){e&&a.call(t,e)}}(),o.extend=o.Util.extend,o.bind=o.Util.bind,o.stamp=o.Util.stamp,o.setOptions=o.Util.setOptions,o.Class=function(){},o.Class.extend=function(t){var e=function(){this.initialize&&this.initialize.apply(this,arguments),this._initHooks&&this.callInitHooks()},i=function(){};i.prototype=this.prototype;var n=new i;n.constructor=e,e.prototype=n;for(var s in this)this.hasOwnProperty(s)&&"prototype"!==s&&(e[s]=this[s]);t.statics&&(o.extend(e,t.statics),delete t.statics),t.includes&&(o.Util.extend.apply(null,[n].concat(t.includes)),delete t.includes),t.options&&n.options&&(t.options=o.extend({},n.options,t.options)),o.extend(n,t),n._initHooks=[];var a=this;return e.__super__=a.prototype,n.callInitHooks=function(){if(!this._initHooksCalled){a.prototype.callInitHooks&&a.prototype.callInitHooks.call(this),this._initHooksCalled=!0;for(var t=0,e=n._initHooks.length;e>t;t++)n._initHooks[t].call(this)}},e},o.Class.include=function(t){o.extend(this.prototype,t)},o.Class.mergeOptions=function(t){o.extend(this.prototype.options,t)},o.Class.addInitHook=function(t){var e=Array.prototype.slice.call(arguments,1),i="function"==typeof t?t:function(){this[t].apply(this,e)};this.prototype._initHooks=this.prototype._initHooks||[],this.prototype._initHooks.push(i)};var s="_leaflet_events";o.Mixin={},o.Mixin.Events={addEventListener:function(t,e,i){if(o.Util.invokeEach(t,this.addEventListener,this,e,i))return this;var n,a,r,h,l,u,c,d=this[s]=this[s]||{},p=i&&i!==this&&o.stamp(i);for(t=o.Util.splitWords(t),n=0,a=t.length;a>n;n++)r={action:e,context:i||this},h=t[n],p?(l=h+"_idx",u=l+"_len",c=d[l]=d[l]||{},c[p]||(c[p]=[],d[u]=(d[u]||0)+1),c[p].push(r)):(d[h]=d[h]||[],d[h].push(r));return this},hasEventListeners:function(t){var e=this[s];return!!e&&(t in e&&e[t].length>0||t+"_idx"in e&&e[t+"_idx_len"]>0)},removeEventListener:function(t,e,i){if(!this[s])return this;if(!t)return this.clearAllEventListeners();if(o.Util.invokeEach(t,this.removeEventListener,this,e,i))return this;var n,a,r,h,l,u,c,d,p,_=this[s],m=i&&i!==this&&o.stamp(i);for(t=o.Util.splitWords(t),n=0,a=t.length;a>n;n++)if(r=t[n],u=r+"_idx",c=u+"_len",d=_[u],e){if(h=m&&d?d[m]:_[r]){for(l=h.length-1;l>=0;l--)h[l].action!==e||i&&h[l].context!==i||(p=h.splice(l,1),p[0].action=o.Util.falseFn);i&&d&&0===h.length&&(delete d[m],_[c]--)}}else delete _[r],delete _[u],delete _[c];return this},clearAllEventListeners:function(){return delete this[s],this},fireEvent:function(t,e){if(!this.hasEventListeners(t))return this;var i,n,a,r,h,l=o.Util.extend({},e,{type:t,target:this}),u=this[s];if(u[t])for(i=u[t].slice(),n=0,a=i.length;a>n;n++)i[n].action.call(i[n].context,l);r=u[t+"_idx"];for(h in r)if(i=r[h].slice())for(n=0,a=i.length;a>n;n++)i[n].action.call(i[n].context,l);return this},addOneTimeEventListener:function(t,e,i){if(o.Util.invokeEach(t,this.addOneTimeEventListener,this,e,i))return this;var n=o.bind(function(){this.removeEventListener(t,e,i).removeEventListener(t,n,i)},this);return this.addEventListener(t,e,i).addEventListener(t,n,i)}},o.Mixin.Events.on=o.Mixin.Events.addEventListener,o.Mixin.Events.off=o.Mixin.Events.removeEventListener,o.Mixin.Events.once=o.Mixin.Events.addOneTimeEventListener,o.Mixin.Events.fire=o.Mixin.Events.fireEvent,function(){var n="ActiveXObject"in t,s=n&&!e.addEventListener,a=navigator.userAgent.toLowerCase(),r=-1!==a.indexOf("webkit"),h=-1!==a.indexOf("chrome"),l=-1!==a.indexOf("phantom"),u=-1!==a.indexOf("android"),c=-1!==a.search("android [23]"),d=-1!==a.indexOf("gecko"),p=typeof orientation!=i+"",_=t.navigator&&t.navigator.msPointerEnabled&&t.navigator.msMaxTouchPoints&&!t.PointerEvent,m=t.PointerEvent&&t.navigator.pointerEnabled&&t.navigator.maxTouchPoints||_,f="devicePixelRatio"in t&&t.devicePixelRatio>1||"matchMedia"in t&&t.matchMedia("(min-resolution:144dpi)")&&t.matchMedia("(min-resolution:144dpi)").matches,g=e.documentElement,v=n&&"transition"in g.style,y="WebKitCSSMatrix"in t&&"m11"in new t.WebKitCSSMatrix&&!c,P="MozPerspective"in g.style,L="OTransition"in g.style,x=!t.L_DISABLE_3D&&(v||y||P||L)&&!l,w=!t.L_NO_TOUCH&&!l&&function(){var t="ontouchstart";if(m||t in g)return!0;var i=e.createElement("div"),n=!1;return i.setAttribute?(i.setAttribute(t,"return;"),"function"==typeof i[t]&&(n=!0),i.removeAttribute(t),i=null,n):!1}();o.Browser={ie:n,ielt9:s,webkit:r,gecko:d&&!r&&!t.opera&&!n,android:u,android23:c,chrome:h,ie3d:v,webkit3d:y,gecko3d:P,opera3d:L,any3d:x,mobile:p,mobileWebkit:p&&r,mobileWebkit3d:p&&y,mobileOpera:p&&t.opera,touch:w,msPointer:_,pointer:m,retina:f}}(),o.Point=function(t,e,i){this.x=i?Math.round(t):t,this.y=i?Math.round(e):e},o.Point.prototype={clone:function(){return new o.Point(this.x,this.y)},add:function(t){return this.clone()._add(o.point(t))},_add:function(t){return this.x+=t.x,this.y+=t.y,this},subtract:function(t){return this.clone()._subtract(o.point(t))},_subtract:function(t){return this.x-=t.x,this.y-=t.y,this},divideBy:function(t){return this.clone()._divideBy(t)},_divideBy:function(t){return this.x/=t,this.y/=t,this},multiplyBy:function(t){return this.clone()._multiplyBy(t)},_multiplyBy:function(t){return this.x*=t,this.y*=t,this},round:function(){return this.clone()._round()},_round:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this},floor:function(){return this.clone()._floor()},_floor:function(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this},distanceTo:function(t){t=o.point(t);var e=t.x-this.x,i=t.y-this.y;return Math.sqrt(e*e+i*i)},equals:function(t){return t=o.point(t),t.x===this.x&&t.y===this.y},contains:function(t){return t=o.point(t),Math.abs(t.x)<=Math.abs(this.x)&&Math.abs(t.y)<=Math.abs(this.y)},toString:function(){return"Point("+o.Util.formatNum(this.x)+", "+o.Util.formatNum(this.y)+")"}},o.point=function(t,e,n){return t instanceof o.Point?t:o.Util.isArray(t)?new o.Point(t[0],t[1]):t===i||null===t?t:new o.Point(t,e,n)},o.Bounds=function(t,e){if(t)for(var i=e?[t,e]:t,n=0,o=i.length;o>n;n++)this.extend(i[n])},o.Bounds.prototype={extend:function(t){return t=o.point(t),this.min||this.max?(this.min.x=Math.min(t.x,this.min.x),this.max.x=Math.max(t.x,this.max.x),this.min.y=Math.min(t.y,this.min.y),this.max.y=Math.max(t.y,this.max.y)):(this.min=t.clone(),this.max=t.clone()),this},getCenter:function(t){return new o.Point((this.min.x+this.max.x)/2,(this.min.y+this.max.y)/2,t)},getBottomLeft:function(){return new o.Point(this.min.x,this.max.y)},getTopRight:function(){return new o.Point(this.max.x,this.min.y)},getSize:function(){return this.max.subtract(this.min)},contains:function(t){var e,i;return t="number"==typeof t[0]||t instanceof o.Point?o.point(t):o.bounds(t),t instanceof o.Bounds?(e=t.min,i=t.max):e=i=t,e.x>=this.min.x&&i.x<=this.max.x&&e.y>=this.min.y&&i.y<=this.max.y},intersects:function(t){t=o.bounds(t);var e=this.min,i=this.max,n=t.min,s=t.max,a=s.x>=e.x&&n.x<=i.x,r=s.y>=e.y&&n.y<=i.y;return a&&r},isValid:function(){return!(!this.min||!this.max)}},o.bounds=function(t,e){return!t||t instanceof o.Bounds?t:new o.Bounds(t,e)},o.Transformation=function(t,e,i,n){this._a=t,this._b=e,this._c=i,this._d=n},o.Transformation.prototype={transform:function(t,e){return this._transform(t.clone(),e)},_transform:function(t,e){return e=e||1,t.x=e*(this._a*t.x+this._b),t.y=e*(this._c*t.y+this._d),t},untransform:function(t,e){return e=e||1,new o.Point((t.x/e-this._b)/this._a,(t.y/e-this._d)/this._c)}},o.DomUtil={get:function(t){return"string"==typeof t?e.getElementById(t):t},getStyle:function(t,i){var n=t.style[i];if(!n&&t.currentStyle&&(n=t.currentStyle[i]),(!n||"auto"===n)&&e.defaultView){var o=e.defaultView.getComputedStyle(t,null);n=o?o[i]:null}return"auto"===n?null:n},getViewportOffset:function(t){var i,n=0,s=0,a=t,r=e.body,h=e.documentElement;do{if(n+=a.offsetTop||0,s+=a.offsetLeft||0,n+=parseInt(o.DomUtil.getStyle(a,"borderTopWidth"),10)||0,s+=parseInt(o.DomUtil.getStyle(a,"borderLeftWidth"),10)||0,i=o.DomUtil.getStyle(a,"position"),a.offsetParent===r&&"absolute"===i)break;if("fixed"===i){n+=r.scrollTop||h.scrollTop||0,s+=r.scrollLeft||h.scrollLeft||0;break}if("relative"===i&&!a.offsetLeft){var l=o.DomUtil.getStyle(a,"width"),u=o.DomUtil.getStyle(a,"max-width"),c=a.getBoundingClientRect();("none"!==l||"none"!==u)&&(s+=c.left+a.clientLeft),n+=c.top+(r.scrollTop||h.scrollTop||0);break}a=a.offsetParent}while(a);a=t;do{if(a===r)break;n-=a.scrollTop||0,s-=a.scrollLeft||0,a=a.parentNode}while(a);return new o.Point(s,n)},documentIsLtr:function(){return o.DomUtil._docIsLtrCached||(o.DomUtil._docIsLtrCached=!0,o.DomUtil._docIsLtr="ltr"===o.DomUtil.getStyle(e.body,"direction")),o.DomUtil._docIsLtr},create:function(t,i,n){var o=e.createElement(t);return o.className=i,n&&n.appendChild(o),o},hasClass:function(t,e){if(t.classList!==i)return t.classList.contains(e);var n=o.DomUtil._getClass(t);return n.length>0&&new RegExp("(^|\\s)"+e+"(\\s|$)").test(n)},addClass:function(t,e){if(t.classList!==i)for(var n=o.Util.splitWords(e),s=0,a=n.length;a>s;s++)t.classList.add(n[s]);else if(!o.DomUtil.hasClass(t,e)){var r=o.DomUtil._getClass(t);o.DomUtil._setClass(t,(r?r+" ":"")+e)}},removeClass:function(t,e){t.classList!==i?t.classList.remove(e):o.DomUtil._setClass(t,o.Util.trim((" "+o.DomUtil._getClass(t)+" ").replace(" "+e+" "," ")))},_setClass:function(t,e){t.className.baseVal===i?t.className=e:t.className.baseVal=e},_getClass:function(t){return t.className.baseVal===i?t.className:t.className.baseVal},setOpacity:function(t,e){if("opacity"in t.style)t.style.opacity=e;else if("filter"in t.style){var i=!1,n="DXImageTransform.Microsoft.Alpha";try{i=t.filters.item(n)}catch(o){if(1===e)return}e=Math.round(100*e),i?(i.Enabled=100!==e,i.Opacity=e):t.style.filter+=" progid:"+n+"(opacity="+e+")"}},testProp:function(t){for(var i=e.documentElement.style,n=0;n<t.length;n++)if(t[n]in i)return t[n];return!1},getTranslateString:function(t){var e=o.Browser.webkit3d,i="translate"+(e?"3d":"")+"(",n=(e?",0":"")+")";return i+t.x+"px,"+t.y+"px"+n},getScaleString:function(t,e){var i=o.DomUtil.getTranslateString(e.add(e.multiplyBy(-1*t))),n=" scale("+t+") ";return i+n},setPosition:function(t,e,i){t._leaflet_pos=e,!i&&o.Browser.any3d?t.style[o.DomUtil.TRANSFORM]=o.DomUtil.getTranslateString(e):(t.style.left=e.x+"px",t.style.top=e.y+"px")},getPosition:function(t){return t._leaflet_pos}},o.DomUtil.TRANSFORM=o.DomUtil.testProp(["transform","WebkitTransform","OTransform","MozTransform","msTransform"]),o.DomUtil.TRANSITION=o.DomUtil.testProp(["webkitTransition","transition","OTransition","MozTransition","msTransition"]),o.DomUtil.TRANSITION_END="webkitTransition"===o.DomUtil.TRANSITION||"OTransition"===o.DomUtil.TRANSITION?o.DomUtil.TRANSITION+"End":"transitionend",function(){if("onselectstart"in e)o.extend(o.DomUtil,{disableTextSelection:function(){o.DomEvent.on(t,"selectstart",o.DomEvent.preventDefault)},enableTextSelection:function(){o.DomEvent.off(t,"selectstart",o.DomEvent.preventDefault)}});else{var i=o.DomUtil.testProp(["userSelect","WebkitUserSelect","OUserSelect","MozUserSelect","msUserSelect"]);o.extend(o.DomUtil,{disableTextSelection:function(){if(i){var t=e.documentElement.style;this._userSelect=t[i],t[i]="none"}},enableTextSelection:function(){i&&(e.documentElement.style[i]=this._userSelect,delete this._userSelect)}})}o.extend(o.DomUtil,{disableImageDrag:function(){o.DomEvent.on(t,"dragstart",o.DomEvent.preventDefault)},enableImageDrag:function(){o.DomEvent.off(t,"dragstart",o.DomEvent.preventDefault)}})}(),o.LatLng=function(t,e,n){if(t=parseFloat(t),e=parseFloat(e),isNaN(t)||isNaN(e))throw new Error("Invalid LatLng object: ("+t+", "+e+")");this.lat=t,this.lng=e,n!==i&&(this.alt=parseFloat(n))},o.extend(o.LatLng,{DEG_TO_RAD:Math.PI/180,RAD_TO_DEG:180/Math.PI,MAX_MARGIN:1e-9}),o.LatLng.prototype={equals:function(t){if(!t)return!1;t=o.latLng(t);var e=Math.max(Math.abs(this.lat-t.lat),Math.abs(this.lng-t.lng));return e<=o.LatLng.MAX_MARGIN},toString:function(t){return"LatLng("+o.Util.formatNum(this.lat,t)+", "+o.Util.formatNum(this.lng,t)+")"},distanceTo:function(t){t=o.latLng(t);var e=6378137,i=o.LatLng.DEG_TO_RAD,n=(t.lat-this.lat)*i,s=(t.lng-this.lng)*i,a=this.lat*i,r=t.lat*i,h=Math.sin(n/2),l=Math.sin(s/2),u=h*h+l*l*Math.cos(a)*Math.cos(r);return 2*e*Math.atan2(Math.sqrt(u),Math.sqrt(1-u))},wrap:function(t,e){var i=this.lng;return t=t||-180,e=e||180,i=(i+e)%(e-t)+(t>i||i===e?e:t),new o.LatLng(this.lat,i)}},o.latLng=function(t,e){return t instanceof o.LatLng?t:o.Util.isArray(t)?"number"==typeof t[0]||"string"==typeof t[0]?new o.LatLng(t[0],t[1],t[2]):null:t===i||null===t?t:"object"==typeof t&&"lat"in t?new o.LatLng(t.lat,"lng"in t?t.lng:t.lon):e===i?null:new o.LatLng(t,e)},o.LatLngBounds=function(t,e){if(t)for(var i=e?[t,e]:t,n=0,o=i.length;o>n;n++)this.extend(i[n])},o.LatLngBounds.prototype={extend:function(t){if(!t)return this;var e=o.latLng(t);return t=null!==e?e:o.latLngBounds(t),t instanceof o.LatLng?this._southWest||this._northEast?(this._southWest.lat=Math.min(t.lat,this._southWest.lat),this._southWest.lng=Math.min(t.lng,this._southWest.lng),this._northEast.lat=Math.max(t.lat,this._northEast.lat),this._northEast.lng=Math.max(t.lng,this._northEast.lng)):(this._southWest=new o.LatLng(t.lat,t.lng),this._northEast=new o.LatLng(t.lat,t.lng)):t instanceof o.LatLngBounds&&(this.extend(t._southWest),this.extend(t._northEast)),this},pad:function(t){var e=this._southWest,i=this._northEast,n=Math.abs(e.lat-i.lat)*t,s=Math.abs(e.lng-i.lng)*t;return new o.LatLngBounds(new o.LatLng(e.lat-n,e.lng-s),new o.LatLng(i.lat+n,i.lng+s))},getCenter:function(){return new o.LatLng((this._southWest.lat+this._northEast.lat)/2,(this._southWest.lng+this._northEast.lng)/2)},getSouthWest:function(){return this._southWest},getNorthEast:function(){return this._northEast},getNorthWest:function(){return new o.LatLng(this.getNorth(),this.getWest())},getSouthEast:function(){return new o.LatLng(this.getSouth(),this.getEast())},getWest:function(){return this._southWest.lng},getSouth:function(){return this._southWest.lat},getEast:function(){return this._northEast.lng},getNorth:function(){return this._northEast.lat},contains:function(t){t="number"==typeof t[0]||t instanceof o.LatLng?o.latLng(t):o.latLngBounds(t);var e,i,n=this._southWest,s=this._northEast;return t instanceof o.LatLngBounds?(e=t.getSouthWest(),i=t.getNorthEast()):e=i=t,e.lat>=n.lat&&i.lat<=s.lat&&e.lng>=n.lng&&i.lng<=s.lng},intersects:function(t){t=o.latLngBounds(t);var e=this._southWest,i=this._northEast,n=t.getSouthWest(),s=t.getNorthEast(),a=s.lat>=e.lat&&n.lat<=i.lat,r=s.lng>=e.lng&&n.lng<=i.lng;return a&&r},toBBoxString:function(){return[this.getWest(),this.getSouth(),this.getEast(),this.getNorth()].join(",")},equals:function(t){return t?(t=o.latLngBounds(t),this._southWest.equals(t.getSouthWest())&&this._northEast.equals(t.getNorthEast())):!1},isValid:function(){return!(!this._southWest||!this._northEast)}},o.latLngBounds=function(t,e){return!t||t instanceof o.LatLngBounds?t:new o.LatLngBounds(t,e)},o.Projection={},o.Projection.SphericalMercator={MAX_LATITUDE:85.0511287798,project:function(t){var e=o.LatLng.DEG_TO_RAD,i=this.MAX_LATITUDE,n=Math.max(Math.min(i,t.lat),-i),s=t.lng*e,a=n*e;return a=Math.log(Math.tan(Math.PI/4+a/2)),new o.Point(s,a)},unproject:function(t){var e=o.LatLng.RAD_TO_DEG,i=t.x*e,n=(2*Math.atan(Math.exp(t.y))-Math.PI/2)*e;return new o.LatLng(n,i)}},o.Projection.LonLat={project:function(t){return new o.Point(t.lng,t.lat)},unproject:function(t){return new o.LatLng(t.y,t.x)}},o.CRS={latLngToPoint:function(t,e){var i=this.projection.project(t),n=this.scale(e);return this.transformation._transform(i,n)},pointToLatLng:function(t,e){var i=this.scale(e),n=this.transformation.untransform(t,i);return this.projection.unproject(n)},project:function(t){return this.projection.project(t)},scale:function(t){return 256*Math.pow(2,t)},getSize:function(t){var e=this.scale(t);return o.point(e,e)}},o.CRS.Simple=o.extend({},o.CRS,{projection:o.Projection.LonLat,transformation:new o.Transformation(1,0,-1,0),scale:function(t){return Math.pow(2,t)}}),o.CRS.EPSG3857=o.extend({},o.CRS,{code:"EPSG:3857",projection:o.Projection.SphericalMercator,transformation:new o.Transformation(.5/Math.PI,.5,-.5/Math.PI,.5),project:function(t){var e=this.projection.project(t),i=6378137;return e.multiplyBy(i)}}),o.CRS.EPSG900913=o.extend({},o.CRS.EPSG3857,{code:"EPSG:900913"}),o.CRS.EPSG4326=o.extend({},o.CRS,{code:"EPSG:4326",projection:o.Projection.LonLat,transformation:new o.Transformation(1/360,.5,-1/360,.5)}),o.Map=o.Class.extend({includes:o.Mixin.Events,options:{crs:o.CRS.EPSG3857,fadeAnimation:o.DomUtil.TRANSITION&&!o.Browser.android23,trackResize:!0,markerZoomAnimation:o.DomUtil.TRANSITION&&o.Browser.any3d},initialize:function(t,e){e=o.setOptions(this,e),this._initContainer(t),this._initLayout(),this._onResize=o.bind(this._onResize,this),this._initEvents(),e.maxBounds&&this.setMaxBounds(e.maxBounds),e.center&&e.zoom!==i&&this.setView(o.latLng(e.center),e.zoom,{reset:!0}),this._handlers=[],this._layers={},this._zoomBoundLayers={},this._tileLayersNum=0,this.callInitHooks(),this._addLayers(e.layers)},setView:function(t,e){return e=e===i?this.getZoom():e,this._resetView(o.latLng(t),this._limitZoom(e)),this},setZoom:function(t,e){return this._loaded?this.setView(this.getCenter(),t,{zoom:e}):(this._zoom=this._limitZoom(t),this)},zoomIn:function(t,e){return this.setZoom(this._zoom+(t||1),e)},zoomOut:function(t,e){return this.setZoom(this._zoom-(t||1),e)},setZoomAround:function(t,e,i){var n=this.getZoomScale(e),s=this.getSize().divideBy(2),a=t instanceof o.Point?t:this.latLngToContainerPoint(t),r=a.subtract(s).multiplyBy(1-1/n),h=this.containerPointToLatLng(s.add(r));return this.setView(h,e,{zoom:i})},fitBounds:function(t,e){e=e||{},t=t.getBounds?t.getBounds():o.latLngBounds(t);var i=o.point(e.paddingTopLeft||e.padding||[0,0]),n=o.point(e.paddingBottomRight||e.padding||[0,0]),s=this.getBoundsZoom(t,!1,i.add(n)),a=n.subtract(i).divideBy(2),r=this.project(t.getSouthWest(),s),h=this.project(t.getNorthEast(),s),l=this.unproject(r.add(h).divideBy(2).add(a),s);return s=e&&e.maxZoom?Math.min(e.maxZoom,s):s,this.setView(l,s,e)},fitWorld:function(t){return this.fitBounds([[-90,-180],[90,180]],t)},panTo:function(t,e){return this.setView(t,this._zoom,{pan:e})},panBy:function(t){return this.fire("movestart"),this._rawPanBy(o.point(t)),this.fire("move"),this.fire("moveend")},setMaxBounds:function(t){return t=o.latLngBounds(t),this.options.maxBounds=t,t?(this._loaded&&this._panInsideMaxBounds(),this.on("moveend",this._panInsideMaxBounds,this)):this.off("moveend",this._panInsideMaxBounds,this)},panInsideBounds:function(t,e){var i=this.getCenter(),n=this._limitCenter(i,this._zoom,t);return i.equals(n)?this:this.panTo(n,e)},addLayer:function(t){var e=o.stamp(t);return this._layers[e]?this:(this._layers[e]=t,!t.options||isNaN(t.options.maxZoom)&&isNaN(t.options.minZoom)||(this._zoomBoundLayers[e]=t,this._updateZoomLevels()),this.options.zoomAnimation&&o.TileLayer&&t instanceof o.TileLayer&&(this._tileLayersNum++,this._tileLayersToLoad++,t.on("load",this._onTileLayerLoad,this)),this._loaded&&this._layerAdd(t),this)},removeLayer:function(t){var e=o.stamp(t);return this._layers[e]?(this._loaded&&t.onRemove(this),delete this._layers[e],this._loaded&&this.fire("layerremove",{layer:t}),this._zoomBoundLayers[e]&&(delete this._zoomBoundLayers[e],this._updateZoomLevels()),this.options.zoomAnimation&&o.TileLayer&&t instanceof o.TileLayer&&(this._tileLayersNum--,this._tileLayersToLoad--,t.off("load",this._onTileLayerLoad,this)),this):this},hasLayer:function(t){return t?o.stamp(t)in this._layers:!1},eachLayer:function(t,e){for(var i in this._layers)t.call(e,this._layers[i]);return this},invalidateSize:function(t){if(!this._loaded)return this;t=o.extend({animate:!1,pan:!0},t===!0?{animate:!0}:t);var e=this.getSize();this._sizeChanged=!0,this._initialCenter=null;var i=this.getSize(),n=e.divideBy(2).round(),s=i.divideBy(2).round(),a=n.subtract(s);return a.x||a.y?(t.animate&&t.pan?this.panBy(a):(t.pan&&this._rawPanBy(a),this.fire("move"),t.debounceMoveend?(clearTimeout(this._sizeTimer),this._sizeTimer=setTimeout(o.bind(this.fire,this,"moveend"),200)):this.fire("moveend")),this.fire("resize",{oldSize:e,newSize:i})):this},addHandler:function(t,e){if(!e)return this;var i=this[t]=new e(this);return this._handlers.push(i),this.options[t]&&i.enable(),this},remove:function(){this._loaded&&this.fire("unload"),this._initEvents("off");try{delete this._container._leaflet}catch(t){this._container._leaflet=i}return this._clearPanes(),this._clearControlPos&&this._clearControlPos(),this._clearHandlers(),this},getCenter:function(){return this._checkIfLoaded(),this._initialCenter&&!this._moved()?this._initialCenter:this.layerPointToLatLng(this._getCenterLayerPoint())},getZoom:function(){return this._zoom},getBounds:function(){var t=this.getPixelBounds(),e=this.unproject(t.getBottomLeft()),i=this.unproject(t.getTopRight());return new o.LatLngBounds(e,i)},getMinZoom:function(){return this.options.minZoom===i?this._layersMinZoom===i?0:this._layersMinZoom:this.options.minZoom},getMaxZoom:function(){return this.options.maxZoom===i?this._layersMaxZoom===i?1/0:this._layersMaxZoom:this.options.maxZoom},getBoundsZoom:function(t,e,i){t=o.latLngBounds(t);var n,s=this.getMinZoom()-(e?1:0),a=this.getMaxZoom(),r=this.getSize(),h=t.getNorthWest(),l=t.getSouthEast(),u=!0;i=o.point(i||[0,0]);do s++,n=this.project(l,s).subtract(this.project(h,s)).add(i),u=e?n.x<r.x||n.y<r.y:r.contains(n);while(u&&a>=s);return u&&e?null:e?s:s-1},getSize:function(){return(!this._size||this._sizeChanged)&&(this._size=new o.Point(this._container.clientWidth,this._container.clientHeight),this._sizeChanged=!1),this._size.clone()},getPixelBounds:function(){var t=this._getTopLeftPoint();return new o.Bounds(t,t.add(this.getSize()))},getPixelOrigin:function(){return this._checkIfLoaded(),this._initialTopLeftPoint},getPanes:function(){return this._panes},getContainer:function(){return this._container},getZoomScale:function(t){var e=this.options.crs;return e.scale(t)/e.scale(this._zoom)},getScaleZoom:function(t){return this._zoom+Math.log(t)/Math.LN2},project:function(t,e){return e=e===i?this._zoom:e,this.options.crs.latLngToPoint(o.latLng(t),e)},unproject:function(t,e){return e=e===i?this._zoom:e,this.options.crs.pointToLatLng(o.point(t),e)},layerPointToLatLng:function(t){var e=o.point(t).add(this.getPixelOrigin());return this.unproject(e)},latLngToLayerPoint:function(t){var e=this.project(o.latLng(t))._round();return e._subtract(this.getPixelOrigin())},containerPointToLayerPoint:function(t){return o.point(t).subtract(this._getMapPanePos())},layerPointToContainerPoint:function(t){return o.point(t).add(this._getMapPanePos())},containerPointToLatLng:function(t){var e=this.containerPointToLayerPoint(o.point(t));return this.layerPointToLatLng(e)},latLngToContainerPoint:function(t){return this.layerPointToContainerPoint(this.latLngToLayerPoint(o.latLng(t)))},mouseEventToContainerPoint:function(t){return o.DomEvent.getMousePosition(t,this._container)},mouseEventToLayerPoint:function(t){return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(t))},mouseEventToLatLng:function(t){return this.layerPointToLatLng(this.mouseEventToLayerPoint(t))},_initContainer:function(t){var e=this._container=o.DomUtil.get(t);if(!e)throw new Error("Map container not found.");if(e._leaflet)throw new Error("Map container is already initialized.");e._leaflet=!0},_initLayout:function(){var t=this._container;o.DomUtil.addClass(t,"leaflet-container"+(o.Browser.touch?" leaflet-touch":"")+(o.Browser.retina?" leaflet-retina":"")+(o.Browser.ielt9?" leaflet-oldie":"")+(this.options.fadeAnimation?" leaflet-fade-anim":""));var e=o.DomUtil.getStyle(t,"position");"absolute"!==e&&"relative"!==e&&"fixed"!==e&&(t.style.position="relative"),this._initPanes(),this._initControlPos&&this._initControlPos()},_initPanes:function(){var t=this._panes={};this._mapPane=t.mapPane=this._createPane("leaflet-map-pane",this._container),this._tilePane=t.tilePane=this._createPane("leaflet-tile-pane",this._mapPane),t.objectsPane=this._createPane("leaflet-objects-pane",this._mapPane),t.shadowPane=this._createPane("leaflet-shadow-pane"),t.overlayPane=this._createPane("leaflet-overlay-pane"),t.markerPane=this._createPane("leaflet-marker-pane"),t.popupPane=this._createPane("leaflet-popup-pane");var e=" leaflet-zoom-hide";this.options.markerZoomAnimation||(o.DomUtil.addClass(t.markerPane,e),o.DomUtil.addClass(t.shadowPane,e),o.DomUtil.addClass(t.popupPane,e))},_createPane:function(t,e){return o.DomUtil.create("div",t,e||this._panes.objectsPane)},_clearPanes:function(){this._container.removeChild(this._mapPane)},_addLayers:function(t){t=t?o.Util.isArray(t)?t:[t]:[];for(var e=0,i=t.length;i>e;e++)this.addLayer(t[e])},_resetView:function(t,e,i,n){var s=this._zoom!==e;n||(this.fire("movestart"),s&&this.fire("zoomstart")),this._zoom=e,this._initialCenter=t,this._initialTopLeftPoint=this._getNewTopLeftPoint(t),i?this._initialTopLeftPoint._add(this._getMapPanePos()):o.DomUtil.setPosition(this._mapPane,new o.Point(0,0)),this._tileLayersToLoad=this._tileLayersNum;var a=!this._loaded;this._loaded=!0,a&&(this.fire("load"),this.eachLayer(this._layerAdd,this)),this.fire("viewreset",{hard:!i}),this.fire("move"),(s||n)&&this.fire("zoomend"),this.fire("moveend",{hard:!i})},_rawPanBy:function(t){o.DomUtil.setPosition(this._mapPane,this._getMapPanePos().subtract(t))},_getZoomSpan:function(){return this.getMaxZoom()-this.getMinZoom()},_updateZoomLevels:function(){var t,e=1/0,n=-1/0,o=this._getZoomSpan();for(t in this._zoomBoundLayers){var s=this._zoomBoundLayers[t];isNaN(s.options.minZoom)||(e=Math.min(e,s.options.minZoom)),isNaN(s.options.maxZoom)||(n=Math.max(n,s.options.maxZoom))}t===i?this._layersMaxZoom=this._layersMinZoom=i:(this._layersMaxZoom=n,this._layersMinZoom=e),o!==this._getZoomSpan()&&this.fire("zoomlevelschange")},_panInsideMaxBounds:function(){this.panInsideBounds(this.options.maxBounds)},_checkIfLoaded:function(){if(!this._loaded)throw new Error("Set map center and zoom first.")},_initEvents:function(e){if(o.DomEvent){e=e||"on",o.DomEvent[e](this._container,"click",this._onMouseClick,this);var i,n,s=["dblclick","mousedown","mouseup","mouseenter","mouseleave","mousemove","contextmenu"];for(i=0,n=s.length;n>i;i++)o.DomEvent[e](this._container,s[i],this._fireMouseEvent,this);this.options.trackResize&&o.DomEvent[e](t,"resize",this._onResize,this)}},_onResize:function(){o.Util.cancelAnimFrame(this._resizeRequest),this._resizeRequest=o.Util.requestAnimFrame(function(){this.invalidateSize({debounceMoveend:!0})},this,!1,this._container)},_onMouseClick:function(t){!this._loaded||!t._simulated&&(this.dragging&&this.dragging.moved()||this.boxZoom&&this.boxZoom.moved())||o.DomEvent._skipped(t)||(this.fire("preclick"),this._fireMouseEvent(t))},_fireMouseEvent:function(t){if(this._loaded&&!o.DomEvent._skipped(t)){var e=t.type;if(e="mouseenter"===e?"mouseover":"mouseleave"===e?"mouseout":e,this.hasEventListeners(e)){"contextmenu"===e&&o.DomEvent.preventDefault(t);var i=this.mouseEventToContainerPoint(t),n=this.containerPointToLayerPoint(i),s=this.layerPointToLatLng(n);this.fire(e,{latlng:s,layerPoint:n,containerPoint:i,originalEvent:t})}}},_onTileLayerLoad:function(){this._tileLayersToLoad--,this._tileLayersNum&&!this._tileLayersToLoad&&this.fire("tilelayersload")},_clearHandlers:function(){for(var t=0,e=this._handlers.length;e>t;t++)this._handlers[t].disable()},whenReady:function(t,e){return this._loaded?t.call(e||this,this):this.on("load",t,e),this},_layerAdd:function(t){t.onAdd(this),this.fire("layeradd",{layer:t})},_getMapPanePos:function(){return o.DomUtil.getPosition(this._mapPane)},_moved:function(){var t=this._getMapPanePos();return t&&!t.equals([0,0])},_getTopLeftPoint:function(){return this.getPixelOrigin().subtract(this._getMapPanePos())},_getNewTopLeftPoint:function(t,e){var i=this.getSize()._divideBy(2);return this.project(t,e)._subtract(i)._round()},_latLngToNewLayerPoint:function(t,e,i){var n=this._getNewTopLeftPoint(i,e).add(this._getMapPanePos());return this.project(t,e)._subtract(n)},_getCenterLayerPoint:function(){return this.containerPointToLayerPoint(this.getSize()._divideBy(2))},_getCenterOffset:function(t){return this.latLngToLayerPoint(t).subtract(this._getCenterLayerPoint())},_limitCenter:function(t,e,i){if(!i)return t;var n=this.project(t,e),s=this.getSize().divideBy(2),a=new o.Bounds(n.subtract(s),n.add(s)),r=this._getBoundsOffset(a,i,e);return this.unproject(n.add(r),e)},_limitOffset:function(t,e){if(!e)return t;var i=this.getPixelBounds(),n=new o.Bounds(i.min.add(t),i.max.add(t));return t.add(this._getBoundsOffset(n,e))},_getBoundsOffset:function(t,e,i){var n=this.project(e.getNorthWest(),i).subtract(t.min),s=this.project(e.getSouthEast(),i).subtract(t.max),a=this._rebound(n.x,-s.x),r=this._rebound(n.y,-s.y);return new o.Point(a,r)},_rebound:function(t,e){return t+e>0?Math.round(t-e)/2:Math.max(0,Math.ceil(t))-Math.max(0,Math.floor(e))},_limitZoom:function(t){var e=this.getMinZoom(),i=this.getMaxZoom();return Math.max(e,Math.min(i,t))}}),o.map=function(t,e){return new o.Map(t,e)},o.Projection.Mercator={MAX_LATITUDE:85.0840591556,R_MINOR:6356752.314245179,R_MAJOR:6378137,project:function(t){var e=o.LatLng.DEG_TO_RAD,i=this.MAX_LATITUDE,n=Math.max(Math.min(i,t.lat),-i),s=this.R_MAJOR,a=this.R_MINOR,r=t.lng*e*s,h=n*e,l=a/s,u=Math.sqrt(1-l*l),c=u*Math.sin(h);c=Math.pow((1-c)/(1+c),.5*u);var d=Math.tan(.5*(.5*Math.PI-h))/c;return h=-s*Math.log(d),new o.Point(r,h)},unproject:function(t){for(var e,i=o.LatLng.RAD_TO_DEG,n=this.R_MAJOR,s=this.R_MINOR,a=t.x*i/n,r=s/n,h=Math.sqrt(1-r*r),l=Math.exp(-t.y/n),u=Math.PI/2-2*Math.atan(l),c=15,d=1e-7,p=c,_=.1;Math.abs(_)>d&&--p>0;)e=h*Math.sin(u),_=Math.PI/2-2*Math.atan(l*Math.pow((1-e)/(1+e),.5*h))-u,u+=_;
return new o.LatLng(u*i,a)}},o.CRS.EPSG3395=o.extend({},o.CRS,{code:"EPSG:3395",projection:o.Projection.Mercator,transformation:function(){var t=o.Projection.Mercator,e=t.R_MAJOR,i=.5/(Math.PI*e);return new o.Transformation(i,.5,-i,.5)}()}),o.TileLayer=o.Class.extend({includes:o.Mixin.Events,options:{minZoom:0,maxZoom:18,tileSize:256,subdomains:"abc",errorTileUrl:"",attribution:"",zoomOffset:0,opacity:1,unloadInvisibleTiles:o.Browser.mobile,updateWhenIdle:o.Browser.mobile},initialize:function(t,e){e=o.setOptions(this,e),e.detectRetina&&o.Browser.retina&&e.maxZoom>0&&(e.tileSize=Math.floor(e.tileSize/2),e.zoomOffset++,e.minZoom>0&&e.minZoom--,this.options.maxZoom--),e.bounds&&(e.bounds=o.latLngBounds(e.bounds)),this._url=t;var i=this.options.subdomains;"string"==typeof i&&(this.options.subdomains=i.split(""))},onAdd:function(t){this._map=t,this._animated=t._zoomAnimated,this._initContainer(),t.on({viewreset:this._reset,moveend:this._update},this),this._animated&&t.on({zoomanim:this._animateZoom,zoomend:this._endZoomAnim},this),this.options.updateWhenIdle||(this._limitedUpdate=o.Util.limitExecByInterval(this._update,150,this),t.on("move",this._limitedUpdate,this)),this._reset(),this._update()},addTo:function(t){return t.addLayer(this),this},onRemove:function(t){this._container.parentNode.removeChild(this._container),t.off({viewreset:this._reset,moveend:this._update},this),this._animated&&t.off({zoomanim:this._animateZoom,zoomend:this._endZoomAnim},this),this.options.updateWhenIdle||t.off("move",this._limitedUpdate,this),this._container=null,this._map=null},bringToFront:function(){var t=this._map._panes.tilePane;return this._container&&(t.appendChild(this._container),this._setAutoZIndex(t,Math.max)),this},bringToBack:function(){var t=this._map._panes.tilePane;return this._container&&(t.insertBefore(this._container,t.firstChild),this._setAutoZIndex(t,Math.min)),this},getAttribution:function(){return this.options.attribution},getContainer:function(){return this._container},setOpacity:function(t){return this.options.opacity=t,this._map&&this._updateOpacity(),this},setZIndex:function(t){return this.options.zIndex=t,this._updateZIndex(),this},setUrl:function(t,e){return this._url=t,e||this.redraw(),this},redraw:function(){return this._map&&(this._reset({hard:!0}),this._update()),this},_updateZIndex:function(){this._container&&this.options.zIndex!==i&&(this._container.style.zIndex=this.options.zIndex)},_setAutoZIndex:function(t,e){var i,n,o,s=t.children,a=-e(1/0,-1/0);for(n=0,o=s.length;o>n;n++)s[n]!==this._container&&(i=parseInt(s[n].style.zIndex,10),isNaN(i)||(a=e(a,i)));this.options.zIndex=this._container.style.zIndex=(isFinite(a)?a:0)+e(1,-1)},_updateOpacity:function(){var t,e=this._tiles;if(o.Browser.ielt9)for(t in e)o.DomUtil.setOpacity(e[t],this.options.opacity);else o.DomUtil.setOpacity(this._container,this.options.opacity)},_initContainer:function(){var t=this._map._panes.tilePane;if(!this._container){if(this._container=o.DomUtil.create("div","leaflet-layer"),this._updateZIndex(),this._animated){var e="leaflet-tile-container";this._bgBuffer=o.DomUtil.create("div",e,this._container),this._tileContainer=o.DomUtil.create("div",e,this._container)}else this._tileContainer=this._container;t.appendChild(this._container),this.options.opacity<1&&this._updateOpacity()}},_reset:function(t){for(var e in this._tiles)this.fire("tileunload",{tile:this._tiles[e]});this._tiles={},this._tilesToLoad=0,this.options.reuseTiles&&(this._unusedTiles=[]),this._tileContainer.innerHTML="",this._animated&&t&&t.hard&&this._clearBgBuffer(),this._initContainer()},_getTileSize:function(){var t=this._map,e=t.getZoom()+this.options.zoomOffset,i=this.options.maxNativeZoom,n=this.options.tileSize;return i&&e>i&&(n=Math.round(t.getZoomScale(e)/t.getZoomScale(i)*n)),n},_update:function(){if(this._map){var t=this._map,e=t.getPixelBounds(),i=t.getZoom(),n=this._getTileSize();if(!(i>this.options.maxZoom||i<this.options.minZoom)){var s=o.bounds(e.min.divideBy(n)._floor(),e.max.divideBy(n)._floor());this._addTilesFromCenterOut(s),(this.options.unloadInvisibleTiles||this.options.reuseTiles)&&this._removeOtherTiles(s)}}},_addTilesFromCenterOut:function(t){var i,n,s,a=[],r=t.getCenter();for(i=t.min.y;i<=t.max.y;i++)for(n=t.min.x;n<=t.max.x;n++)s=new o.Point(n,i),this._tileShouldBeLoaded(s)&&a.push(s);var h=a.length;if(0!==h){a.sort(function(t,e){return t.distanceTo(r)-e.distanceTo(r)});var l=e.createDocumentFragment();for(this._tilesToLoad||this.fire("loading"),this._tilesToLoad+=h,n=0;h>n;n++)this._addTile(a[n],l);this._tileContainer.appendChild(l)}},_tileShouldBeLoaded:function(t){if(t.x+":"+t.y in this._tiles)return!1;var e=this.options;if(!e.continuousWorld){var i=this._getWrapTileNum();if(e.noWrap&&(t.x<0||t.x>=i.x)||t.y<0||t.y>=i.y)return!1}if(e.bounds){var n=e.tileSize,o=t.multiplyBy(n),s=o.add([n,n]),a=this._map.unproject(o),r=this._map.unproject(s);if(e.continuousWorld||e.noWrap||(a=a.wrap(),r=r.wrap()),!e.bounds.intersects([a,r]))return!1}return!0},_removeOtherTiles:function(t){var e,i,n,o;for(o in this._tiles)e=o.split(":"),i=parseInt(e[0],10),n=parseInt(e[1],10),(i<t.min.x||i>t.max.x||n<t.min.y||n>t.max.y)&&this._removeTile(o)},_removeTile:function(t){var e=this._tiles[t];this.fire("tileunload",{tile:e,url:e.src}),this.options.reuseTiles?(o.DomUtil.removeClass(e,"leaflet-tile-loaded"),this._unusedTiles.push(e)):e.parentNode===this._tileContainer&&this._tileContainer.removeChild(e),o.Browser.android||(e.onload=null,e.src=o.Util.emptyImageUrl),delete this._tiles[t]},_addTile:function(t,e){var i=this._getTilePos(t),n=this._getTile();o.DomUtil.setPosition(n,i,o.Browser.chrome),this._tiles[t.x+":"+t.y]=n,this._loadTile(n,t),n.parentNode!==this._tileContainer&&e.appendChild(n)},_getZoomForUrl:function(){var t=this.options,e=this._map.getZoom();return t.zoomReverse&&(e=t.maxZoom-e),e+=t.zoomOffset,t.maxNativeZoom?Math.min(e,t.maxNativeZoom):e},_getTilePos:function(t){var e=this._map.getPixelOrigin(),i=this._getTileSize();return t.multiplyBy(i).subtract(e)},getTileUrl:function(t){return o.Util.template(this._url,o.extend({s:this._getSubdomain(t),z:t.z,x:t.x,y:t.y},this.options))},_getWrapTileNum:function(){var t=this._map.options.crs,e=t.getSize(this._map.getZoom());return e.divideBy(this._getTileSize())._floor()},_adjustTilePoint:function(t){var e=this._getWrapTileNum();this.options.continuousWorld||this.options.noWrap||(t.x=(t.x%e.x+e.x)%e.x),this.options.tms&&(t.y=e.y-t.y-1),t.z=this._getZoomForUrl()},_getSubdomain:function(t){var e=Math.abs(t.x+t.y)%this.options.subdomains.length;return this.options.subdomains[e]},_getTile:function(){if(this.options.reuseTiles&&this._unusedTiles.length>0){var t=this._unusedTiles.pop();return this._resetTile(t),t}return this._createTile()},_resetTile:function(){},_createTile:function(){var t=o.DomUtil.create("img","leaflet-tile");return t.style.width=t.style.height=this._getTileSize()+"px",t.galleryimg="no",t.onselectstart=t.onmousemove=o.Util.falseFn,o.Browser.ielt9&&this.options.opacity!==i&&o.DomUtil.setOpacity(t,this.options.opacity),o.Browser.mobileWebkit3d&&(t.style.WebkitBackfaceVisibility="hidden"),t},_loadTile:function(t,e){t._layer=this,t.onload=this._tileOnLoad,t.onerror=this._tileOnError,this._adjustTilePoint(e),t.src=this.getTileUrl(e),this.fire("tileloadstart",{tile:t,url:t.src})},_tileLoaded:function(){this._tilesToLoad--,this._animated&&o.DomUtil.addClass(this._tileContainer,"leaflet-zoom-animated"),this._tilesToLoad||(this.fire("load"),this._animated&&(clearTimeout(this._clearBgBufferTimer),this._clearBgBufferTimer=setTimeout(o.bind(this._clearBgBuffer,this),500)))},_tileOnLoad:function(){var t=this._layer;this.src!==o.Util.emptyImageUrl&&(o.DomUtil.addClass(this,"leaflet-tile-loaded"),t.fire("tileload",{tile:this,url:this.src})),t._tileLoaded()},_tileOnError:function(){var t=this._layer;t.fire("tileerror",{tile:this,url:this.src});var e=t.options.errorTileUrl;e&&(this.src=e),t._tileLoaded()}}),o.tileLayer=function(t,e){return new o.TileLayer(t,e)},o.TileLayer.WMS=o.TileLayer.extend({defaultWmsParams:{service:"WMS",request:"GetMap",version:"1.1.1",layers:"",styles:"",format:"image/jpeg",transparent:!1},initialize:function(t,e){this._url=t;var i=o.extend({},this.defaultWmsParams),n=e.tileSize||this.options.tileSize;i.width=i.height=e.detectRetina&&o.Browser.retina?2*n:n;for(var s in e)this.options.hasOwnProperty(s)||"crs"===s||(i[s]=e[s]);this.wmsParams=i,o.setOptions(this,e)},onAdd:function(t){this._crs=this.options.crs||t.options.crs,this._wmsVersion=parseFloat(this.wmsParams.version);var e=this._wmsVersion>=1.3?"crs":"srs";this.wmsParams[e]=this._crs.code,o.TileLayer.prototype.onAdd.call(this,t)},getTileUrl:function(t){var e=this._map,i=this.options.tileSize,n=t.multiplyBy(i),s=n.add([i,i]),a=this._crs.project(e.unproject(n,t.z)),r=this._crs.project(e.unproject(s,t.z)),h=this._wmsVersion>=1.3&&this._crs===o.CRS.EPSG4326?[r.y,a.x,a.y,r.x].join(","):[a.x,r.y,r.x,a.y].join(","),l=o.Util.template(this._url,{s:this._getSubdomain(t)});return l+o.Util.getParamString(this.wmsParams,l,!0)+"&BBOX="+h},setParams:function(t,e){return o.extend(this.wmsParams,t),e||this.redraw(),this}}),o.tileLayer.wms=function(t,e){return new o.TileLayer.WMS(t,e)},o.TileLayer.Canvas=o.TileLayer.extend({options:{async:!1},initialize:function(t){o.setOptions(this,t)},redraw:function(){this._map&&(this._reset({hard:!0}),this._update());for(var t in this._tiles)this._redrawTile(this._tiles[t]);return this},_redrawTile:function(t){this.drawTile(t,t._tilePoint,this._map._zoom)},_createTile:function(){var t=o.DomUtil.create("canvas","leaflet-tile");return t.width=t.height=this.options.tileSize,t.onselectstart=t.onmousemove=o.Util.falseFn,t},_loadTile:function(t,e){t._layer=this,t._tilePoint=e,this._redrawTile(t),this.options.async||this.tileDrawn(t)},drawTile:function(){},tileDrawn:function(t){this._tileOnLoad.call(t)}}),o.tileLayer.canvas=function(t){return new o.TileLayer.Canvas(t)},o.ImageOverlay=o.Class.extend({includes:o.Mixin.Events,options:{opacity:1},initialize:function(t,e,i){this._url=t,this._bounds=o.latLngBounds(e),o.setOptions(this,i)},onAdd:function(t){this._map=t,this._image||this._initImage(),t._panes.overlayPane.appendChild(this._image),t.on("viewreset",this._reset,this),t.options.zoomAnimation&&o.Browser.any3d&&t.on("zoomanim",this._animateZoom,this),this._reset()},onRemove:function(t){t.getPanes().overlayPane.removeChild(this._image),t.off("viewreset",this._reset,this),t.options.zoomAnimation&&t.off("zoomanim",this._animateZoom,this)},addTo:function(t){return t.addLayer(this),this},setOpacity:function(t){return this.options.opacity=t,this._updateOpacity(),this},bringToFront:function(){return this._image&&this._map._panes.overlayPane.appendChild(this._image),this},bringToBack:function(){var t=this._map._panes.overlayPane;return this._image&&t.insertBefore(this._image,t.firstChild),this},setUrl:function(t){this._url=t,this._image.src=this._url},getAttribution:function(){return this.options.attribution},_initImage:function(){this._image=o.DomUtil.create("img","leaflet-image-layer"),this._map.options.zoomAnimation&&o.Browser.any3d?o.DomUtil.addClass(this._image,"leaflet-zoom-animated"):o.DomUtil.addClass(this._image,"leaflet-zoom-hide"),this._updateOpacity(),o.extend(this._image,{galleryimg:"no",onselectstart:o.Util.falseFn,onmousemove:o.Util.falseFn,onload:o.bind(this._onImageLoad,this),src:this._url})},_animateZoom:function(t){var e=this._map,i=this._image,n=e.getZoomScale(t.zoom),s=this._bounds.getNorthWest(),a=this._bounds.getSouthEast(),r=e._latLngToNewLayerPoint(s,t.zoom,t.center),h=e._latLngToNewLayerPoint(a,t.zoom,t.center)._subtract(r),l=r._add(h._multiplyBy(.5*(1-1/n)));i.style[o.DomUtil.TRANSFORM]=o.DomUtil.getTranslateString(l)+" scale("+n+") "},_reset:function(){var t=this._image,e=this._map.latLngToLayerPoint(this._bounds.getNorthWest()),i=this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(e);o.DomUtil.setPosition(t,e),t.style.width=i.x+"px",t.style.height=i.y+"px"},_onImageLoad:function(){this.fire("load")},_updateOpacity:function(){o.DomUtil.setOpacity(this._image,this.options.opacity)}}),o.imageOverlay=function(t,e,i){return new o.ImageOverlay(t,e,i)},o.Icon=o.Class.extend({options:{className:""},initialize:function(t){o.setOptions(this,t)},createIcon:function(t){return this._createIcon("icon",t)},createShadow:function(t){return this._createIcon("shadow",t)},_createIcon:function(t,e){var i=this._getIconUrl(t);if(!i){if("icon"===t)throw new Error("iconUrl not set in Icon options (see the docs).");return null}var n;return n=e&&"IMG"===e.tagName?this._createImg(i,e):this._createImg(i),this._setIconStyles(n,t),n},_setIconStyles:function(t,e){var i,n=this.options,s=o.point(n[e+"Size"]);i=o.point("shadow"===e?n.shadowAnchor||n.iconAnchor:n.iconAnchor),!i&&s&&(i=s.divideBy(2,!0)),t.className="leaflet-marker-"+e+" "+n.className,i&&(t.style.marginLeft=-i.x+"px",t.style.marginTop=-i.y+"px"),s&&(t.style.width=s.x+"px",t.style.height=s.y+"px")},_createImg:function(t,i){return i=i||e.createElement("img"),i.src=t,i},_getIconUrl:function(t){return o.Browser.retina&&this.options[t+"RetinaUrl"]?this.options[t+"RetinaUrl"]:this.options[t+"Url"]}}),o.icon=function(t){return new o.Icon(t)},o.Icon.Default=o.Icon.extend({options:{iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]},_getIconUrl:function(t){var e=t+"Url";if(this.options[e])return this.options[e];o.Browser.retina&&"icon"===t&&(t+="-2x");var i=o.Icon.Default.imagePath;if(!i)throw new Error("Couldn't autodetect L.Icon.Default.imagePath, set it manually.");return i+"/marker-"+t+".png"}}),o.Icon.Default.imagePath=function(){var t,i,n,o,s,a=e.getElementsByTagName("script"),r=/[\/^]leaflet[\-\._]?([\w\-\._]*)\.js\??/;for(t=0,i=a.length;i>t;t++)if(n=a[t].src,o=n.match(r))return s=n.split(r)[0],(s?s+"/":"")+"images"}(),o.Marker=o.Class.extend({includes:o.Mixin.Events,options:{icon:new o.Icon.Default,title:"",alt:"",clickable:!0,draggable:!1,keyboard:!0,zIndexOffset:0,opacity:1,riseOnHover:!1,riseOffset:250},initialize:function(t,e){o.setOptions(this,e),this._latlng=o.latLng(t)},onAdd:function(t){this._map=t,t.on("viewreset",this.update,this),this._initIcon(),this.update(),this.fire("add"),t.options.zoomAnimation&&t.options.markerZoomAnimation&&t.on("zoomanim",this._animateZoom,this)},addTo:function(t){return t.addLayer(this),this},onRemove:function(t){this.dragging&&this.dragging.disable(),this._removeIcon(),this._removeShadow(),this.fire("remove"),t.off({viewreset:this.update,zoomanim:this._animateZoom},this),this._map=null},getLatLng:function(){return this._latlng},setLatLng:function(t){return this._latlng=o.latLng(t),this.update(),this.fire("move",{latlng:this._latlng})},setZIndexOffset:function(t){return this.options.zIndexOffset=t,this.update(),this},setIcon:function(t){return this.options.icon=t,this._map&&(this._initIcon(),this.update()),this._popup&&this.bindPopup(this._popup),this},update:function(){if(this._icon){var t=this._map.latLngToLayerPoint(this._latlng).round();this._setPos(t)}return this},_initIcon:function(){var t=this.options,e=this._map,i=e.options.zoomAnimation&&e.options.markerZoomAnimation,n=i?"leaflet-zoom-animated":"leaflet-zoom-hide",s=t.icon.createIcon(this._icon),a=!1;s!==this._icon&&(this._icon&&this._removeIcon(),a=!0,t.title&&(s.title=t.title),t.alt&&(s.alt=t.alt)),o.DomUtil.addClass(s,n),t.keyboard&&(s.tabIndex="0"),this._icon=s,this._initInteraction(),t.riseOnHover&&o.DomEvent.on(s,"mouseover",this._bringToFront,this).on(s,"mouseout",this._resetZIndex,this);var r=t.icon.createShadow(this._shadow),h=!1;r!==this._shadow&&(this._removeShadow(),h=!0),r&&o.DomUtil.addClass(r,n),this._shadow=r,t.opacity<1&&this._updateOpacity();var l=this._map._panes;a&&l.markerPane.appendChild(this._icon),r&&h&&l.shadowPane.appendChild(this._shadow)},_removeIcon:function(){this.options.riseOnHover&&o.DomEvent.off(this._icon,"mouseover",this._bringToFront).off(this._icon,"mouseout",this._resetZIndex),this._map._panes.markerPane.removeChild(this._icon),this._icon=null},_removeShadow:function(){this._shadow&&this._map._panes.shadowPane.removeChild(this._shadow),this._shadow=null},_setPos:function(t){o.DomUtil.setPosition(this._icon,t),this._shadow&&o.DomUtil.setPosition(this._shadow,t),this._zIndex=t.y+this.options.zIndexOffset,this._resetZIndex()},_updateZIndex:function(t){this._icon.style.zIndex=this._zIndex+t},_animateZoom:function(t){var e=this._map._latLngToNewLayerPoint(this._latlng,t.zoom,t.center).round();this._setPos(e)},_initInteraction:function(){if(this.options.clickable){var t=this._icon,e=["dblclick","mousedown","mouseover","mouseout","contextmenu"];o.DomUtil.addClass(t,"leaflet-clickable"),o.DomEvent.on(t,"click",this._onMouseClick,this),o.DomEvent.on(t,"keypress",this._onKeyPress,this);for(var i=0;i<e.length;i++)o.DomEvent.on(t,e[i],this._fireMouseEvent,this);o.Handler.MarkerDrag&&(this.dragging=new o.Handler.MarkerDrag(this),this.options.draggable&&this.dragging.enable())}},_onMouseClick:function(t){var e=this.dragging&&this.dragging.moved();(this.hasEventListeners(t.type)||e)&&o.DomEvent.stopPropagation(t),e||(this.dragging&&this.dragging._enabled||!this._map.dragging||!this._map.dragging.moved())&&this.fire(t.type,{originalEvent:t,latlng:this._latlng})},_onKeyPress:function(t){13===t.keyCode&&this.fire("click",{originalEvent:t,latlng:this._latlng})},_fireMouseEvent:function(t){this.fire(t.type,{originalEvent:t,latlng:this._latlng}),"contextmenu"===t.type&&this.hasEventListeners(t.type)&&o.DomEvent.preventDefault(t),"mousedown"!==t.type?o.DomEvent.stopPropagation(t):o.DomEvent.preventDefault(t)},setOpacity:function(t){return this.options.opacity=t,this._map&&this._updateOpacity(),this},_updateOpacity:function(){o.DomUtil.setOpacity(this._icon,this.options.opacity),this._shadow&&o.DomUtil.setOpacity(this._shadow,this.options.opacity)},_bringToFront:function(){this._updateZIndex(this.options.riseOffset)},_resetZIndex:function(){this._updateZIndex(0)}}),o.marker=function(t,e){return new o.Marker(t,e)},o.DivIcon=o.Icon.extend({options:{iconSize:[12,12],className:"leaflet-div-icon",html:!1},createIcon:function(t){var i=t&&"DIV"===t.tagName?t:e.createElement("div"),n=this.options;return i.innerHTML=n.html!==!1?n.html:"",n.bgPos&&(i.style.backgroundPosition=-n.bgPos.x+"px "+-n.bgPos.y+"px"),this._setIconStyles(i,"icon"),i},createShadow:function(){return null}}),o.divIcon=function(t){return new o.DivIcon(t)},o.Map.mergeOptions({closePopupOnClick:!0}),o.Popup=o.Class.extend({includes:o.Mixin.Events,options:{minWidth:50,maxWidth:300,autoPan:!0,closeButton:!0,offset:[0,7],autoPanPadding:[5,5],keepInView:!1,className:"",zoomAnimation:!0},initialize:function(t,e){o.setOptions(this,t),this._source=e,this._animated=o.Browser.any3d&&this.options.zoomAnimation,this._isOpen=!1},onAdd:function(t){this._map=t,this._container||this._initLayout();var e=t.options.fadeAnimation;e&&o.DomUtil.setOpacity(this._container,0),t._panes.popupPane.appendChild(this._container),t.on(this._getEvents(),this),this.update(),e&&o.DomUtil.setOpacity(this._container,1),this.fire("open"),t.fire("popupopen",{popup:this}),this._source&&this._source.fire("popupopen",{popup:this})},addTo:function(t){return t.addLayer(this),this},openOn:function(t){return t.openPopup(this),this},onRemove:function(t){t._panes.popupPane.removeChild(this._container),o.Util.falseFn(this._container.offsetWidth),t.off(this._getEvents(),this),t.options.fadeAnimation&&o.DomUtil.setOpacity(this._container,0),this._map=null,this.fire("close"),t.fire("popupclose",{popup:this}),this._source&&this._source.fire("popupclose",{popup:this})},getLatLng:function(){return this._latlng},setLatLng:function(t){return this._latlng=o.latLng(t),this._map&&(this._updatePosition(),this._adjustPan()),this},getContent:function(){return this._content},setContent:function(t){return this._content=t,this.update(),this},update:function(){this._map&&(this._container.style.visibility="hidden",this._updateContent(),this._updateLayout(),this._updatePosition(),this._container.style.visibility="",this._adjustPan())},_getEvents:function(){var t={viewreset:this._updatePosition};return this._animated&&(t.zoomanim=this._zoomAnimation),("closeOnClick"in this.options?this.options.closeOnClick:this._map.options.closePopupOnClick)&&(t.preclick=this._close),this.options.keepInView&&(t.moveend=this._adjustPan),t},_close:function(){this._map&&this._map.closePopup(this)},_initLayout:function(){var t,e="leaflet-popup",i=e+" "+this.options.className+" leaflet-zoom-"+(this._animated?"animated":"hide"),n=this._container=o.DomUtil.create("div",i);this.options.closeButton&&(t=this._closeButton=o.DomUtil.create("a",e+"-close-button",n),t.href="#close",t.innerHTML="&#215;",o.DomEvent.disableClickPropagation(t),o.DomEvent.on(t,"click",this._onCloseButtonClick,this));var s=this._wrapper=o.DomUtil.create("div",e+"-content-wrapper",n);o.DomEvent.disableClickPropagation(s),this._contentNode=o.DomUtil.create("div",e+"-content",s),o.DomEvent.disableScrollPropagation(this._contentNode),o.DomEvent.on(s,"contextmenu",o.DomEvent.stopPropagation),this._tipContainer=o.DomUtil.create("div",e+"-tip-container",n),this._tip=o.DomUtil.create("div",e+"-tip",this._tipContainer)},_updateContent:function(){if(this._content){if("string"==typeof this._content)this._contentNode.innerHTML=this._content;else{for(;this._contentNode.hasChildNodes();)this._contentNode.removeChild(this._contentNode.firstChild);this._contentNode.appendChild(this._content)}this.fire("contentupdate")}},_updateLayout:function(){var t=this._contentNode,e=t.style;e.width="",e.whiteSpace="nowrap";var i=t.offsetWidth;i=Math.min(i,this.options.maxWidth),i=Math.max(i,this.options.minWidth),e.width=i+1+"px",e.whiteSpace="",e.height="";var n=t.offsetHeight,s=this.options.maxHeight,a="leaflet-popup-scrolled";s&&n>s?(e.height=s+"px",o.DomUtil.addClass(t,a)):o.DomUtil.removeClass(t,a),this._containerWidth=this._container.offsetWidth},_updatePosition:function(){if(this._map){var t=this._map.latLngToLayerPoint(this._latlng),e=this._animated,i=o.point(this.options.offset);e&&o.DomUtil.setPosition(this._container,t),this._containerBottom=-i.y-(e?0:t.y),this._containerLeft=-Math.round(this._containerWidth/2)+i.x+(e?0:t.x),this._container.style.bottom=this._containerBottom+"px",this._container.style.left=this._containerLeft+"px"}},_zoomAnimation:function(t){var e=this._map._latLngToNewLayerPoint(this._latlng,t.zoom,t.center);o.DomUtil.setPosition(this._container,e)},_adjustPan:function(){if(this.options.autoPan){var t=this._map,e=this._container.offsetHeight,i=this._containerWidth,n=new o.Point(this._containerLeft,-e-this._containerBottom);this._animated&&n._add(o.DomUtil.getPosition(this._container));var s=t.layerPointToContainerPoint(n),a=o.point(this.options.autoPanPadding),r=o.point(this.options.autoPanPaddingTopLeft||a),h=o.point(this.options.autoPanPaddingBottomRight||a),l=t.getSize(),u=0,c=0;s.x+i+h.x>l.x&&(u=s.x+i-l.x+h.x),s.x-u-r.x<0&&(u=s.x-r.x),s.y+e+h.y>l.y&&(c=s.y+e-l.y+h.y),s.y-c-r.y<0&&(c=s.y-r.y),(u||c)&&t.fire("autopanstart").panBy([u,c])}},_onCloseButtonClick:function(t){this._close(),o.DomEvent.stop(t)}}),o.popup=function(t,e){return new o.Popup(t,e)},o.Map.include({openPopup:function(t,e,i){if(this.closePopup(),!(t instanceof o.Popup)){var n=t;t=new o.Popup(i).setLatLng(e).setContent(n)}return t._isOpen=!0,this._popup=t,this.addLayer(t)},closePopup:function(t){return t&&t!==this._popup||(t=this._popup,this._popup=null),t&&(this.removeLayer(t),t._isOpen=!1),this}}),o.Marker.include({openPopup:function(){return this._popup&&this._map&&!this._map.hasLayer(this._popup)&&(this._popup.setLatLng(this._latlng),this._map.openPopup(this._popup)),this},closePopup:function(){return this._popup&&this._popup._close(),this},togglePopup:function(){return this._popup&&(this._popup._isOpen?this.closePopup():this.openPopup()),this},bindPopup:function(t,e){var i=o.point(this.options.icon.options.popupAnchor||[0,0]);return i=i.add(o.Popup.prototype.options.offset),e&&e.offset&&(i=i.add(e.offset)),e=o.extend({offset:i},e),this._popupHandlersAdded||(this.on("click",this.togglePopup,this).on("remove",this.closePopup,this).on("move",this._movePopup,this),this._popupHandlersAdded=!0),t instanceof o.Popup?(o.setOptions(t,e),this._popup=t):this._popup=new o.Popup(e,this).setContent(t),this},setPopupContent:function(t){return this._popup&&this._popup.setContent(t),this},unbindPopup:function(){return this._popup&&(this._popup=null,this.off("click",this.togglePopup,this).off("remove",this.closePopup,this).off("move",this._movePopup,this),this._popupHandlersAdded=!1),this},getPopup:function(){return this._popup},_movePopup:function(t){this._popup.setLatLng(t.latlng)}}),o.LayerGroup=o.Class.extend({initialize:function(t){this._layers={};var e,i;if(t)for(e=0,i=t.length;i>e;e++)this.addLayer(t[e])},addLayer:function(t){var e=this.getLayerId(t);return this._layers[e]=t,this._map&&this._map.addLayer(t),this},removeLayer:function(t){var e=t in this._layers?t:this.getLayerId(t);return this._map&&this._layers[e]&&this._map.removeLayer(this._layers[e]),delete this._layers[e],this},hasLayer:function(t){return t?t in this._layers||this.getLayerId(t)in this._layers:!1},clearLayers:function(){return this.eachLayer(this.removeLayer,this),this},invoke:function(t){var e,i,n=Array.prototype.slice.call(arguments,1);for(e in this._layers)i=this._layers[e],i[t]&&i[t].apply(i,n);return this},onAdd:function(t){this._map=t,this.eachLayer(t.addLayer,t)},onRemove:function(t){this.eachLayer(t.removeLayer,t),this._map=null},addTo:function(t){return t.addLayer(this),this},eachLayer:function(t,e){for(var i in this._layers)t.call(e,this._layers[i]);return this},getLayer:function(t){return this._layers[t]},getLayers:function(){var t=[];for(var e in this._layers)t.push(this._layers[e]);return t},setZIndex:function(t){return this.invoke("setZIndex",t)},getLayerId:function(t){return o.stamp(t)}}),o.layerGroup=function(t){return new o.LayerGroup(t)},o.FeatureGroup=o.LayerGroup.extend({includes:o.Mixin.Events,statics:{EVENTS:"click dblclick mouseover mouseout mousemove contextmenu popupopen popupclose"},addLayer:function(t){return this.hasLayer(t)?this:("on"in t&&t.on(o.FeatureGroup.EVENTS,this._propagateEvent,this),o.LayerGroup.prototype.addLayer.call(this,t),this._popupContent&&t.bindPopup&&t.bindPopup(this._popupContent,this._popupOptions),this.fire("layeradd",{layer:t}))},removeLayer:function(t){return this.hasLayer(t)?(t in this._layers&&(t=this._layers[t]),t.off(o.FeatureGroup.EVENTS,this._propagateEvent,this),o.LayerGroup.prototype.removeLayer.call(this,t),this._popupContent&&this.invoke("unbindPopup"),this.fire("layerremove",{layer:t})):this},bindPopup:function(t,e){return this._popupContent=t,this._popupOptions=e,this.invoke("bindPopup",t,e)},openPopup:function(t){for(var e in this._layers){this._layers[e].openPopup(t);break}return this},setStyle:function(t){return this.invoke("setStyle",t)},bringToFront:function(){return this.invoke("bringToFront")},bringToBack:function(){return this.invoke("bringToBack")},getBounds:function(){var t=new o.LatLngBounds;return this.eachLayer(function(e){t.extend(e instanceof o.Marker?e.getLatLng():e.getBounds())}),t},_propagateEvent:function(t){t=o.extend({layer:t.target,target:this},t),this.fire(t.type,t)}}),o.featureGroup=function(t){return new o.FeatureGroup(t)},o.Path=o.Class.extend({includes:[o.Mixin.Events],statics:{CLIP_PADDING:function(){var e=o.Browser.mobile?1280:2e3,i=(e/Math.max(t.outerWidth,t.outerHeight)-1)/2;return Math.max(0,Math.min(.5,i))}()},options:{stroke:!0,color:"#0033ff",dashArray:null,lineCap:null,lineJoin:null,weight:5,opacity:.5,fill:!1,fillColor:null,fillOpacity:.2,clickable:!0},initialize:function(t){o.setOptions(this,t)},onAdd:function(t){this._map=t,this._container||(this._initElements(),this._initEvents()),this.projectLatlngs(),this._updatePath(),this._container&&this._map._pathRoot.appendChild(this._container),this.fire("add"),t.on({viewreset:this.projectLatlngs,moveend:this._updatePath},this)},addTo:function(t){return t.addLayer(this),this},onRemove:function(t){t._pathRoot.removeChild(this._container),this.fire("remove"),this._map=null,o.Browser.vml&&(this._container=null,this._stroke=null,this._fill=null),t.off({viewreset:this.projectLatlngs,moveend:this._updatePath},this)},projectLatlngs:function(){},setStyle:function(t){return o.setOptions(this,t),this._container&&this._updateStyle(),this},redraw:function(){return this._map&&(this.projectLatlngs(),this._updatePath()),this}}),o.Map.include({_updatePathViewport:function(){var t=o.Path.CLIP_PADDING,e=this.getSize(),i=o.DomUtil.getPosition(this._mapPane),n=i.multiplyBy(-1)._subtract(e.multiplyBy(t)._round()),s=n.add(e.multiplyBy(1+2*t)._round());this._pathViewport=new o.Bounds(n,s)}}),o.Path.SVG_NS="http://www.w3.org/2000/svg",o.Browser.svg=!(!e.createElementNS||!e.createElementNS(o.Path.SVG_NS,"svg").createSVGRect),o.Path=o.Path.extend({statics:{SVG:o.Browser.svg},bringToFront:function(){var t=this._map._pathRoot,e=this._container;return e&&t.lastChild!==e&&t.appendChild(e),this},bringToBack:function(){var t=this._map._pathRoot,e=this._container,i=t.firstChild;return e&&i!==e&&t.insertBefore(e,i),this},getPathString:function(){},_createElement:function(t){return e.createElementNS(o.Path.SVG_NS,t)},_initElements:function(){this._map._initPathRoot(),this._initPath(),this._initStyle()},_initPath:function(){this._container=this._createElement("g"),this._path=this._createElement("path"),this.options.className&&o.DomUtil.addClass(this._path,this.options.className),this._container.appendChild(this._path)},_initStyle:function(){this.options.stroke&&(this._path.setAttribute("stroke-linejoin","round"),this._path.setAttribute("stroke-linecap","round")),this.options.fill&&this._path.setAttribute("fill-rule","evenodd"),this.options.pointerEvents&&this._path.setAttribute("pointer-events",this.options.pointerEvents),this.options.clickable||this.options.pointerEvents||this._path.setAttribute("pointer-events","none"),this._updateStyle()},_updateStyle:function(){this.options.stroke?(this._path.setAttribute("stroke",this.options.color),this._path.setAttribute("stroke-opacity",this.options.opacity),this._path.setAttribute("stroke-width",this.options.weight),this.options.dashArray?this._path.setAttribute("stroke-dasharray",this.options.dashArray):this._path.removeAttribute("stroke-dasharray"),this.options.lineCap&&this._path.setAttribute("stroke-linecap",this.options.lineCap),this.options.lineJoin&&this._path.setAttribute("stroke-linejoin",this.options.lineJoin)):this._path.setAttribute("stroke","none"),this.options.fill?(this._path.setAttribute("fill",this.options.fillColor||this.options.color),this._path.setAttribute("fill-opacity",this.options.fillOpacity)):this._path.setAttribute("fill","none")},_updatePath:function(){var t=this.getPathString();t||(t="M0 0"),this._path.setAttribute("d",t)},_initEvents:function(){if(this.options.clickable){(o.Browser.svg||!o.Browser.vml)&&o.DomUtil.addClass(this._path,"leaflet-clickable"),o.DomEvent.on(this._container,"click",this._onMouseClick,this);for(var t=["dblclick","mousedown","mouseover","mouseout","mousemove","contextmenu"],e=0;e<t.length;e++)o.DomEvent.on(this._container,t[e],this._fireMouseEvent,this)}},_onMouseClick:function(t){this._map.dragging&&this._map.dragging.moved()||this._fireMouseEvent(t)},_fireMouseEvent:function(t){if(this.hasEventListeners(t.type)){var e=this._map,i=e.mouseEventToContainerPoint(t),n=e.containerPointToLayerPoint(i),s=e.layerPointToLatLng(n);this.fire(t.type,{latlng:s,layerPoint:n,containerPoint:i,originalEvent:t}),"contextmenu"===t.type&&o.DomEvent.preventDefault(t),"mousemove"!==t.type&&o.DomEvent.stopPropagation(t)}}}),o.Map.include({_initPathRoot:function(){this._pathRoot||(this._pathRoot=o.Path.prototype._createElement("svg"),this._panes.overlayPane.appendChild(this._pathRoot),this.options.zoomAnimation&&o.Browser.any3d?(o.DomUtil.addClass(this._pathRoot,"leaflet-zoom-animated"),this.on({zoomanim:this._animatePathZoom,zoomend:this._endPathZoom})):o.DomUtil.addClass(this._pathRoot,"leaflet-zoom-hide"),this.on("moveend",this._updateSvgViewport),this._updateSvgViewport())
},_animatePathZoom:function(t){var e=this.getZoomScale(t.zoom),i=this._getCenterOffset(t.center)._multiplyBy(-e)._add(this._pathViewport.min);this._pathRoot.style[o.DomUtil.TRANSFORM]=o.DomUtil.getTranslateString(i)+" scale("+e+") ",this._pathZooming=!0},_endPathZoom:function(){this._pathZooming=!1},_updateSvgViewport:function(){if(!this._pathZooming){this._updatePathViewport();var t=this._pathViewport,e=t.min,i=t.max,n=i.x-e.x,s=i.y-e.y,a=this._pathRoot,r=this._panes.overlayPane;o.Browser.mobileWebkit&&r.removeChild(a),o.DomUtil.setPosition(a,e),a.setAttribute("width",n),a.setAttribute("height",s),a.setAttribute("viewBox",[e.x,e.y,n,s].join(" ")),o.Browser.mobileWebkit&&r.appendChild(a)}}}),o.Path.include({bindPopup:function(t,e){return t instanceof o.Popup?this._popup=t:((!this._popup||e)&&(this._popup=new o.Popup(e,this)),this._popup.setContent(t)),this._popupHandlersAdded||(this.on("click",this._openPopup,this).on("remove",this.closePopup,this),this._popupHandlersAdded=!0),this},unbindPopup:function(){return this._popup&&(this._popup=null,this.off("click",this._openPopup).off("remove",this.closePopup),this._popupHandlersAdded=!1),this},openPopup:function(t){return this._popup&&(t=t||this._latlng||this._latlngs[Math.floor(this._latlngs.length/2)],this._openPopup({latlng:t})),this},closePopup:function(){return this._popup&&this._popup._close(),this},_openPopup:function(t){this._popup.setLatLng(t.latlng),this._map.openPopup(this._popup)}}),o.Browser.vml=!o.Browser.svg&&function(){try{var t=e.createElement("div");t.innerHTML='<v:shape adj="1"/>';var i=t.firstChild;return i.style.behavior="url(#default#VML)",i&&"object"==typeof i.adj}catch(n){return!1}}(),o.Path=o.Browser.svg||!o.Browser.vml?o.Path:o.Path.extend({statics:{VML:!0,CLIP_PADDING:.02},_createElement:function(){try{return e.namespaces.add("lvml","urn:schemas-microsoft-com:vml"),function(t){return e.createElement("<lvml:"+t+' class="lvml">')}}catch(t){return function(t){return e.createElement("<"+t+' xmlns="urn:schemas-microsoft.com:vml" class="lvml">')}}}(),_initPath:function(){var t=this._container=this._createElement("shape");o.DomUtil.addClass(t,"leaflet-vml-shape"+(this.options.className?" "+this.options.className:"")),this.options.clickable&&o.DomUtil.addClass(t,"leaflet-clickable"),t.coordsize="1 1",this._path=this._createElement("path"),t.appendChild(this._path),this._map._pathRoot.appendChild(t)},_initStyle:function(){this._updateStyle()},_updateStyle:function(){var t=this._stroke,e=this._fill,i=this.options,n=this._container;n.stroked=i.stroke,n.filled=i.fill,i.stroke?(t||(t=this._stroke=this._createElement("stroke"),t.endcap="round",n.appendChild(t)),t.weight=i.weight+"px",t.color=i.color,t.opacity=i.opacity,t.dashStyle=i.dashArray?o.Util.isArray(i.dashArray)?i.dashArray.join(" "):i.dashArray.replace(/( *, *)/g," "):"",i.lineCap&&(t.endcap=i.lineCap.replace("butt","flat")),i.lineJoin&&(t.joinstyle=i.lineJoin)):t&&(n.removeChild(t),this._stroke=null),i.fill?(e||(e=this._fill=this._createElement("fill"),n.appendChild(e)),e.color=i.fillColor||i.color,e.opacity=i.fillOpacity):e&&(n.removeChild(e),this._fill=null)},_updatePath:function(){var t=this._container.style;t.display="none",this._path.v=this.getPathString()+" ",t.display=""}}),o.Map.include(o.Browser.svg||!o.Browser.vml?{}:{_initPathRoot:function(){if(!this._pathRoot){var t=this._pathRoot=e.createElement("div");t.className="leaflet-vml-container",this._panes.overlayPane.appendChild(t),this.on("moveend",this._updatePathViewport),this._updatePathViewport()}}}),o.Browser.canvas=function(){return!!e.createElement("canvas").getContext}(),o.Path=o.Path.SVG&&!t.L_PREFER_CANVAS||!o.Browser.canvas?o.Path:o.Path.extend({statics:{CANVAS:!0,SVG:!1},redraw:function(){return this._map&&(this.projectLatlngs(),this._requestUpdate()),this},setStyle:function(t){return o.setOptions(this,t),this._map&&(this._updateStyle(),this._requestUpdate()),this},onRemove:function(t){t.off("viewreset",this.projectLatlngs,this).off("moveend",this._updatePath,this),this.options.clickable&&(this._map.off("click",this._onClick,this),this._map.off("mousemove",this._onMouseMove,this)),this._requestUpdate(),this._map=null},_requestUpdate:function(){this._map&&!o.Path._updateRequest&&(o.Path._updateRequest=o.Util.requestAnimFrame(this._fireMapMoveEnd,this._map))},_fireMapMoveEnd:function(){o.Path._updateRequest=null,this.fire("moveend")},_initElements:function(){this._map._initPathRoot(),this._ctx=this._map._canvasCtx},_updateStyle:function(){var t=this.options;t.stroke&&(this._ctx.lineWidth=t.weight,this._ctx.strokeStyle=t.color),t.fill&&(this._ctx.fillStyle=t.fillColor||t.color)},_drawPath:function(){var t,e,i,n,s,a;for(this._ctx.beginPath(),t=0,i=this._parts.length;i>t;t++){for(e=0,n=this._parts[t].length;n>e;e++)s=this._parts[t][e],a=(0===e?"move":"line")+"To",this._ctx[a](s.x,s.y);this instanceof o.Polygon&&this._ctx.closePath()}},_checkIfEmpty:function(){return!this._parts.length},_updatePath:function(){if(!this._checkIfEmpty()){var t=this._ctx,e=this.options;this._drawPath(),t.save(),this._updateStyle(),e.fill&&(t.globalAlpha=e.fillOpacity,t.fill()),e.stroke&&(t.globalAlpha=e.opacity,t.stroke()),t.restore()}},_initEvents:function(){this.options.clickable&&(this._map.on("mousemove",this._onMouseMove,this),this._map.on("click",this._onClick,this))},_onClick:function(t){this._containsPoint(t.layerPoint)&&this.fire("click",t)},_onMouseMove:function(t){this._map&&!this._map._animatingZoom&&(this._containsPoint(t.layerPoint)?(this._ctx.canvas.style.cursor="pointer",this._mouseInside=!0,this.fire("mouseover",t)):this._mouseInside&&(this._ctx.canvas.style.cursor="",this._mouseInside=!1,this.fire("mouseout",t)))}}),o.Map.include(o.Path.SVG&&!t.L_PREFER_CANVAS||!o.Browser.canvas?{}:{_initPathRoot:function(){var t,i=this._pathRoot;i||(i=this._pathRoot=e.createElement("canvas"),i.style.position="absolute",t=this._canvasCtx=i.getContext("2d"),t.lineCap="round",t.lineJoin="round",this._panes.overlayPane.appendChild(i),this.options.zoomAnimation&&(this._pathRoot.className="leaflet-zoom-animated",this.on("zoomanim",this._animatePathZoom),this.on("zoomend",this._endPathZoom)),this.on("moveend",this._updateCanvasViewport),this._updateCanvasViewport())},_updateCanvasViewport:function(){if(!this._pathZooming){this._updatePathViewport();var t=this._pathViewport,e=t.min,i=t.max.subtract(e),n=this._pathRoot;o.DomUtil.setPosition(n,e),n.width=i.x,n.height=i.y,n.getContext("2d").translate(-e.x,-e.y)}}}),o.LineUtil={simplify:function(t,e){if(!e||!t.length)return t.slice();var i=e*e;return t=this._reducePoints(t,i),t=this._simplifyDP(t,i)},pointToSegmentDistance:function(t,e,i){return Math.sqrt(this._sqClosestPointOnSegment(t,e,i,!0))},closestPointOnSegment:function(t,e,i){return this._sqClosestPointOnSegment(t,e,i)},_simplifyDP:function(t,e){var n=t.length,o=typeof Uint8Array!=i+""?Uint8Array:Array,s=new o(n);s[0]=s[n-1]=1,this._simplifyDPStep(t,s,e,0,n-1);var a,r=[];for(a=0;n>a;a++)s[a]&&r.push(t[a]);return r},_simplifyDPStep:function(t,e,i,n,o){var s,a,r,h=0;for(a=n+1;o-1>=a;a++)r=this._sqClosestPointOnSegment(t[a],t[n],t[o],!0),r>h&&(s=a,h=r);h>i&&(e[s]=1,this._simplifyDPStep(t,e,i,n,s),this._simplifyDPStep(t,e,i,s,o))},_reducePoints:function(t,e){for(var i=[t[0]],n=1,o=0,s=t.length;s>n;n++)this._sqDist(t[n],t[o])>e&&(i.push(t[n]),o=n);return s-1>o&&i.push(t[s-1]),i},clipSegment:function(t,e,i,n){var o,s,a,r=n?this._lastCode:this._getBitCode(t,i),h=this._getBitCode(e,i);for(this._lastCode=h;;){if(!(r|h))return[t,e];if(r&h)return!1;o=r||h,s=this._getEdgeIntersection(t,e,o,i),a=this._getBitCode(s,i),o===r?(t=s,r=a):(e=s,h=a)}},_getEdgeIntersection:function(t,e,i,n){var s=e.x-t.x,a=e.y-t.y,r=n.min,h=n.max;return 8&i?new o.Point(t.x+s*(h.y-t.y)/a,h.y):4&i?new o.Point(t.x+s*(r.y-t.y)/a,r.y):2&i?new o.Point(h.x,t.y+a*(h.x-t.x)/s):1&i?new o.Point(r.x,t.y+a*(r.x-t.x)/s):void 0},_getBitCode:function(t,e){var i=0;return t.x<e.min.x?i|=1:t.x>e.max.x&&(i|=2),t.y<e.min.y?i|=4:t.y>e.max.y&&(i|=8),i},_sqDist:function(t,e){var i=e.x-t.x,n=e.y-t.y;return i*i+n*n},_sqClosestPointOnSegment:function(t,e,i,n){var s,a=e.x,r=e.y,h=i.x-a,l=i.y-r,u=h*h+l*l;return u>0&&(s=((t.x-a)*h+(t.y-r)*l)/u,s>1?(a=i.x,r=i.y):s>0&&(a+=h*s,r+=l*s)),h=t.x-a,l=t.y-r,n?h*h+l*l:new o.Point(a,r)}},o.Polyline=o.Path.extend({initialize:function(t,e){o.Path.prototype.initialize.call(this,e),this._latlngs=this._convertLatLngs(t)},options:{smoothFactor:1,noClip:!1},projectLatlngs:function(){this._originalPoints=[];for(var t=0,e=this._latlngs.length;e>t;t++)this._originalPoints[t]=this._map.latLngToLayerPoint(this._latlngs[t])},getPathString:function(){for(var t=0,e=this._parts.length,i="";e>t;t++)i+=this._getPathPartStr(this._parts[t]);return i},getLatLngs:function(){return this._latlngs},setLatLngs:function(t){return this._latlngs=this._convertLatLngs(t),this.redraw()},addLatLng:function(t){return this._latlngs.push(o.latLng(t)),this.redraw()},spliceLatLngs:function(){var t=[].splice.apply(this._latlngs,arguments);return this._convertLatLngs(this._latlngs,!0),this.redraw(),t},closestLayerPoint:function(t){for(var e,i,n=1/0,s=this._parts,a=null,r=0,h=s.length;h>r;r++)for(var l=s[r],u=1,c=l.length;c>u;u++){e=l[u-1],i=l[u];var d=o.LineUtil._sqClosestPointOnSegment(t,e,i,!0);n>d&&(n=d,a=o.LineUtil._sqClosestPointOnSegment(t,e,i))}return a&&(a.distance=Math.sqrt(n)),a},getBounds:function(){return new o.LatLngBounds(this.getLatLngs())},_convertLatLngs:function(t,e){var i,n,s=e?t:[];for(i=0,n=t.length;n>i;i++){if(o.Util.isArray(t[i])&&"number"!=typeof t[i][0])return;s[i]=o.latLng(t[i])}return s},_initEvents:function(){o.Path.prototype._initEvents.call(this)},_getPathPartStr:function(t){for(var e,i=o.Path.VML,n=0,s=t.length,a="";s>n;n++)e=t[n],i&&e._round(),a+=(n?"L":"M")+e.x+" "+e.y;return a},_clipPoints:function(){var t,e,i,n=this._originalPoints,s=n.length;if(this.options.noClip)return void(this._parts=[n]);this._parts=[];var a=this._parts,r=this._map._pathViewport,h=o.LineUtil;for(t=0,e=0;s-1>t;t++)i=h.clipSegment(n[t],n[t+1],r,t),i&&(a[e]=a[e]||[],a[e].push(i[0]),(i[1]!==n[t+1]||t===s-2)&&(a[e].push(i[1]),e++))},_simplifyPoints:function(){for(var t=this._parts,e=o.LineUtil,i=0,n=t.length;n>i;i++)t[i]=e.simplify(t[i],this.options.smoothFactor)},_updatePath:function(){this._map&&(this._clipPoints(),this._simplifyPoints(),o.Path.prototype._updatePath.call(this))}}),o.polyline=function(t,e){return new o.Polyline(t,e)},o.PolyUtil={},o.PolyUtil.clipPolygon=function(t,e){var i,n,s,a,r,h,l,u,c,d=[1,4,2,8],p=o.LineUtil;for(n=0,l=t.length;l>n;n++)t[n]._code=p._getBitCode(t[n],e);for(a=0;4>a;a++){for(u=d[a],i=[],n=0,l=t.length,s=l-1;l>n;s=n++)r=t[n],h=t[s],r._code&u?h._code&u||(c=p._getEdgeIntersection(h,r,u,e),c._code=p._getBitCode(c,e),i.push(c)):(h._code&u&&(c=p._getEdgeIntersection(h,r,u,e),c._code=p._getBitCode(c,e),i.push(c)),i.push(r));t=i}return t},o.Polygon=o.Polyline.extend({options:{fill:!0},initialize:function(t,e){o.Polyline.prototype.initialize.call(this,t,e),this._initWithHoles(t)},_initWithHoles:function(t){var e,i,n;if(t&&o.Util.isArray(t[0])&&"number"!=typeof t[0][0])for(this._latlngs=this._convertLatLngs(t[0]),this._holes=t.slice(1),e=0,i=this._holes.length;i>e;e++)n=this._holes[e]=this._convertLatLngs(this._holes[e]),n[0].equals(n[n.length-1])&&n.pop();t=this._latlngs,t.length>=2&&t[0].equals(t[t.length-1])&&t.pop()},projectLatlngs:function(){if(o.Polyline.prototype.projectLatlngs.call(this),this._holePoints=[],this._holes){var t,e,i,n;for(t=0,i=this._holes.length;i>t;t++)for(this._holePoints[t]=[],e=0,n=this._holes[t].length;n>e;e++)this._holePoints[t][e]=this._map.latLngToLayerPoint(this._holes[t][e])}},setLatLngs:function(t){return t&&o.Util.isArray(t[0])&&"number"!=typeof t[0][0]?(this._initWithHoles(t),this.redraw()):o.Polyline.prototype.setLatLngs.call(this,t)},_clipPoints:function(){var t=this._originalPoints,e=[];if(this._parts=[t].concat(this._holePoints),!this.options.noClip){for(var i=0,n=this._parts.length;n>i;i++){var s=o.PolyUtil.clipPolygon(this._parts[i],this._map._pathViewport);s.length&&e.push(s)}this._parts=e}},_getPathPartStr:function(t){var e=o.Polyline.prototype._getPathPartStr.call(this,t);return e+(o.Browser.svg?"z":"x")}}),o.polygon=function(t,e){return new o.Polygon(t,e)},function(){function t(t){return o.FeatureGroup.extend({initialize:function(t,e){this._layers={},this._options=e,this.setLatLngs(t)},setLatLngs:function(e){var i=0,n=e.length;for(this.eachLayer(function(t){n>i?t.setLatLngs(e[i++]):this.removeLayer(t)},this);n>i;)this.addLayer(new t(e[i++],this._options));return this},getLatLngs:function(){var t=[];return this.eachLayer(function(e){t.push(e.getLatLngs())}),t}})}o.MultiPolyline=t(o.Polyline),o.MultiPolygon=t(o.Polygon),o.multiPolyline=function(t,e){return new o.MultiPolyline(t,e)},o.multiPolygon=function(t,e){return new o.MultiPolygon(t,e)}}(),o.Rectangle=o.Polygon.extend({initialize:function(t,e){o.Polygon.prototype.initialize.call(this,this._boundsToLatLngs(t),e)},setBounds:function(t){this.setLatLngs(this._boundsToLatLngs(t))},_boundsToLatLngs:function(t){return t=o.latLngBounds(t),[t.getSouthWest(),t.getNorthWest(),t.getNorthEast(),t.getSouthEast()]}}),o.rectangle=function(t,e){return new o.Rectangle(t,e)},o.Circle=o.Path.extend({initialize:function(t,e,i){o.Path.prototype.initialize.call(this,i),this._latlng=o.latLng(t),this._mRadius=e},options:{fill:!0},setLatLng:function(t){return this._latlng=o.latLng(t),this.redraw()},setRadius:function(t){return this._mRadius=t,this.redraw()},projectLatlngs:function(){var t=this._getLngRadius(),e=this._latlng,i=this._map.latLngToLayerPoint([e.lat,e.lng-t]);this._point=this._map.latLngToLayerPoint(e),this._radius=Math.max(this._point.x-i.x,1)},getBounds:function(){var t=this._getLngRadius(),e=this._mRadius/40075017*360,i=this._latlng;return new o.LatLngBounds([i.lat-e,i.lng-t],[i.lat+e,i.lng+t])},getLatLng:function(){return this._latlng},getPathString:function(){var t=this._point,e=this._radius;return this._checkIfEmpty()?"":o.Browser.svg?"M"+t.x+","+(t.y-e)+"A"+e+","+e+",0,1,1,"+(t.x-.1)+","+(t.y-e)+" z":(t._round(),e=Math.round(e),"AL "+t.x+","+t.y+" "+e+","+e+" 0,23592600")},getRadius:function(){return this._mRadius},_getLatRadius:function(){return this._mRadius/40075017*360},_getLngRadius:function(){return this._getLatRadius()/Math.cos(o.LatLng.DEG_TO_RAD*this._latlng.lat)},_checkIfEmpty:function(){if(!this._map)return!1;var t=this._map._pathViewport,e=this._radius,i=this._point;return i.x-e>t.max.x||i.y-e>t.max.y||i.x+e<t.min.x||i.y+e<t.min.y}}),o.circle=function(t,e,i){return new o.Circle(t,e,i)},o.CircleMarker=o.Circle.extend({options:{radius:10,weight:2},initialize:function(t,e){o.Circle.prototype.initialize.call(this,t,null,e),this._radius=this.options.radius},projectLatlngs:function(){this._point=this._map.latLngToLayerPoint(this._latlng)},_updateStyle:function(){o.Circle.prototype._updateStyle.call(this),this.setRadius(this.options.radius)},setLatLng:function(t){return o.Circle.prototype.setLatLng.call(this,t),this._popup&&this._popup._isOpen&&this._popup.setLatLng(t),this},setRadius:function(t){return this.options.radius=this._radius=t,this.redraw()},getRadius:function(){return this._radius}}),o.circleMarker=function(t,e){return new o.CircleMarker(t,e)},o.Polyline.include(o.Path.CANVAS?{_containsPoint:function(t,e){var i,n,s,a,r,h,l,u=this.options.weight/2;for(o.Browser.touch&&(u+=10),i=0,a=this._parts.length;a>i;i++)for(l=this._parts[i],n=0,r=l.length,s=r-1;r>n;s=n++)if((e||0!==n)&&(h=o.LineUtil.pointToSegmentDistance(t,l[s],l[n]),u>=h))return!0;return!1}}:{}),o.Polygon.include(o.Path.CANVAS?{_containsPoint:function(t){var e,i,n,s,a,r,h,l,u=!1;if(o.Polyline.prototype._containsPoint.call(this,t,!0))return!0;for(s=0,h=this._parts.length;h>s;s++)for(e=this._parts[s],a=0,l=e.length,r=l-1;l>a;r=a++)i=e[a],n=e[r],i.y>t.y!=n.y>t.y&&t.x<(n.x-i.x)*(t.y-i.y)/(n.y-i.y)+i.x&&(u=!u);return u}}:{}),o.Circle.include(o.Path.CANVAS?{_drawPath:function(){var t=this._point;this._ctx.beginPath(),this._ctx.arc(t.x,t.y,this._radius,0,2*Math.PI,!1)},_containsPoint:function(t){var e=this._point,i=this.options.stroke?this.options.weight/2:0;return t.distanceTo(e)<=this._radius+i}}:{}),o.CircleMarker.include(o.Path.CANVAS?{_updateStyle:function(){o.Path.prototype._updateStyle.call(this)}}:{}),o.GeoJSON=o.FeatureGroup.extend({initialize:function(t,e){o.setOptions(this,e),this._layers={},t&&this.addData(t)},addData:function(t){var e,i,n,s=o.Util.isArray(t)?t:t.features;if(s){for(e=0,i=s.length;i>e;e++)n=s[e],(n.geometries||n.geometry||n.features||n.coordinates)&&this.addData(s[e]);return this}var a=this.options;if(!a.filter||a.filter(t)){var r=o.GeoJSON.geometryToLayer(t,a.pointToLayer,a.coordsToLatLng,a);return r.feature=o.GeoJSON.asFeature(t),r.defaultOptions=r.options,this.resetStyle(r),a.onEachFeature&&a.onEachFeature(t,r),this.addLayer(r)}},resetStyle:function(t){var e=this.options.style;e&&(o.Util.extend(t.options,t.defaultOptions),this._setLayerStyle(t,e))},setStyle:function(t){this.eachLayer(function(e){this._setLayerStyle(e,t)},this)},_setLayerStyle:function(t,e){"function"==typeof e&&(e=e(t.feature)),t.setStyle&&t.setStyle(e)}}),o.extend(o.GeoJSON,{geometryToLayer:function(t,e,i,n){var s,a,r,h,l="Feature"===t.type?t.geometry:t,u=l.coordinates,c=[];switch(i=i||this.coordsToLatLng,l.type){case"Point":return s=i(u),e?e(t,s):new o.Marker(s);case"MultiPoint":for(r=0,h=u.length;h>r;r++)s=i(u[r]),c.push(e?e(t,s):new o.Marker(s));return new o.FeatureGroup(c);case"LineString":return a=this.coordsToLatLngs(u,0,i),new o.Polyline(a,n);case"Polygon":if(2===u.length&&!u[1].length)throw new Error("Invalid GeoJSON object.");return a=this.coordsToLatLngs(u,1,i),new o.Polygon(a,n);case"MultiLineString":return a=this.coordsToLatLngs(u,1,i),new o.MultiPolyline(a,n);case"MultiPolygon":return a=this.coordsToLatLngs(u,2,i),new o.MultiPolygon(a,n);case"GeometryCollection":for(r=0,h=l.geometries.length;h>r;r++)c.push(this.geometryToLayer({geometry:l.geometries[r],type:"Feature",properties:t.properties},e,i,n));return new o.FeatureGroup(c);default:throw new Error("Invalid GeoJSON object.")}},coordsToLatLng:function(t){return new o.LatLng(t[1],t[0],t[2])},coordsToLatLngs:function(t,e,i){var n,o,s,a=[];for(o=0,s=t.length;s>o;o++)n=e?this.coordsToLatLngs(t[o],e-1,i):(i||this.coordsToLatLng)(t[o]),a.push(n);return a},latLngToCoords:function(t){var e=[t.lng,t.lat];return t.alt!==i&&e.push(t.alt),e},latLngsToCoords:function(t){for(var e=[],i=0,n=t.length;n>i;i++)e.push(o.GeoJSON.latLngToCoords(t[i]));return e},getFeature:function(t,e){return t.feature?o.extend({},t.feature,{geometry:e}):o.GeoJSON.asFeature(e)},asFeature:function(t){return"Feature"===t.type?t:{type:"Feature",properties:{},geometry:t}}});var a={toGeoJSON:function(){return o.GeoJSON.getFeature(this,{type:"Point",coordinates:o.GeoJSON.latLngToCoords(this.getLatLng())})}};o.Marker.include(a),o.Circle.include(a),o.CircleMarker.include(a),o.Polyline.include({toGeoJSON:function(){return o.GeoJSON.getFeature(this,{type:"LineString",coordinates:o.GeoJSON.latLngsToCoords(this.getLatLngs())})}}),o.Polygon.include({toGeoJSON:function(){var t,e,i,n=[o.GeoJSON.latLngsToCoords(this.getLatLngs())];if(n[0].push(n[0][0]),this._holes)for(t=0,e=this._holes.length;e>t;t++)i=o.GeoJSON.latLngsToCoords(this._holes[t]),i.push(i[0]),n.push(i);return o.GeoJSON.getFeature(this,{type:"Polygon",coordinates:n})}}),function(){function t(t){return function(){var e=[];return this.eachLayer(function(t){e.push(t.toGeoJSON().geometry.coordinates)}),o.GeoJSON.getFeature(this,{type:t,coordinates:e})}}o.MultiPolyline.include({toGeoJSON:t("MultiLineString")}),o.MultiPolygon.include({toGeoJSON:t("MultiPolygon")}),o.LayerGroup.include({toGeoJSON:function(){var e,i=this.feature&&this.feature.geometry,n=[];if(i&&"MultiPoint"===i.type)return t("MultiPoint").call(this);var s=i&&"GeometryCollection"===i.type;return this.eachLayer(function(t){t.toGeoJSON&&(e=t.toGeoJSON(),n.push(s?e.geometry:o.GeoJSON.asFeature(e)))}),s?o.GeoJSON.getFeature(this,{geometries:n,type:"GeometryCollection"}):{type:"FeatureCollection",features:n}}})}(),o.geoJson=function(t,e){return new o.GeoJSON(t,e)},o.DomEvent={addListener:function(t,e,i,n){var s,a,r,h=o.stamp(i),l="_leaflet_"+e+h;return t[l]?this:(s=function(e){return i.call(n||t,e||o.DomEvent._getEvent())},o.Browser.pointer&&0===e.indexOf("touch")?this.addPointerListener(t,e,s,h):(o.Browser.touch&&"dblclick"===e&&this.addDoubleTapListener&&this.addDoubleTapListener(t,s,h),"addEventListener"in t?"mousewheel"===e?(t.addEventListener("DOMMouseScroll",s,!1),t.addEventListener(e,s,!1)):"mouseenter"===e||"mouseleave"===e?(a=s,r="mouseenter"===e?"mouseover":"mouseout",s=function(e){return o.DomEvent._checkMouse(t,e)?a(e):void 0},t.addEventListener(r,s,!1)):"click"===e&&o.Browser.android?(a=s,s=function(t){return o.DomEvent._filterClick(t,a)},t.addEventListener(e,s,!1)):t.addEventListener(e,s,!1):"attachEvent"in t&&t.attachEvent("on"+e,s),t[l]=s,this))},removeListener:function(t,e,i){var n=o.stamp(i),s="_leaflet_"+e+n,a=t[s];return a?(o.Browser.pointer&&0===e.indexOf("touch")?this.removePointerListener(t,e,n):o.Browser.touch&&"dblclick"===e&&this.removeDoubleTapListener?this.removeDoubleTapListener(t,n):"removeEventListener"in t?"mousewheel"===e?(t.removeEventListener("DOMMouseScroll",a,!1),t.removeEventListener(e,a,!1)):"mouseenter"===e||"mouseleave"===e?t.removeEventListener("mouseenter"===e?"mouseover":"mouseout",a,!1):t.removeEventListener(e,a,!1):"detachEvent"in t&&t.detachEvent("on"+e,a),t[s]=null,this):this},stopPropagation:function(t){return t.stopPropagation?t.stopPropagation():t.cancelBubble=!0,o.DomEvent._skipped(t),this},disableScrollPropagation:function(t){var e=o.DomEvent.stopPropagation;return o.DomEvent.on(t,"mousewheel",e).on(t,"MozMousePixelScroll",e)},disableClickPropagation:function(t){for(var e=o.DomEvent.stopPropagation,i=o.Draggable.START.length-1;i>=0;i--)o.DomEvent.on(t,o.Draggable.START[i],e);return o.DomEvent.on(t,"click",o.DomEvent._fakeStop).on(t,"dblclick",e)},preventDefault:function(t){return t.preventDefault?t.preventDefault():t.returnValue=!1,this},stop:function(t){return o.DomEvent.preventDefault(t).stopPropagation(t)},getMousePosition:function(t,e){if(!e)return new o.Point(t.clientX,t.clientY);var i=e.getBoundingClientRect();return new o.Point(t.clientX-i.left-e.clientLeft,t.clientY-i.top-e.clientTop)},getWheelDelta:function(t){var e=0;return t.wheelDelta&&(e=t.wheelDelta/120),t.detail&&(e=-t.detail/3),e},_skipEvents:{},_fakeStop:function(t){o.DomEvent._skipEvents[t.type]=!0},_skipped:function(t){var e=this._skipEvents[t.type];return this._skipEvents[t.type]=!1,e},_checkMouse:function(t,e){var i=e.relatedTarget;if(!i)return!0;try{for(;i&&i!==t;)i=i.parentNode}catch(n){return!1}return i!==t},_getEvent:function(){var e=t.event;if(!e)for(var i=arguments.callee.caller;i&&(e=i.arguments[0],!e||t.Event!==e.constructor);)i=i.caller;return e},_filterClick:function(t,e){var i=t.timeStamp||t.originalEvent.timeStamp,n=o.DomEvent._lastClick&&i-o.DomEvent._lastClick;return n&&n>100&&1e3>n||t.target._simulatedClick&&!t._simulated?void o.DomEvent.stop(t):(o.DomEvent._lastClick=i,e(t))}},o.DomEvent.on=o.DomEvent.addListener,o.DomEvent.off=o.DomEvent.removeListener,o.Draggable=o.Class.extend({includes:o.Mixin.Events,statics:{START:o.Browser.touch?["touchstart","mousedown"]:["mousedown"],END:{mousedown:"mouseup",touchstart:"touchend",pointerdown:"touchend",MSPointerDown:"touchend"},MOVE:{mousedown:"mousemove",touchstart:"touchmove",pointerdown:"touchmove",MSPointerDown:"touchmove"}},initialize:function(t,e){this._element=t,this._dragStartTarget=e||t},enable:function(){if(!this._enabled){for(var t=o.Draggable.START.length-1;t>=0;t--)o.DomEvent.on(this._dragStartTarget,o.Draggable.START[t],this._onDown,this);this._enabled=!0}},disable:function(){if(this._enabled){for(var t=o.Draggable.START.length-1;t>=0;t--)o.DomEvent.off(this._dragStartTarget,o.Draggable.START[t],this._onDown,this);this._enabled=!1,this._moved=!1}},_onDown:function(t){if(this._moved=!1,!(t.shiftKey||1!==t.which&&1!==t.button&&!t.touches||(o.DomEvent.stopPropagation(t),o.Draggable._disabled||(o.DomUtil.disableImageDrag(),o.DomUtil.disableTextSelection(),this._moving)))){var i=t.touches?t.touches[0]:t;this._startPoint=new o.Point(i.clientX,i.clientY),this._startPos=this._newPos=o.DomUtil.getPosition(this._element),o.DomEvent.on(e,o.Draggable.MOVE[t.type],this._onMove,this).on(e,o.Draggable.END[t.type],this._onUp,this)}},_onMove:function(t){if(t.touches&&t.touches.length>1)return void(this._moved=!0);var i=t.touches&&1===t.touches.length?t.touches[0]:t,n=new o.Point(i.clientX,i.clientY),s=n.subtract(this._startPoint);(s.x||s.y)&&(o.DomEvent.preventDefault(t),this._moved||(this.fire("dragstart"),this._moved=!0,this._startPos=o.DomUtil.getPosition(this._element).subtract(s),o.DomUtil.addClass(e.body,"leaflet-dragging"),o.DomUtil.addClass(t.target||t.srcElement,"leaflet-drag-target")),this._newPos=this._startPos.add(s),this._moving=!0,o.Util.cancelAnimFrame(this._animRequest),this._animRequest=o.Util.requestAnimFrame(this._updatePosition,this,!0,this._dragStartTarget))},_updatePosition:function(){this.fire("predrag"),o.DomUtil.setPosition(this._element,this._newPos),this.fire("drag")},_onUp:function(t){o.DomUtil.removeClass(e.body,"leaflet-dragging"),o.DomUtil.removeClass(t.target||t.srcElement,"leaflet-drag-target");for(var i in o.Draggable.MOVE)o.DomEvent.off(e,o.Draggable.MOVE[i],this._onMove).off(e,o.Draggable.END[i],this._onUp);o.DomUtil.enableImageDrag(),o.DomUtil.enableTextSelection(),this._moved&&this._moving&&(o.Util.cancelAnimFrame(this._animRequest),this.fire("dragend",{distance:this._newPos.distanceTo(this._startPos)})),this._moving=!1}}),o.Handler=o.Class.extend({initialize:function(t){this._map=t},enable:function(){this._enabled||(this._enabled=!0,this.addHooks())},disable:function(){this._enabled&&(this._enabled=!1,this.removeHooks())},enabled:function(){return!!this._enabled}}),o.Map.mergeOptions({dragging:!0,inertia:!o.Browser.android23,inertiaDeceleration:3400,inertiaMaxSpeed:1/0,inertiaThreshold:o.Browser.touch?32:18,easeLinearity:.25,worldCopyJump:!1}),o.Map.Drag=o.Handler.extend({addHooks:function(){if(!this._draggable){var t=this._map;this._draggable=new o.Draggable(t._mapPane,t._container),this._draggable.on({dragstart:this._onDragStart,drag:this._onDrag,dragend:this._onDragEnd},this),t.options.worldCopyJump&&(this._draggable.on("predrag",this._onPreDrag,this),t.on("viewreset",this._onViewReset,this),t.whenReady(this._onViewReset,this))}this._draggable.enable()},removeHooks:function(){this._draggable.disable()},moved:function(){return this._draggable&&this._draggable._moved},_onDragStart:function(){var t=this._map;t._panAnim&&t._panAnim.stop(),t.fire("movestart").fire("dragstart"),t.options.inertia&&(this._positions=[],this._times=[])},_onDrag:function(){if(this._map.options.inertia){var t=this._lastTime=+new Date,e=this._lastPos=this._draggable._newPos;this._positions.push(e),this._times.push(t),t-this._times[0]>200&&(this._positions.shift(),this._times.shift())}this._map.fire("move").fire("drag")},_onViewReset:function(){var t=this._map.getSize()._divideBy(2),e=this._map.latLngToLayerPoint([0,0]);this._initialWorldOffset=e.subtract(t).x,this._worldWidth=this._map.project([0,180]).x},_onPreDrag:function(){var t=this._worldWidth,e=Math.round(t/2),i=this._initialWorldOffset,n=this._draggable._newPos.x,o=(n-e+i)%t+e-i,s=(n+e+i)%t-e-i,a=Math.abs(o+i)<Math.abs(s+i)?o:s;this._draggable._newPos.x=a},_onDragEnd:function(t){var e=this._map,i=e.options,n=+new Date-this._lastTime,s=!i.inertia||n>i.inertiaThreshold||!this._positions[0];if(e.fire("dragend",t),s)e.fire("moveend");else{var a=this._lastPos.subtract(this._positions[0]),r=(this._lastTime+n-this._times[0])/1e3,h=i.easeLinearity,l=a.multiplyBy(h/r),u=l.distanceTo([0,0]),c=Math.min(i.inertiaMaxSpeed,u),d=l.multiplyBy(c/u),p=c/(i.inertiaDeceleration*h),_=d.multiplyBy(-p/2).round();_.x&&_.y?(_=e._limitOffset(_,e.options.maxBounds),o.Util.requestAnimFrame(function(){e.panBy(_,{duration:p,easeLinearity:h,noMoveStart:!0})})):e.fire("moveend")}}}),o.Map.addInitHook("addHandler","dragging",o.Map.Drag),o.Map.mergeOptions({doubleClickZoom:!0}),o.Map.DoubleClickZoom=o.Handler.extend({addHooks:function(){this._map.on("dblclick",this._onDoubleClick,this)},removeHooks:function(){this._map.off("dblclick",this._onDoubleClick,this)},_onDoubleClick:function(t){var e=this._map,i=e.getZoom()+(t.originalEvent.shiftKey?-1:1);"center"===e.options.doubleClickZoom?e.setZoom(i):e.setZoomAround(t.containerPoint,i)}}),o.Map.addInitHook("addHandler","doubleClickZoom",o.Map.DoubleClickZoom),o.Map.mergeOptions({scrollWheelZoom:!0}),o.Map.ScrollWheelZoom=o.Handler.extend({addHooks:function(){o.DomEvent.on(this._map._container,"mousewheel",this._onWheelScroll,this),o.DomEvent.on(this._map._container,"MozMousePixelScroll",o.DomEvent.preventDefault),this._delta=0},removeHooks:function(){o.DomEvent.off(this._map._container,"mousewheel",this._onWheelScroll),o.DomEvent.off(this._map._container,"MozMousePixelScroll",o.DomEvent.preventDefault)},_onWheelScroll:function(t){var e=o.DomEvent.getWheelDelta(t);this._delta+=e,this._lastMousePos=this._map.mouseEventToContainerPoint(t),this._startTime||(this._startTime=+new Date);var i=Math.max(40-(+new Date-this._startTime),0);clearTimeout(this._timer),this._timer=setTimeout(o.bind(this._performZoom,this),i),o.DomEvent.preventDefault(t),o.DomEvent.stopPropagation(t)},_performZoom:function(){var t=this._map,e=this._delta,i=t.getZoom();e=e>0?Math.ceil(e):Math.floor(e),e=Math.max(Math.min(e,4),-4),e=t._limitZoom(i+e)-i,this._delta=0,this._startTime=null,e&&("center"===t.options.scrollWheelZoom?t.setZoom(i+e):t.setZoomAround(this._lastMousePos,i+e))}}),o.Map.addInitHook("addHandler","scrollWheelZoom",o.Map.ScrollWheelZoom),o.extend(o.DomEvent,{_touchstart:o.Browser.msPointer?"MSPointerDown":o.Browser.pointer?"pointerdown":"touchstart",_touchend:o.Browser.msPointer?"MSPointerUp":o.Browser.pointer?"pointerup":"touchend",addDoubleTapListener:function(t,i,n){function s(t){var e;if(o.Browser.pointer?(_.push(t.pointerId),e=_.length):e=t.touches.length,!(e>1)){var i=Date.now(),n=i-(r||i);h=t.touches?t.touches[0]:t,l=n>0&&u>=n,r=i}}function a(t){if(o.Browser.pointer){var e=_.indexOf(t.pointerId);if(-1===e)return;_.splice(e,1)}if(l){if(o.Browser.pointer){var n,s={};for(var a in h)n=h[a],s[a]="function"==typeof n?n.bind(h):n;h=s}h.type="dblclick",i(h),r=null}}var r,h,l=!1,u=250,c="_leaflet_",d=this._touchstart,p=this._touchend,_=[];t[c+d+n]=s,t[c+p+n]=a;var m=o.Browser.pointer?e.documentElement:t;return t.addEventListener(d,s,!1),m.addEventListener(p,a,!1),o.Browser.pointer&&m.addEventListener(o.DomEvent.POINTER_CANCEL,a,!1),this},removeDoubleTapListener:function(t,i){var n="_leaflet_";return t.removeEventListener(this._touchstart,t[n+this._touchstart+i],!1),(o.Browser.pointer?e.documentElement:t).removeEventListener(this._touchend,t[n+this._touchend+i],!1),o.Browser.pointer&&e.documentElement.removeEventListener(o.DomEvent.POINTER_CANCEL,t[n+this._touchend+i],!1),this}}),o.extend(o.DomEvent,{POINTER_DOWN:o.Browser.msPointer?"MSPointerDown":"pointerdown",POINTER_MOVE:o.Browser.msPointer?"MSPointerMove":"pointermove",POINTER_UP:o.Browser.msPointer?"MSPointerUp":"pointerup",POINTER_CANCEL:o.Browser.msPointer?"MSPointerCancel":"pointercancel",_pointers:[],_pointerDocumentListener:!1,addPointerListener:function(t,e,i,n){switch(e){case"touchstart":return this.addPointerListenerStart(t,e,i,n);case"touchend":return this.addPointerListenerEnd(t,e,i,n);case"touchmove":return this.addPointerListenerMove(t,e,i,n);default:throw"Unknown touch event type"}},addPointerListenerStart:function(t,i,n,s){var a="_leaflet_",r=this._pointers,h=function(t){o.DomEvent.preventDefault(t);for(var e=!1,i=0;i<r.length;i++)if(r[i].pointerId===t.pointerId){e=!0;break}e||r.push(t),t.touches=r.slice(),t.changedTouches=[t],n(t)};if(t[a+"touchstart"+s]=h,t.addEventListener(this.POINTER_DOWN,h,!1),!this._pointerDocumentListener){var l=function(t){for(var e=0;e<r.length;e++)if(r[e].pointerId===t.pointerId){r.splice(e,1);
break}};e.documentElement.addEventListener(this.POINTER_UP,l,!1),e.documentElement.addEventListener(this.POINTER_CANCEL,l,!1),this._pointerDocumentListener=!0}return this},addPointerListenerMove:function(t,e,i,n){function o(t){if(t.pointerType!==t.MSPOINTER_TYPE_MOUSE&&"mouse"!==t.pointerType||0!==t.buttons){for(var e=0;e<a.length;e++)if(a[e].pointerId===t.pointerId){a[e]=t;break}t.touches=a.slice(),t.changedTouches=[t],i(t)}}var s="_leaflet_",a=this._pointers;return t[s+"touchmove"+n]=o,t.addEventListener(this.POINTER_MOVE,o,!1),this},addPointerListenerEnd:function(t,e,i,n){var o="_leaflet_",s=this._pointers,a=function(t){for(var e=0;e<s.length;e++)if(s[e].pointerId===t.pointerId){s.splice(e,1);break}t.touches=s.slice(),t.changedTouches=[t],i(t)};return t[o+"touchend"+n]=a,t.addEventListener(this.POINTER_UP,a,!1),t.addEventListener(this.POINTER_CANCEL,a,!1),this},removePointerListener:function(t,e,i){var n="_leaflet_",o=t[n+e+i];switch(e){case"touchstart":t.removeEventListener(this.POINTER_DOWN,o,!1);break;case"touchmove":t.removeEventListener(this.POINTER_MOVE,o,!1);break;case"touchend":t.removeEventListener(this.POINTER_UP,o,!1),t.removeEventListener(this.POINTER_CANCEL,o,!1)}return this}}),o.Map.mergeOptions({touchZoom:o.Browser.touch&&!o.Browser.android23,bounceAtZoomLimits:!0}),o.Map.TouchZoom=o.Handler.extend({addHooks:function(){o.DomEvent.on(this._map._container,"touchstart",this._onTouchStart,this)},removeHooks:function(){o.DomEvent.off(this._map._container,"touchstart",this._onTouchStart,this)},_onTouchStart:function(t){var i=this._map;if(t.touches&&2===t.touches.length&&!i._animatingZoom&&!this._zooming){var n=i.mouseEventToLayerPoint(t.touches[0]),s=i.mouseEventToLayerPoint(t.touches[1]),a=i._getCenterLayerPoint();this._startCenter=n.add(s)._divideBy(2),this._startDist=n.distanceTo(s),this._moved=!1,this._zooming=!0,this._centerOffset=a.subtract(this._startCenter),i._panAnim&&i._panAnim.stop(),o.DomEvent.on(e,"touchmove",this._onTouchMove,this).on(e,"touchend",this._onTouchEnd,this),o.DomEvent.preventDefault(t)}},_onTouchMove:function(t){var e=this._map;if(t.touches&&2===t.touches.length&&this._zooming){var i=e.mouseEventToLayerPoint(t.touches[0]),n=e.mouseEventToLayerPoint(t.touches[1]);this._scale=i.distanceTo(n)/this._startDist,this._delta=i._add(n)._divideBy(2)._subtract(this._startCenter),1!==this._scale&&(e.options.bounceAtZoomLimits||!(e.getZoom()===e.getMinZoom()&&this._scale<1||e.getZoom()===e.getMaxZoom()&&this._scale>1))&&(this._moved||(o.DomUtil.addClass(e._mapPane,"leaflet-touching"),e.fire("movestart").fire("zoomstart"),this._moved=!0),o.Util.cancelAnimFrame(this._animRequest),this._animRequest=o.Util.requestAnimFrame(this._updateOnMove,this,!0,this._map._container),o.DomEvent.preventDefault(t))}},_updateOnMove:function(){var t=this._map,e=this._getScaleOrigin(),i=t.layerPointToLatLng(e),n=t.getScaleZoom(this._scale);t._animateZoom(i,n,this._startCenter,this._scale,this._delta)},_onTouchEnd:function(){if(!this._moved||!this._zooming)return void(this._zooming=!1);var t=this._map;this._zooming=!1,o.DomUtil.removeClass(t._mapPane,"leaflet-touching"),o.Util.cancelAnimFrame(this._animRequest),o.DomEvent.off(e,"touchmove",this._onTouchMove).off(e,"touchend",this._onTouchEnd);var i=this._getScaleOrigin(),n=t.layerPointToLatLng(i),s=t.getZoom(),a=t.getScaleZoom(this._scale)-s,r=a>0?Math.ceil(a):Math.floor(a),h=t._limitZoom(s+r),l=t.getZoomScale(h)/this._scale;t._animateZoom(n,h,i,l)},_getScaleOrigin:function(){var t=this._centerOffset.subtract(this._delta).divideBy(this._scale);return this._startCenter.add(t)}}),o.Map.addInitHook("addHandler","touchZoom",o.Map.TouchZoom),o.Map.mergeOptions({tap:!0,tapTolerance:15}),o.Map.Tap=o.Handler.extend({addHooks:function(){o.DomEvent.on(this._map._container,"touchstart",this._onDown,this)},removeHooks:function(){o.DomEvent.off(this._map._container,"touchstart",this._onDown,this)},_onDown:function(t){if(t.touches){if(o.DomEvent.preventDefault(t),this._fireClick=!0,t.touches.length>1)return this._fireClick=!1,void clearTimeout(this._holdTimeout);var i=t.touches[0],n=i.target;this._startPos=this._newPos=new o.Point(i.clientX,i.clientY),n.tagName&&"a"===n.tagName.toLowerCase()&&o.DomUtil.addClass(n,"leaflet-active"),this._holdTimeout=setTimeout(o.bind(function(){this._isTapValid()&&(this._fireClick=!1,this._onUp(),this._simulateEvent("contextmenu",i))},this),1e3),o.DomEvent.on(e,"touchmove",this._onMove,this).on(e,"touchend",this._onUp,this)}},_onUp:function(t){if(clearTimeout(this._holdTimeout),o.DomEvent.off(e,"touchmove",this._onMove,this).off(e,"touchend",this._onUp,this),this._fireClick&&t&&t.changedTouches){var i=t.changedTouches[0],n=i.target;n&&n.tagName&&"a"===n.tagName.toLowerCase()&&o.DomUtil.removeClass(n,"leaflet-active"),this._isTapValid()&&this._simulateEvent("click",i)}},_isTapValid:function(){return this._newPos.distanceTo(this._startPos)<=this._map.options.tapTolerance},_onMove:function(t){var e=t.touches[0];this._newPos=new o.Point(e.clientX,e.clientY)},_simulateEvent:function(i,n){var o=e.createEvent("MouseEvents");o._simulated=!0,n.target._simulatedClick=!0,o.initMouseEvent(i,!0,!0,t,1,n.screenX,n.screenY,n.clientX,n.clientY,!1,!1,!1,!1,0,null),n.target.dispatchEvent(o)}}),o.Browser.touch&&!o.Browser.pointer&&o.Map.addInitHook("addHandler","tap",o.Map.Tap),o.Map.mergeOptions({boxZoom:!0}),o.Map.BoxZoom=o.Handler.extend({initialize:function(t){this._map=t,this._container=t._container,this._pane=t._panes.overlayPane,this._moved=!1},addHooks:function(){o.DomEvent.on(this._container,"mousedown",this._onMouseDown,this)},removeHooks:function(){o.DomEvent.off(this._container,"mousedown",this._onMouseDown),this._moved=!1},moved:function(){return this._moved},_onMouseDown:function(t){return this._moved=!1,!t.shiftKey||1!==t.which&&1!==t.button?!1:(o.DomUtil.disableTextSelection(),o.DomUtil.disableImageDrag(),this._startLayerPoint=this._map.mouseEventToLayerPoint(t),void o.DomEvent.on(e,"mousemove",this._onMouseMove,this).on(e,"mouseup",this._onMouseUp,this).on(e,"keydown",this._onKeyDown,this))},_onMouseMove:function(t){this._moved||(this._box=o.DomUtil.create("div","leaflet-zoom-box",this._pane),o.DomUtil.setPosition(this._box,this._startLayerPoint),this._container.style.cursor="crosshair",this._map.fire("boxzoomstart"));var e=this._startLayerPoint,i=this._box,n=this._map.mouseEventToLayerPoint(t),s=n.subtract(e),a=new o.Point(Math.min(n.x,e.x),Math.min(n.y,e.y));o.DomUtil.setPosition(i,a),this._moved=!0,i.style.width=Math.max(0,Math.abs(s.x)-4)+"px",i.style.height=Math.max(0,Math.abs(s.y)-4)+"px"},_finish:function(){this._moved&&(this._pane.removeChild(this._box),this._container.style.cursor=""),o.DomUtil.enableTextSelection(),o.DomUtil.enableImageDrag(),o.DomEvent.off(e,"mousemove",this._onMouseMove).off(e,"mouseup",this._onMouseUp).off(e,"keydown",this._onKeyDown)},_onMouseUp:function(t){this._finish();var e=this._map,i=e.mouseEventToLayerPoint(t);if(!this._startLayerPoint.equals(i)){var n=new o.LatLngBounds(e.layerPointToLatLng(this._startLayerPoint),e.layerPointToLatLng(i));e.fitBounds(n),e.fire("boxzoomend",{boxZoomBounds:n})}},_onKeyDown:function(t){27===t.keyCode&&this._finish()}}),o.Map.addInitHook("addHandler","boxZoom",o.Map.BoxZoom),o.Map.mergeOptions({keyboard:!0,keyboardPanOffset:80,keyboardZoomOffset:1}),o.Map.Keyboard=o.Handler.extend({keyCodes:{left:[37],right:[39],down:[40],up:[38],zoomIn:[187,107,61,171],zoomOut:[189,109,173]},initialize:function(t){this._map=t,this._setPanOffset(t.options.keyboardPanOffset),this._setZoomOffset(t.options.keyboardZoomOffset)},addHooks:function(){var t=this._map._container;-1===t.tabIndex&&(t.tabIndex="0"),o.DomEvent.on(t,"focus",this._onFocus,this).on(t,"blur",this._onBlur,this).on(t,"mousedown",this._onMouseDown,this),this._map.on("focus",this._addHooks,this).on("blur",this._removeHooks,this)},removeHooks:function(){this._removeHooks();var t=this._map._container;o.DomEvent.off(t,"focus",this._onFocus,this).off(t,"blur",this._onBlur,this).off(t,"mousedown",this._onMouseDown,this),this._map.off("focus",this._addHooks,this).off("blur",this._removeHooks,this)},_onMouseDown:function(){if(!this._focused){var i=e.body,n=e.documentElement,o=i.scrollTop||n.scrollTop,s=i.scrollLeft||n.scrollLeft;this._map._container.focus(),t.scrollTo(s,o)}},_onFocus:function(){this._focused=!0,this._map.fire("focus")},_onBlur:function(){this._focused=!1,this._map.fire("blur")},_setPanOffset:function(t){var e,i,n=this._panKeys={},o=this.keyCodes;for(e=0,i=o.left.length;i>e;e++)n[o.left[e]]=[-1*t,0];for(e=0,i=o.right.length;i>e;e++)n[o.right[e]]=[t,0];for(e=0,i=o.down.length;i>e;e++)n[o.down[e]]=[0,t];for(e=0,i=o.up.length;i>e;e++)n[o.up[e]]=[0,-1*t]},_setZoomOffset:function(t){var e,i,n=this._zoomKeys={},o=this.keyCodes;for(e=0,i=o.zoomIn.length;i>e;e++)n[o.zoomIn[e]]=t;for(e=0,i=o.zoomOut.length;i>e;e++)n[o.zoomOut[e]]=-t},_addHooks:function(){o.DomEvent.on(e,"keydown",this._onKeyDown,this)},_removeHooks:function(){o.DomEvent.off(e,"keydown",this._onKeyDown,this)},_onKeyDown:function(t){var e=t.keyCode,i=this._map;if(e in this._panKeys){if(i._panAnim&&i._panAnim._inProgress)return;i.panBy(this._panKeys[e]),i.options.maxBounds&&i.panInsideBounds(i.options.maxBounds)}else{if(!(e in this._zoomKeys))return;i.setZoom(i.getZoom()+this._zoomKeys[e])}o.DomEvent.stop(t)}}),o.Map.addInitHook("addHandler","keyboard",o.Map.Keyboard),o.Handler.MarkerDrag=o.Handler.extend({initialize:function(t){this._marker=t},addHooks:function(){var t=this._marker._icon;this._draggable||(this._draggable=new o.Draggable(t,t)),this._draggable.on("dragstart",this._onDragStart,this).on("drag",this._onDrag,this).on("dragend",this._onDragEnd,this),this._draggable.enable(),o.DomUtil.addClass(this._marker._icon,"leaflet-marker-draggable")},removeHooks:function(){this._draggable.off("dragstart",this._onDragStart,this).off("drag",this._onDrag,this).off("dragend",this._onDragEnd,this),this._draggable.disable(),o.DomUtil.removeClass(this._marker._icon,"leaflet-marker-draggable")},moved:function(){return this._draggable&&this._draggable._moved},_onDragStart:function(){this._marker.closePopup().fire("movestart").fire("dragstart")},_onDrag:function(){var t=this._marker,e=t._shadow,i=o.DomUtil.getPosition(t._icon),n=t._map.layerPointToLatLng(i);e&&o.DomUtil.setPosition(e,i),t._latlng=n,t.fire("move",{latlng:n}).fire("drag")},_onDragEnd:function(t){this._marker.fire("moveend").fire("dragend",t)}}),o.Control=o.Class.extend({options:{position:"topright"},initialize:function(t){o.setOptions(this,t)},getPosition:function(){return this.options.position},setPosition:function(t){var e=this._map;return e&&e.removeControl(this),this.options.position=t,e&&e.addControl(this),this},getContainer:function(){return this._container},addTo:function(t){this._map=t;var e=this._container=this.onAdd(t),i=this.getPosition(),n=t._controlCorners[i];return o.DomUtil.addClass(e,"leaflet-control"),-1!==i.indexOf("bottom")?n.insertBefore(e,n.firstChild):n.appendChild(e),this},removeFrom:function(t){var e=this.getPosition(),i=t._controlCorners[e];return i.removeChild(this._container),this._map=null,this.onRemove&&this.onRemove(t),this},_refocusOnMap:function(){this._map&&this._map.getContainer().focus()}}),o.control=function(t){return new o.Control(t)},o.Map.include({addControl:function(t){return t.addTo(this),this},removeControl:function(t){return t.removeFrom(this),this},_initControlPos:function(){function t(t,s){var a=i+t+" "+i+s;e[t+s]=o.DomUtil.create("div",a,n)}var e=this._controlCorners={},i="leaflet-",n=this._controlContainer=o.DomUtil.create("div",i+"control-container",this._container);t("top","left"),t("top","right"),t("bottom","left"),t("bottom","right")},_clearControlPos:function(){this._container.removeChild(this._controlContainer)}}),o.Control.Zoom=o.Control.extend({options:{position:"topleft",zoomInText:"+",zoomInTitle:"Zoom in",zoomOutText:"-",zoomOutTitle:"Zoom out"},onAdd:function(t){var e="leaflet-control-zoom",i=o.DomUtil.create("div",e+" leaflet-bar");return this._map=t,this._zoomInButton=this._createButton(this.options.zoomInText,this.options.zoomInTitle,e+"-in",i,this._zoomIn,this),this._zoomOutButton=this._createButton(this.options.zoomOutText,this.options.zoomOutTitle,e+"-out",i,this._zoomOut,this),this._updateDisabled(),t.on("zoomend zoomlevelschange",this._updateDisabled,this),i},onRemove:function(t){t.off("zoomend zoomlevelschange",this._updateDisabled,this)},_zoomIn:function(t){this._map.zoomIn(t.shiftKey?3:1)},_zoomOut:function(t){this._map.zoomOut(t.shiftKey?3:1)},_createButton:function(t,e,i,n,s,a){var r=o.DomUtil.create("a",i,n);r.innerHTML=t,r.href="#",r.title=e;var h=o.DomEvent.stopPropagation;return o.DomEvent.on(r,"click",h).on(r,"mousedown",h).on(r,"dblclick",h).on(r,"click",o.DomEvent.preventDefault).on(r,"click",s,a).on(r,"click",this._refocusOnMap,a),r},_updateDisabled:function(){var t=this._map,e="leaflet-disabled";o.DomUtil.removeClass(this._zoomInButton,e),o.DomUtil.removeClass(this._zoomOutButton,e),t._zoom===t.getMinZoom()&&o.DomUtil.addClass(this._zoomOutButton,e),t._zoom===t.getMaxZoom()&&o.DomUtil.addClass(this._zoomInButton,e)}}),o.Map.mergeOptions({zoomControl:!0}),o.Map.addInitHook(function(){this.options.zoomControl&&(this.zoomControl=new o.Control.Zoom,this.addControl(this.zoomControl))}),o.control.zoom=function(t){return new o.Control.Zoom(t)},o.Control.Attribution=o.Control.extend({options:{position:"bottomright",prefix:'<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'},initialize:function(t){o.setOptions(this,t),this._attributions={}},onAdd:function(t){this._container=o.DomUtil.create("div","leaflet-control-attribution"),o.DomEvent.disableClickPropagation(this._container);for(var e in t._layers)t._layers[e].getAttribution&&this.addAttribution(t._layers[e].getAttribution());return t.on("layeradd",this._onLayerAdd,this).on("layerremove",this._onLayerRemove,this),this._update(),this._container},onRemove:function(t){t.off("layeradd",this._onLayerAdd).off("layerremove",this._onLayerRemove)},setPrefix:function(t){return this.options.prefix=t,this._update(),this},addAttribution:function(t){return t?(this._attributions[t]||(this._attributions[t]=0),this._attributions[t]++,this._update(),this):void 0},removeAttribution:function(t){return t?(this._attributions[t]&&(this._attributions[t]--,this._update()),this):void 0},_update:function(){if(this._map){var t=[];for(var e in this._attributions)this._attributions[e]&&t.push(e);var i=[];this.options.prefix&&i.push(this.options.prefix),t.length&&i.push(t.join(", ")),this._container.innerHTML=i.join(" | ")}},_onLayerAdd:function(t){t.layer.getAttribution&&this.addAttribution(t.layer.getAttribution())},_onLayerRemove:function(t){t.layer.getAttribution&&this.removeAttribution(t.layer.getAttribution())}}),o.Map.mergeOptions({attributionControl:!0}),o.Map.addInitHook(function(){this.options.attributionControl&&(this.attributionControl=(new o.Control.Attribution).addTo(this))}),o.control.attribution=function(t){return new o.Control.Attribution(t)},o.Control.Scale=o.Control.extend({options:{position:"bottomleft",maxWidth:100,metric:!0,imperial:!0,updateWhenIdle:!1},onAdd:function(t){this._map=t;var e="leaflet-control-scale",i=o.DomUtil.create("div",e),n=this.options;return this._addScales(n,e,i),t.on(n.updateWhenIdle?"moveend":"move",this._update,this),t.whenReady(this._update,this),i},onRemove:function(t){t.off(this.options.updateWhenIdle?"moveend":"move",this._update,this)},_addScales:function(t,e,i){t.metric&&(this._mScale=o.DomUtil.create("div",e+"-line",i)),t.imperial&&(this._iScale=o.DomUtil.create("div",e+"-line",i))},_update:function(){var t=this._map.getBounds(),e=t.getCenter().lat,i=6378137*Math.PI*Math.cos(e*Math.PI/180),n=i*(t.getNorthEast().lng-t.getSouthWest().lng)/180,o=this._map.getSize(),s=this.options,a=0;o.x>0&&(a=n*(s.maxWidth/o.x)),this._updateScales(s,a)},_updateScales:function(t,e){t.metric&&e&&this._updateMetric(e),t.imperial&&e&&this._updateImperial(e)},_updateMetric:function(t){var e=this._getRoundNum(t);this._mScale.style.width=this._getScaleWidth(e/t)+"px",this._mScale.innerHTML=1e3>e?e+" m":e/1e3+" km"},_updateImperial:function(t){var e,i,n,o=3.2808399*t,s=this._iScale;o>5280?(e=o/5280,i=this._getRoundNum(e),s.style.width=this._getScaleWidth(i/e)+"px",s.innerHTML=i+" mi"):(n=this._getRoundNum(o),s.style.width=this._getScaleWidth(n/o)+"px",s.innerHTML=n+" ft")},_getScaleWidth:function(t){return Math.round(this.options.maxWidth*t)-10},_getRoundNum:function(t){var e=Math.pow(10,(Math.floor(t)+"").length-1),i=t/e;return i=i>=10?10:i>=5?5:i>=3?3:i>=2?2:1,e*i}}),o.control.scale=function(t){return new o.Control.Scale(t)},o.Control.Layers=o.Control.extend({options:{collapsed:!0,position:"topright",autoZIndex:!0},initialize:function(t,e,i){o.setOptions(this,i),this._layers={},this._lastZIndex=0,this._handlingClick=!1;for(var n in t)this._addLayer(t[n],n);for(n in e)this._addLayer(e[n],n,!0)},onAdd:function(t){return this._initLayout(),this._update(),t.on("layeradd",this._onLayerChange,this).on("layerremove",this._onLayerChange,this),this._container},onRemove:function(t){t.off("layeradd",this._onLayerChange).off("layerremove",this._onLayerChange)},addBaseLayer:function(t,e){return this._addLayer(t,e),this._update(),this},addOverlay:function(t,e){return this._addLayer(t,e,!0),this._update(),this},removeLayer:function(t){var e=o.stamp(t);return delete this._layers[e],this._update(),this},_initLayout:function(){var t="leaflet-control-layers",e=this._container=o.DomUtil.create("div",t);e.setAttribute("aria-haspopup",!0),o.Browser.touch?o.DomEvent.on(e,"click",o.DomEvent.stopPropagation):o.DomEvent.disableClickPropagation(e).disableScrollPropagation(e);var i=this._form=o.DomUtil.create("form",t+"-list");if(this.options.collapsed){o.Browser.android||o.DomEvent.on(e,"mouseover",this._expand,this).on(e,"mouseout",this._collapse,this);var n=this._layersLink=o.DomUtil.create("a",t+"-toggle",e);n.href="#",n.title="Layers",o.Browser.touch?o.DomEvent.on(n,"click",o.DomEvent.stop).on(n,"click",this._expand,this):o.DomEvent.on(n,"focus",this._expand,this),o.DomEvent.on(i,"click",function(){setTimeout(o.bind(this._onInputClick,this),0)},this),this._map.on("click",this._collapse,this)}else this._expand();this._baseLayersList=o.DomUtil.create("div",t+"-base",i),this._separator=o.DomUtil.create("div",t+"-separator",i),this._overlaysList=o.DomUtil.create("div",t+"-overlays",i),e.appendChild(i)},_addLayer:function(t,e,i){var n=o.stamp(t);this._layers[n]={layer:t,name:e,overlay:i},this.options.autoZIndex&&t.setZIndex&&(this._lastZIndex++,t.setZIndex(this._lastZIndex))},_update:function(){if(this._container){this._baseLayersList.innerHTML="",this._overlaysList.innerHTML="";var t,e,i=!1,n=!1;for(t in this._layers)e=this._layers[t],this._addItem(e),n=n||e.overlay,i=i||!e.overlay;this._separator.style.display=n&&i?"":"none"}},_onLayerChange:function(t){var e=this._layers[o.stamp(t.layer)];if(e){this._handlingClick||this._update();var i=e.overlay?"layeradd"===t.type?"overlayadd":"overlayremove":"layeradd"===t.type?"baselayerchange":null;i&&this._map.fire(i,e)}},_createRadioElement:function(t,i){var n='<input type="radio" class="leaflet-control-layers-selector" name="'+t+'"';i&&(n+=' checked="checked"'),n+="/>";var o=e.createElement("div");return o.innerHTML=n,o.firstChild},_addItem:function(t){var i,n=e.createElement("label"),s=this._map.hasLayer(t.layer);t.overlay?(i=e.createElement("input"),i.type="checkbox",i.className="leaflet-control-layers-selector",i.defaultChecked=s):i=this._createRadioElement("leaflet-base-layers",s),i.layerId=o.stamp(t.layer),o.DomEvent.on(i,"click",this._onInputClick,this);var a=e.createElement("span");a.innerHTML=" "+t.name,n.appendChild(i),n.appendChild(a);var r=t.overlay?this._overlaysList:this._baseLayersList;return r.appendChild(n),n},_onInputClick:function(){var t,e,i,n=this._form.getElementsByTagName("input"),o=n.length;for(this._handlingClick=!0,t=0;o>t;t++)e=n[t],i=this._layers[e.layerId],e.checked&&!this._map.hasLayer(i.layer)?this._map.addLayer(i.layer):!e.checked&&this._map.hasLayer(i.layer)&&this._map.removeLayer(i.layer);this._handlingClick=!1,this._refocusOnMap()},_expand:function(){o.DomUtil.addClass(this._container,"leaflet-control-layers-expanded")},_collapse:function(){this._container.className=this._container.className.replace(" leaflet-control-layers-expanded","")}}),o.control.layers=function(t,e,i){return new o.Control.Layers(t,e,i)},o.PosAnimation=o.Class.extend({includes:o.Mixin.Events,run:function(t,e,i,n){this.stop(),this._el=t,this._inProgress=!0,this._newPos=e,this.fire("start"),t.style[o.DomUtil.TRANSITION]="all "+(i||.25)+"s cubic-bezier(0,0,"+(n||.5)+",1)",o.DomEvent.on(t,o.DomUtil.TRANSITION_END,this._onTransitionEnd,this),o.DomUtil.setPosition(t,e),o.Util.falseFn(t.offsetWidth),this._stepTimer=setInterval(o.bind(this._onStep,this),50)},stop:function(){this._inProgress&&(o.DomUtil.setPosition(this._el,this._getPos()),this._onTransitionEnd(),o.Util.falseFn(this._el.offsetWidth))},_onStep:function(){var t=this._getPos();return t?(this._el._leaflet_pos=t,void this.fire("step")):void this._onTransitionEnd()},_transformRe:/([-+]?(?:\d*\.)?\d+)\D*, ([-+]?(?:\d*\.)?\d+)\D*\)/,_getPos:function(){var e,i,n,s=this._el,a=t.getComputedStyle(s);if(o.Browser.any3d){if(n=a[o.DomUtil.TRANSFORM].match(this._transformRe),!n)return;e=parseFloat(n[1]),i=parseFloat(n[2])}else e=parseFloat(a.left),i=parseFloat(a.top);return new o.Point(e,i,!0)},_onTransitionEnd:function(){o.DomEvent.off(this._el,o.DomUtil.TRANSITION_END,this._onTransitionEnd,this),this._inProgress&&(this._inProgress=!1,this._el.style[o.DomUtil.TRANSITION]="",this._el._leaflet_pos=this._newPos,clearInterval(this._stepTimer),this.fire("step").fire("end"))}}),o.Map.include({setView:function(t,e,n){if(e=e===i?this._zoom:this._limitZoom(e),t=this._limitCenter(o.latLng(t),e,this.options.maxBounds),n=n||{},this._panAnim&&this._panAnim.stop(),this._loaded&&!n.reset&&n!==!0){n.animate!==i&&(n.zoom=o.extend({animate:n.animate},n.zoom),n.pan=o.extend({animate:n.animate},n.pan));var s=this._zoom!==e?this._tryAnimatedZoom&&this._tryAnimatedZoom(t,e,n.zoom):this._tryAnimatedPan(t,n.pan);if(s)return clearTimeout(this._sizeTimer),this}return this._resetView(t,e),this},panBy:function(t,e){if(t=o.point(t).round(),e=e||{},!t.x&&!t.y)return this;if(this._panAnim||(this._panAnim=new o.PosAnimation,this._panAnim.on({step:this._onPanTransitionStep,end:this._onPanTransitionEnd},this)),e.noMoveStart||this.fire("movestart"),e.animate!==!1){o.DomUtil.addClass(this._mapPane,"leaflet-pan-anim");var i=this._getMapPanePos().subtract(t);this._panAnim.run(this._mapPane,i,e.duration||.25,e.easeLinearity)}else this._rawPanBy(t),this.fire("move").fire("moveend");return this},_onPanTransitionStep:function(){this.fire("move")},_onPanTransitionEnd:function(){o.DomUtil.removeClass(this._mapPane,"leaflet-pan-anim"),this.fire("moveend")},_tryAnimatedPan:function(t,e){var i=this._getCenterOffset(t)._floor();return(e&&e.animate)===!0||this.getSize().contains(i)?(this.panBy(i,e),!0):!1}}),o.PosAnimation=o.DomUtil.TRANSITION?o.PosAnimation:o.PosAnimation.extend({run:function(t,e,i,n){this.stop(),this._el=t,this._inProgress=!0,this._duration=i||.25,this._easeOutPower=1/Math.max(n||.5,.2),this._startPos=o.DomUtil.getPosition(t),this._offset=e.subtract(this._startPos),this._startTime=+new Date,this.fire("start"),this._animate()},stop:function(){this._inProgress&&(this._step(),this._complete())},_animate:function(){this._animId=o.Util.requestAnimFrame(this._animate,this),this._step()},_step:function(){var t=+new Date-this._startTime,e=1e3*this._duration;e>t?this._runFrame(this._easeOut(t/e)):(this._runFrame(1),this._complete())},_runFrame:function(t){var e=this._startPos.add(this._offset.multiplyBy(t));o.DomUtil.setPosition(this._el,e),this.fire("step")},_complete:function(){o.Util.cancelAnimFrame(this._animId),this._inProgress=!1,this.fire("end")},_easeOut:function(t){return 1-Math.pow(1-t,this._easeOutPower)}}),o.Map.mergeOptions({zoomAnimation:!0,zoomAnimationThreshold:4}),o.DomUtil.TRANSITION&&o.Map.addInitHook(function(){this._zoomAnimated=this.options.zoomAnimation&&o.DomUtil.TRANSITION&&o.Browser.any3d&&!o.Browser.android23&&!o.Browser.mobileOpera,this._zoomAnimated&&o.DomEvent.on(this._mapPane,o.DomUtil.TRANSITION_END,this._catchTransitionEnd,this)}),o.Map.include(o.DomUtil.TRANSITION?{_catchTransitionEnd:function(t){this._animatingZoom&&t.propertyName.indexOf("transform")>=0&&this._onZoomTransitionEnd()},_nothingToAnimate:function(){return!this._container.getElementsByClassName("leaflet-zoom-animated").length},_tryAnimatedZoom:function(t,e,i){if(this._animatingZoom)return!0;if(i=i||{},!this._zoomAnimated||i.animate===!1||this._nothingToAnimate()||Math.abs(e-this._zoom)>this.options.zoomAnimationThreshold)return!1;var n=this.getZoomScale(e),o=this._getCenterOffset(t)._divideBy(1-1/n),s=this._getCenterLayerPoint()._add(o);return i.animate===!0||this.getSize().contains(o)?(this.fire("movestart").fire("zoomstart"),this._animateZoom(t,e,s,n,null,!0),!0):!1},_animateZoom:function(t,e,i,n,s,a){this._animatingZoom=!0,o.DomUtil.addClass(this._mapPane,"leaflet-zoom-anim"),this._animateToCenter=t,this._animateToZoom=e,o.Draggable&&(o.Draggable._disabled=!0),this.fire("zoomanim",{center:t,zoom:e,origin:i,scale:n,delta:s,backwards:a})},_onZoomTransitionEnd:function(){this._animatingZoom=!1,o.DomUtil.removeClass(this._mapPane,"leaflet-zoom-anim"),this._resetView(this._animateToCenter,this._animateToZoom,!0,!0),o.Draggable&&(o.Draggable._disabled=!1)}}:{}),o.TileLayer.include({_animateZoom:function(t){this._animating||(this._animating=!0,this._prepareBgBuffer());var e=this._bgBuffer,i=o.DomUtil.TRANSFORM,n=t.delta?o.DomUtil.getTranslateString(t.delta):e.style[i],s=o.DomUtil.getScaleString(t.scale,t.origin);e.style[i]=t.backwards?s+" "+n:n+" "+s},_endZoomAnim:function(){var t=this._tileContainer,e=this._bgBuffer;t.style.visibility="",t.parentNode.appendChild(t),o.Util.falseFn(e.offsetWidth),this._animating=!1},_clearBgBuffer:function(){var t=this._map;!t||t._animatingZoom||t.touchZoom._zooming||(this._bgBuffer.innerHTML="",this._bgBuffer.style[o.DomUtil.TRANSFORM]="")},_prepareBgBuffer:function(){var t=this._tileContainer,e=this._bgBuffer,i=this._getLoadedTilesPercentage(e),n=this._getLoadedTilesPercentage(t);return e&&i>.5&&.5>n?(t.style.visibility="hidden",void this._stopLoadingImages(t)):(e.style.visibility="hidden",e.style[o.DomUtil.TRANSFORM]="",this._tileContainer=e,e=this._bgBuffer=t,this._stopLoadingImages(e),void clearTimeout(this._clearBgBufferTimer))},_getLoadedTilesPercentage:function(t){var e,i,n=t.getElementsByTagName("img"),o=0;for(e=0,i=n.length;i>e;e++)n[e].complete&&o++;return o/i},_stopLoadingImages:function(t){var e,i,n,s=Array.prototype.slice.call(t.getElementsByTagName("img"));for(e=0,i=s.length;i>e;e++)n=s[e],n.complete||(n.onload=o.Util.falseFn,n.onerror=o.Util.falseFn,n.src=o.Util.emptyImageUrl,n.parentNode.removeChild(n))}}),o.Map.include({_defaultLocateOptions:{watch:!1,setView:!1,maxZoom:1/0,timeout:1e4,maximumAge:0,enableHighAccuracy:!1},locate:function(t){if(t=this._locateOptions=o.extend(this._defaultLocateOptions,t),!navigator.geolocation)return this._handleGeolocationError({code:0,message:"Geolocation not supported."}),this;var e=o.bind(this._handleGeolocationResponse,this),i=o.bind(this._handleGeolocationError,this);return t.watch?this._locationWatchId=navigator.geolocation.watchPosition(e,i,t):navigator.geolocation.getCurrentPosition(e,i,t),this},stopLocate:function(){return navigator.geolocation&&navigator.geolocation.clearWatch(this._locationWatchId),this._locateOptions&&(this._locateOptions.setView=!1),this},_handleGeolocationError:function(t){var e=t.code,i=t.message||(1===e?"permission denied":2===e?"position unavailable":"timeout");this._locateOptions.setView&&!this._loaded&&this.fitWorld(),this.fire("locationerror",{code:e,message:"Geolocation error: "+i+"."})},_handleGeolocationResponse:function(t){var e=t.coords.latitude,i=t.coords.longitude,n=new o.LatLng(e,i),s=180*t.coords.accuracy/40075017,a=s/Math.cos(o.LatLng.DEG_TO_RAD*e),r=o.latLngBounds([e-s,i-a],[e+s,i+a]),h=this._locateOptions;if(h.setView){var l=Math.min(this.getBoundsZoom(r),h.maxZoom);this.setView(n,l)}var u={latlng:n,bounds:r,timestamp:t.timestamp};for(var c in t.coords)"number"==typeof t.coords[c]&&(u[c]=t.coords[c]);this.fire("locationfound",u)}})}(window,document);
},{}],3:[function(require,module,exports){
(function (global){!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.omnivore=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var xhr = _dereq_('corslite'),
    csv2geojson = _dereq_('csv2geojson'),
    wellknown = _dereq_('wellknown'),
    topojson = _dereq_('topojson'),
    toGeoJSON = _dereq_('togeojson');

module.exports.geojson = geojsonLoad;

module.exports.topojson = topojsonLoad;
module.exports.topojson.parse = topojsonParse;

module.exports.csv = csvLoad;
module.exports.csv.parse = csvParse;

module.exports.gpx = gpxLoad;
module.exports.gpx.parse = gpxParse;

module.exports.kml = kmlLoad;
module.exports.kml.parse = kmlParse;

module.exports.wkt = wktLoad;
module.exports.wkt.parse = wktParse;

function geojsonLoad(url, options) {
    var layer = L.geoJson();
    xhr(url, function(err, response) {
        if (err) return layer.fire('error', { error: err });
        layer.addData(JSON.parse(response.responseText));
        layer.fire('ready');
    });
    return layer;
}

function topojsonLoad(url, options) {
    var layer = L.geoJson();
    xhr(url, onload);
    function onload(err, response) {
        if (err) return layer.fire('error', { error: err });
        layer.addData(topojsonParse(response.responseText));
        layer.fire('ready');
    }
    return layer;
}

function topojsonParse(data) {
    var o = typeof data === 'string' ?
        JSON.parse(data) : data;
    var features = [];
    for (var i in o.objects) {
        var ft = topojson.feature(o, o.objects[i]);
        if (ft.features) features = features.concat(ft.features);
        else features = features.concat([ft]);
    }
    return features;
}

function csvLoad(url, options) {
    var layer = L.geoJson();
    xhr(url, onload);
    function onload(err, response) {
        var error;
        if (err) return layer.fire('error', { error: err });
        function avoidReady() {
            error = true;
        }
        layer.on('error', avoidReady);
        csvParse(response.responseText, options, layer);
        layer.off('error', avoidReady);
        if (!error) layer.fire('ready');
    }
    return layer;
}

function csvParse(csv, options, layer) {
    layer = layer || L.geoJson();
    options = options || {};
    csv2geojson.csv2geojson(csv, options, onparse);
    function onparse(err, geojson) {
        if (err) return layer.fire('error', { error: err });
        layer.addData(geojson);
    }
    return layer;
}

function gpxLoad(url, options) {
    var layer = L.geoJson();
    xhr(url, onload);
    function onload(err, response) {
        var error;
        if (err) return layer.fire('error', { error: err });
        function avoidReady() {
            error = true;
        }
        layer.on('error', avoidReady);
        gpxParse(response.responseXML || response.responseText, options, layer);
        layer.off('error', avoidReady);
        if (!error) layer.fire('ready');
    }
    return layer;
}

function gpxParse(gpx, options, layer) {
    var xml = parseXML(gpx);
    if (!xml) return layer.fire('error', {
        error: 'Could not parse GPX'
    });
    layer = layer || L.geoJson();
    var geojson = toGeoJSON.gpx(xml);
    layer.addData(geojson);
    return layer;
}

function kmlLoad(url, options) {
    var layer = L.geoJson();
    xhr(url, onload);
    function onload(err, response) {
        var error;
        if (err) return layer.fire('error', { error: err });
        function avoidReady() {
            error = true;
        }
        layer.on('error', avoidReady);
        kmlParse(response.responseXML || response.responseText, options, layer);
        layer.off('error', avoidReady);
        if (!error) layer.fire('ready');
    }
    return layer;
}

function kmlParse(gpx, options, layer) {
    var xml = parseXML(gpx);
    if (!xml) return layer.fire('error', {
        error: 'Could not parse GPX'
    });
    layer = layer || L.geoJson();
    var geojson = toGeoJSON.kml(xml);
    layer.addData(geojson);
    return layer;
}

function wktLoad(url, options) {
    var layer = L.geoJson();
    xhr(url, onload);
    function onload(err, response) {
        if (err) return layer.fire('error', { error: err });
        wktParse(response.responseText, options, layer);
        layer.fire('ready');
    }
    return layer;
}

function wktParse(wkt, options, layer) {
    layer = layer || L.geoJson();
    var geojson = wellknown(wkt);
    layer.addData(geojson);
    return layer;
}

function parseXML(str) {
    if (typeof str === 'string') {
        return (new DOMParser()).parseFromString(str, 'text/xml');
    } else {
        return str;
    }
}

},{"corslite":5,"csv2geojson":6,"togeojson":9,"topojson":10,"wellknown":38}],2:[function(_dereq_,module,exports){

},{}],3:[function(_dereq_,module,exports){
module.exports=_dereq_(2)
},{}],4:[function(_dereq_,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],5:[function(_dereq_,module,exports){
function xhr(url, callback, cors) {
    var sent = false;

    if (typeof window.XMLHttpRequest === 'undefined') {
        return callback(Error('Browser not supported'));
    }

    if (typeof cors === 'undefined') {
        var m = url.match(/^\s*https?:\/\/[^\/]*/);
        cors = m && (m[0] !== location.protocol + '//' + location.domain +
                (location.port ? ':' + location.port : ''));
    }

    var x;

    function isSuccessful(status) {
        return status >= 200 && status < 300 || status === 304;
    }

    if (cors && (
        // IE7-9 Quirks & Compatibility
        typeof window.XDomainRequest === 'object' ||
        // IE9 Standards mode
        typeof window.XDomainRequest === 'function'
    )) {
        // IE8-10
        x = new window.XDomainRequest();

        // Ensure callback is never called synchronously, i.e., before
        // x.send() returns (this has been observed in the wild).
        // See https://github.com/mapbox/mapbox.js/issues/472
        var original = callback;
        callback = function() {
            if (sent) {
                original.apply(this, arguments);
            } else {
                var that = this, args = arguments;
                setTimeout(function() {
                    original.apply(that, args);
                }, 0);
            }
        }
    } else {
        x = new window.XMLHttpRequest();
    }

    function loaded() {
        if (
            // XDomainRequest
            x.status === undefined ||
            // modern browsers
            isSuccessful(x.status)) callback.call(x, null, x);
        else callback.call(x, x, null);
    }

    // Both `onreadystatechange` and `onload` can fire. `onreadystatechange`
    // has [been supported for longer](http://stackoverflow.com/a/9181508/229001).
    if ('onload' in x) {
        x.onload = loaded;
    } else {
        x.onreadystatechange = function readystate() {
            if (x.readyState === 4) {
                loaded();
            }
        };
    }

    // Call the callback with the XMLHttpRequest object as an error and prevent
    // it from ever being called again by reassigning it to `noop`
    x.onerror = function error(evt) {
        // XDomainRequest provides no evt parameter
        callback.call(this, evt || true, null);
        callback = function() { };
    };

    // IE9 must have onprogress be set to a unique function.
    x.onprogress = function() { };

    x.ontimeout = function(evt) {
        callback.call(this, evt, null);
        callback = function() { };
    };

    x.onabort = function(evt) {
        callback.call(this, evt, null);
        callback = function() { };
    };

    // GET is the only supported HTTP Verb by XDomainRequest and is the
    // only one supported here.
    x.open('GET', url, true);

    // Send the request. Sending data is not supported.
    x.send(null);
    sent = true;

    return x;
}

if (typeof module !== 'undefined') module.exports = xhr;

},{}],6:[function(_dereq_,module,exports){
var dsv = _dereq_('dsv'),
    sexagesimal = _dereq_('sexagesimal');

function isLat(f) { return !!f.match(/(Lat)(itude)?/gi); }
function isLon(f) { return !!f.match(/(L)(on|ng)(gitude)?/i); }

function keyCount(o) {
    return (typeof o == 'object') ? Object.keys(o).length : 0;
}

function autoDelimiter(x) {
    var delimiters = [',', ';', '\t', '|'];
    var results = [];

    delimiters.forEach(function(delimiter) {
        var res = dsv(delimiter).parse(x);
        if (res.length >= 1) {
            var count = keyCount(res[0]);
            for (var i = 0; i < res.length; i++) {
                if (keyCount(res[i]) !== count) return;
            }
            results.push({
                delimiter: delimiter,
                arity: Object.keys(res[0]).length,
            });
        }
    });

    if (results.length) {
        return results.sort(function(a, b) {
            return b.arity - a.arity;
        })[0].delimiter;
    } else {
        return null;
    }
}

function auto(x) {
    var delimiter = autoDelimiter(x);
    if (!delimiter) return null;
    return dsv(delimiter).parse(x);
}

function csv2geojson(x, options, callback) {

    if (!callback) {
        callback = options;
        options = {};
    }

    options.delimiter = options.delimiter || ',';

    var latfield = options.latfield || '',
        lonfield = options.lonfield || '';

    var features = [],
        featurecollection = { type: 'FeatureCollection', features: features };

    if (options.delimiter === 'auto' && typeof x == 'string') {
        options.delimiter = autoDelimiter(x);
        if (!options.delimiter) return callback({
            type: 'Error',
            message: 'Could not autodetect delimiter'
        });
    }

    var parsed = (typeof x == 'string') ? dsv(options.delimiter).parse(x) : x;

    if (!parsed.length) return callback(null, featurecollection);

    if (!latfield || !lonfield) {
        for (var f in parsed[0]) {
            if (!latfield && isLat(f)) latfield = f;
            if (!lonfield && isLon(f)) lonfield = f;
        }
        if (!latfield || !lonfield) {
            var fields = [];
            for (var k in parsed[0]) fields.push(k);
            return callback({
                type: 'Error',
                message: 'Latitude and longitude fields not present',
                data: parsed,
                fields: fields
            });
        }
    }

    var errors = [];

    for (var i = 0; i < parsed.length; i++) {
        if (parsed[i][lonfield] !== undefined &&
            parsed[i][lonfield] !== undefined) {

            var lonk = parsed[i][lonfield],
                latk = parsed[i][latfield],
                lonf, latf,
                a;

            a = sexagesimal(lonk, 'EW');
            if (a) lonk = a;
            a = sexagesimal(latk, 'NS');
            if (a) latk = a;

            lonf = parseFloat(lonk);
            latf = parseFloat(latk);

            if (isNaN(lonf) ||
                isNaN(latf)) {
                errors.push({
                    message: 'A row contained an invalid value for latitude or longitude',
                    row: parsed[i]
                });
            } else {
                if (!options.includeLatLon) {
                    delete parsed[i][lonfield];
                    delete parsed[i][latfield];
                }

                features.push({
                    type: 'Feature',
                    properties: parsed[i],
                    geometry: {
                        type: 'Point',
                        coordinates: [
                            parseFloat(lonf),
                            parseFloat(latf)
                        ]
                    }
                });
            }
        }
    }

    callback(errors.length ? errors: null, featurecollection);
}

function toLine(gj) {
    var features = gj.features;
    var line = {
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: []
        }
    };
    for (var i = 0; i < features.length; i++) {
        line.geometry.coordinates.push(features[i].geometry.coordinates);
    }
    line.properties = features[0].properties;
    return {
        type: 'FeatureCollection',
        features: [line]
    };
}

function toPolygon(gj) {
    var features = gj.features;
    var poly = {
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [[]]
        }
    };
    for (var i = 0; i < features.length; i++) {
        poly.geometry.coordinates[0].push(features[i].geometry.coordinates);
    }
    poly.properties = features[0].properties;
    return {
        type: 'FeatureCollection',
        features: [poly]
    };
}

module.exports = {
    isLon: isLon,
    isLat: isLat,
    csv: dsv.csv.parse,
    tsv: dsv.tsv.parse,
    dsv: dsv,
    auto: auto,
    csv2geojson: csv2geojson,
    toLine: toLine,
    toPolygon: toPolygon
};

},{"dsv":7,"sexagesimal":8}],7:[function(_dereq_,module,exports){
var fs = _dereq_("fs");

module.exports = new Function("dsv.version = \"0.0.3\";\n\ndsv.tsv = dsv(\"\\t\");\ndsv.csv = dsv(\",\");\n\nfunction dsv(delimiter) {\n  var dsv = {},\n      reFormat = new RegExp(\"[\\\"\" + delimiter + \"\\n]\"),\n      delimiterCode = delimiter.charCodeAt(0);\n\n  dsv.parse = function(text, f) {\n    var o;\n    return dsv.parseRows(text, function(row, i) {\n      if (o) return o(row, i - 1);\n      var a = new Function(\"d\", \"return {\" + row.map(function(name, i) {\n        return JSON.stringify(name) + \": d[\" + i + \"]\";\n      }).join(\",\") + \"}\");\n      o = f ? function(row, i) { return f(a(row), i); } : a;\n    });\n  };\n\n  dsv.parseRows = function(text, f) {\n    var EOL = {}, // sentinel value for end-of-line\n        EOF = {}, // sentinel value for end-of-file\n        rows = [], // output rows\n        N = text.length,\n        I = 0, // current character index\n        n = 0, // the current line number\n        t, // the current token\n        eol; // is the current token followed by EOL?\n\n    function token() {\n      if (I >= N) return EOF; // special case: end of file\n      if (eol) return eol = false, EOL; // special case: end of line\n\n      // special case: quotes\n      var j = I;\n      if (text.charCodeAt(j) === 34) {\n        var i = j;\n        while (i++ < N) {\n          if (text.charCodeAt(i) === 34) {\n            if (text.charCodeAt(i + 1) !== 34) break;\n            ++i;\n          }\n        }\n        I = i + 2;\n        var c = text.charCodeAt(i + 1);\n        if (c === 13) {\n          eol = true;\n          if (text.charCodeAt(i + 2) === 10) ++I;\n        } else if (c === 10) {\n          eol = true;\n        }\n        return text.substring(j + 1, i).replace(/\"\"/g, \"\\\"\");\n      }\n\n      // common case: find next delimiter or newline\n      while (I < N) {\n        var c = text.charCodeAt(I++), k = 1;\n        if (c === 10) eol = true; // \\n\n        else if (c === 13) { eol = true; if (text.charCodeAt(I) === 10) ++I, ++k; } // \\r|\\r\\n\n        else if (c !== delimiterCode) continue;\n        return text.substring(j, I - k);\n      }\n\n      // special case: last token before EOF\n      return text.substring(j);\n    }\n\n    while ((t = token()) !== EOF) {\n      var a = [];\n      while (t !== EOL && t !== EOF) {\n        a.push(t);\n        t = token();\n      }\n      if (f && !(a = f(a, n++))) continue;\n      rows.push(a);\n    }\n\n    return rows;\n  };\n\n  dsv.format = function(rows) {\n    if (Array.isArray(rows[0])) return dsv.formatRows(rows); // deprecated; use formatRows\n    var fieldSet = {}, fields = [];\n\n    // Compute unique fields in order of discovery.\n    rows.forEach(function(row) {\n      for (var field in row) {\n        if (!(field in fieldSet)) {\n          fields.push(fieldSet[field] = field);\n        }\n      }\n    });\n\n    return [fields.map(formatValue).join(delimiter)].concat(rows.map(function(row) {\n      return fields.map(function(field) {\n        return formatValue(row[field]);\n      }).join(delimiter);\n    })).join(\"\\n\");\n  };\n\n  dsv.formatRows = function(rows) {\n    return rows.map(formatRow).join(\"\\n\");\n  };\n\n  function formatRow(row) {\n    return row.map(formatValue).join(delimiter);\n  }\n\n  function formatValue(text) {\n    return reFormat.test(text) ? \"\\\"\" + text.replace(/\\\"/g, \"\\\"\\\"\") + \"\\\"\" : text;\n  }\n\n  return dsv;\n}\n" + ";return dsv")();

},{"fs":2}],8:[function(_dereq_,module,exports){
module.exports = function(x, dims) {
    if (!dims) dims = 'NSEW';
    if (typeof x !== 'string') return null;
    var r = /^([0-9.]+)°? *(?:([0-9.]+)['’′‘] *)?(?:([0-9.]+)(?:''|"|”|″) *)?([NSEW])?/,
        m = x.match(r);
    if (!m) return null;
    else if (m[4] && dims.indexOf(m[4]) === -1) return null;
    else return (((m[1]) ? parseFloat(m[1]) : 0) +
        ((m[2] ? parseFloat(m[2]) / 60 : 0)) +
        ((m[3] ? parseFloat(m[3]) / 3600 : 0))) *
        ((m[4] && m[4] === 'S' || m[4] === 'W') ? -1 : 1);
};

},{}],9:[function(_dereq_,module,exports){
(function (process){toGeoJSON = (function() {
    'use strict';

    var removeSpace = (/\s*/g),
        trimSpace = (/^\s*|\s*$/g),
        splitSpace = (/\s+/);
    // generate a short, numeric hash of a string
    function okhash(x) {
        if (!x || !x.length) return 0;
        for (var i = 0, h = 0; i < x.length; i++) {
            h = ((h << 5) - h) + x.charCodeAt(i) | 0;
        } return h;
    }
    // all Y children of X
    function get(x, y) { return x.getElementsByTagName(y); }
    function attr(x, y) { return x.getAttribute(y); }
    function attrf(x, y) { return parseFloat(attr(x, y)); }
    // one Y child of X, if any, otherwise null
    function get1(x, y) { var n = get(x, y); return n.length ? n[0] : null; }
    // https://developer.mozilla.org/en-US/docs/Web/API/Node.normalize
    function norm(el) { if (el.normalize) { el.normalize(); } return el; }
    // cast array x into numbers
    function numarray(x) {
        for (var j = 0, o = []; j < x.length; j++) o[j] = parseFloat(x[j]);
        return o;
    }
    function clean(x) {
        var o = {};
        for (var i in x) if (x[i]) o[i] = x[i];
        return o;
    }
    // get the content of a text node, if any
    function nodeVal(x) { if (x) {norm(x);} return x && x.firstChild && x.firstChild.nodeValue; }
    // get one coordinate from a coordinate array, if any
    function coord1(v) { return numarray(v.replace(removeSpace, '').split(',')); }
    // get all coordinates from a coordinate array as [[],[]]
    function coord(v) {
        var coords = v.replace(trimSpace, '').split(splitSpace),
            o = [];
        for (var i = 0; i < coords.length; i++) {
            o.push(coord1(coords[i]));
        }
        return o;
    }
    function coordPair(x) {
        var ll = [attrf(x, 'lon'), attrf(x, 'lat')],
            ele = get1(x, 'ele');
        if (ele) ll.push(parseFloat(nodeVal(ele)));
        return ll;
    }

    // create a new feature collection parent object
    function fc() {
        return {
            type: 'FeatureCollection',
            features: []
        };
    }

    var serializer;
    if (typeof XMLSerializer !== 'undefined') {
        serializer = new XMLSerializer();
    // only require xmldom in a node environment
    } else if (typeof exports === 'object' && typeof process === 'object' && !process.browser) {
        serializer = new (_dereq_('xmldom').XMLSerializer)();
    }
    function xml2str(str) { return serializer.serializeToString(str); }

    var t = {
        kml: function(doc, o) {
            o = o || {};

            var gj = fc(),
                // styleindex keeps track of hashed styles in order to match features
                styleIndex = {},
                // atomic geospatial types supported by KML - MultiGeometry is
                // handled separately
                geotypes = ['Polygon', 'LineString', 'Point', 'Track'],
                // all root placemarks in the file
                placemarks = get(doc, 'Placemark'),
                styles = get(doc, 'Style');

            for (var k = 0; k < styles.length; k++) {
                styleIndex['#' + attr(styles[k], 'id')] = okhash(xml2str(styles[k])).toString(16);
            }
            for (var j = 0; j < placemarks.length; j++) {
                gj.features = gj.features.concat(getPlacemark(placemarks[j]));
            }
            function gxCoord(v) { return numarray(v.split(' ')); }
            function gxCoords(root) {
                var elems = get(root, 'coord', 'gx'), coords = [];
                for (var i = 0; i < elems.length; i++) coords.push(gxCoord(nodeVal(elems[i])));
                return coords;
            }
            function getGeometry(root) {
                var geomNode, geomNodes, i, j, k, geoms = [];
                if (get1(root, 'MultiGeometry')) return getGeometry(get1(root, 'MultiGeometry'));
                if (get1(root, 'MultiTrack')) return getGeometry(get1(root, 'MultiTrack'));
                for (i = 0; i < geotypes.length; i++) {
                    geomNodes = get(root, geotypes[i]);
                    if (geomNodes) {
                        for (j = 0; j < geomNodes.length; j++) {
                            geomNode = geomNodes[j];
                            if (geotypes[i] == 'Point') {
                                geoms.push({
                                    type: 'Point',
                                    coordinates: coord1(nodeVal(get1(geomNode, 'coordinates')))
                                });
                            } else if (geotypes[i] == 'LineString') {
                                geoms.push({
                                    type: 'LineString',
                                    coordinates: coord(nodeVal(get1(geomNode, 'coordinates')))
                                });
                            } else if (geotypes[i] == 'Polygon') {
                                var rings = get(geomNode, 'LinearRing'),
                                    coords = [];
                                for (k = 0; k < rings.length; k++) {
                                    coords.push(coord(nodeVal(get1(rings[k], 'coordinates'))));
                                }
                                geoms.push({
                                    type: 'Polygon',
                                    coordinates: coords
                                });
                            } else if (geotypes[i] == 'Track') {
                                geoms.push({
                                    type: 'LineString',
                                    coordinates: gxCoords(geomNode)
                                });
                            }
                        }
                    }
                }
                return geoms;
            }
            function getPlacemark(root) {
                var geoms = getGeometry(root), i, properties = {},
                    name = nodeVal(get1(root, 'name')),
                    styleUrl = nodeVal(get1(root, 'styleUrl')),
                    description = nodeVal(get1(root, 'description')),
                    timeSpan = get1(root, 'TimeSpan'),
                    extendedData = get1(root, 'ExtendedData');

                if (!geoms.length) return [];
                if (name) properties.name = name;
                if (styleUrl && styleIndex[styleUrl]) {
                    properties.styleUrl = styleUrl;
                    properties.styleHash = styleIndex[styleUrl];
                }
                if (description) properties.description = description;
                if (timeSpan) {
                    var begin = nodeVal(get1(timeSpan, 'begin'));
                    var end = nodeVal(get1(timeSpan, 'end'));
                    properties.timespan = { begin: begin, end: end };
                }
                if (extendedData) {
                    var datas = get(extendedData, 'Data'),
                        simpleDatas = get(extendedData, 'SimpleData');

                    for (i = 0; i < datas.length; i++) {
                        properties[datas[i].getAttribute('name')] = nodeVal(get1(datas[i], 'value'));
                    }
                    for (i = 0; i < simpleDatas.length; i++) {
                        properties[simpleDatas[i].getAttribute('name')] = nodeVal(simpleDatas[i]);
                    }
                }
                return [{
                    type: 'Feature',
                    geometry: (geoms.length === 1) ? geoms[0] : {
                        type: 'GeometryCollection',
                        geometries: geoms
                    },
                    properties: properties
                }];
            }
            return gj;
        },
        gpx: function(doc, o) {
            var i,
                tracks = get(doc, 'trk'),
                routes = get(doc, 'rte'),
                waypoints = get(doc, 'wpt'),
                // a feature collection
                gj = fc();
            for (i = 0; i < tracks.length; i++) {
                gj.features.push(getLinestring(tracks[i], 'trkpt'));
            }
            for (i = 0; i < routes.length; i++) {
                gj.features.push(getLinestring(routes[i], 'rtept'));
            }
            for (i = 0; i < waypoints.length; i++) {
                gj.features.push(getPoint(waypoints[i]));
            }
            function getLinestring(node, pointname) {
                var j, pts = get(node, pointname), line = [];
                for (j = 0; j < pts.length; j++) {
                    line.push(coordPair(pts[j]));
                }
                return {
                    type: 'Feature',
                    properties: getProperties(node),
                    geometry: {
                        type: 'LineString',
                        coordinates: line
                    }
                };
            }
            function getPoint(node) {
                var prop = getProperties(node);
                prop.sym = nodeVal(get1(node, 'sym'));
                return {
                    type: 'Feature',
                    properties: prop,
                    geometry: {
                        type: 'Point',
                        coordinates: coordPair(node)
                    }
                };
            }
            function getProperties(node) {
                var meta = ['name', 'desc', 'author', 'copyright', 'link',
                            'time', 'keywords'],
                    prop = {},
                    k;
                for (k = 0; k < meta.length; k++) {
                    prop[meta[k]] = nodeVal(get1(node, meta[k]));
                }
                return clean(prop);
            }
            return gj;
        }
    };
    return t;
})();

if (typeof module !== 'undefined') module.exports = toGeoJSON;
}).call(this,_dereq_("/Users/tmcw/src/leaflet-omnivore/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
},{"/Users/tmcw/src/leaflet-omnivore/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,"xmldom":3}],10:[function(_dereq_,module,exports){
var topojson = module.exports = _dereq_("./topojson");
topojson.topology = _dereq_("./lib/topojson/topology");
topojson.simplify = _dereq_("./lib/topojson/simplify");
topojson.clockwise = _dereq_("./lib/topojson/clockwise");
topojson.filter = _dereq_("./lib/topojson/filter");
topojson.prune = _dereq_("./lib/topojson/prune");
topojson.bind = _dereq_("./lib/topojson/bind");

},{"./lib/topojson/bind":11,"./lib/topojson/clockwise":14,"./lib/topojson/filter":18,"./lib/topojson/prune":21,"./lib/topojson/simplify":23,"./lib/topojson/topology":26,"./topojson":37}],11:[function(_dereq_,module,exports){
var type = _dereq_("./type"),
    topojson = _dereq_("../../");

module.exports = function(topology, propertiesById) {
  var bind = type({
    geometry: function(geometry) {
      var properties0 = geometry.properties,
          properties1 = propertiesById[geometry.id];
      if (properties1) {
        if (properties0) for (var k in properties1) properties0[k] = properties1[k];
        else for (var k in properties1) { geometry.properties = properties1; break; }
      }
      this.defaults.geometry.call(this, geometry);
    },
    LineString: noop,
    MultiLineString: noop,
    Point: noop,
    MultiPoint: noop,
    Polygon: noop,
    MultiPolygon: noop
  });

  for (var key in topology.objects) {
    bind.object(topology.objects[key]);
  }
};

function noop() {}

},{"../../":10,"./type":36}],12:[function(_dereq_,module,exports){

// Computes the bounding box of the specified hash of GeoJSON objects.
module.exports = function(objects) {
  var x0 = Infinity,
      y0 = Infinity,
      x1 = -Infinity,
      y1 = -Infinity;

  function boundGeometry(geometry) {
    if (geometry && boundGeometryType.hasOwnProperty(geometry.type)) boundGeometryType[geometry.type](geometry);
  }

  var boundGeometryType = {
    GeometryCollection: function(o) { o.geometries.forEach(boundGeometry); },
    Point: function(o) { boundPoint(o.coordinates); },
    MultiPoint: function(o) { o.coordinates.forEach(boundPoint); },
    LineString: function(o) { boundLine(o.coordinates); },
    MultiLineString: function(o) { o.coordinates.forEach(boundLine); },
    Polygon: function(o) { o.coordinates.forEach(boundLine); },
    MultiPolygon: function(o) { o.coordinates.forEach(boundMultiLine); }
  };

  function boundPoint(coordinates) {
    var x = coordinates[0],
        y = coordinates[1];
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }

  function boundLine(coordinates) {
    coordinates.forEach(boundPoint);
  }

  function boundMultiLine(coordinates) {
    coordinates.forEach(boundLine);
  }

  for (var key in objects) {
    boundGeometry(objects[key]);
  }

  return [x0, y0, x1, y1];
};

},{}],13:[function(_dereq_,module,exports){
exports.name = "cartesian";
exports.formatDistance = formatDistance;
exports.ringArea = ringArea;
exports.absoluteArea = Math.abs;
exports.triangleArea = triangleArea;
exports.distance = distance;

function formatDistance(d) {
  return d.toString();
}

function ringArea(ring) {
  var i = 0,
      n = ring.length,
      area = ring[n - 1][1] * ring[0][0] - ring[n - 1][0] * ring[0][1];
  while (++i < n) {
    area += ring[i - 1][1] * ring[i][0] - ring[i - 1][0] * ring[i][1];
  }
  return -area * .5; // ensure clockwise pixel areas are positive
}

function triangleArea(triangle) {
  return Math.abs(
    (triangle[0][0] - triangle[2][0]) * (triangle[1][1] - triangle[0][1])
    - (triangle[0][0] - triangle[1][0]) * (triangle[2][1] - triangle[0][1])
  );
}

function distance(x0, y0, x1, y1) {
  var dx = x0 - x1, dy = y0 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

},{}],14:[function(_dereq_,module,exports){
var type = _dereq_("./type"),
    systems = _dereq_("./coordinate-systems"),
    topojson = _dereq_("../../");

module.exports = function(object, options) {
  if (object.type === "Topology") clockwiseTopology(object, options);
  else clockwiseGeometry(object, options);
};

function clockwiseGeometry(object, options) {
  var system = null;

  if (options)
    "coordinate-system" in options && (system = systems[options["coordinate-system"]]);

  var clockwisePolygon = clockwisePolygonSystem(system.ringArea, reverse);

  type({
    LineString: noop,
    MultiLineString: noop,
    Point: noop,
    MultiPoint: noop,
    Polygon: function(polygon) { clockwisePolygon(polygon.coordinates); },
    MultiPolygon: function(multiPolygon) { multiPolygon.coordinates.forEach(clockwisePolygon); }
  }).object(object);

  function reverse(array) { array.reverse(); }
}

function clockwiseTopology(topology, options) {
  var system = null;

  if (options)
    "coordinate-system" in options && (system = systems[options["coordinate-system"]]);

  var clockwisePolygon = clockwisePolygonSystem(ringArea, reverse);

  var clockwise = type({
    LineString: noop,
    MultiLineString: noop,
    Point: noop,
    MultiPoint: noop,
    Polygon: function(polygon) { clockwisePolygon(polygon.arcs); },
    MultiPolygon: function(multiPolygon) { multiPolygon.arcs.forEach(clockwisePolygon); }
  });

  for (var key in topology.objects) {
    clockwise.object(topology.objects[key]);
  }

  function ringArea(ring) {
    return system.ringArea(topojson.feature(topology, {type: "Polygon", arcs: [ring]}).geometry.coordinates[0]);
  }

  // TODO It might be slightly more compact to reverse the arc.
  function reverse(ring) {
    var i = -1, n = ring.length;
    ring.reverse();
    while (++i < n) ring[i] = ~ring[i];
  }
};

function clockwisePolygonSystem(ringArea, reverse) {
  return function(rings) {
    if (!(n = rings.length)) return;
    var n,
        areas = new Array(n),
        max = -Infinity,
        best,
        area,
        t;
    // Find the largest absolute ring area; this should be the exterior ring.
    for (var i = 0; i < n; ++i) {
      var area = Math.abs(areas[i] = ringArea(rings[i]));
      if (area > max) max = area, best = i;
    }
    // Ensure the largest ring appears first.
    if (best) {
      t = rings[best], rings[best] = rings[0], rings[0] = t;
      t = areas[best], areas[best] = areas[0], areas[0] = t;
    }
    if (areas[0] < 0) reverse(rings[0]);
    for (var i = 1; i < n; ++i) {
      if (areas[i] > 0) reverse(rings[i]);
    }
  };
}

function noop() {}

},{"../../":10,"./coordinate-systems":16,"./type":36}],15:[function(_dereq_,module,exports){
// Given a hash of GeoJSON objects and an id function, invokes the id function
// to compute a new id for each object that is a feature. The function is passed
// the feature and is expected to return the new feature id, or null if the
// feature should not have an id.
module.exports = function(objects, id) {
  if (arguments.length < 2) id = function(d) { return d.id; };

  function idObject(object) {
    if (object && idObjectType.hasOwnProperty(object.type)) idObjectType[object.type](object);
  }

  function idFeature(feature) {
    var i = id(feature);
    if (i == null) delete feature.id;
    else feature.id = i;
  }

  var idObjectType = {
    Feature: idFeature,
    FeatureCollection: function(collection) { collection.features.forEach(idFeature); }
  };

  for (var key in objects) {
    idObject(objects[key]);
  }

  return objects;
};

},{}],16:[function(_dereq_,module,exports){
module.exports = {
  cartesian: _dereq_("./cartesian"),
  spherical: _dereq_("./spherical")
};

},{"./cartesian":13,"./spherical":24}],17:[function(_dereq_,module,exports){
// Given a TopoJSON topology in absolute (quantized) coordinates,
// converts to fixed-point delta encoding.
// This is a destructive operation that modifies the given topology!
module.exports = function(topology) {
  var arcs = topology.arcs,
      i = -1,
      n = arcs.length;

  while (++i < n) {
    var arc = arcs[i],
        j = 0,
        m = arc.length,
        point = arc[0],
        x0 = point[0],
        y0 = point[1],
        x1,
        y1;
    while (++j < m) {
      point = arc[j];
      x1 = point[0];
      y1 = point[1];
      arc[j] = [x1 - x0, y1 - y0];
      x0 = x1;
      y0 = y1;
    }
  }

  return topology;
};

},{}],18:[function(_dereq_,module,exports){
var type = _dereq_("./type"),
    prune = _dereq_("./prune"),
    clockwise = _dereq_("./clockwise"),
    systems = _dereq_("./coordinate-systems"),
    topojson = _dereq_("../../");

module.exports = function(topology, options) {
  var system = null,
      forceClockwise = true, // force exterior rings to be clockwise?
      minimumArea;

  if (options)
    "coordinate-system" in options && (system = systems[options["coordinate-system"]]),
    "minimum-area" in options && (minimumArea = +options["minimum-area"]),
    "force-clockwise" in options && (forceClockwise = !!options["force-clockwise"]);

  if (forceClockwise) clockwise(topology, options); // deprecated; for backwards-compatibility

  if (!(minimumArea > 0)) minimumArea = Number.MIN_VALUE;

  var filter = type({
    LineString: noop, // TODO remove empty lines
    MultiLineString: noop,
    Point: noop,
    MultiPoint: noop,
    Polygon: function(polygon) {
      polygon.arcs = polygon.arcs.filter(ringArea);
      if (!polygon.arcs.length) {
        polygon.type = null;
        delete polygon.arcs;
      }
    },
    MultiPolygon: function(multiPolygon) {
      multiPolygon.arcs = multiPolygon.arcs.map(function(polygon) {
        return polygon.filter(ringArea);
      }).filter(function(polygon) {
        return polygon.length;
      });
      if (!multiPolygon.arcs.length) {
        multiPolygon.type = null;
        delete multiPolygon.arcs;
      }
    },
    GeometryCollection: function(collection) {
      this.defaults.GeometryCollection.call(this, collection);
      collection.geometries = collection.geometries.filter(function(geometry) { return geometry.type != null; });
      if (!collection.geometries.length) {
        collection.type = null;
        delete collection.geometries;
      }
    }
  });

  for (var key in topology.objects) {
    filter.object(topology.objects[key]);
  }

  prune(topology, options);

  function ringArea(ring) {
    var topopolygon = {type: "Polygon", arcs: [ring]},
        geopolygon = topojson.feature(topology, topopolygon),
        exterior = geopolygon.geometry.coordinates[0],
        exteriorArea = system.absoluteArea(system.ringArea(exterior));
    return exteriorArea >= minimumArea;
  }
};

function noop() {}

},{"../../":10,"./clockwise":14,"./coordinate-systems":16,"./prune":21,"./type":36}],19:[function(_dereq_,module,exports){
// Given a hash of GeoJSON objects, replaces Features with geometry objects.
// This is a destructive operation that modifies the input objects!
module.exports = function(objects) {

  function geomifyObject(object) {
    return (object && geomifyObjectType.hasOwnProperty(object.type)
        ? geomifyObjectType[object.type]
        : geomifyGeometry)(object);
  }

  function geomifyFeature(feature) {
    var geometry = feature.geometry;
    if (geometry == null) {
      feature.type = null;
    } else {
      geomifyGeometry(geometry);
      feature.type = geometry.type;
      if (geometry.geometries) feature.geometries = geometry.geometries;
      else if (geometry.coordinates) feature.coordinates = geometry.coordinates;
    }
    delete feature.geometry;
    return feature;
  }

  function geomifyGeometry(geometry) {
    if (!geometry) return {type: null};
    if (geomifyGeometryType.hasOwnProperty(geometry.type)) geomifyGeometryType[geometry.type](geometry);
    return geometry;
  }

  var geomifyObjectType = {
    Feature: geomifyFeature,
    FeatureCollection: function(collection) {
      collection.type = "GeometryCollection";
      collection.geometries = collection.features;
      collection.features.forEach(geomifyFeature);
      delete collection.features;
      return collection;
    }
  };

  var geomifyGeometryType = {
    GeometryCollection: function(o) {
      var geometries = o.geometries, i = -1, n = geometries.length;
      while (++i < n) geometries[i] = geomifyGeometry(geometries[i]);
    },
    MultiPoint: function(o) {
      if (!o.coordinates.length) {
        o.type = null;
        delete o.coordinates;
      } else if (o.coordinates.length < 2) {
        o.type = "Point";
        o.coordinates = o.coordinates[0];
      }
    },
    LineString: function(o) {
      if (!o.coordinates.length) {
        o.type = null;
        delete o.coordinates;
      }
    },
    MultiLineString: function(o) {
      for (var lines = o.coordinates, i = 0, N = 0, n = lines.length; i < n; ++i) {
        var line = lines[i];
        if (line.length) lines[N++] = line;
      }
      if (!N) {
        o.type = null;
        delete o.coordinates;
      } else if (N < 2) {
        o.type = "LineString";
        o.coordinates = lines[0];
      } else {
        o.coordinates.length = N;
      }
    },
    Polygon: function(o) {
      for (var rings = o.coordinates, i = 0, N = 0, n = rings.length; i < n; ++i) {
        var ring = rings[i];
        if (ring.length) rings[N++] = ring;
      }
      if (!N) {
        o.type = null;
        delete o.coordinates;
      } else {
        o.coordinates.length = N;
      }
    },
    MultiPolygon: function(o) {
      for (var polygons = o.coordinates, j = 0, M = 0, m = polygons.length; j < m; ++j) {
        for (var rings = polygons[j], i = 0, N = 0, n = rings.length; i < n; ++i) {
          var ring = rings[i];
          if (ring.length) rings[N++] = ring;
        }
        if (N) {
          rings.length = N;
          polygons[M++] = rings;
        }
      }
      if (!M) {
        o.type = null;
        delete o.coordinates;
      } else if (M < 2) {
        o.type = "Polygon";
        o.coordinates = polygons[0];
      } else {
        polygons.length = M;
      }
    }
  };

  for (var key in objects) {
    objects[key] = geomifyObject(objects[key]);
  }

  return objects;
};

},{}],20:[function(_dereq_,module,exports){
module.exports = function(objects, filter) {

  function prefilterGeometry(geometry) {
    if (!geometry) return {type: null};
    if (prefilterGeometryType.hasOwnProperty(geometry.type)) prefilterGeometryType[geometry.type](geometry);
    return geometry;
  }

  var prefilterGeometryType = {
    GeometryCollection: function(o) {
      var geometries = o.geometries, i = -1, n = geometries.length;
      while (++i < n) geometries[i] = prefilterGeometry(geometries[i]);
    },
    Polygon: function(o) {
      for (var rings = o.coordinates, i = 0, N = 0, n = rings.length; i < n; ++i) {
        var ring = rings[i];
        if (filter(ring)) rings[N++] = ring;
      }
      if (!N) {
        o.type = null;
        delete o.coordinates;
      } else {
        o.coordinates.length = N;
      }
    },
    MultiPolygon: function(o) {
      for (var polygons = o.coordinates, j = 0, M = 0, m = polygons.length; j < m; ++j) {
        for (var rings = polygons[j], i = 0, N = 0, n = rings.length; i < n; ++i) {
          var ring = rings[i];
          if (filter(ring)) rings[N++] = ring;
        }
        if (N) {
          rings.length = N;
          polygons[M++] = rings;
        }
      }
      if (!M) {
        o.type = null;
        delete o.coordinates;
      } else if (M < 2) {
        o.type = "Polygon";
        o.coordinates = polygons[0];
      } else {
        polygons.length = M;
      }
    }
  };

  for (var key in objects) {
    objects[key] = prefilterGeometry(objects[key]);
  }

  return objects;
};

},{}],21:[function(_dereq_,module,exports){
module.exports = function(topology, options) {
  var verbose = false,
      objects = topology.objects,
      oldArcs = topology.arcs,
      oldArcCount = oldArcs.length,
      newArcs = topology.arcs = [],
      newArcCount = 0,
      newIndexByOldIndex = new Array(oldArcs.length);

  if (options)
    "verbose" in options && (verbose = !!options["verbose"]);

  function pruneGeometry(geometry) {
    if (geometry && pruneGeometryType.hasOwnProperty(geometry.type)) pruneGeometryType[geometry.type](geometry);
  }

  var pruneGeometryType = {
    GeometryCollection: function(o) { o.geometries.forEach(pruneGeometry); },
    LineString: function(o) { pruneArcs(o.arcs); },
    MultiLineString: function(o) { o.arcs.forEach(pruneArcs); },
    Polygon: function(o) { o.arcs.forEach(pruneArcs); },
    MultiPolygon: function(o) { o.arcs.forEach(pruneMultiArcs); }
  };

  function pruneArcs(arcs) {
    for (var i = 0, m = 0, n = arcs.length; i < n; ++i) {
      var oldIndex = arcs[i],
          oldReverse = oldIndex < 0 && (oldIndex = ~oldIndex, true),
          oldArc = oldArcs[oldIndex],
          newIndex;

      // Skip collapsed arc segments.
      if (oldArc.length < 3 && !oldArc[1][0] && !oldArc[1][1]) continue;

      // If this is the first instance of this arc,
      // record it under its new index.
      if ((newIndex = newIndexByOldIndex[oldIndex]) == null) {
        newIndexByOldIndex[oldIndex] = newIndex = newArcCount++;
        newArcs[newIndex] = oldArcs[oldIndex];
      }

      arcs[m++] = oldReverse ? ~newIndex : newIndex;
    }

    // If all were collapsed, restore the last arc to avoid collapsing the line.
    if (!(arcs.length = m) && n) {

      // If this is the first instance of this arc,
      // record it under its new index.
      if ((newIndex = newIndexByOldIndex[oldIndex]) == null) {
        newIndexByOldIndex[oldIndex] = newIndex = newArcCount++;
        newArcs[newIndex] = oldArcs[oldIndex];
      }

      arcs[0] = oldReverse ? ~newIndex : newIndex;
    }
  }

  function pruneMultiArcs(arcs) {
    arcs.forEach(pruneArcs);
  }

  for (var key in objects) {
    pruneGeometry(objects[key]);
  }

  if (verbose) console.warn("prune: retained " + newArcCount + " / " + oldArcCount + " arcs (" + Math.round(newArcCount / oldArcCount * 100) + "%)");

  return topology;
};

function noop() {}

},{}],22:[function(_dereq_,module,exports){
module.exports = function(objects, bbox, Q) {
  var x0 = isFinite(bbox[0]) ? bbox[0] : 0,
      y0 = isFinite(bbox[1]) ? bbox[1] : 0,
      x1 = isFinite(bbox[2]) ? bbox[2] : 0,
      y1 = isFinite(bbox[3]) ? bbox[3] : 0,
      kx = x1 - x0 ? (Q - 1) / (x1 - x0) : 1,
      ky = y1 - y0 ? (Q - 1) / (y1 - y0) : 1;

  function quantizeGeometry(geometry) {
    if (geometry && quantizeGeometryType.hasOwnProperty(geometry.type)) quantizeGeometryType[geometry.type](geometry);
  }

  var quantizeGeometryType = {
    GeometryCollection: function(o) { o.geometries.forEach(quantizeGeometry); },
    Point: function(o) { quantizePoint(o.coordinates); },
    MultiPoint: function(o) { o.coordinates.forEach(quantizePoint); },
    LineString: function(o) {
      var line = o.coordinates;
      quantizeLine(line);
      if (line.length < 2) line[1] = line[0]; // must have 2+
    },
    MultiLineString: function(o) {
      for (var lines = o.coordinates, i = 0, n = lines.length; i < n; ++i) {
        var line = lines[i];
        quantizeLine(line);
        if (line.length < 2) line[1] = line[0]; // must have 2+
      }
    },
    Polygon: function(o) {
      for (var rings = o.coordinates, i = 0, n = rings.length; i < n; ++i) {
        var ring = rings[i];
        quantizeLine(ring);
        while (ring.length < 4) ring.push(ring[0]); // must have 4+
      }
    },
    MultiPolygon: function(o) {
      for (var polygons = o.coordinates, i = 0, n = polygons.length; i < n; ++i) {
        for (var rings = polygons[i], j = 0, m = rings.length; j < m; ++j) {
          var ring = rings[j];
          quantizeLine(ring);
          while (ring.length < 4) ring.push(ring[0]); // must have 4+
        }
      }
    }
  };

  function quantizePoint(coordinates) {
    coordinates[0] = Math.round((coordinates[0] - x0) * kx);
    coordinates[1] = Math.round((coordinates[1] - y0) * ky);
  }

  function quantizeLine(coordinates) {
    var i = 0,
        j = 1,
        n = coordinates.length,
        pi = coordinates[0],
        pj,
        px = pi[0] = Math.round((pi[0] - x0) * kx),
        py = pi[1] = Math.round((pi[1] - y0) * ky),
        x,
        y;

    while (++i < n) {
      pi = coordinates[i];
      x = Math.round((pi[0] - x0) * kx);
      y = Math.round((pi[1] - y0) * ky);
      if (x !== px || y !== py) { // skip coincident points
        pj = coordinates[j++];
        pj[0] = px = x;
        pj[1] = py = y;
      }
    }

    coordinates.length = j;
  }

  for (var key in objects) {
    quantizeGeometry(objects[key]);
  }

  return {
    scale: [1 / kx, 1 / ky],
    translate: [x0, y0]
  };
};

},{}],23:[function(_dereq_,module,exports){
var topojson = _dereq_("../../"),
    systems = _dereq_("./coordinate-systems");

module.exports = function(topology, options) {
  var minimumArea = 0,
      retainProportion,
      verbose = false,
      system = null,
      N = topology.arcs.reduce(function(p, v) { return p + v.length; }, 0),
      M = 0;

  if (options)
    "minimum-area" in options && (minimumArea = +options["minimum-area"]),
    "coordinate-system" in options && (system = systems[options["coordinate-system"]]),
    "retain-proportion" in options && (retainProportion = +options["retain-proportion"]),
    "verbose" in options && (verbose = !!options["verbose"]);

  topojson.presimplify(topology, system.triangleArea);

  if (retainProportion) {
    var areas = [];
    topology.arcs.forEach(function(arc) {
      arc.forEach(function(point) {
        areas.push(point[2]);
      });
    });
    options["minimum-area"] = minimumArea = N ? areas.sort(function(a, b) { return b - a; })[Math.ceil((N - 1) * retainProportion)] : 0;
    if (verbose) console.warn("simplification: effective minimum area " + minimumArea.toPrecision(3));
  }

  topology.arcs.forEach(topology.transform ? function(arc) {
    var dx = 0,
        dy = 0, // accumulate removed points
        i = -1,
        j = -1,
        n = arc.length,
        source,
        target;

    while (++i < n) {
      source = arc[i];
      if (source[2] >= minimumArea) {
        target = arc[++j];
        target[0] = source[0] + dx;
        target[1] = source[1] + dy;
        dx = dy = 0;
      } else {
        dx += source[0];
        dy += source[1];
      }
    }

    arc.length = ++j;
  } : function(arc) {
    var i = -1,
        j = -1,
        n = arc.length,
        point;

    while (++i < n) {
      point = arc[i];
      if (point[2] >= minimumArea) {
        arc[++j] = point;
      }
    }

    arc.length = ++j;
  });

  // Remove computed area (z) for each point.
  // This is done as a separate pass because some coordinates may be shared
  // between arcs (such as the last point and first point of a cut line).
  topology.arcs.forEach(function(arc) {
    var i = -1, n = arc.length;
    while (++i < n) arc[i].length = 2;
    M += arc.length;
  });

  if (verbose) console.warn("simplification: retained " + M + " / " + N + " points (" + Math.round((M / N) * 100) + "%)");

  return topology;
};

},{"../../":10,"./coordinate-systems":16}],24:[function(_dereq_,module,exports){
var π = Math.PI,
    π_4 = π / 4,
    radians = π / 180;

exports.name = "spherical";
exports.formatDistance = formatDistance;
exports.ringArea = ringArea;
exports.absoluteArea = absoluteArea;
exports.triangleArea = triangleArea;
exports.distance = haversinDistance; // XXX why two implementations?

function formatDistance(radians) {
  var km = radians * 6371;
  return (km > 1 ? km.toFixed(3) + "km" : (km * 1000).toPrecision(3) + "m")
      + " (" + (radians * 180 / Math.PI).toPrecision(3) + "°)";
}

function ringArea(ring) {
  if (!ring.length) return 0;
  var area = 0,
      p = ring[0],
      λ = p[0] * radians,
      φ = p[1] * radians / 2 + π_4,
      λ0 = λ,
      cosφ0 = Math.cos(φ),
      sinφ0 = Math.sin(φ);

  for (var i = 1, n = ring.length; i < n; ++i) {
    p = ring[i], λ = p[0] * radians, φ = p[1] * radians / 2 + π_4;

    // Spherical excess E for a spherical triangle with vertices: south pole,
    // previous point, current point.  Uses a formula derived from Cagnoli’s
    // theorem.  See Todhunter, Spherical Trig. (1871), Sec. 103, Eq. (2).
    var dλ = λ - λ0,
        cosφ = Math.cos(φ),
        sinφ = Math.sin(φ),
        k = sinφ0 * sinφ,
        u = cosφ0 * cosφ + k * Math.cos(dλ),
        v = k * Math.sin(dλ);
    area += Math.atan2(v, u);

    // Advance the previous point.
    λ0 = λ, cosφ0 = cosφ, sinφ0 = sinφ;
  }

  return 2 * (area > π ? area - 2 * π : area < -π ? area + 2 * π : area);
}

function absoluteArea(a) {
  return a < 0 ? a + 4 * π : a;
}

function triangleArea(t) {
  var a = distance(t[0], t[1]),
      b = distance(t[1], t[2]),
      c = distance(t[2], t[0]),
      s = (a + b + c) / 2;
  return 4 * Math.atan(Math.sqrt(Math.max(0, Math.tan(s / 2) * Math.tan((s - a) / 2) * Math.tan((s - b) / 2) * Math.tan((s - c) / 2))));
}

function distance(a, b) {
  var Δλ = (b[0] - a[0]) * radians,
      sinΔλ = Math.sin(Δλ),
      cosΔλ = Math.cos(Δλ),
      sinφ0 = Math.sin(a[1] * radians),
      cosφ0 = Math.cos(a[1] * radians),
      sinφ1 = Math.sin(b[1] * radians),
      cosφ1 = Math.cos(b[1] * radians),
      _;
  return Math.atan2(Math.sqrt((_ = cosφ1 * sinΔλ) * _ + (_ = cosφ0 * sinφ1 - sinφ0 * cosφ1 * cosΔλ) * _), sinφ0 * sinφ1 + cosφ0 * cosφ1 * cosΔλ);
}

function haversinDistance(x0, y0, x1, y1) {
  x0 *= radians, y0 *= radians, x1 *= radians, y1 *= radians;
  return 2 * Math.asin(Math.sqrt(haversin(y1 - y0) + Math.cos(y0) * Math.cos(y1) * haversin(x1 - x0)));
}

function haversin(x) {
  return (x = Math.sin(x / 2)) * x;
}

},{}],25:[function(_dereq_,module,exports){
var type = _dereq_("./type");

module.exports = function(objects, transform) {
  var ε = 1e-2,
      x0 = -180, x0e = x0 + ε,
      x1 = 180, x1e = x1 - ε,
      y0 = -90, y0e = y0 + ε,
      y1 = 90, y1e = y1 - ε,
      fragments = [];

  if (transform) {
    var kx = transform.scale[0],
        ky = transform.scale[1],
        dx = transform.translate[0],
        dy = transform.translate[1];

    x0 = Math.round((x0 - dx) / kx);
    x1 = Math.round((x1 - dx) / kx);
    y0 = Math.round((y0 - dy) / ky);
    y1 = Math.round((y1 - dy) / ky);
    x0e = Math.round((x0e - dx) / kx);
    x1e = Math.round((x1e - dx) / kx);
    y0e = Math.round((y0e - dy) / ky);
    y1e = Math.round((y1e - dy) / ky);
  }

  function normalizePoint(y) {
    return y <= y0e ? [0, y0] // south pole
        : y >= y1e ? [0, y1] // north pole
        : [x0, y]; // antimeridian
  }

  var stitch = type({
    polygon: function(polygon) {
      var rings = [];

      // For each ring, detect where it crosses the antimeridian or pole.
      for (var j = 0, m = polygon.length; j < m; ++j) {
        var ring = polygon[j],
            fragments = [];

        // By default, assume that this ring doesn’t need any stitching.
        fragments.push(ring);

        for (var i = 0, n = ring.length; i < n; ++i) {
          var point = ring[i],
              x = point[0],
              y = point[1];

          // If this is an antimeridian or polar point…
          if (x <= x0e || x >= x1e || y <= y0e || y >= y1e) {

            // Advance through any antimeridian or polar points…
            for (var k = i + 1; k < n; ++k) {
              var pointk = ring[k],
                  xk = pointk[0],
                  yk = pointk[1];
              if (xk > x0e && xk < x1e && yk > y0e && yk < y1e) break;
            }

            // If this was just a single antimeridian or polar point,
            // we don’t need to cut this ring into a fragment;
            // we can just leave it as-is.
            if (k === i + 1) continue;

            // Otherwise, if this is not the first point in the ring,
            // cut the current fragment so that it ends at the current point.
            // The current point is also normalized for later joining.
            if (i) {
              var fragmentBefore = ring.slice(0, i + 1);
              fragmentBefore[fragmentBefore.length - 1] = normalizePoint(y);
              fragments[fragments.length - 1] = fragmentBefore;
            }

            // If the ring started with an antimeridian fragment,
            // we can ignore that fragment entirely.
            else {
              fragments.pop();
            }

            // If the remainder of the ring is an antimeridian fragment,
            // move on to the next ring.
            if (k >= n) break;

            // Otherwise, add the remaining ring fragment and continue.
            fragments.push(ring = ring.slice(k - 1));
            ring[0] = normalizePoint(ring[0][1]);
            i = -1;
            n = ring.length;
          }
        }

        // Now stitch the fragments back together into rings.
        // To connect the fragments start-to-end, create a simple index by end.
        var fragmentByStart = {},
            fragmentByEnd = {};

        // For each fragment…
        for (var i = 0, n = fragments.length; i < n; ++i) {
          var fragment = fragments[i],
              start = fragment[0],
              end = fragment[fragment.length - 1];

          // If this fragment is closed, add it as a standalone ring.
          if (start[0] === end[0] && start[1] === end[1]) {
            rings.push(fragment);
            fragments[i] = null;
            continue;
          }

          fragment.index = i;
          fragmentByStart[start] = fragmentByEnd[end] = fragment;
        }

        // For each open fragment…
        for (var i = 0; i < n; ++i) {
          var fragment = fragments[i];
          if (fragment) {

            var start = fragment[0],
                end = fragment[fragment.length - 1],
                startFragment = fragmentByEnd[start],
                endFragment = fragmentByStart[end];

            delete fragmentByStart[start];
            delete fragmentByEnd[end];

            // If this fragment is closed, add it as a standalone ring.
            if (start[0] === end[0] && start[1] === end[1]) {
              rings.push(fragment);
              continue;
            }

            if (startFragment) {
              delete fragmentByEnd[start];
              delete fragmentByStart[startFragment[0]];
              startFragment.pop(); // drop the shared coordinate
              fragments[startFragment.index] = null;
              fragment = startFragment.concat(fragment);

              if (startFragment === endFragment) {
                // Connect both ends to this single fragment to create a ring.
                rings.push(fragment);
              } else {
                fragment.index = n++;
                fragments.push(fragmentByStart[fragment[0]] = fragmentByEnd[fragment[fragment.length - 1]] = fragment);
              }
            } else if (endFragment) {
              delete fragmentByStart[end];
              delete fragmentByEnd[endFragment[endFragment.length - 1]];
              fragment.pop(); // drop the shared coordinate
              fragment = fragment.concat(endFragment);
              fragment.index = n++;
              fragments[endFragment.index] = null;
              fragments.push(fragmentByStart[fragment[0]] = fragmentByEnd[fragment[fragment.length - 1]] = fragment);
            } else {
              fragment.push(fragment[0]); // close ring
              rings.push(fragment);
            }
          }
        }
      }

      // Copy the rings into the target polygon.
      for (var i = 0, n = polygon.length = rings.length; i < n; ++i) {
        polygon[i] = rings[i];
      }
    }
  });

  for (var key in objects) {
    stitch.object(objects[key]);
  }
};

},{"./type":36}],26:[function(_dereq_,module,exports){
var type = _dereq_("./type"),
    stitch = _dereq_("./stitch"),
    systems = _dereq_("./coordinate-systems"),
    topologize = _dereq_("./topology/index"),
    delta = _dereq_("./delta"),
    geomify = _dereq_("./geomify"),
    prefilter = _dereq_("./prefilter"),
    quantize = _dereq_("./quantize"),
    bounds = _dereq_("./bounds"),
    computeId = _dereq_("./compute-id"),
    transformProperties = _dereq_("./transform-properties");

var ε = 1e-6;

module.exports = function(objects, options) {
  var Q = 1e4, // precision of quantization
      id = function(d) { return d.id; }, // function to compute object id
      propertyTransform = function() {}, // function to transform properties
      transform,
      minimumArea = 0,
      stitchPoles = true,
      verbose = false,
      system = null;

  if (options)
    "verbose" in options && (verbose = !!options["verbose"]),
    "stitch-poles" in options && (stitchPoles = !!options["stitch-poles"]),
    "coordinate-system" in options && (system = systems[options["coordinate-system"]]),
    "minimum-area" in options && (minimumArea = +options["minimum-area"]),
    "quantization" in options && (Q = +options["quantization"]),
    "id" in options && (id = options["id"]),
    "property-transform" in options && (propertyTransform = options["property-transform"]);

  // Compute the new feature id and transform properties.
  computeId(objects, id);
  transformProperties(objects, propertyTransform);

  // Convert to geometry objects.
  geomify(objects);

  // Compute initial bounding box.
  var bbox = bounds(objects);

  // For automatic coordinate system determination, consider the bounding box.
  var oversize = bbox[0] < -180 - ε
      || bbox[1] < -90 - ε
      || bbox[2] > 180 + ε
      || bbox[3] > 90 + ε;
  if (!system) {
    system = systems[oversize ? "cartesian" : "spherical"];
    if (options) options["coordinate-system"] = system.name;
  }

  if (system === systems.spherical) {
    if (oversize) throw new Error("spherical coordinates outside of [±180°, ±90°]");

    // When near the spherical coordinate limits, clamp to nice round values.
    // This avoids quantized coordinates that are slightly outside the limits.
    if (bbox[0] < -180 + ε) bbox[0] = -180;
    if (bbox[1] < -90 + ε) bbox[1] = -90;
    if (bbox[2] > 180 - ε) bbox[2] = 180;
    if (bbox[3] > 90 - ε) bbox[3] = 90;
  }

  if (verbose) {
    console.warn("bounds: " + bbox.join(" ") + " (" + system.name + ")");
  }

  // Filter rings smaller than the minimum area.
  // This can produce a simpler topology.
  if (minimumArea) prefilter(objects, function(ring) {
    return system.absoluteArea(system.ringArea(ring)) >= minimumArea;
  });

  // Compute the quantization transform.
  if (Q) {
    transform = quantize(objects, bbox, Q);
    if (verbose) {
      console.warn("quantization: " + transform.scale.map(function(degrees) { return system.formatDistance(degrees / 180 * Math.PI); }).join(" "));
    }
  }

  // Remove any antimeridian cuts and restitch.
  if (system === systems.spherical && stitchPoles) {
    stitch(objects, transform);
  }

  // Compute the topology.
  var topology = topologize(objects);
  topology.bbox = bbox;

  if (verbose) {
    console.warn("topology: " + topology.arcs.length + " arcs, " + topology.arcs.reduce(function(p, v) { return p + v.length; }, 0) + " points");
  }

  // Convert to delta-encoding.
  if (Q) topology.transform = transform, delta(topology);

  return topology;
};

},{"./bounds":12,"./compute-id":15,"./coordinate-systems":16,"./delta":17,"./geomify":19,"./prefilter":20,"./quantize":22,"./stitch":25,"./topology/index":31,"./transform-properties":35,"./type":36}],27:[function(_dereq_,module,exports){
var join = _dereq_("./join");

// Given an extracted (pre-)topology, cuts (or rotates) arcs so that all shared
// point sequences are identified. The topology can then be subsequently deduped
// to remove exact duplicate arcs.
module.exports = function(topology) {
  var junctionByPoint = join(topology),
      coordinates = topology.coordinates,
      lines = topology.lines,
      rings = topology.rings;

  for (var i = 0, n = lines.length; i < n; ++i) {
    var line = lines[i],
        lineMid = line[0],
        lineEnd = line[1];
    while (++lineMid < lineEnd) {
      if (junctionByPoint.get(coordinates[lineMid])) {
        var next = {0: lineMid, 1: line[1]};
        line[1] = lineMid;
        line = line.next = next;
      }
    }
  }

  for (var i = 0, n = rings.length; i < n; ++i) {
    var ring = rings[i],
        ringStart = ring[0],
        ringMid = ringStart,
        ringEnd = ring[1],
        ringFixed = junctionByPoint.get(coordinates[ringStart]);
    while (++ringMid < ringEnd) {
      if (junctionByPoint.get(coordinates[ringMid])) {
        if (ringFixed) {
          var next = {0: ringMid, 1: ring[1]};
          ring[1] = ringMid;
          ring = ring.next = next;
        } else { // For the first junction, we can rotate rather than cut.
          rotateArray(coordinates, ringStart, ringEnd, ringEnd - ringMid);
          coordinates[ringEnd] = coordinates[ringStart];
          ringFixed = true;
          ringMid = ringStart; // restart; we may have skipped junctions
        }
      }
    }
  }

  return topology;
};

function rotateArray(array, start, end, offset) {
  reverse(array, start, end);
  reverse(array, start, start + offset);
  reverse(array, start + offset, end);
}

function reverse(array, start, end) {
  for (var mid = start + ((end-- - start) >> 1), t; start < mid; ++start, --end) {
    t = array[start], array[start] = array[end], array[end] = t;
  }
}

},{"./join":32}],28:[function(_dereq_,module,exports){
var join = _dereq_("./join"),
    hashtable = _dereq_("./hashtable"),
    hashPoint = _dereq_("./point-hash"),
    equalPoint = _dereq_("./point-equal");

// Given a cut topology, combines duplicate arcs.
module.exports = function(topology) {
  var coordinates = topology.coordinates,
      lines = topology.lines,
      rings = topology.rings,
      arcCount = lines.length + rings.length;

  delete topology.lines;
  delete topology.rings;

  // Count the number of (non-unique) arcs to initialize the hashtable safely.
  for (var i = 0, n = lines.length; i < n; ++i) {
    var line = lines[i]; while (line = line.next) ++arcCount;
  }
  for (var i = 0, n = rings.length; i < n; ++i) {
    var ring = rings[i]; while (ring = ring.next) ++arcCount;
  }

  var arcsByEnd = hashtable(arcCount * 2, hashPoint, equalPoint),
      arcs = topology.arcs = [];

  for (var i = 0, n = lines.length; i < n; ++i) {
    var line = lines[i];
    do {
      dedupLine(line);
    } while (line = line.next);
  }

  for (var i = 0, n = rings.length; i < n; ++i) {
    var ring = rings[i];
    if (ring.next) { // arc is no longer closed
      do {
        dedupLine(ring);
      } while (ring = ring.next);
    } else {
      dedupRing(ring);
    }
  }

  function dedupLine(arc) {
    var startPoint,
        endPoint,
        startArcs,
        endArcs;

    // Does this arc match an existing arc in order?
    if (startArcs = arcsByEnd.get(startPoint = coordinates[arc[0]])) {
      for (var i = 0, n = startArcs.length; i < n; ++i) {
        var startArc = startArcs[i];
        if (equalLine(startArc, arc)) {
          arc[0] = startArc[0];
          arc[1] = startArc[1];
          return;
        }
      }
    }

    // Does this arc match an existing arc in reverse order?
    if (endArcs = arcsByEnd.get(endPoint = coordinates[arc[1]])) {
      for (var i = 0, n = endArcs.length; i < n; ++i) {
        var endArc = endArcs[i];
        if (reverseEqualLine(endArc, arc)) {
          arc[1] = endArc[0];
          arc[0] = endArc[1];
          return;
        }
      }
    }

    if (startArcs) startArcs.push(arc); else arcsByEnd.set(startPoint, [arc]);
    if (endArcs) endArcs.push(arc); else arcsByEnd.set(endPoint, [arc]);
    arcs.push(arc);
  }

  function dedupRing(arc) {
    var endPoint,
        endArcs;

    // Does this arc match an existing line in order, or reverse order?
    // Rings are closed, so their start point and end point is the same.
    if (endArcs = arcsByEnd.get(endPoint = coordinates[arc[0]])) {
      for (var i = 0, n = endArcs.length; i < n; ++i) {
        var endArc = endArcs[i];
        if (equalRing(endArc, arc)) {
          arc[0] = endArc[0];
          arc[1] = endArc[1];
          return;
        }
        if (reverseEqualRing(endArc, arc)) {
          arc[0] = endArc[1];
          arc[1] = endArc[0];
          return;
        }
      }
    }

    // Otherwise, does this arc match an existing ring in order, or reverse order?
    if (endArcs = arcsByEnd.get(endPoint = coordinates[arc[0] + findMinimumOffset(arc)])) {
      for (var i = 0, n = endArcs.length; i < n; ++i) {
        var endArc = endArcs[i];
        if (equalRing(endArc, arc)) {
          arc[0] = endArc[0];
          arc[1] = endArc[1];
          return;
        }
        if (reverseEqualRing(endArc, arc)) {
          arc[0] = endArc[1];
          arc[1] = endArc[0];
          return;
        }
      }
    }

    if (endArcs) endArcs.push(arc); else arcsByEnd.set(endPoint, [arc]);
    arcs.push(arc);
  }

  function equalLine(arcA, arcB) {
    var ia = arcA[0], ib = arcB[0],
        ja = arcA[1], jb = arcB[1];
    if (ia - ja !== ib - jb) return false;
    for (; ia <= ja; ++ia, ++ib) if (!equalPoint(coordinates[ia], coordinates[ib])) return false;
    return true;
  }

  function reverseEqualLine(arcA, arcB) {
    var ia = arcA[0], ib = arcB[0],
        ja = arcA[1], jb = arcB[1];
    if (ia - ja !== ib - jb) return false;
    for (; ia <= ja; ++ia, --jb) if (!equalPoint(coordinates[ia], coordinates[jb])) return false;
    return true;
  }

  function equalRing(arcA, arcB) {
    var ia = arcA[0], ib = arcB[0],
        ja = arcA[1], jb = arcB[1],
        n = ja - ia;
    if (n !== jb - ib) return false;
    var ka = findMinimumOffset(arcA),
        kb = findMinimumOffset(arcB);
    for (var i = 0; i < n; ++i) {
      if (!equalPoint(coordinates[ia + (i + ka) % n], coordinates[ib + (i + kb) % n])) return false;
    }
    return true;
  }

  function reverseEqualRing(arcA, arcB) {
    var ia = arcA[0], ib = arcB[0],
        ja = arcA[1], jb = arcB[1],
        n = ja - ia;
    if (n !== jb - ib) return false;
    var ka = findMinimumOffset(arcA),
        kb = n - findMinimumOffset(arcB);
    for (var i = 0; i < n; ++i) {
      if (!equalPoint(coordinates[ia + (i + ka) % n], coordinates[jb - (i + kb) % n])) return false;
    }
    return true;
  }

  // Rings are rotated to a consistent, but arbitrary, start point.
  // This is necessary to detect when a ring and a rotated copy are dupes.
  function findMinimumOffset(arc) {
    var start = arc[0],
        end = arc[1],
        mid = start,
        minimum = mid,
        minimumPoint = coordinates[mid];
    while (++mid < end) {
      var point = coordinates[mid];
      if (point[0] < minimumPoint[0] || point[0] === minimumPoint[0] && point[1] < minimumPoint[1]) {
        minimum = mid;
        minimumPoint = point;
      }
    }
    return minimum - start;
  }

  return topology;
};

},{"./hashtable":30,"./join":32,"./point-equal":33,"./point-hash":34}],29:[function(_dereq_,module,exports){
// Extracts the lines and rings from the specified hash of geometry objects.
//
// Returns an object with three properties:
//
// * coordinates - shared buffer of [x, y] coordinates
// * lines - lines extracted from the hash, of the form [start, end]
// * rings - rings extracted from the hash, of the form [start, end]
//
// For each ring or line, start and end represent inclusive indexes into the
// coordinates buffer. For rings (and closed lines), coordinates[start] equals
// coordinates[end].
//
// For each line or polygon geometry in the input hash, including nested
// geometries as in geometry collections, the `coordinates` array is replaced
// with an equivalent `arcs` array that, for each line (for line string
// geometries) or ring (for polygon geometries), points to one of the above
// lines or rings.
module.exports = function(objects) {
  var index = -1,
      lines = [],
      rings = [],
      coordinates = [];

  function extractGeometry(geometry) {
    if (geometry && extractGeometryType.hasOwnProperty(geometry.type)) extractGeometryType[geometry.type](geometry);
  }

  var extractGeometryType = {
    GeometryCollection: function(o) { o.geometries.forEach(extractGeometry); },
    LineString: function(o) { o.arcs = extractLine(o.coordinates); delete o.coordinates; },
    MultiLineString: function(o) { o.arcs = o.coordinates.map(extractLine); delete o.coordinates; },
    Polygon: function(o) { o.arcs = o.coordinates.map(extractRing); delete o.coordinates; },
    MultiPolygon: function(o) { o.arcs = o.coordinates.map(extractMultiRing); delete o.coordinates; }
  };

  function extractLine(line) {
    for (var i = 0, n = line.length; i < n; ++i) coordinates[++index] = line[i];
    var arc = {0: index - n + 1, 1: index};
    lines.push(arc);
    return arc;
  }

  function extractRing(ring) {
    for (var i = 0, n = ring.length; i < n; ++i) coordinates[++index] = ring[i];
    var arc = {0: index - n + 1, 1: index};
    rings.push(arc);
    return arc;
  }

  function extractMultiRing(rings) {
    return rings.map(extractRing);
  }

  for (var key in objects) {
    extractGeometry(objects[key]);
  }

  return {
    type: "Topology",
    coordinates: coordinates,
    lines: lines,
    rings: rings,
    objects: objects
  };
};

},{}],30:[function(_dereq_,module,exports){
module.exports = function(size, hash, equal) {
  var hashtable = new Array(size = 1 << Math.ceil(Math.log(size) / Math.LN2)),
      mask = size - 1,
      free = size;

  function set(key, value) {
    var index = hash(key) & mask,
        match = hashtable[index],
        cycle = !index;
    while (match != null) {
      if (equal(match.key, key)) return match.value = value;
      match = hashtable[index = (index + 1) & mask];
      if (!index && cycle++) throw new Error("full hashtable");
    }
    hashtable[index] = {key: key, value: value};
    --free;
    return value;
  }

  function get(key, missingValue) {
    var index = hash(key) & mask,
        match = hashtable[index],
        cycle = !index;
    while (match != null) {
      if (equal(match.key, key)) return match.value;
      match = hashtable[index = (index + 1) & mask];
      if (!index && cycle++) break;
    }
    return missingValue;
  }

  function remove(key) {
    var index = hash(key) & mask,
        match = hashtable[index],
        cycle = !index;
    while (match != null) {
      if (equal(match.key, key)) {
        hashtable[index] = null;
        match = hashtable[index = (index + 1) & mask];
        if (match != null) { // delete and re-add
          ++free;
          hashtable[index] = null;
          set(match.key, match.value);
        }
        ++free;
        return true;
      }
      match = hashtable[index = (index + 1) & mask];
      if (!index && cycle++) break;
    }
    return false;
  }

  function keys() {
    var keys = [];
    for (var i = 0, n = hashtable.length; i < n; ++i) {
      var match = hashtable[i];
      if (match != null) keys.push(match.key);
    }
    return keys;
  }

  return {
    set: set,
    get: get,
    remove: remove,
    keys: keys
  };
};

},{}],31:[function(_dereq_,module,exports){
var hashtable = _dereq_("./hashtable"),
    extract = _dereq_("./extract"),
    cut = _dereq_("./cut"),
    dedup = _dereq_("./dedup");

// Constructs the TopoJSON Topology for the specified hash of geometries.
// Each object in the specified hash must be a GeoJSON object,
// meaning FeatureCollection, a Feature or a geometry object.
module.exports = function(objects) {
  var topology = dedup(cut(extract(objects))),
      coordinates = topology.coordinates,
      indexByArc = hashtable(topology.arcs.length, hashArc, equalArc);

  objects = topology.objects; // for garbage collection

  topology.arcs = topology.arcs.map(function(arc, i) {
    indexByArc.set(arc, i);
    return coordinates.slice(arc[0], arc[1] + 1);
  });

  delete topology.coordinates;
  coordinates = null;

  function indexGeometry(geometry) {
    if (geometry && indexGeometryType.hasOwnProperty(geometry.type)) indexGeometryType[geometry.type](geometry);
  }

  var indexGeometryType = {
    GeometryCollection: function(o) { o.geometries.forEach(indexGeometry); },
    LineString: function(o) { o.arcs = indexArcs(o.arcs); },
    MultiLineString: function(o) { o.arcs = o.arcs.map(indexArcs); },
    Polygon: function(o) { o.arcs = o.arcs.map(indexArcs); },
    MultiPolygon: function(o) { o.arcs = o.arcs.map(indexMultiArcs); }
  };

  function indexArcs(arc) {
    var indexes = [];
    do {
      var index = indexByArc.get(arc);
      indexes.push(arc[0] < arc[1] ? index : ~index);
    } while (arc = arc.next);
    return indexes;
  }

  function indexMultiArcs(arcs) {
    return arcs.map(indexArcs);
  }

  for (var key in objects) {
    indexGeometry(objects[key]);
  }

  return topology;
};

function hashArc(arc) {
  var i = arc[0], j = arc[1], t;
  if (j < i) t = i, i = j, j = t;
  return i + 31 * j;
}

function equalArc(arcA, arcB) {
  var ia = arcA[0], ja = arcA[1],
      ib = arcB[0], jb = arcB[1], t;
  if (ja < ia) t = ia, ia = ja, ja = t;
  if (jb < ib) t = ib, ib = jb, jb = t;
  return ia === ib && ja === jb;
}

},{"./cut":27,"./dedup":28,"./extract":29,"./hashtable":30}],32:[function(_dereq_,module,exports){
var hashtable = _dereq_("./hashtable"),
    hashPoint = _dereq_("./point-hash"),
    equalPoint = _dereq_("./point-equal");

// Given an extracted (pre-)topology, identifies all of the junctions. These are
// the points at which arcs (lines or rings) will need to be cut so that each
// arc is represented uniquely.
//
// A junction is a point where at least one arc deviates from another arc going
// through the same point. For example, consider the point B. If there is a arc
// through ABC and another arc through CBA, then B is not a junction because in
// both cases the adjacent point pairs are {A,C}. However, if there is an
// additional arc ABD, then {A,D} != {A,C}, and thus B becomes a junction.
//
// For a closed ring ABCA, the first point A’s adjacent points are the second
// and last point {B,C}. For a line, the first and last point are always
// considered junctions, even if the line is closed; this ensures that a closed
// line is never rotated.
module.exports = function(topology) {
  var coordinates = topology.coordinates,
      lines = topology.lines,
      rings = topology.rings,
      visitedByPoint,
      neighborsByPoint = hashtable(coordinates.length, hashPoint, equalPoint),
      junctionByPoint = hashtable(coordinates.length, hashPoint, equalPoint);

  for (var i = 0, n = lines.length; i < n; ++i) {
    var line = lines[i],
        lineStart = line[0],
        lineEnd = line[1],
        previousPoint = null,
        currentPoint = coordinates[lineStart],
        nextPoint = coordinates[++lineStart];
    visitedByPoint = hashtable(lineEnd - lineStart, hashPoint, equalPoint);
    junctionByPoint.set(currentPoint, true); // start
    while (++lineStart <= lineEnd) {
      sequence(previousPoint = currentPoint, currentPoint = nextPoint, nextPoint = coordinates[lineStart]);
    }
    junctionByPoint.set(nextPoint, true); // end
  }

  for (var i = 0, n = rings.length; i < n; ++i) {
    var ring = rings[i],
        ringStart = ring[0] + 1,
        ringEnd = ring[1],
        previousPoint = coordinates[ringEnd - 1],
        currentPoint = coordinates[ringStart - 1],
        nextPoint = coordinates[ringStart];
    visitedByPoint = hashtable(ringEnd - ringStart + 1, hashPoint, equalPoint);
    sequence(previousPoint, currentPoint, nextPoint);
    while (++ringStart <= ringEnd) {
      sequence(previousPoint = currentPoint, currentPoint = nextPoint, nextPoint = coordinates[ringStart]);
    }
  }

  function sequence(previousPoint, currentPoint, nextPoint) {
    if (visitedByPoint.get(currentPoint)) return; // ignore self-intersection
    visitedByPoint.set(currentPoint, true);
    var neighbors = neighborsByPoint.get(currentPoint);
    if (neighbors) {
      if (!(equalPoint(neighbors[0], previousPoint)
        && equalPoint(neighbors[1], nextPoint))
        && !(equalPoint(neighbors[0], nextPoint)
        && equalPoint(neighbors[1], previousPoint))) {
        junctionByPoint.set(currentPoint, true);
      }
    } else {
      neighborsByPoint.set(currentPoint, [previousPoint, nextPoint]);
    }
  }

  return junctionByPoint;
};

},{"./hashtable":30,"./point-equal":33,"./point-hash":34}],33:[function(_dereq_,module,exports){
module.exports = function(pointA, pointB) {
  return pointA[0] === pointB[0] && pointA[1] === pointB[1];
};

},{}],34:[function(_dereq_,module,exports){
// TODO if quantized, use simpler Int32 hashing?

var hashBuffer = new ArrayBuffer(8),
    hashFloats = new Float64Array(hashBuffer),
    hashInts = new Int32Array(hashBuffer);

function hashFloat(x) {
  hashFloats[0] = x;
  x = hashInts[1] ^ hashInts[0];
  x ^= (x >>> 20) ^ (x >>> 12);
  x ^= (x >>> 7) ^ (x >>> 4);
  return x;
}

module.exports = function(point) {
  var h = (hashFloat(point[0]) + 31 * hashFloat(point[1])) | 0;
  return h < 0 ? ~h : h;
};

},{}],35:[function(_dereq_,module,exports){
// Given a hash of GeoJSON objects, transforms any properties on features using
// the specified transform function. The function is invoked for each existing
// property on the current feature, being passed the new properties hash, the
// property name, and the property value. The function is then expected to
// assign a new value to the given property hash if the feature is to be
// retained and return true. Or, to skip the property, do nothing and return
// false. If no properties are propagated to the new properties hash, the
// properties hash will be deleted from the current feature.
module.exports = function(objects, propertyTransform) {
  if (arguments.length < 2) propertyTransform = function() {};

  function transformObject(object) {
    if (object && transformObjectType.hasOwnProperty(object.type)) transformObjectType[object.type](object);
  }

  function transformFeature(feature) {
    if (feature.properties) {
      var properties0 = feature.properties,
          properties1 = {},
          empty = true;

      for (var key0 in properties0) {
        if (propertyTransform(properties1, key0, properties0[key0])) {
          empty = false;
        }
      }

      if (empty) delete feature.properties;
      else feature.properties = properties1;
    }
  }

  var transformObjectType = {
    Feature: transformFeature,
    FeatureCollection: function(collection) { collection.features.forEach(transformFeature); }
  };

  for (var key in objects) {
    transformObject(objects[key]);
  }

  return objects;
};

},{}],36:[function(_dereq_,module,exports){
module.exports = function(types) {
  for (var type in typeDefaults) {
    if (!(type in types)) {
      types[type] = typeDefaults[type];
    }
  }
  types.defaults = typeDefaults;
  return types;
};

var typeDefaults = {

  Feature: function(feature) {
    if (feature.geometry) this.geometry(feature.geometry);
  },

  FeatureCollection: function(collection) {
    var features = collection.features, i = -1, n = features.length;
    while (++i < n) this.Feature(features[i]);
  },

  GeometryCollection: function(collection) {
    var geometries = collection.geometries, i = -1, n = geometries.length;
    while (++i < n) this.geometry(geometries[i]);
  },

  LineString: function(lineString) {
    this.line(lineString.coordinates);
  },

  MultiLineString: function(multiLineString) {
    var coordinates = multiLineString.coordinates, i = -1, n = coordinates.length;
    while (++i < n) this.line(coordinates[i]);
  },

  MultiPoint: function(multiPoint) {
    var coordinates = multiPoint.coordinates, i = -1, n = coordinates.length;
    while (++i < n) this.point(coordinates[i]);
  },

  MultiPolygon: function(multiPolygon) {
    var coordinates = multiPolygon.coordinates, i = -1, n = coordinates.length;
    while (++i < n) this.polygon(coordinates[i]);
  },

  Point: function(point) {
    this.point(point.coordinates);
  },

  Polygon: function(polygon) {
    this.polygon(polygon.coordinates);
  },

  object: function(object) {
    return object == null ? null
        : typeObjects.hasOwnProperty(object.type) ? this[object.type](object)
        : this.geometry(object);
  },

  geometry: function(geometry) {
    return geometry == null ? null
        : typeGeometries.hasOwnProperty(geometry.type) ? this[geometry.type](geometry)
        : null;
  },

  point: function() {},

  line: function(coordinates) {
    var i = -1, n = coordinates.length;
    while (++i < n) this.point(coordinates[i]);
  },

  polygon: function(coordinates) {
    var i = -1, n = coordinates.length;
    while (++i < n) this.line(coordinates[i]);
  }
};

var typeGeometries = {
  LineString: 1,
  MultiLineString: 1,
  MultiPoint: 1,
  MultiPolygon: 1,
  Point: 1,
  Polygon: 1,
  GeometryCollection: 1
};

var typeObjects = {
  Feature: 1,
  FeatureCollection: 1
};

},{}],37:[function(_dereq_,module,exports){
!function() {
  var topojson = {
    version: "1.4.6",
    mesh: mesh,
    feature: featureOrCollection,
    neighbors: neighbors,
    presimplify: presimplify
  };

  function merge(topology, arcs) {
    var fragmentByStart = {},
        fragmentByEnd = {};

    arcs.forEach(function(i) {
      var e = ends(i),
          start = e[0],
          end = e[1],
          f, g;

      if (f = fragmentByEnd[start]) {
        delete fragmentByEnd[f.end];
        f.push(i);
        f.end = end;
        if (g = fragmentByStart[end]) {
          delete fragmentByStart[g.start];
          var fg = g === f ? f : f.concat(g);
          fragmentByStart[fg.start = f.start] = fragmentByEnd[fg.end = g.end] = fg;
        } else if (g = fragmentByEnd[end]) {
          delete fragmentByStart[g.start];
          delete fragmentByEnd[g.end];
          var fg = f.concat(g.map(function(i) { return ~i; }).reverse());
          fragmentByStart[fg.start = f.start] = fragmentByEnd[fg.end = g.start] = fg;
        } else {
          fragmentByStart[f.start] = fragmentByEnd[f.end] = f;
        }
      } else if (f = fragmentByStart[end]) {
        delete fragmentByStart[f.start];
        f.unshift(i);
        f.start = start;
        if (g = fragmentByEnd[start]) {
          delete fragmentByEnd[g.end];
          var gf = g === f ? f : g.concat(f);
          fragmentByStart[gf.start = g.start] = fragmentByEnd[gf.end = f.end] = gf;
        } else if (g = fragmentByStart[start]) {
          delete fragmentByStart[g.start];
          delete fragmentByEnd[g.end];
          var gf = g.map(function(i) { return ~i; }).reverse().concat(f);
          fragmentByStart[gf.start = g.end] = fragmentByEnd[gf.end = f.end] = gf;
        } else {
          fragmentByStart[f.start] = fragmentByEnd[f.end] = f;
        }
      } else if (f = fragmentByStart[start]) {
        delete fragmentByStart[f.start];
        f.unshift(~i);
        f.start = end;
        if (g = fragmentByEnd[end]) {
          delete fragmentByEnd[g.end];
          var gf = g === f ? f : g.concat(f);
          fragmentByStart[gf.start = g.start] = fragmentByEnd[gf.end = f.end] = gf;
        } else if (g = fragmentByStart[end]) {
          delete fragmentByStart[g.start];
          delete fragmentByEnd[g.end];
          var gf = g.map(function(i) { return ~i; }).reverse().concat(f);
          fragmentByStart[gf.start = g.end] = fragmentByEnd[gf.end = f.end] = gf;
        } else {
          fragmentByStart[f.start] = fragmentByEnd[f.end] = f;
        }
      } else if (f = fragmentByEnd[end]) {
        delete fragmentByEnd[f.end];
        f.push(~i);
        f.end = start;
        if (g = fragmentByEnd[start]) {
          delete fragmentByStart[g.start];
          var fg = g === f ? f : f.concat(g);
          fragmentByStart[fg.start = f.start] = fragmentByEnd[fg.end = g.end] = fg;
        } else if (g = fragmentByStart[start]) {
          delete fragmentByStart[g.start];
          delete fragmentByEnd[g.end];
          var fg = f.concat(g.map(function(i) { return ~i; }).reverse());
          fragmentByStart[fg.start = f.start] = fragmentByEnd[fg.end = g.start] = fg;
        } else {
          fragmentByStart[f.start] = fragmentByEnd[f.end] = f;
        }
      } else {
        f = [i];
        fragmentByStart[f.start = start] = fragmentByEnd[f.end = end] = f;
      }
    });

    function ends(i) {
      var arc = topology.arcs[i], p0 = arc[0], p1 = [0, 0];
      arc.forEach(function(dp) { p1[0] += dp[0], p1[1] += dp[1]; });
      return [p0, p1];
    }

    var fragments = [];
    for (var k in fragmentByEnd) fragments.push(fragmentByEnd[k]);
    return fragments;
  }

  function mesh(topology, o, filter) {
    var arcs = [];

    if (arguments.length > 1) {
      var geomsByArc = [],
          geom;

      function arc(i) {
        if (i < 0) i = ~i;
        (geomsByArc[i] || (geomsByArc[i] = [])).push(geom);
      }

      function line(arcs) {
        arcs.forEach(arc);
      }

      function polygon(arcs) {
        arcs.forEach(line);
      }

      function geometry(o) {
        if (o.type === "GeometryCollection") o.geometries.forEach(geometry);
        else if (o.type in geometryType) {
          geom = o;
          geometryType[o.type](o.arcs);
        }
      }

      var geometryType = {
        LineString: line,
        MultiLineString: polygon,
        Polygon: polygon,
        MultiPolygon: function(arcs) { arcs.forEach(polygon); }
      };

      geometry(o);

      geomsByArc.forEach(arguments.length < 3
          ? function(geoms, i) { arcs.push(i); }
          : function(geoms, i) { if (filter(geoms[0], geoms[geoms.length - 1])) arcs.push(i); });
    } else {
      for (var i = 0, n = topology.arcs.length; i < n; ++i) arcs.push(i);
    }

    return object(topology, {type: "MultiLineString", arcs: merge(topology, arcs)});
  }

  function featureOrCollection(topology, o) {
    return o.type === "GeometryCollection" ? {
      type: "FeatureCollection",
      features: o.geometries.map(function(o) { return feature(topology, o); })
    } : feature(topology, o);
  }

  function feature(topology, o) {
    var f = {
      type: "Feature",
      id: o.id,
      properties: o.properties || {},
      geometry: object(topology, o)
    };
    if (o.id == null) delete f.id;
    return f;
  }

  function object(topology, o) {
    var absolute = transformAbsolute(topology.transform),
        arcs = topology.arcs;

    function arc(i, points) {
      if (points.length) points.pop();
      for (var a = arcs[i < 0 ? ~i : i], k = 0, n = a.length, p; k < n; ++k) {
        points.push(p = a[k].slice());
        absolute(p, k);
      }
      if (i < 0) reverse(points, n);
    }

    function point(p) {
      p = p.slice();
      absolute(p, 0);
      return p;
    }

    function line(arcs) {
      var points = [];
      for (var i = 0, n = arcs.length; i < n; ++i) arc(arcs[i], points);
      if (points.length < 2) points.push(points[0].slice());
      return points;
    }

    function ring(arcs) {
      var points = line(arcs);
      while (points.length < 4) points.push(points[0].slice());
      return points;
    }

    function polygon(arcs) {
      return arcs.map(ring);
    }

    function geometry(o) {
      var t = o.type;
      return t === "GeometryCollection" ? {type: t, geometries: o.geometries.map(geometry)}
          : t in geometryType ? {type: t, coordinates: geometryType[t](o)}
          : null;
    }

    var geometryType = {
      Point: function(o) { return point(o.coordinates); },
      MultiPoint: function(o) { return o.coordinates.map(point); },
      LineString: function(o) { return line(o.arcs); },
      MultiLineString: function(o) { return o.arcs.map(line); },
      Polygon: function(o) { return polygon(o.arcs); },
      MultiPolygon: function(o) { return o.arcs.map(polygon); }
    };

    return geometry(o);
  }

  function reverse(array, n) {
    var t, j = array.length, i = j - n; while (i < --j) t = array[i], array[i++] = array[j], array[j] = t;
  }

  function bisect(a, x) {
    var lo = 0, hi = a.length;
    while (lo < hi) {
      var mid = lo + hi >>> 1;
      if (a[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  function neighbors(objects) {
    var indexesByArc = {}, // arc index -> array of object indexes
        neighbors = objects.map(function() { return []; });

    function line(arcs, i) {
      arcs.forEach(function(a) {
        if (a < 0) a = ~a;
        var o = indexesByArc[a];
        if (o) o.push(i);
        else indexesByArc[a] = [i];
      });
    }

    function polygon(arcs, i) {
      arcs.forEach(function(arc) { line(arc, i); });
    }

    function geometry(o, i) {
      if (o.type === "GeometryCollection") o.geometries.forEach(function(o) { geometry(o, i); });
      else if (o.type in geometryType) geometryType[o.type](o.arcs, i);
    }

    var geometryType = {
      LineString: line,
      MultiLineString: polygon,
      Polygon: polygon,
      MultiPolygon: function(arcs, i) { arcs.forEach(function(arc) { polygon(arc, i); }); }
    };

    objects.forEach(geometry);

    for (var i in indexesByArc) {
      for (var indexes = indexesByArc[i], m = indexes.length, j = 0; j < m; ++j) {
        for (var k = j + 1; k < m; ++k) {
          var ij = indexes[j], ik = indexes[k], n;
          if ((n = neighbors[ij])[i = bisect(n, ik)] !== ik) n.splice(i, 0, ik);
          if ((n = neighbors[ik])[i = bisect(n, ij)] !== ij) n.splice(i, 0, ij);
        }
      }
    }

    return neighbors;
  }

  function presimplify(topology, triangleArea) {
    var absolute = transformAbsolute(topology.transform),
        relative = transformRelative(topology.transform),
        heap = minHeap(compareArea),
        maxArea = 0,
        triangle;

    if (!triangleArea) triangleArea = cartesianArea;

    topology.arcs.forEach(function(arc) {
      var triangles = [];

      arc.forEach(absolute);

      for (var i = 1, n = arc.length - 1; i < n; ++i) {
        triangle = arc.slice(i - 1, i + 2);
        triangle[1][2] = triangleArea(triangle);
        triangles.push(triangle);
        heap.push(triangle);
      }

      // Always keep the arc endpoints!
      arc[0][2] = arc[n][2] = Infinity;

      for (var i = 0, n = triangles.length; i < n; ++i) {
        triangle = triangles[i];
        triangle.previous = triangles[i - 1];
        triangle.next = triangles[i + 1];
      }
    });

    while (triangle = heap.pop()) {
      var previous = triangle.previous,
          next = triangle.next;

      // If the area of the current point is less than that of the previous point
      // to be eliminated, use the latter's area instead. This ensures that the
      // current point cannot be eliminated without eliminating previously-
      // eliminated points.
      if (triangle[1][2] < maxArea) triangle[1][2] = maxArea;
      else maxArea = triangle[1][2];

      if (previous) {
        previous.next = next;
        previous[2] = triangle[2];
        update(previous);
      }

      if (next) {
        next.previous = previous;
        next[0] = triangle[0];
        update(next);
      }
    }

    topology.arcs.forEach(function(arc) {
      arc.forEach(relative);
    });

    function update(triangle) {
      heap.remove(triangle);
      triangle[1][2] = triangleArea(triangle);
      heap.push(triangle);
    }

    return topology;
  };

  function cartesianArea(triangle) {
    return Math.abs(
      (triangle[0][0] - triangle[2][0]) * (triangle[1][1] - triangle[0][1])
      - (triangle[0][0] - triangle[1][0]) * (triangle[2][1] - triangle[0][1])
    );
  }

  function compareArea(a, b) {
    return a[1][2] - b[1][2];
  }

  function minHeap(compare) {
    var heap = {},
        array = [];

    heap.push = function() {
      for (var i = 0, n = arguments.length; i < n; ++i) {
        var object = arguments[i];
        up(object.index = array.push(object) - 1);
      }
      return array.length;
    };

    heap.pop = function() {
      var removed = array[0],
          object = array.pop();
      if (array.length) {
        array[object.index = 0] = object;
        down(0);
      }
      return removed;
    };

    heap.remove = function(removed) {
      var i = removed.index,
          object = array.pop();
      if (i !== array.length) {
        array[object.index = i] = object;
        (compare(object, removed) < 0 ? up : down)(i);
      }
      return i;
    };

    function up(i) {
      var object = array[i];
      while (i > 0) {
        var up = ((i + 1) >> 1) - 1,
            parent = array[up];
        if (compare(object, parent) >= 0) break;
        array[parent.index = i] = parent;
        array[object.index = i = up] = object;
      }
    }

    function down(i) {
      var object = array[i];
      while (true) {
        var right = (i + 1) << 1,
            left = right - 1,
            down = i,
            child = array[down];
        if (left < array.length && compare(array[left], child) < 0) child = array[down = left];
        if (right < array.length && compare(array[right], child) < 0) child = array[down = right];
        if (down === i) break;
        array[child.index = i] = child;
        array[object.index = i = down] = object;
      }
    }

    return heap;
  }

  function transformAbsolute(transform) {
    if (!transform) return noop;
    var x0,
        y0,
        kx = transform.scale[0],
        ky = transform.scale[1],
        dx = transform.translate[0],
        dy = transform.translate[1];
    return function(point, i) {
      if (!i) x0 = y0 = 0;
      point[0] = (x0 += point[0]) * kx + dx;
      point[1] = (y0 += point[1]) * ky + dy;
    };
  }

  function transformRelative(transform) {
    if (!transform) return noop;
    var x0,
        y0,
        kx = transform.scale[0],
        ky = transform.scale[1],
        dx = transform.translate[0],
        dy = transform.translate[1];
    return function(point, i) {
      if (!i) x0 = y0 = 0;
      var x1 = (point[0] - dx) / kx | 0,
          y1 = (point[1] - dy) / ky | 0;
      point[0] = x1 - x0;
      point[1] = y1 - y0;
      x0 = x1;
      y0 = y1;
    };
  }

  function noop() {}

  if (typeof define === "function" && define.amd) define(topojson);
  else if (typeof module === "object" && module.exports) module.exports = topojson;
  else this.topojson = topojson;
}();

},{}],38:[function(_dereq_,module,exports){
module.exports = parse;

/*
 * Parse WKT and return GeoJSON.
 *
 * @param {string} _ A WKT geometry
 * @return {?Object} A GeoJSON geometry object
 */
function parse(_) {

    var i = 0;

    function $(re) {
        var match = _.substring(i).match(re);
        if (!match) return null;
        else {
            i += match[0].length;
            return match[0];
        }
    }

    function white() { $(/^\s*/); }

    function multicoords() {
        white();
        var depth = 0, rings = [],
            pointer = rings, elem;
        while (elem =
            $(/^(\()/) ||
            $(/^(\))/) ||
            $(/^(\,)/) ||
            coords()) {
            if (elem == '(') {
                depth++;
            } else if (elem == ')') {
                depth--;
                if (depth == 0) break;
            } else if (elem && Array.isArray(elem) && elem.length) {
                pointer.push(elem);
            } else if (elem === ',') {
            }
            white();
        }
        if (depth !== 0) return null;
        return rings;
    }

    function coords() {
        var list = [], item, pt;
        while (pt =
            $(/^[-+]?([0-9]*\.[0-9]+|[0-9]+)/) ||
            $(/^(\,)/)) {
            if (pt == ',') {
                list.push(item);
                item = [];
            } else {
                if (!item) item = [];
                item.push(parseFloat(pt));
            }
            white();
        }
        if (item) list.push(item);
        return list.length ? list : null;
    }

    function point() {
        if (!$(/^(point)/i)) return null;
        white();
        if (!$(/^(\()/)) return null;
        var c = coords();
        white();
        if (!$(/^(\))/)) return null;
        return {
            type: 'Point',
            coordinates: c[0]
        };
    }

    function multipoint() {
        if (!$(/^(multipoint)/i)) return null;
        white();
        var c = multicoords();
        white();
        return {
            type: 'MultiPoint',
            coordinates: c[0]
        };
    }

    function multilinestring() {
        if (!$(/^(multilinestring)/i)) return null;
        white();
        var c = multicoords();
        white();
        return {
            type: 'MultiLineString',
            coordinates: c
        };
    }

    function linestring() {
        if (!$(/^(linestring)/i)) return null;
        white();
        if (!$(/^(\()/)) return null;
        var c = coords();
        if (!$(/^(\))/)) return null;
        return {
            type: 'LineString',
            coordinates: c
        };
    }

    function polygon() {
        if (!$(/^(polygon)/i)) return null;
        white();
        return {
            type: 'Polygon',
            coordinates: multicoords()
        };
    }

    function multipolygon() {
        if (!$(/^(multipolygon)/i)) return null;
        white();
        return {
            type: 'MultiPolygon',
            coordinates: multicoords()
        };
    }

    function geometrycollection() {
        var geometries = [], geometry;

        if (!$(/^(geometrycollection)/i)) return null;
        white();

        if (!$(/^(\()/)) return null;
        while (geometry = root()) {
            geometries.push(geometry);
            white();
            $(/^(\,)/);
            white();
        }
        if (!$(/^(\))/)) return null;

        return {
            type: 'GeometryCollection',
            geometries: geometries
        };
    }

    function root() {
        return point() ||
            linestring() ||
            polygon() ||
            multipoint() ||
            multilinestring() ||
            multipolygon() ||
            geometrycollection();
    }

    return root();
}

},{}]},{},[1])
(1)
});}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
// browserify maplibs.js -o maplibs-bundle.js
// browserify maplibs.js | uglifyjs > maplibs-bundle.js

require('../../../components/leaflet-dist/leaflet.js');
require('../../../components/esri-leaflet/dist/esri-leaflet.js');
require('../../../components/leaflet-omnivore/leaflet-omnivore.js');


},{"../../../components/esri-leaflet/dist/esri-leaflet.js":1,"../../../components/leaflet-dist/leaflet.js":2,"../../../components/leaflet-omnivore/leaflet-omnivore.js":3}]},{},[4])