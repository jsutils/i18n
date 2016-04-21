define({
  name: "jsutils.i18n",
  modules: ["jQuery","jsutils.file","jsutils.tmpl"]
}).as(function(i18n, jQuery, fileUtil,tempUtil) {
    var STRINGS = {};
    return {
        _instance_ : function () {
          this.reversemap = {};
        },
        add : function(file){
          if (is.String(file)) {
    				return fileUtil.getJSON(file).done(function(resp) {
    					for (var key in resp.map) {
    						STRINGS[key] = resp.map[key];
    					}
    				});
    			} else {
    				return $.Deferred(function(dff){
    					for(var key in file.map) {
    						STRINGS[key] = file.map[key];
    					}	
    					dff.resolve(file);
    				}).promise();
    			}
        },
        get : function (key) {
          var keys = key.split(":");
          var str = STRINGS[keys[0]] || "";
          for(var i=1; i<keys.length; i++){
            str = str.replace("$"+i,keys[i]);
          }
          if(this.reversemap){
            this.reversemap[str] = key;
          }
          return str;
        },
        key : function(str){
            if(this.reversemap){
              return this.reversemap[str];
            }
        },
        _ready_ : function(){
          var i18n = this;
          if(tempUtil){
            tempUtil.formatter("i18n", function(key){
              return i18n.get(key);
            })
          }
        }
    };
});
