define({
    name: "jsutils.i18n",
    modules: ["jQuery", "jsutils.file", "jsutils.tmpl","JSONPath","JSON"]
}).as(function(i18n, jQuery, fileUtil, tempUtil,JSONPath,JSON) {
    var STRINGS = {};
    return {
        _instance_: function() {
            this.reversemap = {};
        },
        add: function(file) {
            if (is.String(file)) {
                return fileUtil.getJSON(file).done(function(resp) {
                    for (var key in resp.map) {
                        STRINGS[key] = resp.map[key];
                    }
                });
            } else {
                return jQuery.Deferred(function(dff) {
                    for (var key in file.map) {
                        STRINGS[key] = file.map[key];
                    }
                    dff.resolve(file);
                }).promise();
            }
        },
        getJSON: function(fileNameJson) {
            var self = this;
            var version = (bootloader && bootloader.config) ?
                JSONPath("resource.version").load(bootloader.config(), bootloader.config().version) : 0;
            var fileName = fileNameJson, fileNameKey = "_lang." + fileName;
            var langMap = localStorage.getItem(fileNameKey);
            if (langMap) {
                langMap = JSON.parse(langMap);
            }
            if (langMap && langMap.version >= version) {
                return self.add(langMap);
            } else {
                return fileUtil.getJSON(fileNameJson).done(function(resp) {
                    resp.version = version;
                    localStorage.setItem(fileNameKey, JSON.stringify(resp));
                    return self.add(resp);
                });
            }
        },
        get: function(key) {
            if (is.String(key)) {
                var keys = key.split(":");
                var str = STRINGS[keys[0]] || "";
                for (var i = 1; i < keys.length; i++) {
                    str = str.replace("$" + i, keys[i]);
                }
                str = str ? str : key;
                if (this.reversemap) {
                    this.reversemap[str] = key;
                }
                return str;
            }
            return key;
        },
        key: function(str) {
            if (is.String(str) && this.reversemap && this.reversemap[str]) {
                return this.reversemap[str];
            }
            return str;
        },
        _ready_: function() {
            var i18n = this;
            if (tempUtil) {
                tempUtil.formatter("i18n", function(key) {
                    return i18n.get(key);
                });
            }
        }
    };
});
