var COMPILED = !0, goog = goog || {};
goog.global = this;
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.provide = function $goog$provide$($name$$) {
  if(!COMPILED) {
    if(goog.isProvided_($name$$)) {
      throw Error('Namespace "' + $name$$ + '" already declared.');
    }
    delete goog.implicitNamespaces_[$name$$];
    for(var $namespace$$ = $name$$;($namespace$$ = $namespace$$.substring(0, $namespace$$.lastIndexOf("."))) && !goog.getObjectByName($namespace$$);) {
      goog.implicitNamespaces_[$namespace$$] = !0
    }
  }
  goog.exportPath_($name$$)
};
goog.setTestOnly = function $goog$setTestOnly$($opt_message$$) {
  if(COMPILED && !goog.DEBUG) {
    throw $opt_message$$ = $opt_message$$ || "", Error("Importing test-only code into non-debug environment" + $opt_message$$ ? ": " + $opt_message$$ : ".");
  }
};
COMPILED || (goog.isProvided_ = function $goog$isProvided_$($name$$) {
  return!goog.implicitNamespaces_[$name$$] && !!goog.getObjectByName($name$$)
}, goog.implicitNamespaces_ = {});
goog.exportPath_ = function $goog$exportPath_$($name$$, $opt_object$$, $cur_opt_objectToExportTo$$) {
  $name$$ = $name$$.split(".");
  $cur_opt_objectToExportTo$$ = $cur_opt_objectToExportTo$$ || goog.global;
  !($name$$[0] in $cur_opt_objectToExportTo$$) && $cur_opt_objectToExportTo$$.execScript && $cur_opt_objectToExportTo$$.execScript("var " + $name$$[0]);
  for(var $part$$;$name$$.length && ($part$$ = $name$$.shift());) {
    !$name$$.length && goog.isDef($opt_object$$) ? $cur_opt_objectToExportTo$$[$part$$] = $opt_object$$ : $cur_opt_objectToExportTo$$ = $cur_opt_objectToExportTo$$[$part$$] ? $cur_opt_objectToExportTo$$[$part$$] : $cur_opt_objectToExportTo$$[$part$$] = {}
  }
};
goog.getObjectByName = function $goog$getObjectByName$($name$$, $opt_obj$$) {
  for(var $parts$$ = $name$$.split("."), $cur$$ = $opt_obj$$ || goog.global, $part$$;$part$$ = $parts$$.shift();) {
    if(goog.isDefAndNotNull($cur$$[$part$$])) {
      $cur$$ = $cur$$[$part$$]
    }else {
      return null
    }
  }
  return $cur$$
};
goog.globalize = function $goog$globalize$($obj$$, $opt_global$$) {
  var $global$$ = $opt_global$$ || goog.global, $x$$;
  for($x$$ in $obj$$) {
    $global$$[$x$$] = $obj$$[$x$$]
  }
};
goog.addDependency = function $goog$addDependency$($path$$, $provides_require$$, $requires$$) {
  if(!COMPILED) {
    var $j_provide$$;
    $path$$ = $path$$.replace(/\\/g, "/");
    for(var $deps$$ = goog.dependencies_, $i$$ = 0;$j_provide$$ = $provides_require$$[$i$$];$i$$++) {
      $deps$$.nameToPath[$j_provide$$] = $path$$, $path$$ in $deps$$.pathToNames || ($deps$$.pathToNames[$path$$] = {}), $deps$$.pathToNames[$path$$][$j_provide$$] = !0
    }
    for($j_provide$$ = 0;$provides_require$$ = $requires$$[$j_provide$$];$j_provide$$++) {
      $path$$ in $deps$$.requires || ($deps$$.requires[$path$$] = {}), $deps$$.requires[$path$$][$provides_require$$] = !0
    }
  }
};
goog.ENABLE_DEBUG_LOADER = !0;
goog.require = function $goog$require$($errorMessage_name$$) {
  if(!COMPILED && !goog.isProvided_($errorMessage_name$$)) {
    if(goog.ENABLE_DEBUG_LOADER) {
      var $path$$ = goog.getPathFromDeps_($errorMessage_name$$);
      if($path$$) {
        goog.included_[$path$$] = !0;
        goog.writeScripts_();
        return
      }
    }
    $errorMessage_name$$ = "goog.require could not find: " + $errorMessage_name$$;
    goog.global.console && goog.global.console.error($errorMessage_name$$);
    throw Error($errorMessage_name$$);
  }
};
goog.basePath = "";
goog.nullFunction = function $goog$nullFunction$() {
};
goog.identityFunction = function $goog$identityFunction$($opt_returnValue$$) {
  return $opt_returnValue$$
};
goog.abstractMethod = function $goog$abstractMethod$() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function $goog$addSingletonGetter$($ctor$$) {
  $ctor$$.getInstance = function $$ctor$$$getInstance$() {
    if($ctor$$.instance_) {
      return $ctor$$.instance_
    }
    goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = $ctor$$);
    return $ctor$$.instance_ = new $ctor$$
  }
};
goog.instantiatedSingletons_ = [];
!COMPILED && goog.ENABLE_DEBUG_LOADER && (goog.included_ = {}, goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}}, goog.inHtmlDocument_ = function $goog$inHtmlDocument_$() {
  var $doc$$ = goog.global.document;
  return"undefined" != typeof $doc$$ && "write" in $doc$$
}, goog.findBasePath_ = function $goog$findBasePath_$() {
  if(goog.global.CLOSURE_BASE_PATH) {
    goog.basePath = goog.global.CLOSURE_BASE_PATH
  }else {
    if(goog.inHtmlDocument_()) {
      for(var $scripts$$ = goog.global.document.getElementsByTagName("script"), $i$$ = $scripts$$.length - 1;0 <= $i$$;--$i$$) {
        var $src$$ = $scripts$$[$i$$].src, $l_qmark$$ = $src$$.lastIndexOf("?"), $l_qmark$$ = -1 == $l_qmark$$ ? $src$$.length : $l_qmark$$;
        if("base.js" == $src$$.substr($l_qmark$$ - 7, 7)) {
          goog.basePath = $src$$.substr(0, $l_qmark$$ - 7);
          break
        }
      }
    }
  }
}, goog.importScript_ = function $goog$importScript_$($src$$) {
  var $importScript$$ = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
  !goog.dependencies_.written[$src$$] && $importScript$$($src$$) && (goog.dependencies_.written[$src$$] = !0)
}, goog.writeScriptTag_ = function $goog$writeScriptTag_$($src$$) {
  if(goog.inHtmlDocument_()) {
    var $doc$$ = goog.global.document;
    if("complete" == $doc$$.readyState) {
      if(/\bdeps.js$/.test($src$$)) {
        return!1
      }
      throw Error('Cannot write "' + $src$$ + '" after document load');
    }
    $doc$$.write('<script type="text/javascript" src="' + $src$$ + '">\x3c/script>');
    return!0
  }
  return!1
}, goog.writeScripts_ = function $goog$writeScripts_$() {
  function $visitNode$$($path$$) {
    if(!($path$$ in $deps$$.written)) {
      if(!($path$$ in $deps$$.visited) && ($deps$$.visited[$path$$] = !0, $path$$ in $deps$$.requires)) {
        for(var $requireName$$ in $deps$$.requires[$path$$]) {
          if(!goog.isProvided_($requireName$$)) {
            if($requireName$$ in $deps$$.nameToPath) {
              $visitNode$$($deps$$.nameToPath[$requireName$$])
            }else {
              throw Error("Undefined nameToPath for " + $requireName$$);
            }
          }
        }
      }
      $path$$ in $seenScript$$ || ($seenScript$$[$path$$] = !0, $scripts$$.push($path$$))
    }
  }
  var $scripts$$ = [], $seenScript$$ = {}, $deps$$ = goog.dependencies_, $i$$4_path$$;
  for($i$$4_path$$ in goog.included_) {
    $deps$$.written[$i$$4_path$$] || $visitNode$$($i$$4_path$$)
  }
  for($i$$4_path$$ = 0;$i$$4_path$$ < $scripts$$.length;$i$$4_path$$++) {
    if($scripts$$[$i$$4_path$$]) {
      goog.importScript_(goog.basePath + $scripts$$[$i$$4_path$$])
    }else {
      throw Error("Undefined script input");
    }
  }
}, goog.getPathFromDeps_ = function $goog$getPathFromDeps_$($rule$$) {
  return $rule$$ in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[$rule$$] : null
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function $goog$typeOf$($value$$) {
  var $s$$ = typeof $value$$;
  if("object" == $s$$) {
    if($value$$) {
      if($value$$ instanceof Array) {
        return"array"
      }
      if($value$$ instanceof Object) {
        return $s$$
      }
      var $className$$ = Object.prototype.toString.call($value$$);
      if("[object Window]" == $className$$) {
        return"object"
      }
      if("[object Array]" == $className$$ || "number" == typeof $value$$.length && "undefined" != typeof $value$$.splice && "undefined" != typeof $value$$.propertyIsEnumerable && !$value$$.propertyIsEnumerable("splice")) {
        return"array"
      }
      if("[object Function]" == $className$$ || "undefined" != typeof $value$$.call && "undefined" != typeof $value$$.propertyIsEnumerable && !$value$$.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if("function" == $s$$ && "undefined" == typeof $value$$.call) {
      return"object"
    }
  }
  return $s$$
};
goog.isDef = function $goog$isDef$($val$$) {
  return void 0 !== $val$$
};
goog.isNull = function $goog$isNull$($val$$) {
  return null === $val$$
};
goog.isDefAndNotNull = function $goog$isDefAndNotNull$($val$$) {
  return null != $val$$
};
goog.isArray = function $goog$isArray$($val$$) {
  return"array" == goog.typeOf($val$$)
};
goog.isArrayLike = function $goog$isArrayLike$($val$$) {
  var $type$$ = goog.typeOf($val$$);
  return"array" == $type$$ || "object" == $type$$ && "number" == typeof $val$$.length
};
goog.isDateLike = function $goog$isDateLike$($val$$) {
  return goog.isObject($val$$) && "function" == typeof $val$$.getFullYear
};
goog.isString = function $goog$isString$($val$$) {
  return"string" == typeof $val$$
};
goog.isBoolean = function $goog$isBoolean$($val$$) {
  return"boolean" == typeof $val$$
};
goog.isNumber = function $goog$isNumber$($val$$) {
  return"number" == typeof $val$$
};
goog.isFunction = function $goog$isFunction$($val$$) {
  return"function" == goog.typeOf($val$$)
};
goog.isObject = function $goog$isObject$($val$$) {
  var $type$$ = typeof $val$$;
  return"object" == $type$$ && null != $val$$ || "function" == $type$$
};
goog.getUid = function $goog$getUid$($obj$$) {
  return $obj$$[goog.UID_PROPERTY_] || ($obj$$[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function $goog$removeUid$($obj$$) {
  "removeAttribute" in $obj$$ && $obj$$.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete $obj$$[goog.UID_PROPERTY_]
  }catch($ex$$) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + Math.floor(2147483648 * Math.random()).toString(36);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function $goog$cloneObject$($obj$$) {
  var $clone_type$$ = goog.typeOf($obj$$);
  if("object" == $clone_type$$ || "array" == $clone_type$$) {
    if($obj$$.clone) {
      return $obj$$.clone()
    }
    var $clone_type$$ = "array" == $clone_type$$ ? [] : {}, $key$$;
    for($key$$ in $obj$$) {
      $clone_type$$[$key$$] = goog.cloneObject($obj$$[$key$$])
    }
    return $clone_type$$
  }
  return $obj$$
};
goog.bindNative_ = function $goog$bindNative_$($fn$$, $selfObj$$, $var_args$$) {
  return $fn$$.call.apply($fn$$.bind, arguments)
};
goog.bindJs_ = function $goog$bindJs_$($fn$$, $selfObj$$, $var_args$$) {
  if(!$fn$$) {
    throw Error();
  }
  if(2 < arguments.length) {
    var $boundArgs$$ = Array.prototype.slice.call(arguments, 2);
    return function() {
      var $newArgs$$ = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply($newArgs$$, $boundArgs$$);
      return $fn$$.apply($selfObj$$, $newArgs$$)
    }
  }
  return function() {
    return $fn$$.apply($selfObj$$, arguments)
  }
};
goog.bind = function $goog$bind$($fn$$, $selfObj$$, $var_args$$) {
  goog.bind = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bindNative_ : goog.bindJs_;
  return goog.bind.apply(null, arguments)
};
goog.partial = function $goog$partial$($fn$$, $var_args$$) {
  var $args$$ = Array.prototype.slice.call(arguments, 1);
  return function() {
    var $newArgs$$ = Array.prototype.slice.call(arguments);
    $newArgs$$.unshift.apply($newArgs$$, $args$$);
    return $fn$$.apply(this, $newArgs$$)
  }
};
goog.mixin = function $goog$mixin$($target$$, $source$$) {
  for(var $x$$ in $source$$) {
    $target$$[$x$$] = $source$$[$x$$]
  }
};
goog.now = Date.now || function() {
  return+new Date
};
goog.globalEval = function $goog$globalEval$($script$$) {
  if(goog.global.execScript) {
    goog.global.execScript($script$$, "JavaScript")
  }else {
    if(goog.global.eval) {
      if(null == goog.evalWorksForGlobals_ && (goog.global.eval("var _et_ = 1;"), "undefined" != typeof goog.global._et_ ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1), goog.evalWorksForGlobals_) {
        goog.global.eval($script$$)
      }else {
        var $doc$$ = goog.global.document, $scriptElt$$ = $doc$$.createElement("script");
        $scriptElt$$.type = "text/javascript";
        $scriptElt$$.defer = !1;
        $scriptElt$$.appendChild($doc$$.createTextNode($script$$));
        $doc$$.body.appendChild($scriptElt$$);
        $doc$$.body.removeChild($scriptElt$$)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function $goog$getCssName$($className$$, $opt_modifier$$) {
  var $getMapping$$ = function $$getMapping$$$($cssName$$) {
    return goog.cssNameMapping_[$cssName$$] || $cssName$$
  }, $rename_renameByParts$$ = function $$rename_renameByParts$$$($cssName$$1_parts$$) {
    $cssName$$1_parts$$ = $cssName$$1_parts$$.split("-");
    for(var $mapped$$ = [], $i$$ = 0;$i$$ < $cssName$$1_parts$$.length;$i$$++) {
      $mapped$$.push($getMapping$$($cssName$$1_parts$$[$i$$]))
    }
    return $mapped$$.join("-")
  }, $rename_renameByParts$$ = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? $getMapping$$ : $rename_renameByParts$$ : function($a$$) {
    return $a$$
  };
  return $opt_modifier$$ ? $className$$ + "-" + $rename_renameByParts$$($opt_modifier$$) : $rename_renameByParts$$($className$$)
};
goog.setCssNameMapping = function $goog$setCssNameMapping$($mapping$$, $opt_style$$) {
  goog.cssNameMapping_ = $mapping$$;
  goog.cssNameMappingStyle_ = $opt_style$$
};
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function $goog$getMsg$($str$$, $opt_values$$) {
  var $values$$ = $opt_values$$ || {}, $key$$;
  for($key$$ in $values$$) {
    var $value$$ = ("" + $values$$[$key$$]).replace(/\$/g, "$$$$");
    $str$$ = $str$$.replace(RegExp("\\{\\$" + $key$$ + "\\}", "gi"), $value$$)
  }
  return $str$$
};
goog.getMsgWithFallback = function $goog$getMsgWithFallback$($a$$) {
  return $a$$
};
goog.exportSymbol = function $goog$exportSymbol$($publicPath$$, $object$$, $opt_objectToExportTo$$) {
  goog.exportPath_($publicPath$$, $object$$, $opt_objectToExportTo$$)
};
goog.exportProperty = function $goog$exportProperty$($object$$, $publicName$$, $symbol$$) {
  $object$$[$publicName$$] = $symbol$$
};
goog.inherits = function $goog$inherits$($childCtor$$, $parentCtor$$) {
  function $tempCtor$$() {
  }
  $tempCtor$$.prototype = $parentCtor$$.prototype;
  $childCtor$$.superClass_ = $parentCtor$$.prototype;
  $childCtor$$.prototype = new $tempCtor$$;
  $childCtor$$.prototype.constructor = $childCtor$$
};
goog.base = function $goog$base$($me$$, $opt_methodName$$, $var_args$$) {
  var $caller$$ = arguments.callee.caller;
  if($caller$$.superClass_) {
    return $caller$$.superClass_.constructor.apply($me$$, Array.prototype.slice.call(arguments, 1))
  }
  for(var $args$$ = Array.prototype.slice.call(arguments, 2), $foundCaller$$ = !1, $ctor$$ = $me$$.constructor;$ctor$$;$ctor$$ = $ctor$$.superClass_ && $ctor$$.superClass_.constructor) {
    if($ctor$$.prototype[$opt_methodName$$] === $caller$$) {
      $foundCaller$$ = !0
    }else {
      if($foundCaller$$) {
        return $ctor$$.prototype[$opt_methodName$$].apply($me$$, $args$$)
      }
    }
  }
  if($me$$[$opt_methodName$$] === $caller$$) {
    return $me$$.constructor.prototype[$opt_methodName$$].apply($me$$, $args$$)
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function $goog$scope$($fn$$) {
  $fn$$.call(goog.global)
};
goog.debug = {};
goog.debug.errorHandlerWeakDep = {protectEntryPoint:function $goog$debug$errorHandlerWeakDep$protectEntryPoint$($fn$$) {
  return $fn$$
}};
goog.string = {};
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function $goog$string$startsWith$($str$$, $prefix$$) {
  return 0 == $str$$.lastIndexOf($prefix$$, 0)
};
goog.string.endsWith = function $goog$string$endsWith$($str$$, $suffix$$) {
  var $l$$ = $str$$.length - $suffix$$.length;
  return 0 <= $l$$ && $str$$.indexOf($suffix$$, $l$$) == $l$$
};
goog.string.caseInsensitiveStartsWith = function $goog$string$caseInsensitiveStartsWith$($str$$, $prefix$$) {
  return 0 == goog.string.caseInsensitiveCompare($prefix$$, $str$$.substr(0, $prefix$$.length))
};
goog.string.caseInsensitiveEndsWith = function $goog$string$caseInsensitiveEndsWith$($str$$, $suffix$$) {
  return 0 == goog.string.caseInsensitiveCompare($suffix$$, $str$$.substr($str$$.length - $suffix$$.length, $suffix$$.length))
};
goog.string.subs = function $goog$string$subs$($str$$, $var_args$$) {
  for(var $i$$ = 1;$i$$ < arguments.length;$i$$++) {
    var $replacement$$ = String(arguments[$i$$]).replace(/\$/g, "$$$$");
    $str$$ = $str$$.replace(/\%s/, $replacement$$)
  }
  return $str$$
};
goog.string.collapseWhitespace = function $goog$string$collapseWhitespace$($str$$) {
  return $str$$.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function $goog$string$isEmpty$($str$$) {
  return/^[\s\xa0]*$/.test($str$$)
};
goog.string.isEmptySafe = function $goog$string$isEmptySafe$($str$$) {
  return goog.string.isEmpty(goog.string.makeSafe($str$$))
};
goog.string.isBreakingWhitespace = function $goog$string$isBreakingWhitespace$($str$$) {
  return!/[^\t\n\r ]/.test($str$$)
};
goog.string.isAlpha = function $goog$string$isAlpha$($str$$) {
  return!/[^a-zA-Z]/.test($str$$)
};
goog.string.isNumeric = function $goog$string$isNumeric$($str$$) {
  return!/[^0-9]/.test($str$$)
};
goog.string.isAlphaNumeric = function $goog$string$isAlphaNumeric$($str$$) {
  return!/[^a-zA-Z0-9]/.test($str$$)
};
goog.string.isSpace = function $goog$string$isSpace$($ch$$) {
  return" " == $ch$$
};
goog.string.isUnicodeChar = function $goog$string$isUnicodeChar$($ch$$) {
  return 1 == $ch$$.length && " " <= $ch$$ && "~" >= $ch$$ || "\u0080" <= $ch$$ && "\ufffd" >= $ch$$
};
goog.string.stripNewlines = function $goog$string$stripNewlines$($str$$) {
  return $str$$.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function $goog$string$canonicalizeNewlines$($str$$) {
  return $str$$.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function $goog$string$normalizeWhitespace$($str$$) {
  return $str$$.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function $goog$string$normalizeSpaces$($str$$) {
  return $str$$.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.collapseBreakingSpaces = function $goog$string$collapseBreakingSpaces$($str$$) {
  return $str$$.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
};
goog.string.trim = function $goog$string$trim$($str$$) {
  return $str$$.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function $goog$string$trimLeft$($str$$) {
  return $str$$.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function $goog$string$trimRight$($str$$) {
  return $str$$.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function $goog$string$caseInsensitiveCompare$($str1$$, $str2$$) {
  var $test1$$ = String($str1$$).toLowerCase(), $test2$$ = String($str2$$).toLowerCase();
  return $test1$$ < $test2$$ ? -1 : $test1$$ == $test2$$ ? 0 : 1
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function $goog$string$numerateCompare$($str1$$, $str2$$) {
  if($str1$$ == $str2$$) {
    return 0
  }
  if(!$str1$$) {
    return-1
  }
  if(!$str2$$) {
    return 1
  }
  for(var $num1_tokens1$$ = $str1$$.toLowerCase().match(goog.string.numerateCompareRegExp_), $num2_tokens2$$ = $str2$$.toLowerCase().match(goog.string.numerateCompareRegExp_), $count$$ = Math.min($num1_tokens1$$.length, $num2_tokens2$$.length), $i$$ = 0;$i$$ < $count$$;$i$$++) {
    var $a$$ = $num1_tokens1$$[$i$$], $b$$ = $num2_tokens2$$[$i$$];
    if($a$$ != $b$$) {
      return $num1_tokens1$$ = parseInt($a$$, 10), !isNaN($num1_tokens1$$) && ($num2_tokens2$$ = parseInt($b$$, 10), !isNaN($num2_tokens2$$) && $num1_tokens1$$ - $num2_tokens2$$) ? $num1_tokens1$$ - $num2_tokens2$$ : $a$$ < $b$$ ? -1 : 1
    }
  }
  return $num1_tokens1$$.length != $num2_tokens2$$.length ? $num1_tokens1$$.length - $num2_tokens2$$.length : $str1$$ < $str2$$ ? -1 : 1
};
goog.string.urlEncode = function $goog$string$urlEncode$($str$$) {
  return encodeURIComponent(String($str$$))
};
goog.string.urlDecode = function $goog$string$urlDecode$($str$$) {
  return decodeURIComponent($str$$.replace(/\+/g, " "))
};
goog.string.newLineToBr = function $goog$string$newLineToBr$($str$$, $opt_xml$$) {
  return $str$$.replace(/(\r\n|\r|\n)/g, $opt_xml$$ ? "<br />" : "<br>")
};
goog.string.htmlEscape = function $goog$string$htmlEscape$($str$$, $opt_isLikelyToContainHtmlChars$$) {
  if($opt_isLikelyToContainHtmlChars$$) {
    return $str$$.replace(goog.string.amperRe_, "&amp;").replace(goog.string.ltRe_, "&lt;").replace(goog.string.gtRe_, "&gt;").replace(goog.string.quotRe_, "&quot;")
  }
  if(!goog.string.allRe_.test($str$$)) {
    return $str$$
  }
  -1 != $str$$.indexOf("&") && ($str$$ = $str$$.replace(goog.string.amperRe_, "&amp;"));
  -1 != $str$$.indexOf("<") && ($str$$ = $str$$.replace(goog.string.ltRe_, "&lt;"));
  -1 != $str$$.indexOf(">") && ($str$$ = $str$$.replace(goog.string.gtRe_, "&gt;"));
  -1 != $str$$.indexOf('"') && ($str$$ = $str$$.replace(goog.string.quotRe_, "&quot;"));
  return $str$$
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /\"/g;
goog.string.allRe_ = /[&<>\"]/;
goog.string.unescapeEntities = function $goog$string$unescapeEntities$($str$$) {
  return goog.string.contains($str$$, "&") ? "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_($str$$) : goog.string.unescapePureXmlEntities_($str$$) : $str$$
};
goog.string.unescapeEntitiesUsingDom_ = function $goog$string$unescapeEntitiesUsingDom_$($str$$) {
  var $seen$$ = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'}, $div$$ = document.createElement("div");
  return $str$$.replace(goog.string.HTML_ENTITY_PATTERN_, function($s$$, $entity$$) {
    var $value$$ = $seen$$[$s$$];
    if($value$$) {
      return $value$$
    }
    if("#" == $entity$$.charAt(0)) {
      var $n$$ = Number("0" + $entity$$.substr(1));
      isNaN($n$$) || ($value$$ = String.fromCharCode($n$$))
    }
    $value$$ || ($div$$.innerHTML = $s$$ + " ", $value$$ = $div$$.firstChild.nodeValue.slice(0, -1));
    return $seen$$[$s$$] = $value$$
  })
};
goog.string.unescapePureXmlEntities_ = function $goog$string$unescapePureXmlEntities_$($str$$) {
  return $str$$.replace(/&([^;]+);/g, function($s$$, $entity$$) {
    switch($entity$$) {
      case "amp":
        return"&";
      case "lt":
        return"<";
      case "gt":
        return">";
      case "quot":
        return'"';
      default:
        if("#" == $entity$$.charAt(0)) {
          var $n$$ = Number("0" + $entity$$.substr(1));
          if(!isNaN($n$$)) {
            return String.fromCharCode($n$$)
          }
        }
        return $s$$
    }
  })
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function $goog$string$whitespaceEscape$($str$$, $opt_xml$$) {
  return goog.string.newLineToBr($str$$.replace(/  /g, " &#160;"), $opt_xml$$)
};
goog.string.stripQuotes = function $goog$string$stripQuotes$($str$$, $quoteChars$$) {
  for(var $length$$ = $quoteChars$$.length, $i$$ = 0;$i$$ < $length$$;$i$$++) {
    var $quoteChar$$ = 1 == $length$$ ? $quoteChars$$ : $quoteChars$$.charAt($i$$);
    if($str$$.charAt(0) == $quoteChar$$ && $str$$.charAt($str$$.length - 1) == $quoteChar$$) {
      return $str$$.substring(1, $str$$.length - 1)
    }
  }
  return $str$$
};
goog.string.truncate = function $goog$string$truncate$($str$$, $chars$$, $opt_protectEscapedCharacters$$) {
  $opt_protectEscapedCharacters$$ && ($str$$ = goog.string.unescapeEntities($str$$));
  $str$$.length > $chars$$ && ($str$$ = $str$$.substring(0, $chars$$ - 3) + "...");
  $opt_protectEscapedCharacters$$ && ($str$$ = goog.string.htmlEscape($str$$));
  return $str$$
};
goog.string.truncateMiddle = function $goog$string$truncateMiddle$($str$$, $chars$$, $opt_protectEscapedCharacters$$, $half_opt_trailingChars$$) {
  $opt_protectEscapedCharacters$$ && ($str$$ = goog.string.unescapeEntities($str$$));
  if($half_opt_trailingChars$$ && $str$$.length > $chars$$) {
    $half_opt_trailingChars$$ > $chars$$ && ($half_opt_trailingChars$$ = $chars$$);
    var $endPoint_endPos$$ = $str$$.length - $half_opt_trailingChars$$;
    $str$$ = $str$$.substring(0, $chars$$ - $half_opt_trailingChars$$) + "..." + $str$$.substring($endPoint_endPos$$)
  }else {
    $str$$.length > $chars$$ && ($half_opt_trailingChars$$ = Math.floor($chars$$ / 2), $endPoint_endPos$$ = $str$$.length - $half_opt_trailingChars$$, $str$$ = $str$$.substring(0, $half_opt_trailingChars$$ + $chars$$ % 2) + "..." + $str$$.substring($endPoint_endPos$$))
  }
  $opt_protectEscapedCharacters$$ && ($str$$ = goog.string.htmlEscape($str$$));
  return $str$$
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function $goog$string$quote$($s$$) {
  $s$$ = String($s$$);
  if($s$$.quote) {
    return $s$$.quote()
  }
  for(var $sb$$ = ['"'], $i$$ = 0;$i$$ < $s$$.length;$i$$++) {
    var $ch$$ = $s$$.charAt($i$$), $cc$$ = $ch$$.charCodeAt(0);
    $sb$$[$i$$ + 1] = goog.string.specialEscapeChars_[$ch$$] || (31 < $cc$$ && 127 > $cc$$ ? $ch$$ : goog.string.escapeChar($ch$$))
  }
  $sb$$.push('"');
  return $sb$$.join("")
};
goog.string.escapeString = function $goog$string$escapeString$($str$$) {
  for(var $sb$$ = [], $i$$ = 0;$i$$ < $str$$.length;$i$$++) {
    $sb$$[$i$$] = goog.string.escapeChar($str$$.charAt($i$$))
  }
  return $sb$$.join("")
};
goog.string.escapeChar = function $goog$string$escapeChar$($c$$) {
  if($c$$ in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[$c$$]
  }
  if($c$$ in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[$c$$] = goog.string.specialEscapeChars_[$c$$]
  }
  var $rv$$ = $c$$, $cc$$ = $c$$.charCodeAt(0);
  if(31 < $cc$$ && 127 > $cc$$) {
    $rv$$ = $c$$
  }else {
    if(256 > $cc$$) {
      if($rv$$ = "\\x", 16 > $cc$$ || 256 < $cc$$) {
        $rv$$ += "0"
      }
    }else {
      $rv$$ = "\\u", 4096 > $cc$$ && ($rv$$ += "0")
    }
    $rv$$ += $cc$$.toString(16).toUpperCase()
  }
  return goog.string.jsEscapeCache_[$c$$] = $rv$$
};
goog.string.toMap = function $goog$string$toMap$($s$$) {
  for(var $rv$$ = {}, $i$$ = 0;$i$$ < $s$$.length;$i$$++) {
    $rv$$[$s$$.charAt($i$$)] = !0
  }
  return $rv$$
};
goog.string.contains = function $goog$string$contains$($s$$, $ss$$) {
  return-1 != $s$$.indexOf($ss$$)
};
goog.string.countOf = function $goog$string$countOf$($s$$, $ss$$) {
  return $s$$ && $ss$$ ? $s$$.split($ss$$).length - 1 : 0
};
goog.string.removeAt = function $goog$string$removeAt$($s$$, $index$$, $stringLength$$) {
  var $resultStr$$ = $s$$;
  0 <= $index$$ && ($index$$ < $s$$.length && 0 < $stringLength$$) && ($resultStr$$ = $s$$.substr(0, $index$$) + $s$$.substr($index$$ + $stringLength$$, $s$$.length - $index$$ - $stringLength$$));
  return $resultStr$$
};
goog.string.remove = function $goog$string$remove$($s$$, $ss$$) {
  var $re$$ = RegExp(goog.string.regExpEscape($ss$$), "");
  return $s$$.replace($re$$, "")
};
goog.string.removeAll = function $goog$string$removeAll$($s$$, $ss$$) {
  var $re$$ = RegExp(goog.string.regExpEscape($ss$$), "g");
  return $s$$.replace($re$$, "")
};
goog.string.regExpEscape = function $goog$string$regExpEscape$($s$$) {
  return String($s$$).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function $goog$string$repeat$($string$$, $length$$) {
  return Array($length$$ + 1).join($string$$)
};
goog.string.padNumber = function $goog$string$padNumber$($num$$4_s$$, $length$$, $index$$46_opt_precision$$) {
  $num$$4_s$$ = goog.isDef($index$$46_opt_precision$$) ? $num$$4_s$$.toFixed($index$$46_opt_precision$$) : String($num$$4_s$$);
  $index$$46_opt_precision$$ = $num$$4_s$$.indexOf(".");
  -1 == $index$$46_opt_precision$$ && ($index$$46_opt_precision$$ = $num$$4_s$$.length);
  return goog.string.repeat("0", Math.max(0, $length$$ - $index$$46_opt_precision$$)) + $num$$4_s$$
};
goog.string.makeSafe = function $goog$string$makeSafe$($obj$$) {
  return null == $obj$$ ? "" : String($obj$$)
};
goog.string.buildString = function $goog$string$buildString$($var_args$$) {
  return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function $goog$string$getRandomString$() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function $goog$string$compareVersions$($version1$$, $version2$$) {
  for(var $order_v1CompNum$$ = 0, $v1Subs$$ = goog.string.trim(String($version1$$)).split("."), $v2Subs$$ = goog.string.trim(String($version2$$)).split("."), $subCount$$ = Math.max($v1Subs$$.length, $v2Subs$$.length), $subIdx$$ = 0;0 == $order_v1CompNum$$ && $subIdx$$ < $subCount$$;$subIdx$$++) {
    var $v1Sub$$ = $v1Subs$$[$subIdx$$] || "", $v2Sub$$ = $v2Subs$$[$subIdx$$] || "", $v1CompParser$$ = RegExp("(\\d*)(\\D*)", "g"), $v2CompParser$$ = RegExp("(\\d*)(\\D*)", "g");
    do {
      var $v1Comp$$ = $v1CompParser$$.exec($v1Sub$$) || ["", "", ""], $v2Comp$$ = $v2CompParser$$.exec($v2Sub$$) || ["", "", ""];
      if(0 == $v1Comp$$[0].length && 0 == $v2Comp$$[0].length) {
        break
      }
      var $order_v1CompNum$$ = 0 == $v1Comp$$[1].length ? 0 : parseInt($v1Comp$$[1], 10), $v2CompNum$$ = 0 == $v2Comp$$[1].length ? 0 : parseInt($v2Comp$$[1], 10), $order_v1CompNum$$ = goog.string.compareElements_($order_v1CompNum$$, $v2CompNum$$) || goog.string.compareElements_(0 == $v1Comp$$[2].length, 0 == $v2Comp$$[2].length) || goog.string.compareElements_($v1Comp$$[2], $v2Comp$$[2])
    }while(0 == $order_v1CompNum$$)
  }
  return $order_v1CompNum$$
};
goog.string.compareElements_ = function $goog$string$compareElements_$($left$$, $right$$) {
  return $left$$ < $right$$ ? -1 : $left$$ > $right$$ ? 1 : 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function $goog$string$hashCode$($str$$) {
  for(var $result$$ = 0, $i$$ = 0;$i$$ < $str$$.length;++$i$$) {
    $result$$ = 31 * $result$$ + $str$$.charCodeAt($i$$), $result$$ %= goog.string.HASHCODE_MAX_
  }
  return $result$$
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function $goog$string$createUniqueString$() {
  return"goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function $goog$string$toNumber$($str$$) {
  var $num$$ = Number($str$$);
  return 0 == $num$$ && goog.string.isEmpty($str$$) ? NaN : $num$$
};
goog.string.toCamelCase = function $goog$string$toCamelCase$($str$$) {
  return String($str$$).replace(/\-([a-z])/g, function($all$$, $match$$) {
    return $match$$.toUpperCase()
  })
};
goog.string.toSelectorCase = function $goog$string$toSelectorCase$($str$$) {
  return String($str$$).replace(/([A-Z])/g, "-$1").toLowerCase()
};
goog.string.toTitleCase = function $goog$string$toTitleCase$($str$$, $opt_delimiters$$) {
  var $delimiters$$ = goog.isString($opt_delimiters$$) ? goog.string.regExpEscape($opt_delimiters$$) : "\\s";
  return $str$$.replace(RegExp("(^" + ($delimiters$$ ? "|[" + $delimiters$$ + "]+" : "") + ")([a-z])", "g"), function($all$$, $p1$$, $p2$$) {
    return $p1$$ + $p2$$.toUpperCase()
  })
};
goog.string.parseInt = function $goog$string$parseInt$($value$$) {
  isFinite($value$$) && ($value$$ = String($value$$));
  return goog.isString($value$$) ? /^\s*-?0x/i.test($value$$) ? parseInt($value$$, 16) : parseInt($value$$, 10) : NaN
};
goog.userAgent = {};
goog.userAgent.ASSUME_IE = !1;
goog.userAgent.ASSUME_GECKO = !1;
goog.userAgent.ASSUME_WEBKIT = !1;
goog.userAgent.ASSUME_MOBILE_WEBKIT = !1;
goog.userAgent.ASSUME_OPERA = !1;
goog.userAgent.ASSUME_ANY_VERSION = !1;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function $goog$userAgent$getUserAgentString$() {
  return goog.global.navigator ? goog.global.navigator.userAgent : null
};
goog.userAgent.getNavigator = function $goog$userAgent$getNavigator$() {
  return goog.global.navigator
};
goog.userAgent.init_ = function $goog$userAgent$init_$() {
  goog.userAgent.detectedOpera_ = !1;
  goog.userAgent.detectedIe_ = !1;
  goog.userAgent.detectedWebkit_ = !1;
  goog.userAgent.detectedMobile_ = !1;
  goog.userAgent.detectedGecko_ = !1;
  var $ua$$;
  if(!goog.userAgent.BROWSER_KNOWN_ && ($ua$$ = goog.userAgent.getUserAgentString())) {
    var $navigator$$ = goog.userAgent.getNavigator();
    goog.userAgent.detectedOpera_ = 0 == $ua$$.indexOf("Opera");
    goog.userAgent.detectedIe_ = !goog.userAgent.detectedOpera_ && -1 != $ua$$.indexOf("MSIE");
    goog.userAgent.detectedWebkit_ = !goog.userAgent.detectedOpera_ && -1 != $ua$$.indexOf("WebKit");
    goog.userAgent.detectedMobile_ = goog.userAgent.detectedWebkit_ && -1 != $ua$$.indexOf("Mobile");
    goog.userAgent.detectedGecko_ = !goog.userAgent.detectedOpera_ && !goog.userAgent.detectedWebkit_ && "Gecko" == $navigator$$.product
  }
};
goog.userAgent.BROWSER_KNOWN_ || goog.userAgent.init_();
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.userAgent.detectedOpera_;
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.userAgent.detectedIe_;
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.userAgent.detectedGecko_;
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.userAgent.detectedWebkit_;
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.detectedMobile_;
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function $goog$userAgent$determinePlatform_$() {
  var $navigator$$ = goog.userAgent.getNavigator();
  return $navigator$$ && $navigator$$.platform || ""
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = !1;
goog.userAgent.ASSUME_WINDOWS = !1;
goog.userAgent.ASSUME_LINUX = !1;
goog.userAgent.ASSUME_X11 = !1;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11;
goog.userAgent.initPlatform_ = function $goog$userAgent$initPlatform_$() {
  goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM, "Mac");
  goog.userAgent.detectedWindows_ = goog.string.contains(goog.userAgent.PLATFORM, "Win");
  goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM, "Linux");
  goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() && goog.string.contains(goog.userAgent.getNavigator().appVersion || "", "X11")
};
goog.userAgent.PLATFORM_KNOWN_ || goog.userAgent.initPlatform_();
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.userAgent.detectedMac_;
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.userAgent.detectedWindows_;
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.detectedLinux_;
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.detectedX11_;
goog.userAgent.determineVersion_ = function $goog$userAgent$determineVersion_$() {
  var $arr$$16_operaVersion_version$$ = "", $docMode_re$$;
  goog.userAgent.OPERA && goog.global.opera ? ($arr$$16_operaVersion_version$$ = goog.global.opera.version, $arr$$16_operaVersion_version$$ = "function" == typeof $arr$$16_operaVersion_version$$ ? $arr$$16_operaVersion_version$$() : $arr$$16_operaVersion_version$$) : (goog.userAgent.GECKO ? $docMode_re$$ = /rv\:([^\);]+)(\)|;)/ : goog.userAgent.IE ? $docMode_re$$ = /MSIE\s+([^\);]+)(\)|;)/ : goog.userAgent.WEBKIT && ($docMode_re$$ = /WebKit\/(\S+)/), $docMode_re$$ && ($arr$$16_operaVersion_version$$ = 
  ($arr$$16_operaVersion_version$$ = $docMode_re$$.exec(goog.userAgent.getUserAgentString())) ? $arr$$16_operaVersion_version$$[1] : ""));
  return goog.userAgent.IE && ($docMode_re$$ = goog.userAgent.getDocumentMode_(), $docMode_re$$ > parseFloat($arr$$16_operaVersion_version$$)) ? String($docMode_re$$) : $arr$$16_operaVersion_version$$
};
goog.userAgent.getDocumentMode_ = function $goog$userAgent$getDocumentMode_$() {
  var $doc$$ = goog.global.document;
  return $doc$$ ? $doc$$.documentMode : void 0
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function $goog$userAgent$compare$($v1$$, $v2$$) {
  return goog.string.compareVersions($v1$$, $v2$$)
};
goog.userAgent.isVersionCache_ = {};
goog.userAgent.isVersion = function $goog$userAgent$isVersion$($version$$) {
  return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionCache_[$version$$] || (goog.userAgent.isVersionCache_[$version$$] = 0 <= goog.string.compareVersions(goog.userAgent.VERSION, $version$$))
};
goog.userAgent.isDocumentMode = function $goog$userAgent$isDocumentMode$($documentMode$$) {
  return goog.userAgent.IE && goog.userAgent.DOCUMENT_MODE >= $documentMode$$
};
goog.userAgent.DOCUMENT_MODE = function() {
  var $doc$$ = goog.global.document;
  return!$doc$$ || !goog.userAgent.IE ? void 0 : goog.userAgent.getDocumentMode_() || ("CSS1Compat" == $doc$$.compatMode ? parseInt(goog.userAgent.VERSION, 10) : 5)
}();
goog.events = {};
goog.events.Listener = function $goog$events$Listener$() {
  goog.events.Listener.ENABLE_MONITORING && (this.creationStack = Error().stack)
};
goog.events.Listener.counter_ = 0;
goog.events.Listener.ENABLE_MONITORING = !1;
goog.events.Listener.prototype.key = 0;
goog.events.Listener.prototype.removed = !1;
goog.events.Listener.prototype.callOnce = !1;
goog.events.Listener.prototype.init = function $goog$events$Listener$$init$($listener$$, $proxy$$, $src$$, $type$$, $capture$$, $opt_handler$$) {
  if(goog.isFunction($listener$$)) {
    this.isFunctionListener_ = !0
  }else {
    if($listener$$ && $listener$$.handleEvent && goog.isFunction($listener$$.handleEvent)) {
      this.isFunctionListener_ = !1
    }else {
      throw Error("Invalid listener argument");
    }
  }
  this.listener = $listener$$;
  this.proxy = $proxy$$;
  this.src = $src$$;
  this.type = $type$$;
  this.capture = !!$capture$$;
  this.handler = $opt_handler$$;
  this.callOnce = !1;
  this.key = ++goog.events.Listener.counter_;
  this.removed = !1
};
goog.events.Listener.prototype.handleEvent = function $goog$events$Listener$$handleEvent$($eventObject$$) {
  return this.isFunctionListener_ ? this.listener.call(this.handler || this.src, $eventObject$$) : this.listener.handleEvent.call(this.listener, $eventObject$$)
};
goog.object = {};
goog.object.forEach = function $goog$object$forEach$($obj$$, $f$$, $opt_obj$$) {
  for(var $key$$ in $obj$$) {
    $f$$.call($opt_obj$$, $obj$$[$key$$], $key$$, $obj$$)
  }
};
goog.object.filter = function $goog$object$filter$($obj$$, $f$$, $opt_obj$$) {
  var $res$$ = {}, $key$$;
  for($key$$ in $obj$$) {
    $f$$.call($opt_obj$$, $obj$$[$key$$], $key$$, $obj$$) && ($res$$[$key$$] = $obj$$[$key$$])
  }
  return $res$$
};
goog.object.map = function $goog$object$map$($obj$$, $f$$, $opt_obj$$) {
  var $res$$ = {}, $key$$;
  for($key$$ in $obj$$) {
    $res$$[$key$$] = $f$$.call($opt_obj$$, $obj$$[$key$$], $key$$, $obj$$)
  }
  return $res$$
};
goog.object.some = function $goog$object$some$($obj$$, $f$$, $opt_obj$$) {
  for(var $key$$ in $obj$$) {
    if($f$$.call($opt_obj$$, $obj$$[$key$$], $key$$, $obj$$)) {
      return!0
    }
  }
  return!1
};
goog.object.every = function $goog$object$every$($obj$$, $f$$, $opt_obj$$) {
  for(var $key$$ in $obj$$) {
    if(!$f$$.call($opt_obj$$, $obj$$[$key$$], $key$$, $obj$$)) {
      return!1
    }
  }
  return!0
};
goog.object.getCount = function $goog$object$getCount$($obj$$) {
  var $rv$$ = 0, $key$$;
  for($key$$ in $obj$$) {
    $rv$$++
  }
  return $rv$$
};
goog.object.getAnyKey = function $goog$object$getAnyKey$($obj$$) {
  for(var $key$$ in $obj$$) {
    return $key$$
  }
};
goog.object.getAnyValue = function $goog$object$getAnyValue$($obj$$) {
  for(var $key$$ in $obj$$) {
    return $obj$$[$key$$]
  }
};
goog.object.contains = function $goog$object$contains$($obj$$, $val$$) {
  return goog.object.containsValue($obj$$, $val$$)
};
goog.object.getValues = function $goog$object$getValues$($obj$$) {
  var $res$$ = [], $i$$ = 0, $key$$;
  for($key$$ in $obj$$) {
    $res$$[$i$$++] = $obj$$[$key$$]
  }
  return $res$$
};
goog.object.getKeys = function $goog$object$getKeys$($obj$$) {
  var $res$$ = [], $i$$ = 0, $key$$;
  for($key$$ in $obj$$) {
    $res$$[$i$$++] = $key$$
  }
  return $res$$
};
goog.object.getValueByKeys = function $goog$object$getValueByKeys$($obj$$, $var_args$$) {
  for(var $i$$ = goog.isArrayLike($var_args$$), $keys$$ = $i$$ ? $var_args$$ : arguments, $i$$ = $i$$ ? 0 : 1;$i$$ < $keys$$.length && !($obj$$ = $obj$$[$keys$$[$i$$]], !goog.isDef($obj$$));$i$$++) {
  }
  return $obj$$
};
goog.object.containsKey = function $goog$object$containsKey$($obj$$, $key$$) {
  return $key$$ in $obj$$
};
goog.object.containsValue = function $goog$object$containsValue$($obj$$, $val$$) {
  for(var $key$$ in $obj$$) {
    if($obj$$[$key$$] == $val$$) {
      return!0
    }
  }
  return!1
};
goog.object.findKey = function $goog$object$findKey$($obj$$, $f$$, $opt_this$$) {
  for(var $key$$ in $obj$$) {
    if($f$$.call($opt_this$$, $obj$$[$key$$], $key$$, $obj$$)) {
      return $key$$
    }
  }
};
goog.object.findValue = function $goog$object$findValue$($obj$$, $f$$6_key$$, $opt_this$$) {
  return($f$$6_key$$ = goog.object.findKey($obj$$, $f$$6_key$$, $opt_this$$)) && $obj$$[$f$$6_key$$]
};
goog.object.isEmpty = function $goog$object$isEmpty$($obj$$) {
  for(var $key$$ in $obj$$) {
    return!1
  }
  return!0
};
goog.object.clear = function $goog$object$clear$($obj$$) {
  for(var $i$$ in $obj$$) {
    delete $obj$$[$i$$]
  }
};
goog.object.remove = function $goog$object$remove$($obj$$, $key$$) {
  var $rv$$;
  ($rv$$ = $key$$ in $obj$$) && delete $obj$$[$key$$];
  return $rv$$
};
goog.object.add = function $goog$object$add$($obj$$, $key$$, $val$$) {
  if($key$$ in $obj$$) {
    throw Error('The object already contains the key "' + $key$$ + '"');
  }
  goog.object.set($obj$$, $key$$, $val$$)
};
goog.object.get = function $goog$object$get$($obj$$, $key$$, $opt_val$$) {
  return $key$$ in $obj$$ ? $obj$$[$key$$] : $opt_val$$
};
goog.object.set = function $goog$object$set$($obj$$, $key$$, $value$$) {
  $obj$$[$key$$] = $value$$
};
goog.object.setIfUndefined = function $goog$object$setIfUndefined$($obj$$, $key$$, $value$$) {
  return $key$$ in $obj$$ ? $obj$$[$key$$] : $obj$$[$key$$] = $value$$
};
goog.object.clone = function $goog$object$clone$($obj$$) {
  var $res$$ = {}, $key$$;
  for($key$$ in $obj$$) {
    $res$$[$key$$] = $obj$$[$key$$]
  }
  return $res$$
};
goog.object.unsafeClone = function $goog$object$unsafeClone$($obj$$) {
  var $clone$$1_type$$ = goog.typeOf($obj$$);
  if("object" == $clone$$1_type$$ || "array" == $clone$$1_type$$) {
    if($obj$$.clone) {
      return $obj$$.clone()
    }
    var $clone$$1_type$$ = "array" == $clone$$1_type$$ ? [] : {}, $key$$;
    for($key$$ in $obj$$) {
      $clone$$1_type$$[$key$$] = goog.object.unsafeClone($obj$$[$key$$])
    }
    return $clone$$1_type$$
  }
  return $obj$$
};
goog.object.transpose = function $goog$object$transpose$($obj$$) {
  var $transposed$$ = {}, $key$$;
  for($key$$ in $obj$$) {
    $transposed$$[$obj$$[$key$$]] = $key$$
  }
  return $transposed$$
};
goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend = function $goog$object$extend$($target$$, $var_args$$) {
  for(var $key$$, $source$$, $i$$ = 1;$i$$ < arguments.length;$i$$++) {
    $source$$ = arguments[$i$$];
    for($key$$ in $source$$) {
      $target$$[$key$$] = $source$$[$key$$]
    }
    for(var $j$$ = 0;$j$$ < goog.object.PROTOTYPE_FIELDS_.length;$j$$++) {
      $key$$ = goog.object.PROTOTYPE_FIELDS_[$j$$], Object.prototype.hasOwnProperty.call($source$$, $key$$) && ($target$$[$key$$] = $source$$[$key$$])
    }
  }
};
goog.object.create = function $goog$object$create$($var_args$$) {
  var $argLength$$ = arguments.length;
  if(1 == $argLength$$ && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0])
  }
  if($argLength$$ % 2) {
    throw Error("Uneven number of arguments");
  }
  for(var $rv$$ = {}, $i$$ = 0;$i$$ < $argLength$$;$i$$ += 2) {
    $rv$$[arguments[$i$$]] = arguments[$i$$ + 1]
  }
  return $rv$$
};
goog.object.createSet = function $goog$object$createSet$($var_args$$) {
  var $argLength$$ = arguments.length;
  if(1 == $argLength$$ && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0])
  }
  for(var $rv$$ = {}, $i$$ = 0;$i$$ < $argLength$$;$i$$++) {
    $rv$$[arguments[$i$$]] = !0
  }
  return $rv$$
};
goog.object.createImmutableView = function $goog$object$createImmutableView$($obj$$) {
  var $result$$ = $obj$$;
  Object.isFrozen && !Object.isFrozen($obj$$) && ($result$$ = Object.create($obj$$), Object.freeze($result$$));
  return $result$$
};
goog.object.isImmutableView = function $goog$object$isImmutableView$($obj$$) {
  return!!Object.isFrozen && Object.isFrozen($obj$$)
};
goog.events.BrowserFeature = {HAS_W3C_BUTTON:!goog.userAgent.IE || goog.userAgent.isDocumentMode(9), HAS_W3C_EVENT_SUPPORT:!goog.userAgent.IE || goog.userAgent.isDocumentMode(9), SET_KEY_CODE_TO_PREVENT_DEFAULT:goog.userAgent.IE && !goog.userAgent.isVersion("9"), HAS_NAVIGATOR_ONLINE_PROPERTY:!goog.userAgent.WEBKIT || goog.userAgent.isVersion("528"), HAS_HTML5_NETWORK_EVENT_SUPPORT:goog.userAgent.GECKO && goog.userAgent.isVersion("1.9b") || goog.userAgent.IE && goog.userAgent.isVersion("8") || goog.userAgent.OPERA && 
goog.userAgent.isVersion("9.5") || goog.userAgent.WEBKIT && goog.userAgent.isVersion("528"), HTML5_NETWORK_EVENTS_FIRE_ON_BODY:goog.userAgent.GECKO && !goog.userAgent.isVersion("8") || goog.userAgent.IE && !goog.userAgent.isVersion("9"), TOUCH_ENABLED:"ontouchstart" in goog.global || !(!goog.global.document || !(document.documentElement && "ontouchstart" in document.documentElement)) || !(!goog.global.navigator || !goog.global.navigator.msMaxTouchPoints)};
goog.debug.Error = function $goog$debug$Error$($opt_msg$$) {
  Error.captureStackTrace ? Error.captureStackTrace(this, goog.debug.Error) : this.stack = Error().stack || "";
  $opt_msg$$ && (this.message = String($opt_msg$$))
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function $goog$asserts$AssertionError$($messagePattern$$, $messageArgs$$) {
  $messageArgs$$.unshift($messagePattern$$);
  goog.debug.Error.call(this, goog.string.subs.apply(null, $messageArgs$$));
  $messageArgs$$.shift();
  this.messagePattern = $messagePattern$$
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function $goog$asserts$doAssertFailure_$($defaultMessage$$, $defaultArgs$$, $givenMessage$$, $givenArgs$$) {
  var $message$$ = "Assertion failed";
  if($givenMessage$$) {
    var $message$$ = $message$$ + (": " + $givenMessage$$), $args$$ = $givenArgs$$
  }else {
    $defaultMessage$$ && ($message$$ += ": " + $defaultMessage$$, $args$$ = $defaultArgs$$)
  }
  throw new goog.asserts.AssertionError("" + $message$$, $args$$ || []);
};
goog.asserts.assert = function $goog$asserts$assert$($condition$$, $opt_message$$, $var_args$$) {
  goog.asserts.ENABLE_ASSERTS && !$condition$$ && goog.asserts.doAssertFailure_("", null, $opt_message$$, Array.prototype.slice.call(arguments, 2));
  return $condition$$
};
goog.asserts.fail = function $goog$asserts$fail$($opt_message$$, $var_args$$) {
  if(goog.asserts.ENABLE_ASSERTS) {
    throw new goog.asserts.AssertionError("Failure" + ($opt_message$$ ? ": " + $opt_message$$ : ""), Array.prototype.slice.call(arguments, 1));
  }
};
goog.asserts.assertNumber = function $goog$asserts$assertNumber$($value$$, $opt_message$$, $var_args$$) {
  goog.asserts.ENABLE_ASSERTS && !goog.isNumber($value$$) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf($value$$), $value$$], $opt_message$$, Array.prototype.slice.call(arguments, 2));
  return $value$$
};
goog.asserts.assertString = function $goog$asserts$assertString$($value$$, $opt_message$$, $var_args$$) {
  goog.asserts.ENABLE_ASSERTS && !goog.isString($value$$) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf($value$$), $value$$], $opt_message$$, Array.prototype.slice.call(arguments, 2));
  return $value$$
};
goog.asserts.assertFunction = function $goog$asserts$assertFunction$($value$$, $opt_message$$, $var_args$$) {
  goog.asserts.ENABLE_ASSERTS && !goog.isFunction($value$$) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf($value$$), $value$$], $opt_message$$, Array.prototype.slice.call(arguments, 2));
  return $value$$
};
goog.asserts.assertObject = function $goog$asserts$assertObject$($value$$, $opt_message$$, $var_args$$) {
  goog.asserts.ENABLE_ASSERTS && !goog.isObject($value$$) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf($value$$), $value$$], $opt_message$$, Array.prototype.slice.call(arguments, 2));
  return $value$$
};
goog.asserts.assertArray = function $goog$asserts$assertArray$($value$$, $opt_message$$, $var_args$$) {
  goog.asserts.ENABLE_ASSERTS && !goog.isArray($value$$) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf($value$$), $value$$], $opt_message$$, Array.prototype.slice.call(arguments, 2));
  return $value$$
};
goog.asserts.assertBoolean = function $goog$asserts$assertBoolean$($value$$, $opt_message$$, $var_args$$) {
  goog.asserts.ENABLE_ASSERTS && !goog.isBoolean($value$$) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf($value$$), $value$$], $opt_message$$, Array.prototype.slice.call(arguments, 2));
  return $value$$
};
goog.asserts.assertInstanceof = function $goog$asserts$assertInstanceof$($value$$, $type$$, $opt_message$$, $var_args$$) {
  goog.asserts.ENABLE_ASSERTS && !($value$$ instanceof $type$$) && goog.asserts.doAssertFailure_("instanceof check failed.", null, $opt_message$$, Array.prototype.slice.call(arguments, 3));
  return $value$$
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = !0;
goog.array.peek = function $goog$array$peek$($array$$) {
  return $array$$[$array$$.length - 1]
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.indexOf ? function($arr$$, $obj$$, $opt_fromIndex$$) {
  goog.asserts.assert(null != $arr$$.length);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call($arr$$, $obj$$, $opt_fromIndex$$)
} : function($arr$$, $obj$$, $fromIndex_i$$20_opt_fromIndex$$) {
  $fromIndex_i$$20_opt_fromIndex$$ = null == $fromIndex_i$$20_opt_fromIndex$$ ? 0 : 0 > $fromIndex_i$$20_opt_fromIndex$$ ? Math.max(0, $arr$$.length + $fromIndex_i$$20_opt_fromIndex$$) : $fromIndex_i$$20_opt_fromIndex$$;
  if(goog.isString($arr$$)) {
    return!goog.isString($obj$$) || 1 != $obj$$.length ? -1 : $arr$$.indexOf($obj$$, $fromIndex_i$$20_opt_fromIndex$$)
  }
  for(;$fromIndex_i$$20_opt_fromIndex$$ < $arr$$.length;$fromIndex_i$$20_opt_fromIndex$$++) {
    if($fromIndex_i$$20_opt_fromIndex$$ in $arr$$ && $arr$$[$fromIndex_i$$20_opt_fromIndex$$] === $obj$$) {
      return $fromIndex_i$$20_opt_fromIndex$$
    }
  }
  return-1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.lastIndexOf ? function($arr$$, $obj$$, $opt_fromIndex$$) {
  goog.asserts.assert(null != $arr$$.length);
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call($arr$$, $obj$$, null == $opt_fromIndex$$ ? $arr$$.length - 1 : $opt_fromIndex$$)
} : function($arr$$, $obj$$, $fromIndex$$2_i$$21_opt_fromIndex$$) {
  $fromIndex$$2_i$$21_opt_fromIndex$$ = null == $fromIndex$$2_i$$21_opt_fromIndex$$ ? $arr$$.length - 1 : $fromIndex$$2_i$$21_opt_fromIndex$$;
  0 > $fromIndex$$2_i$$21_opt_fromIndex$$ && ($fromIndex$$2_i$$21_opt_fromIndex$$ = Math.max(0, $arr$$.length + $fromIndex$$2_i$$21_opt_fromIndex$$));
  if(goog.isString($arr$$)) {
    return!goog.isString($obj$$) || 1 != $obj$$.length ? -1 : $arr$$.lastIndexOf($obj$$, $fromIndex$$2_i$$21_opt_fromIndex$$)
  }
  for(;0 <= $fromIndex$$2_i$$21_opt_fromIndex$$;$fromIndex$$2_i$$21_opt_fromIndex$$--) {
    if($fromIndex$$2_i$$21_opt_fromIndex$$ in $arr$$ && $arr$$[$fromIndex$$2_i$$21_opt_fromIndex$$] === $obj$$) {
      return $fromIndex$$2_i$$21_opt_fromIndex$$
    }
  }
  return-1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.forEach ? function($arr$$, $f$$, $opt_obj$$) {
  goog.asserts.assert(null != $arr$$.length);
  goog.array.ARRAY_PROTOTYPE_.forEach.call($arr$$, $f$$, $opt_obj$$)
} : function($arr$$, $f$$, $opt_obj$$) {
  for(var $l$$ = $arr$$.length, $arr2$$ = goog.isString($arr$$) ? $arr$$.split("") : $arr$$, $i$$ = 0;$i$$ < $l$$;$i$$++) {
    $i$$ in $arr2$$ && $f$$.call($opt_obj$$, $arr2$$[$i$$], $i$$, $arr$$)
  }
};
goog.array.forEachRight = function $goog$array$forEachRight$($arr$$, $f$$, $opt_obj$$) {
  for(var $i$$23_l$$ = $arr$$.length, $arr2$$ = goog.isString($arr$$) ? $arr$$.split("") : $arr$$, $i$$23_l$$ = $i$$23_l$$ - 1;0 <= $i$$23_l$$;--$i$$23_l$$) {
    $i$$23_l$$ in $arr2$$ && $f$$.call($opt_obj$$, $arr2$$[$i$$23_l$$], $i$$23_l$$, $arr$$)
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.filter ? function($arr$$, $f$$, $opt_obj$$) {
  goog.asserts.assert(null != $arr$$.length);
  return goog.array.ARRAY_PROTOTYPE_.filter.call($arr$$, $f$$, $opt_obj$$)
} : function($arr$$, $f$$, $opt_obj$$) {
  for(var $l$$ = $arr$$.length, $res$$ = [], $resLength$$ = 0, $arr2$$ = goog.isString($arr$$) ? $arr$$.split("") : $arr$$, $i$$ = 0;$i$$ < $l$$;$i$$++) {
    if($i$$ in $arr2$$) {
      var $val$$ = $arr2$$[$i$$];
      $f$$.call($opt_obj$$, $val$$, $i$$, $arr$$) && ($res$$[$resLength$$++] = $val$$)
    }
  }
  return $res$$
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.map ? function($arr$$, $f$$, $opt_obj$$) {
  goog.asserts.assert(null != $arr$$.length);
  return goog.array.ARRAY_PROTOTYPE_.map.call($arr$$, $f$$, $opt_obj$$)
} : function($arr$$, $f$$, $opt_obj$$) {
  for(var $l$$ = $arr$$.length, $res$$ = Array($l$$), $arr2$$ = goog.isString($arr$$) ? $arr$$.split("") : $arr$$, $i$$ = 0;$i$$ < $l$$;$i$$++) {
    $i$$ in $arr2$$ && ($res$$[$i$$] = $f$$.call($opt_obj$$, $arr2$$[$i$$], $i$$, $arr$$))
  }
  return $res$$
};
goog.array.reduce = function $goog$array$reduce$($arr$$, $f$$, $val$$0$$, $opt_obj$$) {
  if($arr$$.reduce) {
    return $opt_obj$$ ? $arr$$.reduce(goog.bind($f$$, $opt_obj$$), $val$$0$$) : $arr$$.reduce($f$$, $val$$0$$)
  }
  var $rval$$ = $val$$0$$;
  goog.array.forEach($arr$$, function($val$$, $index$$) {
    $rval$$ = $f$$.call($opt_obj$$, $rval$$, $val$$, $index$$, $arr$$)
  });
  return $rval$$
};
goog.array.reduceRight = function $goog$array$reduceRight$($arr$$, $f$$, $val$$0$$, $opt_obj$$) {
  if($arr$$.reduceRight) {
    return $opt_obj$$ ? $arr$$.reduceRight(goog.bind($f$$, $opt_obj$$), $val$$0$$) : $arr$$.reduceRight($f$$, $val$$0$$)
  }
  var $rval$$ = $val$$0$$;
  goog.array.forEachRight($arr$$, function($val$$, $index$$) {
    $rval$$ = $f$$.call($opt_obj$$, $rval$$, $val$$, $index$$, $arr$$)
  });
  return $rval$$
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.some ? function($arr$$, $f$$, $opt_obj$$) {
  goog.asserts.assert(null != $arr$$.length);
  return goog.array.ARRAY_PROTOTYPE_.some.call($arr$$, $f$$, $opt_obj$$)
} : function($arr$$, $f$$, $opt_obj$$) {
  for(var $l$$ = $arr$$.length, $arr2$$ = goog.isString($arr$$) ? $arr$$.split("") : $arr$$, $i$$ = 0;$i$$ < $l$$;$i$$++) {
    if($i$$ in $arr2$$ && $f$$.call($opt_obj$$, $arr2$$[$i$$], $i$$, $arr$$)) {
      return!0
    }
  }
  return!1
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.every ? function($arr$$, $f$$, $opt_obj$$) {
  goog.asserts.assert(null != $arr$$.length);
  return goog.array.ARRAY_PROTOTYPE_.every.call($arr$$, $f$$, $opt_obj$$)
} : function($arr$$, $f$$, $opt_obj$$) {
  for(var $l$$ = $arr$$.length, $arr2$$ = goog.isString($arr$$) ? $arr$$.split("") : $arr$$, $i$$ = 0;$i$$ < $l$$;$i$$++) {
    if($i$$ in $arr2$$ && !$f$$.call($opt_obj$$, $arr2$$[$i$$], $i$$, $arr$$)) {
      return!1
    }
  }
  return!0
};
goog.array.count = function $goog$array$count$($arr$$0$$, $f$$, $opt_obj$$) {
  var $count$$ = 0;
  goog.array.forEach($arr$$0$$, function($element$$, $index$$, $arr$$) {
    $f$$.call($opt_obj$$, $element$$, $index$$, $arr$$) && ++$count$$
  }, $opt_obj$$);
  return $count$$
};
goog.array.find = function $goog$array$find$($arr$$, $f$$21_i$$, $opt_obj$$) {
  $f$$21_i$$ = goog.array.findIndex($arr$$, $f$$21_i$$, $opt_obj$$);
  return 0 > $f$$21_i$$ ? null : goog.isString($arr$$) ? $arr$$.charAt($f$$21_i$$) : $arr$$[$f$$21_i$$]
};
goog.array.findIndex = function $goog$array$findIndex$($arr$$, $f$$, $opt_obj$$) {
  for(var $l$$ = $arr$$.length, $arr2$$ = goog.isString($arr$$) ? $arr$$.split("") : $arr$$, $i$$ = 0;$i$$ < $l$$;$i$$++) {
    if($i$$ in $arr2$$ && $f$$.call($opt_obj$$, $arr2$$[$i$$], $i$$, $arr$$)) {
      return $i$$
    }
  }
  return-1
};
goog.array.findRight = function $goog$array$findRight$($arr$$, $f$$23_i$$, $opt_obj$$) {
  $f$$23_i$$ = goog.array.findIndexRight($arr$$, $f$$23_i$$, $opt_obj$$);
  return 0 > $f$$23_i$$ ? null : goog.isString($arr$$) ? $arr$$.charAt($f$$23_i$$) : $arr$$[$f$$23_i$$]
};
goog.array.findIndexRight = function $goog$array$findIndexRight$($arr$$, $f$$, $opt_obj$$) {
  for(var $i$$31_l$$ = $arr$$.length, $arr2$$ = goog.isString($arr$$) ? $arr$$.split("") : $arr$$, $i$$31_l$$ = $i$$31_l$$ - 1;0 <= $i$$31_l$$;$i$$31_l$$--) {
    if($i$$31_l$$ in $arr2$$ && $f$$.call($opt_obj$$, $arr2$$[$i$$31_l$$], $i$$31_l$$, $arr$$)) {
      return $i$$31_l$$
    }
  }
  return-1
};
goog.array.contains = function $goog$array$contains$($arr$$, $obj$$) {
  return 0 <= goog.array.indexOf($arr$$, $obj$$)
};
goog.array.isEmpty = function $goog$array$isEmpty$($arr$$) {
  return 0 == $arr$$.length
};
goog.array.clear = function $goog$array$clear$($arr$$) {
  if(!goog.isArray($arr$$)) {
    for(var $i$$ = $arr$$.length - 1;0 <= $i$$;$i$$--) {
      delete $arr$$[$i$$]
    }
  }
  $arr$$.length = 0
};
goog.array.insert = function $goog$array$insert$($arr$$, $obj$$) {
  goog.array.contains($arr$$, $obj$$) || $arr$$.push($obj$$)
};
goog.array.insertAt = function $goog$array$insertAt$($arr$$, $obj$$, $opt_i$$) {
  goog.array.splice($arr$$, $opt_i$$, 0, $obj$$)
};
goog.array.insertArrayAt = function $goog$array$insertArrayAt$($arr$$, $elementsToAdd$$, $opt_i$$) {
  goog.partial(goog.array.splice, $arr$$, $opt_i$$, 0).apply(null, $elementsToAdd$$)
};
goog.array.insertBefore = function $goog$array$insertBefore$($arr$$, $obj$$, $opt_obj2$$) {
  var $i$$;
  2 == arguments.length || 0 > ($i$$ = goog.array.indexOf($arr$$, $opt_obj2$$)) ? $arr$$.push($obj$$) : goog.array.insertAt($arr$$, $obj$$, $i$$)
};
goog.array.remove = function $goog$array$remove$($arr$$, $obj$$) {
  var $i$$ = goog.array.indexOf($arr$$, $obj$$), $rv$$;
  ($rv$$ = 0 <= $i$$) && goog.array.removeAt($arr$$, $i$$);
  return $rv$$
};
goog.array.removeAt = function $goog$array$removeAt$($arr$$, $i$$) {
  goog.asserts.assert(null != $arr$$.length);
  return 1 == goog.array.ARRAY_PROTOTYPE_.splice.call($arr$$, $i$$, 1).length
};
goog.array.removeIf = function $goog$array$removeIf$($arr$$, $f$$25_i$$, $opt_obj$$) {
  $f$$25_i$$ = goog.array.findIndex($arr$$, $f$$25_i$$, $opt_obj$$);
  return 0 <= $f$$25_i$$ ? (goog.array.removeAt($arr$$, $f$$25_i$$), !0) : !1
};
goog.array.concat = function $goog$array$concat$($var_args$$) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.toArray = function $goog$array$toArray$($object$$) {
  var $length$$ = $object$$.length;
  if(0 < $length$$) {
    for(var $rv$$ = Array($length$$), $i$$ = 0;$i$$ < $length$$;$i$$++) {
      $rv$$[$i$$] = $object$$[$i$$]
    }
    return $rv$$
  }
  return[]
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function $goog$array$extend$($arr1$$, $var_args$$) {
  for(var $i$$ = 1;$i$$ < arguments.length;$i$$++) {
    var $arr2$$ = arguments[$i$$], $isArrayLike$$;
    if(goog.isArray($arr2$$) || ($isArrayLike$$ = goog.isArrayLike($arr2$$)) && Object.prototype.hasOwnProperty.call($arr2$$, "callee")) {
      $arr1$$.push.apply($arr1$$, $arr2$$)
    }else {
      if($isArrayLike$$) {
        for(var $len1$$ = $arr1$$.length, $len2$$ = $arr2$$.length, $j$$ = 0;$j$$ < $len2$$;$j$$++) {
          $arr1$$[$len1$$ + $j$$] = $arr2$$[$j$$]
        }
      }else {
        $arr1$$.push($arr2$$)
      }
    }
  }
};
goog.array.splice = function $goog$array$splice$($arr$$, $index$$, $howMany$$, $var_args$$) {
  goog.asserts.assert(null != $arr$$.length);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply($arr$$, goog.array.slice(arguments, 1))
};
goog.array.slice = function $goog$array$slice$($arr$$, $start$$, $opt_end$$) {
  goog.asserts.assert(null != $arr$$.length);
  return 2 >= arguments.length ? goog.array.ARRAY_PROTOTYPE_.slice.call($arr$$, $start$$) : goog.array.ARRAY_PROTOTYPE_.slice.call($arr$$, $start$$, $opt_end$$)
};
goog.array.removeDuplicates = function $goog$array$removeDuplicates$($arr$$, $opt_rv$$) {
  for(var $returnArray$$ = $opt_rv$$ || $arr$$, $seen$$ = {}, $cursorInsert$$ = 0, $cursorRead$$ = 0;$cursorRead$$ < $arr$$.length;) {
    var $current$$ = $arr$$[$cursorRead$$++], $key$$ = goog.isObject($current$$) ? "o" + goog.getUid($current$$) : (typeof $current$$).charAt(0) + $current$$;
    Object.prototype.hasOwnProperty.call($seen$$, $key$$) || ($seen$$[$key$$] = !0, $returnArray$$[$cursorInsert$$++] = $current$$)
  }
  $returnArray$$.length = $cursorInsert$$
};
goog.array.binarySearch = function $goog$array$binarySearch$($arr$$, $target$$, $opt_compareFn$$) {
  return goog.array.binarySearch_($arr$$, $opt_compareFn$$ || goog.array.defaultCompare, !1, $target$$)
};
goog.array.binarySelect = function $goog$array$binarySelect$($arr$$, $evaluator$$, $opt_obj$$) {
  return goog.array.binarySearch_($arr$$, $evaluator$$, !0, void 0, $opt_obj$$)
};
goog.array.binarySearch_ = function $goog$array$binarySearch_$($arr$$, $compareFn$$, $isEvaluator$$, $opt_target$$, $opt_selfObj$$) {
  for(var $left$$ = 0, $right$$ = $arr$$.length, $found$$;$left$$ < $right$$;) {
    var $middle$$ = $left$$ + $right$$ >> 1, $compareResult$$;
    $compareResult$$ = $isEvaluator$$ ? $compareFn$$.call($opt_selfObj$$, $arr$$[$middle$$], $middle$$, $arr$$) : $compareFn$$($opt_target$$, $arr$$[$middle$$]);
    0 < $compareResult$$ ? $left$$ = $middle$$ + 1 : ($right$$ = $middle$$, $found$$ = !$compareResult$$)
  }
  return $found$$ ? $left$$ : ~$left$$
};
goog.array.sort = function $goog$array$sort$($arr$$, $opt_compareFn$$) {
  goog.asserts.assert(null != $arr$$.length);
  goog.array.ARRAY_PROTOTYPE_.sort.call($arr$$, $opt_compareFn$$ || goog.array.defaultCompare)
};
goog.array.stableSort = function $goog$array$stableSort$($arr$$, $opt_compareFn$$) {
  for(var $i$$ = 0;$i$$ < $arr$$.length;$i$$++) {
    $arr$$[$i$$] = {index:$i$$, value:$arr$$[$i$$]}
  }
  var $valueCompareFn$$ = $opt_compareFn$$ || goog.array.defaultCompare;
  goog.array.sort($arr$$, function stableCompareFn($obj1$$, $obj2$$) {
    return $valueCompareFn$$($obj1$$.value, $obj2$$.value) || $obj1$$.index - $obj2$$.index
  });
  for($i$$ = 0;$i$$ < $arr$$.length;$i$$++) {
    $arr$$[$i$$] = $arr$$[$i$$].value
  }
};
goog.array.sortObjectsByKey = function $goog$array$sortObjectsByKey$($arr$$, $key$$, $opt_compareFn$$) {
  var $compare$$ = $opt_compareFn$$ || goog.array.defaultCompare;
  goog.array.sort($arr$$, function($a$$, $b$$) {
    return $compare$$($a$$[$key$$], $b$$[$key$$])
  })
};
goog.array.isSorted = function $goog$array$isSorted$($arr$$, $compare$$1_opt_compareFn$$, $opt_strict$$) {
  $compare$$1_opt_compareFn$$ = $compare$$1_opt_compareFn$$ || goog.array.defaultCompare;
  for(var $i$$ = 1;$i$$ < $arr$$.length;$i$$++) {
    var $compareResult$$ = $compare$$1_opt_compareFn$$($arr$$[$i$$ - 1], $arr$$[$i$$]);
    if(0 < $compareResult$$ || 0 == $compareResult$$ && $opt_strict$$) {
      return!1
    }
  }
  return!0
};
goog.array.equals = function $goog$array$equals$($arr1$$, $arr2$$, $equalsFn_opt_equalsFn$$) {
  if(!goog.isArrayLike($arr1$$) || !goog.isArrayLike($arr2$$) || $arr1$$.length != $arr2$$.length) {
    return!1
  }
  var $l$$ = $arr1$$.length;
  $equalsFn_opt_equalsFn$$ = $equalsFn_opt_equalsFn$$ || goog.array.defaultCompareEquality;
  for(var $i$$ = 0;$i$$ < $l$$;$i$$++) {
    if(!$equalsFn_opt_equalsFn$$($arr1$$[$i$$], $arr2$$[$i$$])) {
      return!1
    }
  }
  return!0
};
goog.array.compare = function $goog$array$compare$($arr1$$, $arr2$$, $opt_equalsFn$$) {
  return goog.array.equals($arr1$$, $arr2$$, $opt_equalsFn$$)
};
goog.array.compare3 = function $goog$array$compare3$($arr1$$, $arr2$$, $compare$$2_opt_compareFn$$) {
  $compare$$2_opt_compareFn$$ = $compare$$2_opt_compareFn$$ || goog.array.defaultCompare;
  for(var $l$$ = Math.min($arr1$$.length, $arr2$$.length), $i$$ = 0;$i$$ < $l$$;$i$$++) {
    var $result$$ = $compare$$2_opt_compareFn$$($arr1$$[$i$$], $arr2$$[$i$$]);
    if(0 != $result$$) {
      return $result$$
    }
  }
  return goog.array.defaultCompare($arr1$$.length, $arr2$$.length)
};
goog.array.defaultCompare = function $goog$array$defaultCompare$($a$$, $b$$) {
  return $a$$ > $b$$ ? 1 : $a$$ < $b$$ ? -1 : 0
};
goog.array.defaultCompareEquality = function $goog$array$defaultCompareEquality$($a$$, $b$$) {
  return $a$$ === $b$$
};
goog.array.binaryInsert = function $goog$array$binaryInsert$($array$$, $value$$, $index$$51_opt_compareFn$$) {
  $index$$51_opt_compareFn$$ = goog.array.binarySearch($array$$, $value$$, $index$$51_opt_compareFn$$);
  return 0 > $index$$51_opt_compareFn$$ ? (goog.array.insertAt($array$$, $value$$, -($index$$51_opt_compareFn$$ + 1)), !0) : !1
};
goog.array.binaryRemove = function $goog$array$binaryRemove$($array$$, $index$$52_value$$, $opt_compareFn$$) {
  $index$$52_value$$ = goog.array.binarySearch($array$$, $index$$52_value$$, $opt_compareFn$$);
  return 0 <= $index$$52_value$$ ? goog.array.removeAt($array$$, $index$$52_value$$) : !1
};
goog.array.bucket = function $goog$array$bucket$($array$$, $sorter$$) {
  for(var $buckets$$ = {}, $i$$ = 0;$i$$ < $array$$.length;$i$$++) {
    var $value$$ = $array$$[$i$$], $key$$ = $sorter$$($value$$, $i$$, $array$$);
    goog.isDef($key$$) && ($buckets$$[$key$$] || ($buckets$$[$key$$] = [])).push($value$$)
  }
  return $buckets$$
};
goog.array.toObject = function $goog$array$toObject$($arr$$, $keyFunc$$, $opt_obj$$) {
  var $ret$$ = {};
  goog.array.forEach($arr$$, function($element$$, $index$$) {
    $ret$$[$keyFunc$$.call($opt_obj$$, $element$$, $index$$, $arr$$)] = $element$$
  });
  return $ret$$
};
goog.array.repeat = function $goog$array$repeat$($value$$, $n$$) {
  for(var $array$$ = [], $i$$ = 0;$i$$ < $n$$;$i$$++) {
    $array$$[$i$$] = $value$$
  }
  return $array$$
};
goog.array.flatten = function $goog$array$flatten$($var_args$$) {
  for(var $result$$ = [], $i$$ = 0;$i$$ < arguments.length;$i$$++) {
    var $element$$ = arguments[$i$$];
    goog.isArray($element$$) ? $result$$.push.apply($result$$, goog.array.flatten.apply(null, $element$$)) : $result$$.push($element$$)
  }
  return $result$$
};
goog.array.rotate = function $goog$array$rotate$($array$$, $n$$) {
  goog.asserts.assert(null != $array$$.length);
  $array$$.length && ($n$$ %= $array$$.length, 0 < $n$$ ? goog.array.ARRAY_PROTOTYPE_.unshift.apply($array$$, $array$$.splice(-$n$$, $n$$)) : 0 > $n$$ && goog.array.ARRAY_PROTOTYPE_.push.apply($array$$, $array$$.splice(0, -$n$$)));
  return $array$$
};
goog.array.zip = function $goog$array$zip$($var_args$$) {
  if(!arguments.length) {
    return[]
  }
  for(var $result$$ = [], $i$$ = 0;;$i$$++) {
    for(var $value$$ = [], $j$$ = 0;$j$$ < arguments.length;$j$$++) {
      var $arr$$ = arguments[$j$$];
      if($i$$ >= $arr$$.length) {
        return $result$$
      }
      $value$$.push($arr$$[$i$$])
    }
    $result$$.push($value$$)
  }
};
goog.array.shuffle = function $goog$array$shuffle$($arr$$, $opt_randFn$$) {
  for(var $randFn$$ = $opt_randFn$$ || Math.random, $i$$ = $arr$$.length - 1;0 < $i$$;$i$$--) {
    var $j$$ = Math.floor($randFn$$() * ($i$$ + 1)), $tmp$$ = $arr$$[$i$$];
    $arr$$[$i$$] = $arr$$[$j$$];
    $arr$$[$j$$] = $tmp$$
  }
};
goog.debug.entryPointRegistry = {};
goog.debug.EntryPointMonitor = function $goog$debug$EntryPointMonitor$() {
};
goog.debug.entryPointRegistry.refList_ = [];
goog.debug.entryPointRegistry.monitors_ = [];
goog.debug.entryPointRegistry.monitorsMayExist_ = !1;
goog.debug.entryPointRegistry.register = function $goog$debug$entryPointRegistry$register$($callback$$) {
  goog.debug.entryPointRegistry.refList_[goog.debug.entryPointRegistry.refList_.length] = $callback$$;
  if(goog.debug.entryPointRegistry.monitorsMayExist_) {
    for(var $monitors$$ = goog.debug.entryPointRegistry.monitors_, $i$$ = 0;$i$$ < $monitors$$.length;$i$$++) {
      $callback$$(goog.bind($monitors$$[$i$$].wrap, $monitors$$[$i$$]))
    }
  }
};
goog.debug.entryPointRegistry.monitorAll = function $goog$debug$entryPointRegistry$monitorAll$($monitor$$) {
  goog.debug.entryPointRegistry.monitorsMayExist_ = !0;
  for(var $transformer$$ = goog.bind($monitor$$.wrap, $monitor$$), $i$$ = 0;$i$$ < goog.debug.entryPointRegistry.refList_.length;$i$$++) {
    goog.debug.entryPointRegistry.refList_[$i$$]($transformer$$)
  }
  goog.debug.entryPointRegistry.monitors_.push($monitor$$)
};
goog.debug.entryPointRegistry.unmonitorAllIfPossible = function $goog$debug$entryPointRegistry$unmonitorAllIfPossible$($monitor$$1_transformer$$) {
  var $monitors$$ = goog.debug.entryPointRegistry.monitors_;
  goog.asserts.assert($monitor$$1_transformer$$ == $monitors$$[$monitors$$.length - 1], "Only the most recent monitor can be unwrapped.");
  $monitor$$1_transformer$$ = goog.bind($monitor$$1_transformer$$.unwrap, $monitor$$1_transformer$$);
  for(var $i$$ = 0;$i$$ < goog.debug.entryPointRegistry.refList_.length;$i$$++) {
    goog.debug.entryPointRegistry.refList_[$i$$]($monitor$$1_transformer$$)
  }
  $monitors$$.length--
};
goog.events.EventWrapper = function $goog$events$EventWrapper$() {
};
goog.events.EventWrapper.prototype.listen = function $goog$events$EventWrapper$$listen$() {
};
goog.events.EventWrapper.prototype.unlisten = function $goog$events$EventWrapper$$unlisten$() {
};
goog.events.EventType = {CLICK:"click", DBLCLICK:"dblclick", MOUSEDOWN:"mousedown", MOUSEUP:"mouseup", MOUSEOVER:"mouseover", MOUSEOUT:"mouseout", MOUSEMOVE:"mousemove", SELECTSTART:"selectstart", KEYPRESS:"keypress", KEYDOWN:"keydown", KEYUP:"keyup", BLUR:"blur", FOCUS:"focus", DEACTIVATE:"deactivate", FOCUSIN:goog.userAgent.IE ? "focusin" : "DOMFocusIn", FOCUSOUT:goog.userAgent.IE ? "focusout" : "DOMFocusOut", CHANGE:"change", SELECT:"select", SUBMIT:"submit", INPUT:"input", PROPERTYCHANGE:"propertychange", 
DRAGSTART:"dragstart", DRAG:"drag", DRAGENTER:"dragenter", DRAGOVER:"dragover", DRAGLEAVE:"dragleave", DROP:"drop", DRAGEND:"dragend", TOUCHSTART:"touchstart", TOUCHMOVE:"touchmove", TOUCHEND:"touchend", TOUCHCANCEL:"touchcancel", BEFOREUNLOAD:"beforeunload", CONTEXTMENU:"contextmenu", ERROR:"error", HELP:"help", LOAD:"load", LOSECAPTURE:"losecapture", READYSTATECHANGE:"readystatechange", RESIZE:"resize", SCROLL:"scroll", UNLOAD:"unload", HASHCHANGE:"hashchange", PAGEHIDE:"pagehide", PAGESHOW:"pageshow", 
POPSTATE:"popstate", COPY:"copy", PASTE:"paste", CUT:"cut", BEFORECOPY:"beforecopy", BEFORECUT:"beforecut", BEFOREPASTE:"beforepaste", ONLINE:"online", OFFLINE:"offline", MESSAGE:"message", CONNECT:"connect", TRANSITIONEND:goog.userAgent.WEBKIT ? "webkitTransitionEnd" : goog.userAgent.OPERA ? "oTransitionEnd" : "transitionend", MSGESTURECHANGE:"MSGestureChange", MSGESTUREEND:"MSGestureEnd", MSGESTUREHOLD:"MSGestureHold", MSGESTURESTART:"MSGestureStart", MSGESTURETAP:"MSGestureTap", MSGOTPOINTERCAPTURE:"MSGotPointerCapture", 
MSINERTIASTART:"MSInertiaStart", MSLOSTPOINTERCAPTURE:"MSLostPointerCapture", MSPOINTERCANCEL:"MSPointerCancel", MSPOINTERDOWN:"MSPointerDown", MSPOINTERMOVE:"MSPointerMove", MSPOINTEROVER:"MSPointerOver", MSPOINTEROUT:"MSPointerOut", MSPOINTERUP:"MSPointerUp"};
goog.disposable = {};
goog.disposable.IDisposable = function $goog$disposable$IDisposable$() {
};
goog.Disposable = function $goog$Disposable$() {
  goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF && (this.creationStack = Error().stack, goog.Disposable.instances_[goog.getUid(this)] = this)
};
goog.Disposable.MonitoringMode = {OFF:0, PERMANENT:1, INTERACTIVE:2};
goog.Disposable.MONITORING_MODE = 0;
goog.Disposable.instances_ = {};
goog.Disposable.getUndisposedObjects = function $goog$Disposable$getUndisposedObjects$() {
  var $ret$$ = [], $id$$;
  for($id$$ in goog.Disposable.instances_) {
    goog.Disposable.instances_.hasOwnProperty($id$$) && $ret$$.push(goog.Disposable.instances_[Number($id$$)])
  }
  return $ret$$
};
goog.Disposable.clearUndisposedObjects = function $goog$Disposable$clearUndisposedObjects$() {
  goog.Disposable.instances_ = {}
};
goog.Disposable.prototype.disposed_ = !1;
goog.Disposable.prototype.isDisposed = function $goog$Disposable$$isDisposed$() {
  return this.disposed_
};
goog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;
goog.Disposable.prototype.dispose = function $goog$Disposable$$dispose$() {
  if(!this.disposed_ && (this.disposed_ = !0, this.disposeInternal(), goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF)) {
    var $uid$$ = goog.getUid(this);
    if(goog.Disposable.MONITORING_MODE == goog.Disposable.MonitoringMode.PERMANENT && !goog.Disposable.instances_.hasOwnProperty($uid$$)) {
      throw Error(this + " did not call the goog.Disposable base constructor or was disposed of after a clearUndisposedObjects call");
    }
    delete goog.Disposable.instances_[$uid$$]
  }
};
goog.Disposable.prototype.registerDisposable = function $goog$Disposable$$registerDisposable$($disposable$$) {
  this.dependentDisposables_ || (this.dependentDisposables_ = []);
  this.dependentDisposables_.push($disposable$$)
};
goog.Disposable.prototype.addOnDisposeCallback = function $goog$Disposable$$addOnDisposeCallback$($callback$$, $opt_scope$$) {
  this.onDisposeCallbacks_ || (this.onDisposeCallbacks_ = []);
  this.onDisposeCallbacks_.push(goog.bind($callback$$, $opt_scope$$))
};
goog.Disposable.prototype.disposeInternal = function $goog$Disposable$$disposeInternal$() {
  this.dependentDisposables_ && goog.disposeAll.apply(null, this.dependentDisposables_);
  if(this.onDisposeCallbacks_) {
    for(;this.onDisposeCallbacks_.length;) {
      this.onDisposeCallbacks_.shift()()
    }
  }
};
goog.Disposable.isDisposed = function $goog$Disposable$isDisposed$($obj$$) {
  return $obj$$ && "function" == typeof $obj$$.isDisposed ? $obj$$.isDisposed() : !1
};
goog.dispose = function $goog$dispose$($obj$$) {
  $obj$$ && "function" == typeof $obj$$.dispose && $obj$$.dispose()
};
goog.disposeAll = function $goog$disposeAll$($var_args$$) {
  for(var $i$$ = 0, $len$$ = arguments.length;$i$$ < $len$$;++$i$$) {
    var $disposable$$ = arguments[$i$$];
    goog.isArrayLike($disposable$$) ? goog.disposeAll.apply(null, $disposable$$) : goog.dispose($disposable$$)
  }
};
goog.events.Event = function $goog$events$Event$($type$$, $opt_target$$) {
  this.type = $type$$;
  this.currentTarget = this.target = $opt_target$$
};
goog.events.Event.prototype.disposeInternal = function $goog$events$Event$$disposeInternal$() {
};
goog.events.Event.prototype.dispose = function $goog$events$Event$$dispose$() {
};
goog.events.Event.prototype.propagationStopped_ = !1;
goog.events.Event.prototype.defaultPrevented = !1;
goog.events.Event.prototype.returnValue_ = !0;
goog.events.Event.prototype.stopPropagation = function $goog$events$Event$$stopPropagation$() {
  this.propagationStopped_ = !0
};
goog.events.Event.prototype.preventDefault = function $goog$events$Event$$preventDefault$() {
  this.defaultPrevented = !0;
  this.returnValue_ = !1
};
goog.events.Event.stopPropagation = function $goog$events$Event$stopPropagation$($e$$) {
  $e$$.stopPropagation()
};
goog.events.Event.preventDefault = function $goog$events$Event$preventDefault$($e$$) {
  $e$$.preventDefault()
};
goog.reflect = {};
goog.reflect.object = function $goog$reflect$object$($type$$, $object$$) {
  return $object$$
};
goog.reflect.sinkValue = function $goog$reflect$sinkValue$($x$$) {
  goog.reflect.sinkValue[" "]($x$$);
  return $x$$
};
goog.reflect.sinkValue[" "] = goog.nullFunction;
goog.reflect.canAccessProperty = function $goog$reflect$canAccessProperty$($obj$$, $prop$$) {
  try {
    return goog.reflect.sinkValue($obj$$[$prop$$]), !0
  }catch($e$$) {
  }
  return!1
};
goog.events.BrowserEvent = function $goog$events$BrowserEvent$($opt_e$$, $opt_currentTarget$$) {
  $opt_e$$ && this.init($opt_e$$, $opt_currentTarget$$)
};
goog.inherits(goog.events.BrowserEvent, goog.events.Event);
goog.events.BrowserEvent.MouseButton = {LEFT:0, MIDDLE:1, RIGHT:2};
goog.events.BrowserEvent.IEButtonMap = [1, 4, 2];
goog.events.BrowserEvent.prototype.target = null;
goog.events.BrowserEvent.prototype.relatedTarget = null;
goog.events.BrowserEvent.prototype.offsetX = 0;
goog.events.BrowserEvent.prototype.offsetY = 0;
goog.events.BrowserEvent.prototype.clientX = 0;
goog.events.BrowserEvent.prototype.clientY = 0;
goog.events.BrowserEvent.prototype.screenX = 0;
goog.events.BrowserEvent.prototype.screenY = 0;
goog.events.BrowserEvent.prototype.button = 0;
goog.events.BrowserEvent.prototype.keyCode = 0;
goog.events.BrowserEvent.prototype.charCode = 0;
goog.events.BrowserEvent.prototype.ctrlKey = !1;
goog.events.BrowserEvent.prototype.altKey = !1;
goog.events.BrowserEvent.prototype.shiftKey = !1;
goog.events.BrowserEvent.prototype.metaKey = !1;
goog.events.BrowserEvent.prototype.platformModifierKey = !1;
goog.events.BrowserEvent.prototype.event_ = null;
goog.events.BrowserEvent.prototype.init = function $goog$events$BrowserEvent$$init$($e$$, $opt_currentTarget$$) {
  var $type$$ = this.type = $e$$.type;
  goog.events.Event.call(this, $type$$);
  this.target = $e$$.target || $e$$.srcElement;
  this.currentTarget = $opt_currentTarget$$;
  var $relatedTarget$$ = $e$$.relatedTarget;
  $relatedTarget$$ ? goog.userAgent.GECKO && (goog.reflect.canAccessProperty($relatedTarget$$, "nodeName") || ($relatedTarget$$ = null)) : $type$$ == goog.events.EventType.MOUSEOVER ? $relatedTarget$$ = $e$$.fromElement : $type$$ == goog.events.EventType.MOUSEOUT && ($relatedTarget$$ = $e$$.toElement);
  this.relatedTarget = $relatedTarget$$;
  this.offsetX = goog.userAgent.WEBKIT || void 0 !== $e$$.offsetX ? $e$$.offsetX : $e$$.layerX;
  this.offsetY = goog.userAgent.WEBKIT || void 0 !== $e$$.offsetY ? $e$$.offsetY : $e$$.layerY;
  this.clientX = void 0 !== $e$$.clientX ? $e$$.clientX : $e$$.pageX;
  this.clientY = void 0 !== $e$$.clientY ? $e$$.clientY : $e$$.pageY;
  this.screenX = $e$$.screenX || 0;
  this.screenY = $e$$.screenY || 0;
  this.button = $e$$.button;
  this.keyCode = $e$$.keyCode || 0;
  this.charCode = $e$$.charCode || ("keypress" == $type$$ ? $e$$.keyCode : 0);
  this.ctrlKey = $e$$.ctrlKey;
  this.altKey = $e$$.altKey;
  this.shiftKey = $e$$.shiftKey;
  this.metaKey = $e$$.metaKey;
  this.platformModifierKey = goog.userAgent.MAC ? $e$$.metaKey : $e$$.ctrlKey;
  this.state = $e$$.state;
  this.event_ = $e$$;
  $e$$.defaultPrevented && this.preventDefault();
  delete this.propagationStopped_
};
goog.events.BrowserEvent.prototype.isButton = function $goog$events$BrowserEvent$$isButton$($button$$) {
  return goog.events.BrowserFeature.HAS_W3C_BUTTON ? this.event_.button == $button$$ : "click" == this.type ? $button$$ == goog.events.BrowserEvent.MouseButton.LEFT : !!(this.event_.button & goog.events.BrowserEvent.IEButtonMap[$button$$])
};
goog.events.BrowserEvent.prototype.isMouseActionButton = function $goog$events$BrowserEvent$$isMouseActionButton$() {
  return this.isButton(goog.events.BrowserEvent.MouseButton.LEFT) && !(goog.userAgent.WEBKIT && goog.userAgent.MAC && this.ctrlKey)
};
goog.events.BrowserEvent.prototype.stopPropagation = function $goog$events$BrowserEvent$$stopPropagation$() {
  goog.events.BrowserEvent.superClass_.stopPropagation.call(this);
  this.event_.stopPropagation ? this.event_.stopPropagation() : this.event_.cancelBubble = !0
};
goog.events.BrowserEvent.prototype.preventDefault = function $goog$events$BrowserEvent$$preventDefault$() {
  goog.events.BrowserEvent.superClass_.preventDefault.call(this);
  var $be$$ = this.event_;
  if($be$$.preventDefault) {
    $be$$.preventDefault()
  }else {
    if($be$$.returnValue = !1, goog.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT) {
      try {
        if($be$$.ctrlKey || 112 <= $be$$.keyCode && 123 >= $be$$.keyCode) {
          $be$$.keyCode = -1
        }
      }catch($ex$$) {
      }
    }
  }
};
goog.events.BrowserEvent.prototype.getBrowserEvent = function $goog$events$BrowserEvent$$getBrowserEvent$() {
  return this.event_
};
goog.events.BrowserEvent.prototype.disposeInternal = function $goog$events$BrowserEvent$$disposeInternal$() {
};
goog.events.listeners_ = {};
goog.events.listenerTree_ = {};
goog.events.sources_ = {};
goog.events.onString_ = "on";
goog.events.onStringMap_ = {};
goog.events.keySeparator_ = "_";
goog.events.listen = function $goog$events$listen$($src$$, $type$$, $listener$$, $opt_capt$$, $opt_handler$$) {
  if(goog.isArray($type$$)) {
    for(var $i$$ = 0;$i$$ < $type$$.length;$i$$++) {
      goog.events.listen($src$$, $type$$[$i$$], $listener$$, $opt_capt$$, $opt_handler$$)
    }
    return null
  }
  return goog.events.listen_($src$$, $type$$, $listener$$, !1, $opt_capt$$, $opt_handler$$)
};
goog.events.listen_ = function $goog$events$listen_$($src$$, $type$$, $key$$45_listener$$, $callOnce$$, $capture$$1_opt_capt$$, $opt_handler$$) {
  if(!$type$$) {
    throw Error("Invalid event type");
  }
  $capture$$1_opt_capt$$ = !!$capture$$1_opt_capt$$;
  var $listenerObj_map$$ = goog.events.listenerTree_;
  $type$$ in $listenerObj_map$$ || ($listenerObj_map$$[$type$$] = {count_:0, remaining_:0});
  $listenerObj_map$$ = $listenerObj_map$$[$type$$];
  $capture$$1_opt_capt$$ in $listenerObj_map$$ || ($listenerObj_map$$[$capture$$1_opt_capt$$] = {count_:0, remaining_:0}, $listenerObj_map$$.count_++);
  var $listenerObj_map$$ = $listenerObj_map$$[$capture$$1_opt_capt$$], $srcUid$$ = goog.getUid($src$$), $listenerArray$$;
  $listenerObj_map$$.remaining_++;
  if($listenerObj_map$$[$srcUid$$]) {
    $listenerArray$$ = $listenerObj_map$$[$srcUid$$];
    for(var $i$$53_proxy$$ = 0;$i$$53_proxy$$ < $listenerArray$$.length;$i$$53_proxy$$++) {
      if($listenerObj_map$$ = $listenerArray$$[$i$$53_proxy$$], $listenerObj_map$$.listener == $key$$45_listener$$ && $listenerObj_map$$.handler == $opt_handler$$) {
        if($listenerObj_map$$.removed) {
          break
        }
        $callOnce$$ || ($listenerArray$$[$i$$53_proxy$$].callOnce = !1);
        return $listenerArray$$[$i$$53_proxy$$].key
      }
    }
  }else {
    $listenerArray$$ = $listenerObj_map$$[$srcUid$$] = [], $listenerObj_map$$.count_++
  }
  $i$$53_proxy$$ = goog.events.getProxy();
  $i$$53_proxy$$.src = $src$$;
  $listenerObj_map$$ = new goog.events.Listener;
  $listenerObj_map$$.init($key$$45_listener$$, $i$$53_proxy$$, $src$$, $type$$, $capture$$1_opt_capt$$, $opt_handler$$);
  $listenerObj_map$$.callOnce = $callOnce$$;
  $key$$45_listener$$ = $listenerObj_map$$.key;
  $i$$53_proxy$$.key = $key$$45_listener$$;
  $listenerArray$$.push($listenerObj_map$$);
  goog.events.listeners_[$key$$45_listener$$] = $listenerObj_map$$;
  goog.events.sources_[$srcUid$$] || (goog.events.sources_[$srcUid$$] = []);
  goog.events.sources_[$srcUid$$].push($listenerObj_map$$);
  $src$$.addEventListener ? ($src$$ == goog.global || !$src$$.customEvent_) && $src$$.addEventListener($type$$, $i$$53_proxy$$, $capture$$1_opt_capt$$) : $src$$.attachEvent(goog.events.getOnString_($type$$), $i$$53_proxy$$);
  return $key$$45_listener$$
};
goog.events.getProxy = function $goog$events$getProxy$() {
  var $proxyCallbackFunction$$ = goog.events.handleBrowserEvent_, $f$$ = goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT ? function($eventObject$$) {
    return $proxyCallbackFunction$$.call($f$$.src, $f$$.key, $eventObject$$)
  } : function($eventObject$$) {
    $eventObject$$ = $proxyCallbackFunction$$.call($f$$.src, $f$$.key, $eventObject$$);
    if(!$eventObject$$) {
      return $eventObject$$
    }
  };
  return $f$$
};
goog.events.listenOnce = function $goog$events$listenOnce$($src$$, $type$$, $listener$$, $opt_capt$$, $opt_handler$$) {
  if(goog.isArray($type$$)) {
    for(var $i$$ = 0;$i$$ < $type$$.length;$i$$++) {
      goog.events.listenOnce($src$$, $type$$[$i$$], $listener$$, $opt_capt$$, $opt_handler$$)
    }
    return null
  }
  return goog.events.listen_($src$$, $type$$, $listener$$, !0, $opt_capt$$, $opt_handler$$)
};
goog.events.listenWithWrapper = function $goog$events$listenWithWrapper$($src$$, $wrapper$$, $listener$$, $opt_capt$$, $opt_handler$$) {
  $wrapper$$.listen($src$$, $listener$$, $opt_capt$$, $opt_handler$$)
};
goog.events.unlisten = function $goog$events$unlisten$($listenerArray$$1_src$$, $type$$, $listener$$, $capture$$2_opt_capt$$, $opt_handler$$) {
  if(goog.isArray($type$$)) {
    for(var $i$$ = 0;$i$$ < $type$$.length;$i$$++) {
      goog.events.unlisten($listenerArray$$1_src$$, $type$$[$i$$], $listener$$, $capture$$2_opt_capt$$, $opt_handler$$)
    }
    return null
  }
  $capture$$2_opt_capt$$ = !!$capture$$2_opt_capt$$;
  $listenerArray$$1_src$$ = goog.events.getListeners_($listenerArray$$1_src$$, $type$$, $capture$$2_opt_capt$$);
  if(!$listenerArray$$1_src$$) {
    return!1
  }
  for($i$$ = 0;$i$$ < $listenerArray$$1_src$$.length;$i$$++) {
    if($listenerArray$$1_src$$[$i$$].listener == $listener$$ && $listenerArray$$1_src$$[$i$$].capture == $capture$$2_opt_capt$$ && $listenerArray$$1_src$$[$i$$].handler == $opt_handler$$) {
      return goog.events.unlistenByKey($listenerArray$$1_src$$[$i$$].key)
    }
  }
  return!1
};
goog.events.unlistenByKey = function $goog$events$unlistenByKey$($key$$) {
  if(!goog.events.listeners_[$key$$]) {
    return!1
  }
  var $listener$$40_listenerArray$$ = goog.events.listeners_[$key$$];
  if($listener$$40_listenerArray$$.removed) {
    return!1
  }
  var $src$$12_srcUid$$ = $listener$$40_listenerArray$$.src, $type$$ = $listener$$40_listenerArray$$.type, $proxy$$ = $listener$$40_listenerArray$$.proxy, $capture$$ = $listener$$40_listenerArray$$.capture;
  $src$$12_srcUid$$.removeEventListener ? ($src$$12_srcUid$$ == goog.global || !$src$$12_srcUid$$.customEvent_) && $src$$12_srcUid$$.removeEventListener($type$$, $proxy$$, $capture$$) : $src$$12_srcUid$$.detachEvent && $src$$12_srcUid$$.detachEvent(goog.events.getOnString_($type$$), $proxy$$);
  $src$$12_srcUid$$ = goog.getUid($src$$12_srcUid$$);
  goog.events.sources_[$src$$12_srcUid$$] && ($proxy$$ = goog.events.sources_[$src$$12_srcUid$$], goog.array.remove($proxy$$, $listener$$40_listenerArray$$), 0 == $proxy$$.length && delete goog.events.sources_[$src$$12_srcUid$$]);
  $listener$$40_listenerArray$$.removed = !0;
  if($listener$$40_listenerArray$$ = goog.events.listenerTree_[$type$$][$capture$$][$src$$12_srcUid$$]) {
    $listener$$40_listenerArray$$.needsCleanup_ = !0, goog.events.cleanUp_($type$$, $capture$$, $src$$12_srcUid$$, $listener$$40_listenerArray$$)
  }
  delete goog.events.listeners_[$key$$];
  return!0
};
goog.events.unlistenWithWrapper = function $goog$events$unlistenWithWrapper$($src$$, $wrapper$$, $listener$$, $opt_capt$$, $opt_handler$$) {
  $wrapper$$.unlisten($src$$, $listener$$, $opt_capt$$, $opt_handler$$)
};
goog.events.cleanUp_ = function $goog$events$cleanUp_$($type$$, $capture$$, $srcUid$$, $listenerArray$$) {
  if(!$listenerArray$$.locked_ && $listenerArray$$.needsCleanup_) {
    for(var $oldIndex$$ = 0, $newIndex$$ = 0;$oldIndex$$ < $listenerArray$$.length;$oldIndex$$++) {
      $listenerArray$$[$oldIndex$$].removed ? $listenerArray$$[$oldIndex$$].proxy.src = null : ($oldIndex$$ != $newIndex$$ && ($listenerArray$$[$newIndex$$] = $listenerArray$$[$oldIndex$$]), $newIndex$$++)
    }
    $listenerArray$$.length = $newIndex$$;
    $listenerArray$$.needsCleanup_ = !1;
    0 == $newIndex$$ && (delete goog.events.listenerTree_[$type$$][$capture$$][$srcUid$$], goog.events.listenerTree_[$type$$][$capture$$].count_--, 0 == goog.events.listenerTree_[$type$$][$capture$$].count_ && (delete goog.events.listenerTree_[$type$$][$capture$$], goog.events.listenerTree_[$type$$].count_--), 0 == goog.events.listenerTree_[$type$$].count_ && delete goog.events.listenerTree_[$type$$])
  }
};
goog.events.removeAll = function $goog$events$removeAll$($opt_obj$$27_sourcesArray$$1_srcUid$$, $opt_type$$, $opt_capt$$) {
  var $count$$ = 0, $noType$$ = null == $opt_type$$, $noCapt$$ = null == $opt_capt$$;
  $opt_capt$$ = !!$opt_capt$$;
  if(null == $opt_obj$$27_sourcesArray$$1_srcUid$$) {
    goog.object.forEach(goog.events.sources_, function($listeners$$) {
      for(var $i$$ = $listeners$$.length - 1;0 <= $i$$;$i$$--) {
        var $listener$$ = $listeners$$[$i$$];
        if(($noType$$ || $opt_type$$ == $listener$$.type) && ($noCapt$$ || $opt_capt$$ == $listener$$.capture)) {
          goog.events.unlistenByKey($listener$$.key), $count$$++
        }
      }
    })
  }else {
    if($opt_obj$$27_sourcesArray$$1_srcUid$$ = goog.getUid($opt_obj$$27_sourcesArray$$1_srcUid$$), goog.events.sources_[$opt_obj$$27_sourcesArray$$1_srcUid$$]) {
      $opt_obj$$27_sourcesArray$$1_srcUid$$ = goog.events.sources_[$opt_obj$$27_sourcesArray$$1_srcUid$$];
      for(var $i$$0$$ = $opt_obj$$27_sourcesArray$$1_srcUid$$.length - 1;0 <= $i$$0$$;$i$$0$$--) {
        var $listener$$0$$ = $opt_obj$$27_sourcesArray$$1_srcUid$$[$i$$0$$];
        if(($noType$$ || $opt_type$$ == $listener$$0$$.type) && ($noCapt$$ || $opt_capt$$ == $listener$$0$$.capture)) {
          goog.events.unlistenByKey($listener$$0$$.key), $count$$++
        }
      }
    }
  }
  return $count$$
};
goog.events.getListeners = function $goog$events$getListeners$($obj$$, $type$$, $capture$$) {
  return goog.events.getListeners_($obj$$, $type$$, $capture$$) || []
};
goog.events.getListeners_ = function $goog$events$getListeners_$($obj$$, $type$$, $capture$$) {
  var $map$$ = goog.events.listenerTree_;
  return $type$$ in $map$$ && ($map$$ = $map$$[$type$$], $capture$$ in $map$$ && ($map$$ = $map$$[$capture$$], $obj$$ = goog.getUid($obj$$), $map$$[$obj$$])) ? $map$$[$obj$$] : null
};
goog.events.getListener = function $goog$events$getListener$($listenerArray$$4_src$$, $i$$58_type$$, $listener$$, $capture$$7_opt_capt$$, $opt_handler$$) {
  $capture$$7_opt_capt$$ = !!$capture$$7_opt_capt$$;
  if($listenerArray$$4_src$$ = goog.events.getListeners_($listenerArray$$4_src$$, $i$$58_type$$, $capture$$7_opt_capt$$)) {
    for($i$$58_type$$ = 0;$i$$58_type$$ < $listenerArray$$4_src$$.length;$i$$58_type$$++) {
      if(!$listenerArray$$4_src$$[$i$$58_type$$].removed && $listenerArray$$4_src$$[$i$$58_type$$].listener == $listener$$ && $listenerArray$$4_src$$[$i$$58_type$$].capture == $capture$$7_opt_capt$$ && $listenerArray$$4_src$$[$i$$58_type$$].handler == $opt_handler$$) {
        return $listenerArray$$4_src$$[$i$$58_type$$]
      }
    }
  }
  return null
};
goog.events.hasListener = function $goog$events$hasListener$($obj$$82_objUid$$, $opt_type$$, $opt_capture$$) {
  $obj$$82_objUid$$ = goog.getUid($obj$$82_objUid$$);
  var $listeners$$1_map$$ = goog.events.sources_[$obj$$82_objUid$$];
  if($listeners$$1_map$$) {
    var $hasType$$ = goog.isDef($opt_type$$), $hasCapture$$ = goog.isDef($opt_capture$$);
    return $hasType$$ && $hasCapture$$ ? ($listeners$$1_map$$ = goog.events.listenerTree_[$opt_type$$], !!$listeners$$1_map$$ && !!$listeners$$1_map$$[$opt_capture$$] && $obj$$82_objUid$$ in $listeners$$1_map$$[$opt_capture$$]) : !$hasType$$ && !$hasCapture$$ ? !0 : goog.array.some($listeners$$1_map$$, function($listener$$) {
      return $hasType$$ && $listener$$.type == $opt_type$$ || $hasCapture$$ && $listener$$.capture == $opt_capture$$
    })
  }
  return!1
};
goog.events.expose = function $goog$events$expose$($e$$) {
  var $str$$ = [], $key$$;
  for($key$$ in $e$$) {
    $e$$[$key$$] && $e$$[$key$$].id ? $str$$.push($key$$ + " = " + $e$$[$key$$] + " (" + $e$$[$key$$].id + ")") : $str$$.push($key$$ + " = " + $e$$[$key$$])
  }
  return $str$$.join("\n")
};
goog.events.getOnString_ = function $goog$events$getOnString_$($type$$) {
  return $type$$ in goog.events.onStringMap_ ? goog.events.onStringMap_[$type$$] : goog.events.onStringMap_[$type$$] = goog.events.onString_ + $type$$
};
goog.events.fireListeners = function $goog$events$fireListeners$($obj$$, $type$$, $capture$$, $eventObject$$) {
  var $map$$ = goog.events.listenerTree_;
  return $type$$ in $map$$ && ($map$$ = $map$$[$type$$], $capture$$ in $map$$) ? goog.events.fireListeners_($map$$[$capture$$], $obj$$, $type$$, $capture$$, $eventObject$$) : !0
};
goog.events.fireListeners_ = function $goog$events$fireListeners_$($listenerArray$$5_map$$, $obj$$84_objUid$$, $type$$, $capture$$, $eventObject$$) {
  var $retval$$ = 1;
  $obj$$84_objUid$$ = goog.getUid($obj$$84_objUid$$);
  if($listenerArray$$5_map$$[$obj$$84_objUid$$]) {
    $listenerArray$$5_map$$.remaining_--;
    $listenerArray$$5_map$$ = $listenerArray$$5_map$$[$obj$$84_objUid$$];
    $listenerArray$$5_map$$.locked_ ? $listenerArray$$5_map$$.locked_++ : $listenerArray$$5_map$$.locked_ = 1;
    try {
      for(var $length$$ = $listenerArray$$5_map$$.length, $i$$ = 0;$i$$ < $length$$;$i$$++) {
        var $listener$$ = $listenerArray$$5_map$$[$i$$];
        $listener$$ && !$listener$$.removed && ($retval$$ &= !1 !== goog.events.fireListener($listener$$, $eventObject$$))
      }
    }finally {
      $listenerArray$$5_map$$.locked_--, goog.events.cleanUp_($type$$, $capture$$, $obj$$84_objUid$$, $listenerArray$$5_map$$)
    }
  }
  return Boolean($retval$$)
};
goog.events.fireListener = function $goog$events$fireListener$($listener$$, $eventObject$$) {
  $listener$$.callOnce && goog.events.unlistenByKey($listener$$.key);
  return $listener$$.handleEvent($eventObject$$)
};
goog.events.getTotalListenerCount = function $goog$events$getTotalListenerCount$() {
  return goog.object.getCount(goog.events.listeners_)
};
goog.events.dispatchEvent = function $goog$events$dispatchEvent$($src$$, $e$$) {
  var $hasCapture$$1_type$$ = $e$$.type || $e$$, $current$$1_map$$ = goog.events.listenerTree_;
  if(!($hasCapture$$1_type$$ in $current$$1_map$$)) {
    return!0
  }
  if(goog.isString($e$$)) {
    $e$$ = new goog.events.Event($e$$, $src$$)
  }else {
    if($e$$ instanceof goog.events.Event) {
      $e$$.target = $e$$.target || $src$$
    }else {
      var $oldEvent_rv$$ = $e$$;
      $e$$ = new goog.events.Event($hasCapture$$1_type$$, $src$$);
      goog.object.extend($e$$, $oldEvent_rv$$)
    }
  }
  var $oldEvent_rv$$ = 1, $ancestors$$, $current$$1_map$$ = $current$$1_map$$[$hasCapture$$1_type$$], $hasCapture$$1_type$$ = !0 in $current$$1_map$$, $parent$$;
  if($hasCapture$$1_type$$) {
    $ancestors$$ = [];
    for($parent$$ = $src$$;$parent$$;$parent$$ = $parent$$.getParentEventTarget()) {
      $ancestors$$.push($parent$$)
    }
    $parent$$ = $current$$1_map$$[!0];
    $parent$$.remaining_ = $parent$$.count_;
    for(var $i$$ = $ancestors$$.length - 1;!$e$$.propagationStopped_ && 0 <= $i$$ && $parent$$.remaining_;$i$$--) {
      $e$$.currentTarget = $ancestors$$[$i$$], $oldEvent_rv$$ &= goog.events.fireListeners_($parent$$, $ancestors$$[$i$$], $e$$.type, !0, $e$$) && !1 != $e$$.returnValue_
    }
  }
  if(!1 in $current$$1_map$$) {
    if($parent$$ = $current$$1_map$$[!1], $parent$$.remaining_ = $parent$$.count_, $hasCapture$$1_type$$) {
      for($i$$ = 0;!$e$$.propagationStopped_ && $i$$ < $ancestors$$.length && $parent$$.remaining_;$i$$++) {
        $e$$.currentTarget = $ancestors$$[$i$$], $oldEvent_rv$$ &= goog.events.fireListeners_($parent$$, $ancestors$$[$i$$], $e$$.type, !1, $e$$) && !1 != $e$$.returnValue_
      }
    }else {
      for($current$$1_map$$ = $src$$;!$e$$.propagationStopped_ && $current$$1_map$$ && $parent$$.remaining_;$current$$1_map$$ = $current$$1_map$$.getParentEventTarget()) {
        $e$$.currentTarget = $current$$1_map$$, $oldEvent_rv$$ &= goog.events.fireListeners_($parent$$, $current$$1_map$$, $e$$.type, !1, $e$$) && !1 != $e$$.returnValue_
      }
    }
  }
  return Boolean($oldEvent_rv$$)
};
goog.events.protectBrowserEventEntryPoint = function $goog$events$protectBrowserEventEntryPoint$($errorHandler$$) {
  goog.events.handleBrowserEvent_ = $errorHandler$$.protectEntryPoint(goog.events.handleBrowserEvent_)
};
goog.events.handleBrowserEvent_ = function $goog$events$handleBrowserEvent_$($key$$, $opt_evt$$) {
  if(!goog.events.listeners_[$key$$]) {
    return!0
  }
  var $listener$$ = goog.events.listeners_[$key$$], $be$$1_type$$ = $listener$$.type, $map$$ = goog.events.listenerTree_;
  if(!($be$$1_type$$ in $map$$)) {
    return!0
  }
  var $map$$ = $map$$[$be$$1_type$$], $ieEvent_retval$$, $targetsMap$$;
  if(!goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    $ieEvent_retval$$ = $opt_evt$$ || goog.getObjectByName("window.event");
    var $hasCapture$$ = !0 in $map$$, $hasBubble$$ = !1 in $map$$;
    if($hasCapture$$) {
      if(goog.events.isMarkedIeEvent_($ieEvent_retval$$)) {
        return!0
      }
      goog.events.markIeEvent_($ieEvent_retval$$)
    }
    var $evt$$ = new goog.events.BrowserEvent;
    $evt$$.init($ieEvent_retval$$, this);
    $ieEvent_retval$$ = !0;
    try {
      if($hasCapture$$) {
        for(var $ancestors$$ = [], $parent$$ = $evt$$.currentTarget;$parent$$;$parent$$ = $parent$$.parentNode) {
          $ancestors$$.push($parent$$)
        }
        $targetsMap$$ = $map$$[!0];
        $targetsMap$$.remaining_ = $targetsMap$$.count_;
        for(var $i$$ = $ancestors$$.length - 1;!$evt$$.propagationStopped_ && 0 <= $i$$ && $targetsMap$$.remaining_;$i$$--) {
          $evt$$.currentTarget = $ancestors$$[$i$$], $ieEvent_retval$$ &= goog.events.fireListeners_($targetsMap$$, $ancestors$$[$i$$], $be$$1_type$$, !0, $evt$$)
        }
        if($hasBubble$$) {
          $targetsMap$$ = $map$$[!1];
          $targetsMap$$.remaining_ = $targetsMap$$.count_;
          for($i$$ = 0;!$evt$$.propagationStopped_ && $i$$ < $ancestors$$.length && $targetsMap$$.remaining_;$i$$++) {
            $evt$$.currentTarget = $ancestors$$[$i$$], $ieEvent_retval$$ &= goog.events.fireListeners_($targetsMap$$, $ancestors$$[$i$$], $be$$1_type$$, !1, $evt$$)
          }
        }
      }else {
        $ieEvent_retval$$ = goog.events.fireListener($listener$$, $evt$$)
      }
    }finally {
      $ancestors$$ && ($ancestors$$.length = 0)
    }
    return $ieEvent_retval$$
  }
  $be$$1_type$$ = new goog.events.BrowserEvent($opt_evt$$, this);
  return $ieEvent_retval$$ = goog.events.fireListener($listener$$, $be$$1_type$$)
};
goog.events.markIeEvent_ = function $goog$events$markIeEvent_$($e$$) {
  var $useReturnValue$$ = !1;
  if(0 == $e$$.keyCode) {
    try {
      $e$$.keyCode = -1;
      return
    }catch($ex$$) {
      $useReturnValue$$ = !0
    }
  }
  if($useReturnValue$$ || void 0 == $e$$.returnValue) {
    $e$$.returnValue = !0
  }
};
goog.events.isMarkedIeEvent_ = function $goog$events$isMarkedIeEvent_$($e$$) {
  return 0 > $e$$.keyCode || void 0 != $e$$.returnValue
};
goog.events.uniqueIdCounter_ = 0;
goog.events.getUniqueId = function $goog$events$getUniqueId$($identifier$$) {
  return $identifier$$ + "_" + goog.events.uniqueIdCounter_++
};
goog.debug.entryPointRegistry.register(function($transformer$$) {
  goog.events.handleBrowserEvent_ = $transformer$$(goog.events.handleBrowserEvent_)
});
var ww = {util:{}};
ww.util.floatComplexGaussianRandom = function $ww$util$floatComplexGaussianRandom$() {
  var $x1$$, $x2$$, $w$$, $out$$ = [];
  do {
    $x1$$ = 2 * Math.random() - 1, $x2$$ = 2 * Math.random() - 1, $w$$ = $x1$$ * $x1$$ + $x2$$ * $x2$$
  }while(1 <= $w$$);
  $w$$ = Math.sqrt(-1 * Math.log($w$$) / $w$$);
  $out$$[0] = $x1$$ * $w$$;
  $out$$[1] = $x2$$ * $w$$;
  return $out$$
};
(function() {
  for(var $lastTime$$ = 0, $vendors$$ = ["ms", "moz", "webkit", "o"], $x$$ = 0;$x$$ < $vendors$$.length && !window.requestAnimationFrame;++$x$$) {
    window.requestAnimationFrame = window[$vendors$$[$x$$] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[$vendors$$[$x$$] + "CancelAnimationFrame"] || window[$vendors$$[$x$$] + "CancelRequestAnimationFrame"]
  }
  window.requestAnimationFrame || (window.requestAnimationFrame = function $window$requestAnimationFrame$($callback$$) {
    var $currTime$$ = (new Date).getTime(), $timeToCall$$ = Math.max(0, 16 - ($currTime$$ - $lastTime$$)), $id$$ = window.setTimeout(function() {
      $callback$$($currTime$$ + $timeToCall$$)
    }, $timeToCall$$);
    $lastTime$$ = $currTime$$ + $timeToCall$$;
    return $id$$
  });
  window.cancelAnimationFrame || (window.cancelAnimationFrame = function $window$cancelAnimationFrame$($id$$) {
    clearTimeout($id$$)
  })
})();
ww.raqSubscribers = {};
ww.raqRunning = !1;
ww.lastTime = 0;
ww.testMode = -1 < window.location.href.indexOf("test");
var subscriberKey, loopSubscriber, loopCurrentTime, loopDelta;
ww.raqOnFrame = function $ww$raqOnFrame$($t$$) {
  loopCurrentTime = $t$$ || (new Date).getTime();
  loopDelta = loopCurrentTime - ww.lastTime;
  for(subscriberKey in ww.raqSubscribers) {
    ww.raqSubscribers.hasOwnProperty(subscriberKey) && (loopSubscriber = ww.raqSubscribers[subscriberKey], loopSubscriber[1].call(loopSubscriber[0], loopDelta))
  }
  ww.lastTime = loopCurrentTime;
  ww.raqRunning && requestAnimationFrame(ww.raqOnFrame)
};
ww.raqUpdateStatus = function $ww$raqUpdateStatus$() {
  var $len$$ = 0, $key$$;
  for($key$$ in ww.raqSubscribers) {
    ww.raqSubscribers.hasOwnProperty($key$$) && $len$$++
  }
  0 < $len$$ ? ww.raqRunning || (ww.raqRunning = !0, ww.lastTime = (new Date).getTime(), ww.raqOnFrame()) : ww.raqRunning && (ww.raqRunning = !1)
};
ww.raqSubscribe = function $ww$raqSubscribe$($name$$, $obj$$, $func$$) {
  ww.raqSubscribers[$name$$] = [$obj$$, $func$$];
  ww.raqUpdateStatus()
};
ww.raqUnsubscribe = function $ww$raqUnsubscribe$($name$$) {
  delete ww.raqSubscribers[$name$$];
  ww.raqUpdateStatus()
};
goog.dom = {};
goog.dom.classes = {};
goog.dom.classes.set = function $goog$dom$classes$set$($element$$, $className$$) {
  $element$$.className = $className$$
};
goog.dom.classes.get = function $goog$dom$classes$get$($className$$5_element$$) {
  $className$$5_element$$ = $className$$5_element$$.className;
  return goog.isString($className$$5_element$$) && $className$$5_element$$.match(/\S+/g) || []
};
goog.dom.classes.add = function $goog$dom$classes$add$($element$$, $var_args$$) {
  var $classes$$ = goog.dom.classes.get($element$$), $args$$ = goog.array.slice(arguments, 1), $expectedCount$$ = $classes$$.length + $args$$.length;
  goog.dom.classes.add_($classes$$, $args$$);
  $element$$.className = $classes$$.join(" ");
  return $classes$$.length == $expectedCount$$
};
goog.dom.classes.remove = function $goog$dom$classes$remove$($element$$, $var_args$$) {
  var $classes$$ = goog.dom.classes.get($element$$), $args$$ = goog.array.slice(arguments, 1), $newClasses$$ = goog.dom.classes.getDifference_($classes$$, $args$$);
  $element$$.className = $newClasses$$.join(" ");
  return $newClasses$$.length == $classes$$.length - $args$$.length
};
goog.dom.classes.add_ = function $goog$dom$classes$add_$($classes$$, $args$$) {
  for(var $i$$ = 0;$i$$ < $args$$.length;$i$$++) {
    goog.array.contains($classes$$, $args$$[$i$$]) || $classes$$.push($args$$[$i$$])
  }
};
goog.dom.classes.getDifference_ = function $goog$dom$classes$getDifference_$($arr1$$, $arr2$$) {
  return goog.array.filter($arr1$$, function($item$$) {
    return!goog.array.contains($arr2$$, $item$$)
  })
};
goog.dom.classes.swap = function $goog$dom$classes$swap$($element$$, $fromClass$$, $toClass$$) {
  for(var $classes$$ = goog.dom.classes.get($element$$), $removed$$ = !1, $i$$ = 0;$i$$ < $classes$$.length;$i$$++) {
    $classes$$[$i$$] == $fromClass$$ && (goog.array.splice($classes$$, $i$$--, 1), $removed$$ = !0)
  }
  $removed$$ && ($classes$$.push($toClass$$), $element$$.className = $classes$$.join(" "));
  return $removed$$
};
goog.dom.classes.addRemove = function $goog$dom$classes$addRemove$($element$$, $classesToRemove$$, $classesToAdd$$) {
  var $classes$$ = goog.dom.classes.get($element$$);
  goog.isString($classesToRemove$$) ? goog.array.remove($classes$$, $classesToRemove$$) : goog.isArray($classesToRemove$$) && ($classes$$ = goog.dom.classes.getDifference_($classes$$, $classesToRemove$$));
  goog.isString($classesToAdd$$) && !goog.array.contains($classes$$, $classesToAdd$$) ? $classes$$.push($classesToAdd$$) : goog.isArray($classesToAdd$$) && goog.dom.classes.add_($classes$$, $classesToAdd$$);
  $element$$.className = $classes$$.join(" ")
};
goog.dom.classes.has = function $goog$dom$classes$has$($element$$, $className$$) {
  return goog.array.contains(goog.dom.classes.get($element$$), $className$$)
};
goog.dom.classes.enable = function $goog$dom$classes$enable$($element$$, $className$$, $enabled$$) {
  $enabled$$ ? goog.dom.classes.add($element$$, $className$$) : goog.dom.classes.remove($element$$, $className$$)
};
goog.dom.classes.toggle = function $goog$dom$classes$toggle$($element$$, $className$$) {
  var $add$$ = !goog.dom.classes.has($element$$, $className$$);
  goog.dom.classes.enable($element$$, $className$$, $add$$);
  return $add$$
};
goog.dom.TagName = {A:"A", ABBR:"ABBR", ACRONYM:"ACRONYM", ADDRESS:"ADDRESS", APPLET:"APPLET", AREA:"AREA", ARTICLE:"ARTICLE", ASIDE:"ASIDE", AUDIO:"AUDIO", B:"B", BASE:"BASE", BASEFONT:"BASEFONT", BDI:"BDI", BDO:"BDO", BIG:"BIG", BLOCKQUOTE:"BLOCKQUOTE", BODY:"BODY", BR:"BR", BUTTON:"BUTTON", CANVAS:"CANVAS", CAPTION:"CAPTION", CENTER:"CENTER", CITE:"CITE", CODE:"CODE", COL:"COL", COLGROUP:"COLGROUP", COMMAND:"COMMAND", DATA:"DATA", DATALIST:"DATALIST", DD:"DD", DEL:"DEL", DETAILS:"DETAILS", DFN:"DFN", 
DIALOG:"DIALOG", DIR:"DIR", DIV:"DIV", DL:"DL", DT:"DT", EM:"EM", EMBED:"EMBED", FIELDSET:"FIELDSET", FIGCAPTION:"FIGCAPTION", FIGURE:"FIGURE", FONT:"FONT", FOOTER:"FOOTER", FORM:"FORM", FRAME:"FRAME", FRAMESET:"FRAMESET", H1:"H1", H2:"H2", H3:"H3", H4:"H4", H5:"H5", H6:"H6", HEAD:"HEAD", HEADER:"HEADER", HGROUP:"HGROUP", HR:"HR", HTML:"HTML", I:"I", IFRAME:"IFRAME", IMG:"IMG", INPUT:"INPUT", INS:"INS", ISINDEX:"ISINDEX", KBD:"KBD", KEYGEN:"KEYGEN", LABEL:"LABEL", LEGEND:"LEGEND", LI:"LI", LINK:"LINK", 
MAP:"MAP", MARK:"MARK", MATH:"MATH", MENU:"MENU", META:"META", METER:"METER", NAV:"NAV", NOFRAMES:"NOFRAMES", NOSCRIPT:"NOSCRIPT", OBJECT:"OBJECT", OL:"OL", OPTGROUP:"OPTGROUP", OPTION:"OPTION", OUTPUT:"OUTPUT", P:"P", PARAM:"PARAM", PRE:"PRE", PROGRESS:"PROGRESS", Q:"Q", RP:"RP", RT:"RT", RUBY:"RUBY", S:"S", SAMP:"SAMP", SCRIPT:"SCRIPT", SECTION:"SECTION", SELECT:"SELECT", SMALL:"SMALL", SOURCE:"SOURCE", SPAN:"SPAN", STRIKE:"STRIKE", STRONG:"STRONG", STYLE:"STYLE", SUB:"SUB", SUMMARY:"SUMMARY", 
SUP:"SUP", SVG:"SVG", TABLE:"TABLE", TBODY:"TBODY", TD:"TD", TEXTAREA:"TEXTAREA", TFOOT:"TFOOT", TH:"TH", THEAD:"THEAD", TIME:"TIME", TITLE:"TITLE", TR:"TR", TRACK:"TRACK", TT:"TT", U:"U", UL:"UL", VAR:"VAR", VIDEO:"VIDEO", WBR:"WBR"};
goog.math = {};
goog.math.Size = function $goog$math$Size$($width$$, $height$$) {
  this.width = $width$$;
  this.height = $height$$
};
goog.math.Size.equals = function $goog$math$Size$equals$($a$$, $b$$) {
  return $a$$ == $b$$ ? !0 : !$a$$ || !$b$$ ? !1 : $a$$.width == $b$$.width && $a$$.height == $b$$.height
};
goog.math.Size.prototype.clone = function $goog$math$Size$$clone$() {
  return new goog.math.Size(this.width, this.height)
};
goog.DEBUG && (goog.math.Size.prototype.toString = function $goog$math$Size$$toString$() {
  return"(" + this.width + " x " + this.height + ")"
});
goog.math.Size.prototype.getLongest = function $goog$math$Size$$getLongest$() {
  return Math.max(this.width, this.height)
};
goog.math.Size.prototype.getShortest = function $goog$math$Size$$getShortest$() {
  return Math.min(this.width, this.height)
};
goog.math.Size.prototype.area = function $goog$math$Size$$area$() {
  return this.width * this.height
};
goog.math.Size.prototype.perimeter = function $goog$math$Size$$perimeter$() {
  return 2 * (this.width + this.height)
};
goog.math.Size.prototype.aspectRatio = function $goog$math$Size$$aspectRatio$() {
  return this.width / this.height
};
goog.math.Size.prototype.isEmpty = function $goog$math$Size$$isEmpty$() {
  return!this.area()
};
goog.math.Size.prototype.ceil = function $goog$math$Size$$ceil$() {
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this
};
goog.math.Size.prototype.fitsInside = function $goog$math$Size$$fitsInside$($target$$) {
  return this.width <= $target$$.width && this.height <= $target$$.height
};
goog.math.Size.prototype.floor = function $goog$math$Size$$floor$() {
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this
};
goog.math.Size.prototype.round = function $goog$math$Size$$round$() {
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this
};
goog.math.Size.prototype.scale = function $goog$math$Size$$scale$($s$$) {
  this.width *= $s$$;
  this.height *= $s$$;
  return this
};
goog.math.Size.prototype.scaleToFit = function $goog$math$Size$$scaleToFit$($s$$15_target$$) {
  $s$$15_target$$ = this.aspectRatio() > $s$$15_target$$.aspectRatio() ? $s$$15_target$$.width / this.width : $s$$15_target$$.height / this.height;
  return this.scale($s$$15_target$$)
};
goog.dom.BrowserFeature = {CAN_ADD_NAME_OR_TYPE_ATTRIBUTES:!goog.userAgent.IE || goog.userAgent.isDocumentMode(9), CAN_USE_CHILDREN_ATTRIBUTE:!goog.userAgent.GECKO && !goog.userAgent.IE || goog.userAgent.IE && goog.userAgent.isDocumentMode(9) || goog.userAgent.GECKO && goog.userAgent.isVersion("1.9.1"), CAN_USE_INNER_TEXT:goog.userAgent.IE && !goog.userAgent.isVersion("9"), CAN_USE_PARENT_ELEMENT_PROPERTY:goog.userAgent.IE || goog.userAgent.OPERA || goog.userAgent.WEBKIT, INNER_HTML_NEEDS_SCOPED_ELEMENT:goog.userAgent.IE};
goog.math.randomInt = function $goog$math$randomInt$($a$$) {
  return Math.floor(Math.random() * $a$$)
};
goog.math.uniformRandom = function $goog$math$uniformRandom$($a$$, $b$$) {
  return $a$$ + Math.random() * ($b$$ - $a$$)
};
goog.math.clamp = function $goog$math$clamp$($value$$, $min$$, $max$$) {
  return Math.min(Math.max($value$$, $min$$), $max$$)
};
goog.math.modulo = function $goog$math$modulo$($a$$, $b$$) {
  var $r$$ = $a$$ % $b$$;
  return 0 > $r$$ * $b$$ ? $r$$ + $b$$ : $r$$
};
goog.math.lerp = function $goog$math$lerp$($a$$, $b$$, $x$$) {
  return $a$$ + $x$$ * ($b$$ - $a$$)
};
goog.math.nearlyEquals = function $goog$math$nearlyEquals$($a$$, $b$$, $opt_tolerance$$) {
  return Math.abs($a$$ - $b$$) <= ($opt_tolerance$$ || 1E-6)
};
goog.math.standardAngle = function $goog$math$standardAngle$($angle$$) {
  return goog.math.modulo($angle$$, 360)
};
goog.math.toRadians = function $goog$math$toRadians$($angleDegrees$$) {
  return $angleDegrees$$ * Math.PI / 180
};
goog.math.toDegrees = function $goog$math$toDegrees$($angleRadians$$) {
  return 180 * $angleRadians$$ / Math.PI
};
goog.math.angleDx = function $goog$math$angleDx$($degrees$$, $radius$$) {
  return $radius$$ * Math.cos(goog.math.toRadians($degrees$$))
};
goog.math.angleDy = function $goog$math$angleDy$($degrees$$, $radius$$) {
  return $radius$$ * Math.sin(goog.math.toRadians($degrees$$))
};
goog.math.angle = function $goog$math$angle$($x1$$, $y1$$, $x2$$, $y2$$) {
  return goog.math.standardAngle(goog.math.toDegrees(Math.atan2($y2$$ - $y1$$, $x2$$ - $x1$$)))
};
goog.math.angleDifference = function $goog$math$angleDifference$($startAngle$$, $endAngle$$) {
  var $d$$ = goog.math.standardAngle($endAngle$$) - goog.math.standardAngle($startAngle$$);
  180 < $d$$ ? $d$$ -= 360 : -180 >= $d$$ && ($d$$ = 360 + $d$$);
  return $d$$
};
goog.math.sign = function $goog$math$sign$($x$$) {
  return 0 == $x$$ ? 0 : 0 > $x$$ ? -1 : 1
};
goog.math.longestCommonSubsequence = function $goog$math$longestCommonSubsequence$($array1$$, $array2$$, $compare$$3_opt_compareFn$$, $collect_opt_collectorFn$$) {
  $compare$$3_opt_compareFn$$ = $compare$$3_opt_compareFn$$ || function($a$$, $b$$) {
    return $a$$ == $b$$
  };
  $collect_opt_collectorFn$$ = $collect_opt_collectorFn$$ || function($i1$$) {
    return $array1$$[$i1$$]
  };
  for(var $length1$$ = $array1$$.length, $length2$$ = $array2$$.length, $arr$$ = [], $i$$ = 0;$i$$ < $length1$$ + 1;$i$$++) {
    $arr$$[$i$$] = [], $arr$$[$i$$][0] = 0
  }
  for(var $j$$ = 0;$j$$ < $length2$$ + 1;$j$$++) {
    $arr$$[0][$j$$] = 0
  }
  for($i$$ = 1;$i$$ <= $length1$$;$i$$++) {
    for($j$$ = 1;$j$$ <= $length1$$;$j$$++) {
      $arr$$[$i$$][$j$$] = $compare$$3_opt_compareFn$$($array1$$[$i$$ - 1], $array2$$[$j$$ - 1]) ? $arr$$[$i$$ - 1][$j$$ - 1] + 1 : Math.max($arr$$[$i$$ - 1][$j$$], $arr$$[$i$$][$j$$ - 1])
    }
  }
  for(var $result$$ = [], $i$$ = $length1$$, $j$$ = $length2$$;0 < $i$$ && 0 < $j$$;) {
    $compare$$3_opt_compareFn$$($array1$$[$i$$ - 1], $array2$$[$j$$ - 1]) ? ($result$$.unshift($collect_opt_collectorFn$$($i$$ - 1, $j$$ - 1)), $i$$--, $j$$--) : $arr$$[$i$$ - 1][$j$$] > $arr$$[$i$$][$j$$ - 1] ? $i$$-- : $j$$--
  }
  return $result$$
};
goog.math.sum = function $goog$math$sum$($var_args$$) {
  return goog.array.reduce(arguments, function($sum$$, $value$$) {
    return $sum$$ + $value$$
  }, 0)
};
goog.math.average = function $goog$math$average$($var_args$$) {
  return goog.math.sum.apply(null, arguments) / arguments.length
};
goog.math.standardDeviation = function $goog$math$standardDeviation$($var_args$$) {
  var $sampleSize_variance$$ = arguments.length;
  if(2 > $sampleSize_variance$$) {
    return 0
  }
  var $mean$$ = goog.math.average.apply(null, arguments), $sampleSize_variance$$ = goog.math.sum.apply(null, goog.array.map(arguments, function($val$$) {
    return Math.pow($val$$ - $mean$$, 2)
  })) / ($sampleSize_variance$$ - 1);
  return Math.sqrt($sampleSize_variance$$)
};
goog.math.isInt = function $goog$math$isInt$($num$$) {
  return isFinite($num$$) && 0 == $num$$ % 1
};
goog.math.isFiniteNumber = function $goog$math$isFiniteNumber$($num$$) {
  return isFinite($num$$) && !isNaN($num$$)
};
goog.math.Coordinate = function $goog$math$Coordinate$($opt_x$$, $opt_y$$) {
  this.x = goog.isDef($opt_x$$) ? $opt_x$$ : 0;
  this.y = goog.isDef($opt_y$$) ? $opt_y$$ : 0
};
goog.math.Coordinate.prototype.clone = function $goog$math$Coordinate$$clone$() {
  return new goog.math.Coordinate(this.x, this.y)
};
goog.DEBUG && (goog.math.Coordinate.prototype.toString = function $goog$math$Coordinate$$toString$() {
  return"(" + this.x + ", " + this.y + ")"
});
goog.math.Coordinate.equals = function $goog$math$Coordinate$equals$($a$$, $b$$) {
  return $a$$ == $b$$ ? !0 : !$a$$ || !$b$$ ? !1 : $a$$.x == $b$$.x && $a$$.y == $b$$.y
};
goog.math.Coordinate.distance = function $goog$math$Coordinate$distance$($a$$, $b$$) {
  var $dx$$ = $a$$.x - $b$$.x, $dy$$ = $a$$.y - $b$$.y;
  return Math.sqrt($dx$$ * $dx$$ + $dy$$ * $dy$$)
};
goog.math.Coordinate.magnitude = function $goog$math$Coordinate$magnitude$($a$$) {
  return Math.sqrt($a$$.x * $a$$.x + $a$$.y * $a$$.y)
};
goog.math.Coordinate.azimuth = function $goog$math$Coordinate$azimuth$($a$$) {
  return goog.math.angle(0, 0, $a$$.x, $a$$.y)
};
goog.math.Coordinate.squaredDistance = function $goog$math$Coordinate$squaredDistance$($a$$, $b$$) {
  var $dx$$ = $a$$.x - $b$$.x, $dy$$ = $a$$.y - $b$$.y;
  return $dx$$ * $dx$$ + $dy$$ * $dy$$
};
goog.math.Coordinate.difference = function $goog$math$Coordinate$difference$($a$$, $b$$) {
  return new goog.math.Coordinate($a$$.x - $b$$.x, $a$$.y - $b$$.y)
};
goog.math.Coordinate.sum = function $goog$math$Coordinate$sum$($a$$, $b$$) {
  return new goog.math.Coordinate($a$$.x + $b$$.x, $a$$.y + $b$$.y)
};
goog.dom.ASSUME_QUIRKS_MODE = !1;
goog.dom.ASSUME_STANDARDS_MODE = !1;
goog.dom.COMPAT_MODE_KNOWN_ = goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE;
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.dom.getDomHelper = function $goog$dom$getDomHelper$($opt_element$$) {
  return $opt_element$$ ? new goog.dom.DomHelper(goog.dom.getOwnerDocument($opt_element$$)) : goog.dom.defaultDomHelper_ || (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper)
};
goog.dom.getDocument = function $goog$dom$getDocument$() {
  return document
};
goog.dom.getElement = function $goog$dom$getElement$($element$$) {
  return goog.isString($element$$) ? document.getElementById($element$$) : $element$$
};
goog.dom.$ = goog.dom.getElement;
goog.dom.getElementsByTagNameAndClass = function $goog$dom$getElementsByTagNameAndClass$($opt_tag$$, $opt_class$$, $opt_el$$) {
  return goog.dom.getElementsByTagNameAndClass_(document, $opt_tag$$, $opt_class$$, $opt_el$$)
};
goog.dom.getElementsByClass = function $goog$dom$getElementsByClass$($className$$, $opt_el$$) {
  var $parent$$ = $opt_el$$ || document;
  return goog.dom.canUseQuerySelector_($parent$$) ? $parent$$.querySelectorAll("." + $className$$) : $parent$$.getElementsByClassName ? $parent$$.getElementsByClassName($className$$) : goog.dom.getElementsByTagNameAndClass_(document, "*", $className$$, $opt_el$$)
};
goog.dom.getElementByClass = function $goog$dom$getElementByClass$($className$$, $opt_el$$) {
  var $parent$$ = $opt_el$$ || document, $retVal$$ = null;
  return($retVal$$ = goog.dom.canUseQuerySelector_($parent$$) ? $parent$$.querySelector("." + $className$$) : goog.dom.getElementsByClass($className$$, $opt_el$$)[0]) || null
};
goog.dom.canUseQuerySelector_ = function $goog$dom$canUseQuerySelector_$($parent$$) {
  return!(!$parent$$.querySelectorAll || !$parent$$.querySelector)
};
goog.dom.getElementsByTagNameAndClass_ = function $goog$dom$getElementsByTagNameAndClass_$($doc$$6_els_parent$$, $className$$11_opt_tag$$1_tagName$$, $opt_class$$, $arrayLike_opt_el$$) {
  $doc$$6_els_parent$$ = $arrayLike_opt_el$$ || $doc$$6_els_parent$$;
  $className$$11_opt_tag$$1_tagName$$ = $className$$11_opt_tag$$1_tagName$$ && "*" != $className$$11_opt_tag$$1_tagName$$ ? $className$$11_opt_tag$$1_tagName$$.toUpperCase() : "";
  if(goog.dom.canUseQuerySelector_($doc$$6_els_parent$$) && ($className$$11_opt_tag$$1_tagName$$ || $opt_class$$)) {
    return $doc$$6_els_parent$$.querySelectorAll($className$$11_opt_tag$$1_tagName$$ + ($opt_class$$ ? "." + $opt_class$$ : ""))
  }
  if($opt_class$$ && $doc$$6_els_parent$$.getElementsByClassName) {
    $doc$$6_els_parent$$ = $doc$$6_els_parent$$.getElementsByClassName($opt_class$$);
    if($className$$11_opt_tag$$1_tagName$$) {
      $arrayLike_opt_el$$ = {};
      for(var $len$$ = 0, $i$$ = 0, $el$$;$el$$ = $doc$$6_els_parent$$[$i$$];$i$$++) {
        $className$$11_opt_tag$$1_tagName$$ == $el$$.nodeName && ($arrayLike_opt_el$$[$len$$++] = $el$$)
      }
      $arrayLike_opt_el$$.length = $len$$;
      return $arrayLike_opt_el$$
    }
    return $doc$$6_els_parent$$
  }
  $doc$$6_els_parent$$ = $doc$$6_els_parent$$.getElementsByTagName($className$$11_opt_tag$$1_tagName$$ || "*");
  if($opt_class$$) {
    $arrayLike_opt_el$$ = {};
    for($i$$ = $len$$ = 0;$el$$ = $doc$$6_els_parent$$[$i$$];$i$$++) {
      $className$$11_opt_tag$$1_tagName$$ = $el$$.className, "function" == typeof $className$$11_opt_tag$$1_tagName$$.split && goog.array.contains($className$$11_opt_tag$$1_tagName$$.split(/\s+/), $opt_class$$) && ($arrayLike_opt_el$$[$len$$++] = $el$$)
    }
    $arrayLike_opt_el$$.length = $len$$;
    return $arrayLike_opt_el$$
  }
  return $doc$$6_els_parent$$
};
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;
goog.dom.setProperties = function $goog$dom$setProperties$($element$$, $properties$$) {
  goog.object.forEach($properties$$, function($val$$, $key$$) {
    "style" == $key$$ ? $element$$.style.cssText = $val$$ : "class" == $key$$ ? $element$$.className = $val$$ : "for" == $key$$ ? $element$$.htmlFor = $val$$ : $key$$ in goog.dom.DIRECT_ATTRIBUTE_MAP_ ? $element$$.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[$key$$], $val$$) : goog.string.startsWith($key$$, "aria-") || goog.string.startsWith($key$$, "data-") ? $element$$.setAttribute($key$$, $val$$) : $element$$[$key$$] = $val$$
  })
};
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", frameborder:"frameBorder", height:"height", maxlength:"maxLength", role:"role", rowspan:"rowSpan", type:"type", usemap:"useMap", valign:"vAlign", width:"width"};
goog.dom.getViewportSize = function $goog$dom$getViewportSize$($opt_window$$) {
  return goog.dom.getViewportSize_($opt_window$$ || window)
};
goog.dom.getViewportSize_ = function $goog$dom$getViewportSize_$($doc$$7_el$$) {
  $doc$$7_el$$ = $doc$$7_el$$.document;
  $doc$$7_el$$ = goog.dom.isCss1CompatMode_($doc$$7_el$$) ? $doc$$7_el$$.documentElement : $doc$$7_el$$.body;
  return new goog.math.Size($doc$$7_el$$.clientWidth, $doc$$7_el$$.clientHeight)
};
goog.dom.getDocumentHeight = function $goog$dom$getDocumentHeight$() {
  return goog.dom.getDocumentHeight_(window)
};
goog.dom.getDocumentHeight_ = function $goog$dom$getDocumentHeight_$($vh_win$$) {
  var $doc$$8_sh$$ = $vh_win$$.document, $body$$1_height$$ = 0;
  if($doc$$8_sh$$) {
    $vh_win$$ = goog.dom.getViewportSize_($vh_win$$).height;
    var $body$$1_height$$ = $doc$$8_sh$$.body, $docEl$$ = $doc$$8_sh$$.documentElement;
    if(goog.dom.isCss1CompatMode_($doc$$8_sh$$) && $docEl$$.scrollHeight) {
      $body$$1_height$$ = $docEl$$.scrollHeight != $vh_win$$ ? $docEl$$.scrollHeight : $docEl$$.offsetHeight
    }else {
      var $doc$$8_sh$$ = $docEl$$.scrollHeight, $oh$$ = $docEl$$.offsetHeight;
      $docEl$$.clientHeight != $oh$$ && ($doc$$8_sh$$ = $body$$1_height$$.scrollHeight, $oh$$ = $body$$1_height$$.offsetHeight);
      $body$$1_height$$ = $doc$$8_sh$$ > $vh_win$$ ? $doc$$8_sh$$ > $oh$$ ? $doc$$8_sh$$ : $oh$$ : $doc$$8_sh$$ < $oh$$ ? $doc$$8_sh$$ : $oh$$
    }
  }
  return $body$$1_height$$
};
goog.dom.getPageScroll = function $goog$dom$getPageScroll$($opt_window$$) {
  return goog.dom.getDomHelper(($opt_window$$ || goog.global || window).document).getDocumentScroll()
};
goog.dom.getDocumentScroll = function $goog$dom$getDocumentScroll$() {
  return goog.dom.getDocumentScroll_(document)
};
goog.dom.getDocumentScroll_ = function $goog$dom$getDocumentScroll_$($doc$$9_win$$) {
  var $el$$ = goog.dom.getDocumentScrollElement_($doc$$9_win$$);
  $doc$$9_win$$ = goog.dom.getWindow_($doc$$9_win$$);
  return new goog.math.Coordinate($doc$$9_win$$.pageXOffset || $el$$.scrollLeft, $doc$$9_win$$.pageYOffset || $el$$.scrollTop)
};
goog.dom.getDocumentScrollElement = function $goog$dom$getDocumentScrollElement$() {
  return goog.dom.getDocumentScrollElement_(document)
};
goog.dom.getDocumentScrollElement_ = function $goog$dom$getDocumentScrollElement_$($doc$$) {
  return!goog.userAgent.WEBKIT && goog.dom.isCss1CompatMode_($doc$$) ? $doc$$.documentElement : $doc$$.body
};
goog.dom.getWindow = function $goog$dom$getWindow$($opt_doc$$) {
  return $opt_doc$$ ? goog.dom.getWindow_($opt_doc$$) : window
};
goog.dom.getWindow_ = function $goog$dom$getWindow_$($doc$$) {
  return $doc$$.parentWindow || $doc$$.defaultView
};
goog.dom.createDom = function $goog$dom$createDom$($tagName$$, $opt_attributes$$, $var_args$$) {
  return goog.dom.createDom_(document, arguments)
};
goog.dom.createDom_ = function $goog$dom$createDom_$($doc$$, $args$$) {
  var $element$$19_tagName$$ = $args$$[0], $attributes$$ = $args$$[1];
  if(!goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && $attributes$$ && ($attributes$$.name || $attributes$$.type)) {
    $element$$19_tagName$$ = ["<", $element$$19_tagName$$];
    $attributes$$.name && $element$$19_tagName$$.push(' name="', goog.string.htmlEscape($attributes$$.name), '"');
    if($attributes$$.type) {
      $element$$19_tagName$$.push(' type="', goog.string.htmlEscape($attributes$$.type), '"');
      var $clone$$ = {};
      goog.object.extend($clone$$, $attributes$$);
      delete $clone$$.type;
      $attributes$$ = $clone$$
    }
    $element$$19_tagName$$.push(">");
    $element$$19_tagName$$ = $element$$19_tagName$$.join("")
  }
  $element$$19_tagName$$ = $doc$$.createElement($element$$19_tagName$$);
  $attributes$$ && (goog.isString($attributes$$) ? $element$$19_tagName$$.className = $attributes$$ : goog.isArray($attributes$$) ? goog.dom.classes.add.apply(null, [$element$$19_tagName$$].concat($attributes$$)) : goog.dom.setProperties($element$$19_tagName$$, $attributes$$));
  2 < $args$$.length && goog.dom.append_($doc$$, $element$$19_tagName$$, $args$$, 2);
  return $element$$19_tagName$$
};
goog.dom.append_ = function $goog$dom$append_$($doc$$, $parent$$, $args$$, $i$$) {
  function $childHandler$$($child$$) {
    $child$$ && $parent$$.appendChild(goog.isString($child$$) ? $doc$$.createTextNode($child$$) : $child$$)
  }
  for(;$i$$ < $args$$.length;$i$$++) {
    var $arg$$ = $args$$[$i$$];
    goog.isArrayLike($arg$$) && !goog.dom.isNodeLike($arg$$) ? goog.array.forEach(goog.dom.isNodeList($arg$$) ? goog.array.toArray($arg$$) : $arg$$, $childHandler$$) : $childHandler$$($arg$$)
  }
};
goog.dom.$dom = goog.dom.createDom;
goog.dom.createElement = function $goog$dom$createElement$($name$$) {
  return document.createElement($name$$)
};
goog.dom.createTextNode = function $goog$dom$createTextNode$($content$$) {
  return document.createTextNode($content$$)
};
goog.dom.createTable = function $goog$dom$createTable$($rows$$, $columns$$, $opt_fillWithNbsp$$) {
  return goog.dom.createTable_(document, $rows$$, $columns$$, !!$opt_fillWithNbsp$$)
};
goog.dom.createTable_ = function $goog$dom$createTable_$($doc$$14_elem$$, $rows$$, $columns$$, $fillWithNbsp$$) {
  for(var $rowHtml$$ = ["<tr>"], $i$$ = 0;$i$$ < $columns$$;$i$$++) {
    $rowHtml$$.push($fillWithNbsp$$ ? "<td>&nbsp;</td>" : "<td></td>")
  }
  $rowHtml$$.push("</tr>");
  $rowHtml$$ = $rowHtml$$.join("");
  $columns$$ = ["<table>"];
  for($i$$ = 0;$i$$ < $rows$$;$i$$++) {
    $columns$$.push($rowHtml$$)
  }
  $columns$$.push("</table>");
  $doc$$14_elem$$ = $doc$$14_elem$$.createElement(goog.dom.TagName.DIV);
  $doc$$14_elem$$.innerHTML = $columns$$.join("");
  return $doc$$14_elem$$.removeChild($doc$$14_elem$$.firstChild)
};
goog.dom.htmlToDocumentFragment = function $goog$dom$htmlToDocumentFragment$($htmlString$$) {
  return goog.dom.htmlToDocumentFragment_(document, $htmlString$$)
};
goog.dom.htmlToDocumentFragment_ = function $goog$dom$htmlToDocumentFragment_$($doc$$, $htmlString$$) {
  var $tempDiv$$ = $doc$$.createElement("div");
  goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT ? ($tempDiv$$.innerHTML = "<br>" + $htmlString$$, $tempDiv$$.removeChild($tempDiv$$.firstChild)) : $tempDiv$$.innerHTML = $htmlString$$;
  if(1 == $tempDiv$$.childNodes.length) {
    return $tempDiv$$.removeChild($tempDiv$$.firstChild)
  }
  for(var $fragment$$ = $doc$$.createDocumentFragment();$tempDiv$$.firstChild;) {
    $fragment$$.appendChild($tempDiv$$.firstChild)
  }
  return $fragment$$
};
goog.dom.getCompatMode = function $goog$dom$getCompatMode$() {
  return goog.dom.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.isCss1CompatMode = function $goog$dom$isCss1CompatMode$() {
  return goog.dom.isCss1CompatMode_(document)
};
goog.dom.isCss1CompatMode_ = function $goog$dom$isCss1CompatMode_$($doc$$) {
  return goog.dom.COMPAT_MODE_KNOWN_ ? goog.dom.ASSUME_STANDARDS_MODE : "CSS1Compat" == $doc$$.compatMode
};
goog.dom.canHaveChildren = function $goog$dom$canHaveChildren$($node$$) {
  if($node$$.nodeType != goog.dom.NodeType.ELEMENT) {
    return!1
  }
  switch($node$$.tagName) {
    case goog.dom.TagName.APPLET:
    ;
    case goog.dom.TagName.AREA:
    ;
    case goog.dom.TagName.BASE:
    ;
    case goog.dom.TagName.BR:
    ;
    case goog.dom.TagName.COL:
    ;
    case goog.dom.TagName.COMMAND:
    ;
    case goog.dom.TagName.EMBED:
    ;
    case goog.dom.TagName.FRAME:
    ;
    case goog.dom.TagName.HR:
    ;
    case goog.dom.TagName.IMG:
    ;
    case goog.dom.TagName.INPUT:
    ;
    case goog.dom.TagName.IFRAME:
    ;
    case goog.dom.TagName.ISINDEX:
    ;
    case goog.dom.TagName.KEYGEN:
    ;
    case goog.dom.TagName.LINK:
    ;
    case goog.dom.TagName.NOFRAMES:
    ;
    case goog.dom.TagName.NOSCRIPT:
    ;
    case goog.dom.TagName.META:
    ;
    case goog.dom.TagName.OBJECT:
    ;
    case goog.dom.TagName.PARAM:
    ;
    case goog.dom.TagName.SCRIPT:
    ;
    case goog.dom.TagName.SOURCE:
    ;
    case goog.dom.TagName.STYLE:
    ;
    case goog.dom.TagName.TRACK:
    ;
    case goog.dom.TagName.WBR:
      return!1
  }
  return!0
};
goog.dom.appendChild = function $goog$dom$appendChild$($parent$$, $child$$) {
  $parent$$.appendChild($child$$)
};
goog.dom.append = function $goog$dom$append$($parent$$, $var_args$$) {
  goog.dom.append_(goog.dom.getOwnerDocument($parent$$), $parent$$, arguments, 1)
};
goog.dom.removeChildren = function $goog$dom$removeChildren$($node$$) {
  for(var $child$$;$child$$ = $node$$.firstChild;) {
    $node$$.removeChild($child$$)
  }
};
goog.dom.insertSiblingBefore = function $goog$dom$insertSiblingBefore$($newNode$$, $refNode$$) {
  $refNode$$.parentNode && $refNode$$.parentNode.insertBefore($newNode$$, $refNode$$)
};
goog.dom.insertSiblingAfter = function $goog$dom$insertSiblingAfter$($newNode$$, $refNode$$) {
  $refNode$$.parentNode && $refNode$$.parentNode.insertBefore($newNode$$, $refNode$$.nextSibling)
};
goog.dom.insertChildAt = function $goog$dom$insertChildAt$($parent$$, $child$$, $index$$) {
  $parent$$.insertBefore($child$$, $parent$$.childNodes[$index$$] || null)
};
goog.dom.removeNode = function $goog$dom$removeNode$($node$$) {
  return $node$$ && $node$$.parentNode ? $node$$.parentNode.removeChild($node$$) : null
};
goog.dom.replaceNode = function $goog$dom$replaceNode$($newNode$$, $oldNode$$) {
  var $parent$$ = $oldNode$$.parentNode;
  $parent$$ && $parent$$.replaceChild($newNode$$, $oldNode$$)
};
goog.dom.flattenElement = function $goog$dom$flattenElement$($element$$) {
  var $child$$, $parent$$ = $element$$.parentNode;
  if($parent$$ && $parent$$.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT) {
    if($element$$.removeNode) {
      return $element$$.removeNode(!1)
    }
    for(;$child$$ = $element$$.firstChild;) {
      $parent$$.insertBefore($child$$, $element$$)
    }
    return goog.dom.removeNode($element$$)
  }
};
goog.dom.getChildren = function $goog$dom$getChildren$($element$$) {
  return goog.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && void 0 != $element$$.children ? $element$$.children : goog.array.filter($element$$.childNodes, function($node$$) {
    return $node$$.nodeType == goog.dom.NodeType.ELEMENT
  })
};
goog.dom.getFirstElementChild = function $goog$dom$getFirstElementChild$($node$$) {
  return void 0 != $node$$.firstElementChild ? $node$$.firstElementChild : goog.dom.getNextElementNode_($node$$.firstChild, !0)
};
goog.dom.getLastElementChild = function $goog$dom$getLastElementChild$($node$$) {
  return void 0 != $node$$.lastElementChild ? $node$$.lastElementChild : goog.dom.getNextElementNode_($node$$.lastChild, !1)
};
goog.dom.getNextElementSibling = function $goog$dom$getNextElementSibling$($node$$) {
  return void 0 != $node$$.nextElementSibling ? $node$$.nextElementSibling : goog.dom.getNextElementNode_($node$$.nextSibling, !0)
};
goog.dom.getPreviousElementSibling = function $goog$dom$getPreviousElementSibling$($node$$) {
  return void 0 != $node$$.previousElementSibling ? $node$$.previousElementSibling : goog.dom.getNextElementNode_($node$$.previousSibling, !1)
};
goog.dom.getNextElementNode_ = function $goog$dom$getNextElementNode_$($node$$, $forward$$) {
  for(;$node$$ && $node$$.nodeType != goog.dom.NodeType.ELEMENT;) {
    $node$$ = $forward$$ ? $node$$.nextSibling : $node$$.previousSibling
  }
  return $node$$
};
goog.dom.getNextNode = function $goog$dom$getNextNode$($node$$) {
  if(!$node$$) {
    return null
  }
  if($node$$.firstChild) {
    return $node$$.firstChild
  }
  for(;$node$$ && !$node$$.nextSibling;) {
    $node$$ = $node$$.parentNode
  }
  return $node$$ ? $node$$.nextSibling : null
};
goog.dom.getPreviousNode = function $goog$dom$getPreviousNode$($node$$) {
  if(!$node$$) {
    return null
  }
  if(!$node$$.previousSibling) {
    return $node$$.parentNode
  }
  for($node$$ = $node$$.previousSibling;$node$$ && $node$$.lastChild;) {
    $node$$ = $node$$.lastChild
  }
  return $node$$
};
goog.dom.isNodeLike = function $goog$dom$isNodeLike$($obj$$) {
  return goog.isObject($obj$$) && 0 < $obj$$.nodeType
};
goog.dom.isElement = function $goog$dom$isElement$($obj$$) {
  return goog.isObject($obj$$) && $obj$$.nodeType == goog.dom.NodeType.ELEMENT
};
goog.dom.isWindow = function $goog$dom$isWindow$($obj$$) {
  return goog.isObject($obj$$) && $obj$$.window == $obj$$
};
goog.dom.getParentElement = function $goog$dom$getParentElement$($element$$22_parent$$) {
  if(goog.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY) {
    return $element$$22_parent$$.parentElement
  }
  $element$$22_parent$$ = $element$$22_parent$$.parentNode;
  return goog.dom.isElement($element$$22_parent$$) ? $element$$22_parent$$ : null
};
goog.dom.contains = function $goog$dom$contains$($parent$$, $descendant$$) {
  if($parent$$.contains && $descendant$$.nodeType == goog.dom.NodeType.ELEMENT) {
    return $parent$$ == $descendant$$ || $parent$$.contains($descendant$$)
  }
  if("undefined" != typeof $parent$$.compareDocumentPosition) {
    return $parent$$ == $descendant$$ || Boolean($parent$$.compareDocumentPosition($descendant$$) & 16)
  }
  for(;$descendant$$ && $parent$$ != $descendant$$;) {
    $descendant$$ = $descendant$$.parentNode
  }
  return $descendant$$ == $parent$$
};
goog.dom.compareNodeOrder = function $goog$dom$compareNodeOrder$($node1$$, $node2$$) {
  if($node1$$ == $node2$$) {
    return 0
  }
  if($node1$$.compareDocumentPosition) {
    return $node1$$.compareDocumentPosition($node2$$) & 2 ? 1 : -1
  }
  if(goog.userAgent.IE && !goog.userAgent.isDocumentMode(9)) {
    if($node1$$.nodeType == goog.dom.NodeType.DOCUMENT) {
      return-1
    }
    if($node2$$.nodeType == goog.dom.NodeType.DOCUMENT) {
      return 1
    }
  }
  if("sourceIndex" in $node1$$ || $node1$$.parentNode && "sourceIndex" in $node1$$.parentNode) {
    var $isElement1_range1$$ = $node1$$.nodeType == goog.dom.NodeType.ELEMENT, $doc$$ = $node2$$.nodeType == goog.dom.NodeType.ELEMENT;
    if($isElement1_range1$$ && $doc$$) {
      return $node1$$.sourceIndex - $node2$$.sourceIndex
    }
    var $parent1$$ = $node1$$.parentNode, $parent2$$ = $node2$$.parentNode;
    return $parent1$$ == $parent2$$ ? goog.dom.compareSiblingOrder_($node1$$, $node2$$) : !$isElement1_range1$$ && goog.dom.contains($parent1$$, $node2$$) ? -1 * goog.dom.compareParentsDescendantNodeIe_($node1$$, $node2$$) : !$doc$$ && goog.dom.contains($parent2$$, $node1$$) ? goog.dom.compareParentsDescendantNodeIe_($node2$$, $node1$$) : ($isElement1_range1$$ ? $node1$$.sourceIndex : $parent1$$.sourceIndex) - ($doc$$ ? $node2$$.sourceIndex : $parent2$$.sourceIndex)
  }
  $doc$$ = goog.dom.getOwnerDocument($node1$$);
  $isElement1_range1$$ = $doc$$.createRange();
  $isElement1_range1$$.selectNode($node1$$);
  $isElement1_range1$$.collapse(!0);
  $doc$$ = $doc$$.createRange();
  $doc$$.selectNode($node2$$);
  $doc$$.collapse(!0);
  return $isElement1_range1$$.compareBoundaryPoints(goog.global.Range.START_TO_END, $doc$$)
};
goog.dom.compareParentsDescendantNodeIe_ = function $goog$dom$compareParentsDescendantNodeIe_$($textNode$$, $node$$) {
  var $parent$$ = $textNode$$.parentNode;
  if($parent$$ == $node$$) {
    return-1
  }
  for(var $sibling$$ = $node$$;$sibling$$.parentNode != $parent$$;) {
    $sibling$$ = $sibling$$.parentNode
  }
  return goog.dom.compareSiblingOrder_($sibling$$, $textNode$$)
};
goog.dom.compareSiblingOrder_ = function $goog$dom$compareSiblingOrder_$($node1$$, $node2$$) {
  for(var $s$$ = $node2$$;$s$$ = $s$$.previousSibling;) {
    if($s$$ == $node1$$) {
      return-1
    }
  }
  return 1
};
goog.dom.findCommonAncestor = function $goog$dom$findCommonAncestor$($var_args$$) {
  var $i$$, $count$$ = arguments.length;
  if($count$$) {
    if(1 == $count$$) {
      return arguments[0]
    }
  }else {
    return null
  }
  var $paths$$ = [], $minLength$$ = Infinity;
  for($i$$ = 0;$i$$ < $count$$;$i$$++) {
    for(var $ancestors$$ = [], $first$$3_node$$ = arguments[$i$$];$first$$3_node$$;) {
      $ancestors$$.unshift($first$$3_node$$), $first$$3_node$$ = $first$$3_node$$.parentNode
    }
    $paths$$.push($ancestors$$);
    $minLength$$ = Math.min($minLength$$, $ancestors$$.length)
  }
  $ancestors$$ = null;
  for($i$$ = 0;$i$$ < $minLength$$;$i$$++) {
    for(var $first$$3_node$$ = $paths$$[0][$i$$], $j$$ = 1;$j$$ < $count$$;$j$$++) {
      if($first$$3_node$$ != $paths$$[$j$$][$i$$]) {
        return $ancestors$$
      }
    }
    $ancestors$$ = $first$$3_node$$
  }
  return $ancestors$$
};
goog.dom.getOwnerDocument = function $goog$dom$getOwnerDocument$($node$$) {
  return $node$$.nodeType == goog.dom.NodeType.DOCUMENT ? $node$$ : $node$$.ownerDocument || $node$$.document
};
goog.dom.getFrameContentDocument = function $goog$dom$getFrameContentDocument$($frame$$) {
  return $frame$$.contentDocument || $frame$$.contentWindow.document
};
goog.dom.getFrameContentWindow = function $goog$dom$getFrameContentWindow$($frame$$) {
  return $frame$$.contentWindow || goog.dom.getWindow_(goog.dom.getFrameContentDocument($frame$$))
};
goog.dom.setTextContent = function $goog$dom$setTextContent$($element$$, $text$$) {
  if("textContent" in $element$$) {
    $element$$.textContent = $text$$
  }else {
    if($element$$.firstChild && $element$$.firstChild.nodeType == goog.dom.NodeType.TEXT) {
      for(;$element$$.lastChild != $element$$.firstChild;) {
        $element$$.removeChild($element$$.lastChild)
      }
      $element$$.firstChild.data = $text$$
    }else {
      goog.dom.removeChildren($element$$);
      var $doc$$ = goog.dom.getOwnerDocument($element$$);
      $element$$.appendChild($doc$$.createTextNode($text$$))
    }
  }
};
goog.dom.getOuterHtml = function $goog$dom$getOuterHtml$($element$$) {
  if("outerHTML" in $element$$) {
    return $element$$.outerHTML
  }
  var $div$$ = goog.dom.getOwnerDocument($element$$).createElement("div");
  $div$$.appendChild($element$$.cloneNode(!0));
  return $div$$.innerHTML
};
goog.dom.findNode = function $goog$dom$findNode$($root$$, $p$$) {
  var $rv$$ = [];
  return goog.dom.findNodes_($root$$, $p$$, $rv$$, !0) ? $rv$$[0] : void 0
};
goog.dom.findNodes = function $goog$dom$findNodes$($root$$, $p$$) {
  var $rv$$ = [];
  goog.dom.findNodes_($root$$, $p$$, $rv$$, !1);
  return $rv$$
};
goog.dom.findNodes_ = function $goog$dom$findNodes_$($child$$6_root$$, $p$$, $rv$$, $findOne$$) {
  if(null != $child$$6_root$$) {
    for($child$$6_root$$ = $child$$6_root$$.firstChild;$child$$6_root$$;) {
      if($p$$($child$$6_root$$) && ($rv$$.push($child$$6_root$$), $findOne$$) || goog.dom.findNodes_($child$$6_root$$, $p$$, $rv$$, $findOne$$)) {
        return!0
      }
      $child$$6_root$$ = $child$$6_root$$.nextSibling
    }
  }
  return!1
};
goog.dom.TAGS_TO_IGNORE_ = {SCRIPT:1, STYLE:1, HEAD:1, IFRAME:1, OBJECT:1};
goog.dom.PREDEFINED_TAG_VALUES_ = {IMG:" ", BR:"\n"};
goog.dom.isFocusableTabIndex = function $goog$dom$isFocusableTabIndex$($element$$25_index$$) {
  var $attrNode$$ = $element$$25_index$$.getAttributeNode("tabindex");
  return $attrNode$$ && $attrNode$$.specified ? ($element$$25_index$$ = $element$$25_index$$.tabIndex, goog.isNumber($element$$25_index$$) && 0 <= $element$$25_index$$ && 32768 > $element$$25_index$$) : !1
};
goog.dom.setFocusableTabIndex = function $goog$dom$setFocusableTabIndex$($element$$, $enable$$) {
  $enable$$ ? $element$$.tabIndex = 0 : ($element$$.tabIndex = -1, $element$$.removeAttribute("tabIndex"))
};
goog.dom.getTextContent = function $goog$dom$getTextContent$($node$$) {
  if(goog.dom.BrowserFeature.CAN_USE_INNER_TEXT && "innerText" in $node$$) {
    $node$$ = goog.string.canonicalizeNewlines($node$$.innerText)
  }else {
    var $buf$$ = [];
    goog.dom.getTextContent_($node$$, $buf$$, !0);
    $node$$ = $buf$$.join("")
  }
  $node$$ = $node$$.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
  $node$$ = $node$$.replace(/\u200B/g, "");
  goog.dom.BrowserFeature.CAN_USE_INNER_TEXT || ($node$$ = $node$$.replace(/ +/g, " "));
  " " != $node$$ && ($node$$ = $node$$.replace(/^\s*/, ""));
  return $node$$
};
goog.dom.getRawTextContent = function $goog$dom$getRawTextContent$($node$$) {
  var $buf$$ = [];
  goog.dom.getTextContent_($node$$, $buf$$, !1);
  return $buf$$.join("")
};
goog.dom.getTextContent_ = function $goog$dom$getTextContent_$($child$$7_node$$, $buf$$, $normalizeWhitespace$$) {
  if(!($child$$7_node$$.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
    if($child$$7_node$$.nodeType == goog.dom.NodeType.TEXT) {
      $normalizeWhitespace$$ ? $buf$$.push(String($child$$7_node$$.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : $buf$$.push($child$$7_node$$.nodeValue)
    }else {
      if($child$$7_node$$.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
        $buf$$.push(goog.dom.PREDEFINED_TAG_VALUES_[$child$$7_node$$.nodeName])
      }else {
        for($child$$7_node$$ = $child$$7_node$$.firstChild;$child$$7_node$$;) {
          goog.dom.getTextContent_($child$$7_node$$, $buf$$, $normalizeWhitespace$$), $child$$7_node$$ = $child$$7_node$$.nextSibling
        }
      }
    }
  }
};
goog.dom.getNodeTextLength = function $goog$dom$getNodeTextLength$($node$$) {
  return goog.dom.getTextContent($node$$).length
};
goog.dom.getNodeTextOffset = function $goog$dom$getNodeTextOffset$($node$$, $opt_offsetParent$$) {
  for(var $root$$ = $opt_offsetParent$$ || goog.dom.getOwnerDocument($node$$).body, $buf$$ = [];$node$$ && $node$$ != $root$$;) {
    for(var $cur$$ = $node$$;$cur$$ = $cur$$.previousSibling;) {
      $buf$$.unshift(goog.dom.getTextContent($cur$$))
    }
    $node$$ = $node$$.parentNode
  }
  return goog.string.trimLeft($buf$$.join("")).replace(/ +/g, " ").length
};
goog.dom.getNodeAtOffset = function $goog$dom$getNodeAtOffset$($parent$$, $offset$$, $opt_result$$) {
  $parent$$ = [$parent$$];
  for(var $pos$$ = 0, $cur$$ = null;0 < $parent$$.length && $pos$$ < $offset$$;) {
    if($cur$$ = $parent$$.pop(), !($cur$$.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
      if($cur$$.nodeType == goog.dom.NodeType.TEXT) {
        var $i$$69_text$$ = $cur$$.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " "), $pos$$ = $pos$$ + $i$$69_text$$.length
      }else {
        if($cur$$.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
          $pos$$ += goog.dom.PREDEFINED_TAG_VALUES_[$cur$$.nodeName].length
        }else {
          for($i$$69_text$$ = $cur$$.childNodes.length - 1;0 <= $i$$69_text$$;$i$$69_text$$--) {
            $parent$$.push($cur$$.childNodes[$i$$69_text$$])
          }
        }
      }
    }
  }
  goog.isObject($opt_result$$) && ($opt_result$$.remainder = $cur$$ ? $cur$$.nodeValue.length + $offset$$ - $pos$$ - 1 : 0, $opt_result$$.node = $cur$$);
  return $cur$$
};
goog.dom.isNodeList = function $goog$dom$isNodeList$($val$$) {
  if($val$$ && "number" == typeof $val$$.length) {
    if(goog.isObject($val$$)) {
      return"function" == typeof $val$$.item || "string" == typeof $val$$.item
    }
    if(goog.isFunction($val$$)) {
      return"function" == typeof $val$$.item
    }
  }
  return!1
};
goog.dom.getAncestorByTagNameAndClass = function $goog$dom$getAncestorByTagNameAndClass$($element$$, $opt_tag$$, $opt_class$$) {
  if(!$opt_tag$$ && !$opt_class$$) {
    return null
  }
  var $tagName$$ = $opt_tag$$ ? $opt_tag$$.toUpperCase() : null;
  return goog.dom.getAncestor($element$$, function($node$$) {
    return(!$tagName$$ || $node$$.nodeName == $tagName$$) && (!$opt_class$$ || goog.dom.classes.has($node$$, $opt_class$$))
  }, !0)
};
goog.dom.getAncestorByClass = function $goog$dom$getAncestorByClass$($element$$, $className$$) {
  return goog.dom.getAncestorByTagNameAndClass($element$$, null, $className$$)
};
goog.dom.getAncestor = function $goog$dom$getAncestor$($element$$, $matcher$$, $ignoreSearchSteps_opt_includeNode$$, $opt_maxSearchSteps$$) {
  $ignoreSearchSteps_opt_includeNode$$ || ($element$$ = $element$$.parentNode);
  $ignoreSearchSteps_opt_includeNode$$ = null == $opt_maxSearchSteps$$;
  for(var $steps$$ = 0;$element$$ && ($ignoreSearchSteps_opt_includeNode$$ || $steps$$ <= $opt_maxSearchSteps$$);) {
    if($matcher$$($element$$)) {
      return $element$$
    }
    $element$$ = $element$$.parentNode;
    $steps$$++
  }
  return null
};
goog.dom.getActiveElement = function $goog$dom$getActiveElement$($doc$$) {
  try {
    return $doc$$ && $doc$$.activeElement
  }catch($e$$) {
  }
  return null
};
goog.dom.DomHelper = function $goog$dom$DomHelper$($opt_document$$) {
  this.document_ = $opt_document$$ || goog.global.document || document
};
goog.dom.DomHelper.prototype.getDomHelper = goog.dom.getDomHelper;
goog.dom.DomHelper.prototype.setDocument = function $goog$dom$DomHelper$$setDocument$($document$$) {
  this.document_ = $document$$
};
goog.dom.DomHelper.prototype.getDocument = function $goog$dom$DomHelper$$getDocument$() {
  return this.document_
};
goog.dom.DomHelper.prototype.getElement = function $goog$dom$DomHelper$$getElement$($element$$) {
  return goog.isString($element$$) ? this.document_.getElementById($element$$) : $element$$
};
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement;
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function $goog$dom$DomHelper$$getElementsByTagNameAndClass$($opt_tag$$, $opt_class$$, $opt_el$$) {
  return goog.dom.getElementsByTagNameAndClass_(this.document_, $opt_tag$$, $opt_class$$, $opt_el$$)
};
goog.dom.DomHelper.prototype.getElementsByClass = function $goog$dom$DomHelper$$getElementsByClass$($className$$, $opt_el$$) {
  return goog.dom.getElementsByClass($className$$, $opt_el$$ || this.document_)
};
goog.dom.DomHelper.prototype.getElementByClass = function $goog$dom$DomHelper$$getElementByClass$($className$$, $opt_el$$) {
  return goog.dom.getElementByClass($className$$, $opt_el$$ || this.document_)
};
goog.dom.DomHelper.prototype.$$ = goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties;
goog.dom.DomHelper.prototype.getViewportSize = function $goog$dom$DomHelper$$getViewportSize$($opt_window$$) {
  return goog.dom.getViewportSize($opt_window$$ || this.getWindow())
};
goog.dom.DomHelper.prototype.getDocumentHeight = function $goog$dom$DomHelper$$getDocumentHeight$() {
  return goog.dom.getDocumentHeight_(this.getWindow())
};
goog.dom.DomHelper.prototype.createDom = function $goog$dom$DomHelper$$createDom$($tagName$$, $opt_attributes$$, $var_args$$) {
  return goog.dom.createDom_(this.document_, arguments)
};
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom;
goog.dom.DomHelper.prototype.createElement = function $goog$dom$DomHelper$$createElement$($name$$) {
  return this.document_.createElement($name$$)
};
goog.dom.DomHelper.prototype.createTextNode = function $goog$dom$DomHelper$$createTextNode$($content$$) {
  return this.document_.createTextNode($content$$)
};
goog.dom.DomHelper.prototype.createTable = function $goog$dom$DomHelper$$createTable$($rows$$, $columns$$, $opt_fillWithNbsp$$) {
  return goog.dom.createTable_(this.document_, $rows$$, $columns$$, !!$opt_fillWithNbsp$$)
};
goog.dom.DomHelper.prototype.htmlToDocumentFragment = function $goog$dom$DomHelper$$htmlToDocumentFragment$($htmlString$$) {
  return goog.dom.htmlToDocumentFragment_(this.document_, $htmlString$$)
};
goog.dom.DomHelper.prototype.getCompatMode = function $goog$dom$DomHelper$$getCompatMode$() {
  return this.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.DomHelper.prototype.isCss1CompatMode = function $goog$dom$DomHelper$$isCss1CompatMode$() {
  return goog.dom.isCss1CompatMode_(this.document_)
};
goog.dom.DomHelper.prototype.getWindow = function $goog$dom$DomHelper$$getWindow$() {
  return goog.dom.getWindow_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScrollElement = function $goog$dom$DomHelper$$getDocumentScrollElement$() {
  return goog.dom.getDocumentScrollElement_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScroll = function $goog$dom$DomHelper$$getDocumentScroll$() {
  return goog.dom.getDocumentScroll_(this.document_)
};
goog.dom.DomHelper.prototype.getActiveElement = function $goog$dom$DomHelper$$getActiveElement$($opt_doc$$) {
  return goog.dom.getActiveElement($opt_doc$$ || this.document_)
};
goog.dom.DomHelper.prototype.appendChild = goog.dom.appendChild;
goog.dom.DomHelper.prototype.append = goog.dom.append;
goog.dom.DomHelper.prototype.canHaveChildren = goog.dom.canHaveChildren;
goog.dom.DomHelper.prototype.removeChildren = goog.dom.removeChildren;
goog.dom.DomHelper.prototype.insertSiblingBefore = goog.dom.insertSiblingBefore;
goog.dom.DomHelper.prototype.insertSiblingAfter = goog.dom.insertSiblingAfter;
goog.dom.DomHelper.prototype.insertChildAt = goog.dom.insertChildAt;
goog.dom.DomHelper.prototype.removeNode = goog.dom.removeNode;
goog.dom.DomHelper.prototype.replaceNode = goog.dom.replaceNode;
goog.dom.DomHelper.prototype.flattenElement = goog.dom.flattenElement;
goog.dom.DomHelper.prototype.getChildren = goog.dom.getChildren;
goog.dom.DomHelper.prototype.getFirstElementChild = goog.dom.getFirstElementChild;
goog.dom.DomHelper.prototype.getLastElementChild = goog.dom.getLastElementChild;
goog.dom.DomHelper.prototype.getNextElementSibling = goog.dom.getNextElementSibling;
goog.dom.DomHelper.prototype.getPreviousElementSibling = goog.dom.getPreviousElementSibling;
goog.dom.DomHelper.prototype.getNextNode = goog.dom.getNextNode;
goog.dom.DomHelper.prototype.getPreviousNode = goog.dom.getPreviousNode;
goog.dom.DomHelper.prototype.isNodeLike = goog.dom.isNodeLike;
goog.dom.DomHelper.prototype.isElement = goog.dom.isElement;
goog.dom.DomHelper.prototype.isWindow = goog.dom.isWindow;
goog.dom.DomHelper.prototype.getParentElement = goog.dom.getParentElement;
goog.dom.DomHelper.prototype.contains = goog.dom.contains;
goog.dom.DomHelper.prototype.compareNodeOrder = goog.dom.compareNodeOrder;
goog.dom.DomHelper.prototype.findCommonAncestor = goog.dom.findCommonAncestor;
goog.dom.DomHelper.prototype.getOwnerDocument = goog.dom.getOwnerDocument;
goog.dom.DomHelper.prototype.getFrameContentDocument = goog.dom.getFrameContentDocument;
goog.dom.DomHelper.prototype.getFrameContentWindow = goog.dom.getFrameContentWindow;
goog.dom.DomHelper.prototype.setTextContent = goog.dom.setTextContent;
goog.dom.DomHelper.prototype.getOuterHtml = goog.dom.getOuterHtml;
goog.dom.DomHelper.prototype.findNode = goog.dom.findNode;
goog.dom.DomHelper.prototype.findNodes = goog.dom.findNodes;
goog.dom.DomHelper.prototype.isFocusableTabIndex = goog.dom.isFocusableTabIndex;
goog.dom.DomHelper.prototype.setFocusableTabIndex = goog.dom.setFocusableTabIndex;
goog.dom.DomHelper.prototype.getTextContent = goog.dom.getTextContent;
goog.dom.DomHelper.prototype.getNodeTextLength = goog.dom.getNodeTextLength;
goog.dom.DomHelper.prototype.getNodeTextOffset = goog.dom.getNodeTextOffset;
goog.dom.DomHelper.prototype.getNodeAtOffset = goog.dom.getNodeAtOffset;
goog.dom.DomHelper.prototype.isNodeList = goog.dom.isNodeList;
goog.dom.DomHelper.prototype.getAncestorByTagNameAndClass = goog.dom.getAncestorByTagNameAndClass;
goog.dom.DomHelper.prototype.getAncestorByClass = goog.dom.getAncestorByClass;
goog.dom.DomHelper.prototype.getAncestor = goog.dom.getAncestor;
ww.app = {};
var DEBUG_MODE = !0;
ww.app.Core = function $ww$app$Core$() {
  this.window_ = $(window);
  this.height_ = this.width_ = 0;
  this.transformKey_ = Modernizr.prefixed("transform");
  var $self$$ = this;
  this.window_.resize(function() {
    $self$$.onResize()
  });
  this.onResize()
};
ww.app.Core.prototype.renderFrame_ = function $ww$app$Core$$renderFrame_$() {
  TWEEN.update()
};
ww.app.Core.prototype.onResize = function $ww$app$Core$$onResize$() {
  this.width_ = this.window_.width();
  this.height_ = this.window_.height();
  $("iframe").attr("width", this.width_).attr("height", this.height_)
};
ww.app.Core.prototype.start = function $ww$app$Core$$start$() {
  var $self$$ = this;
  this.onReady_ = function $this$onReady_$() {
  };
  goog.events.listen(window, "message", function($data$$29_evt$$) {
    $data$$29_evt$$ = $data$$29_evt$$.getBrowserEvent().data;
    $self$$.log("Got message: " + $data$$29_evt$$.name, $data$$29_evt$$);
    if($data$$29_evt$$.name.match(/.ready/)) {
      $self$$.onReady_($data$$29_evt$$)
    }else {
      "goToMode" === $data$$29_evt$$.name && $self$$.loadModeByName($data$$29_evt$$.data, !0)
    }
  });
  this.loadModeByName("home", !1)
};
ww.app.Core.prototype.loadModeByName = function $ww$app$Core$$loadModeByName$($modeName$$, $transition$$) {
  this.loadMode({name:$modeName$$}, $transition$$)
};
ww.app.Core.prototype.log = function $ww$app$Core$$log$($msg$$) {
  if(DEBUG_MODE && console && console.log) {
    var $args$$ = Array.prototype.slice.call(arguments);
    "string" === typeof $args$$[0] && ($args$$[0] = "App: " + $args$$[0]);
    console.log.apply(console, $args$$)
  }
};
ww.app.Core.prototype.loadMode = function $ww$app$Core$$loadMode$($mode$$, $transition$$) {
  var $onComplete$$, $currentFrame$$ = this.currentIframe, $self$$ = this;
  $onComplete$$ = $transition$$ ? function() {
    $mode$$.iframe.contentWindow.postMessage({name:"focus", data:null}, "*");
    $mode$$.iframe.style[$self$$.transformKey_] = "translateX(" + $self$$.width_ + "px)";
    $mode$$.iframe.style.visibility = "visible";
    setTimeout(function() {
      var $t$$ = new TWEEN.Tween({translateX:$self$$.width_});
      $t$$.to({translateX:0}, 400);
      $t$$.onUpdate(function() {
        $mode$$.iframe.style[$self$$.transformKey_] = "translateX(" + this.translateX + "px)"
      });
      $t$$.onComplete(function() {
        $currentFrame$$.style.pointerEvents = "auto"
      });
      $t$$.start();
      $currentFrame$$ && ($currentFrame$$.contentWindow.postMessage({name:"unfocus", data:null}, "*"), $currentFrame$$.style.pointerEvents = "none", $t$$ = new TWEEN.Tween({translateX:0}), $t$$.to({translateX:-$self$$.width_}, 400), $t$$.onUpdate(function() {
        $currentFrame$$.style[$self$$.transformKey_] = "translateX(" + this.translateX + "px)"
      }), $t$$.onComplete(function() {
        $currentFrame$$.style.visibility = "hidden"
      }), $t$$.start());
      ww.raqSubscribe("app", $self$$, $self$$.renderFrame_)
    }, 50)
  } : function() {
    $mode$$.iframe.contentWindow.postMessage({name:"focus", data:null}, "*");
    $mode$$.iframe.style.visibility = "visible";
    $mode$$.iframe.style.pointerEvents = "auto"
  };
  if($mode$$.iframe) {
    this.currentIframe = $mode$$.iframe, goog.isFunction($onComplete$$) && $onComplete$$()
  }else {
    this.onReady_ = function $this$onReady_$($data$$) {
      $data$$.name === $mode$$.name + ".ready" && goog.isFunction($onComplete$$) && $onComplete$$();
      this.onReady_ = function $this$onReady_$() {
      }
    };
    var $iFrameElem$$ = goog.dom.createElement("iframe");
    $iFrameElem$$.style.visibility = "hidden";
    $iFrameElem$$.style.pointerEvents = "none";
    $iFrameElem$$.src = "modes/" + $mode$$.name + ".html";
    $iFrameElem$$.width = this.width_;
    $iFrameElem$$.height = this.height_;
    goog.dom.appendChild(document.body, $iFrameElem$$);
    this.currentIframe = $iFrameElem$$;
    $mode$$.iframe = $iFrameElem$$
  }
};
window.jQuery(function() {
  (new ww.app.Core).start()
});

